package repository;

import model.DSAProblem;
import util.SimpleJson;

import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.util.*;

public class DSARepository {
    private final File file;
    private final Map<String, DSAProblem> problemMap = new LinkedHashMap<>();

    public DSARepository(String dataDir) {
        this.file = new File(dataDir, "dsa_problems.json");
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
                    DSAProblem p = DSAProblem.fromMap(map);
                    problemMap.put(p.getId(), p);
                }
            }
        } catch (Exception e) {
            System.err.println("Error loading DSA problems: " + e.getMessage());
        }
    }

    public synchronized void save() {
        try {
            List<Map<String, Object>> list = new ArrayList<>();
            for (DSAProblem p : problemMap.values()) {
                list.add(p.toMap());
            }
            if (file.getParentFile() != null && !file.getParentFile().exists()) {
                file.getParentFile().mkdirs();
            }
            Files.writeString(file.toPath(), SimpleJson.stringify(list), StandardCharsets.UTF_8);
        } catch (IOException e) {
            System.err.println("Error saving DSA problems: " + e.getMessage());
        }
    }

    public synchronized List<DSAProblem> findByUserId(String userId) {
        List<DSAProblem> result = new ArrayList<>();
        for (DSAProblem p : problemMap.values()) {
            if (userId.equals(p.getUserId())) {
                result.add(p);
            }
        }
        // sort recent first
        result.sort((a, b) -> Long.compare(b.getSolvedAt(), a.getSolvedAt()));
        return result;
    }

    public synchronized Optional<DSAProblem> findById(String id) {
        return Optional.ofNullable(problemMap.get(id));
    }

    public synchronized void saveProblem(DSAProblem problem) {
        problemMap.put(problem.getId(), problem);
        save();
    }

    public synchronized boolean deleteProblem(String id, String userId) {
        DSAProblem p = problemMap.get(id);
        if (p != null && p.getUserId().equals(userId)) {
            problemMap.remove(id);
            save();
            return true;
        }
        return false;
    }
}
