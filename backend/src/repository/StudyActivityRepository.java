package repository;

import model.StudyActivity;
import util.SimpleJson;

import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.util.*;

public class StudyActivityRepository {
    private final File file;
    private final List<StudyActivity> activities = new ArrayList<>();

    public StudyActivityRepository(String dataDir) {
        this.file = new File(dataDir, "study_activities.json");
        load();
    }

    private synchronized void load() {
        if (!file.exists()) return;
        try {
            String content = Files.readString(file.toPath(), StandardCharsets.UTF_8);
            List<Object> list = SimpleJson.parseArray(content);
            for (Object obj : list) {
                if (obj instanceof Map) {
                    @SuppressWarnings("unchecked")
                    Map<String, Object> map = (Map<String, Object>) obj;
                    StudyActivity a = StudyActivity.fromMap(map);
                    activities.add(a);
                }
            }
        } catch (Exception e) {
            System.err.println("Error loading study activities: " + e.getMessage());
        }
    }

    public synchronized void save() {
        try {
            List<Map<String, Object>> list = new ArrayList<>();
            for (StudyActivity a : activities) {
                list.add(a.toMap());
            }
            if (file.getParentFile() != null && !file.getParentFile().exists()) {
                file.getParentFile().mkdirs();
            }
            Files.writeString(file.toPath(), SimpleJson.stringify(list), StandardCharsets.UTF_8);
        } catch (IOException e) {
            System.err.println("Error saving study activities: " + e.getMessage());
        }
    }

    public synchronized List<StudyActivity> findByUserId(String userId) {
        List<StudyActivity> result = new ArrayList<>();
        for (StudyActivity a : activities) {
            if (userId.equals(a.getUserId())) {
                result.add(a);
            }
        }
        result.sort((a, b) -> Long.compare(b.getTimestamp(), a.getTimestamp()));
        return result;
    }

    public synchronized void addActivity(StudyActivity activity) {
        activities.add(activity);
        save();
    }
}
