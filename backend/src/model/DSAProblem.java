package model;

import java.util.HashMap;
import java.util.Map;

public class DSAProblem {
    private String id;
    private String userId;
    private String name;
    private String category;
    private String difficulty; // Easy, Medium, Hard
    private String platform;   // LeetCode, CodeChef, HackerRank, GeeksforGeeks, Other
    private String notes;
    private String status;     // Completed, In Progress, Not Started
    private String datePracticed; // YYYY-MM-DD
    private long solvedAt;

    public DSAProblem() {}

    public DSAProblem(String id, String userId, String name, String category, String difficulty, String platform, String notes) {
        this(id, userId, name, category, difficulty, platform, notes, "Completed", "");
    }

    public DSAProblem(String id, String userId, String name, String category, String difficulty, String platform, String notes, String status, String datePracticed) {
        this.id = id;
        this.userId = userId;
        this.name = name;
        this.category = category;
        this.difficulty = difficulty != null ? difficulty : "Medium";
        this.platform = platform != null ? platform : "LeetCode";
        this.notes = notes != null ? notes : "";
        this.status = status != null ? status : "Completed";
        this.datePracticed = datePracticed != null ? datePracticed : "";
        this.solvedAt = System.currentTimeMillis();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }

    public String getPlatform() { return platform; }
    public void setPlatform(String platform) { this.platform = platform; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getDatePracticed() { return datePracticed; }
    public void setDatePracticed(String datePracticed) { this.datePracticed = datePracticed; }

    public long getSolvedAt() { return solvedAt; }
    public void setSolvedAt(long solvedAt) { this.solvedAt = solvedAt; }

    public Map<String, Object> toMap() {
        Map<String, Object> map = new HashMap<>();
        map.put("id", id);
        map.put("userId", userId);
        map.put("name", name);
        map.put("category", category);
        map.put("difficulty", difficulty);
        map.put("platform", platform);
        map.put("notes", notes != null ? notes : "");
        map.put("status", status != null ? status : "Completed");
        map.put("datePracticed", datePracticed != null ? datePracticed : "");
        map.put("solvedAt", solvedAt);
        return map;
    }

    public static DSAProblem fromMap(Map<String, Object> map) {
        DSAProblem p = new DSAProblem();
        p.id = (String) map.get("id");
        p.userId = (String) map.get("userId");
        p.name = (String) map.get("name");
        p.category = (String) map.get("category");
        p.difficulty = (String) map.getOrDefault("difficulty", "Medium");
        p.platform = (String) map.getOrDefault("platform", "LeetCode");
        p.notes = (String) map.getOrDefault("notes", "");
        p.status = (String) map.getOrDefault("status", "Completed");
        p.datePracticed = (String) map.getOrDefault("datePracticed", "");
        if (map.get("solvedAt") instanceof Number) {
            p.solvedAt = ((Number) map.get("solvedAt")).longValue();
        } else {
            p.solvedAt = System.currentTimeMillis();
        }
        return p;
    }
}
