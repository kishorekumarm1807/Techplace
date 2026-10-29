package repository;

import model.AptitudeProblem;
import util.SimpleJson;

import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.util.*;

public class AptitudeProblemRepository {
    private final File file;
    private final Map<String, AptitudeProblem> problemMap = new LinkedHashMap<>();

    public AptitudeProblemRepository(String dataDir) {
        this.file = new File(dataDir, "aptitude_problems.json");
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
                    AptitudeProblem p = AptitudeProblem.fromMap(map);
                    problemMap.put(p.getId(), p);
                }
            }
        } catch (Exception e) {
            System.err.println("Error loading Aptitude problems: " + e.getMessage());
        }
    }

    public synchronized void save() {
        try {
            List<Map<String, Object>> list = new ArrayList<>();
            for (AptitudeProblem p : problemMap.values()) {
                list.add(p.toMap());
            }
            if (file.getParentFile() != null && !file.getParentFile().exists()) {
                file.getParentFile().mkdirs();
            }
            Files.writeString(file.toPath(), SimpleJson.stringify(list), StandardCharsets.UTF_8);
        } catch (IOException e) {
            System.err.println("Error saving Aptitude problems: " + e.getMessage());
        }
    }

    public synchronized List<AptitudeProblem> findByUserId(String userId) {
        List<AptitudeProblem> result = new ArrayList<>();
        for (AptitudeProblem p : problemMap.values()) {
            if (userId.equals(p.getUserId())) {
                result.add(p);
            }
        }
        result.sort((a, b) -> Long.compare(b.getCreatedAt(), a.getCreatedAt()));
        return result;
    }

    public synchronized Optional<AptitudeProblem> findById(String id) {
        return Optional.ofNullable(problemMap.get(id));
    }

    public synchronized void saveProblem(AptitudeProblem problem) {
        problemMap.put(problem.getId(), problem);
        save();
    }

    public synchronized boolean deleteProblem(String id, String userId) {
        AptitudeProblem p = problemMap.get(id);
        if (p != null && p.getUserId().equals(userId)) {
            problemMap.remove(id);
            save();
            return true;
        }
        return false;
    }
}
