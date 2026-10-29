package repository;

import util.SimpleJson;

import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.util.*;

public class ProgressRepository {
    private final File file;
    // userId -> Set of completed core CS topic IDs
    private final Map<String, Set<String>> coreCsProgress = new LinkedHashMap<>();
    // userId -> Map of aptitude topicId -> problems solved count
    private final Map<String, Map<String, Integer>> aptitudeProgress = new LinkedHashMap<>();

    public ProgressRepository(String dataDir) {
        this.file = new File(dataDir, "progress.json");
        load();
    }

    private synchronized void load() {
        if (!file.exists()) return;
        try {
            String content = Files.readString(file.toPath(), StandardCharsets.UTF_8);
            Map<String, Object> root = SimpleJson.parseObject(content);

            if (root.get("coreCs") instanceof Map) {
                @SuppressWarnings("unchecked")
                Map<String, Object> coreMap = (Map<String, Object>) root.get("coreCs");
                for (Map.Entry<String, Object> entry : coreMap.entrySet()) {
                    String uId = entry.getKey();
                    Set<String> set = new HashSet<>();
                    if (entry.getValue() instanceof List) {
                        for (Object o : (List<?>) entry.getValue()) {
                            if (o != null) set.add(o.toString());
                        }
                    }
                    coreCsProgress.put(uId, set);
                }
            }

            if (root.get("aptitude") instanceof Map) {
                @SuppressWarnings("unchecked")
                Map<String, Object> aptMap = (Map<String, Object>) root.get("aptitude");
                for (Map.Entry<String, Object> entry : aptMap.entrySet()) {
                    String uId = entry.getKey();
                    Map<String, Integer> topicMap = new HashMap<>();
                    if (entry.getValue() instanceof Map) {
                        for (Map.Entry<?, ?> tEntry : ((Map<?, ?>) entry.getValue()).entrySet()) {
                            if (tEntry.getValue() instanceof Number) {
                                topicMap.put(tEntry.getKey().toString(), ((Number) tEntry.getValue()).intValue());
                            }
                        }
                    }
                    aptitudeProgress.put(uId, topicMap);
                }
            }
        } catch (Exception e) {
            System.err.println("Error loading progress: " + e.getMessage());
        }
    }

    public synchronized void save() {
        try {
            Map<String, Object> root = new LinkedHashMap<>();
            Map<String, Object> coreMap = new LinkedHashMap<>();
            for (Map.Entry<String, Set<String>> entry : coreCsProgress.entrySet()) {
                coreMap.put(entry.getKey(), new ArrayList<>(entry.getValue()));
            }
            root.put("coreCs", coreMap);
            root.put("aptitude", aptitudeProgress);

            if (file.getParentFile() != null && !file.getParentFile().exists()) {
                file.getParentFile().mkdirs();
            }
            Files.writeString(file.toPath(), SimpleJson.stringify(root), StandardCharsets.UTF_8);
        } catch (IOException e) {
            System.err.println("Error saving progress: " + e.getMessage());
        }
    }

    public synchronized Set<String> getCompletedCoreTopics(String userId) {
        return new HashSet<>(coreCsProgress.getOrDefault(userId, Collections.emptySet()));
    }

    public synchronized void toggleCoreTopic(String userId, String topicId, boolean completed) {
        Set<String> set = coreCsProgress.computeIfAbsent(userId, k -> new HashSet<>());
        if (completed) {
            set.add(topicId);
        } else {
            set.remove(topicId);
        }
        save();
    }

    public synchronized Map<String, Integer> getAptitudeProgress(String userId) {
        return new HashMap<>(aptitudeProgress.getOrDefault(userId, Collections.emptyMap()));
    }

    public synchronized void setAptitudeProblemsSolved(String userId, String topicId, int count) {
        Map<String, Integer> map = aptitudeProgress.computeIfAbsent(userId, k -> new HashMap<>());
        map.put(topicId, Math.max(0, count));
        save();
    }
}
