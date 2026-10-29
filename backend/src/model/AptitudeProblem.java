package model;

import java.util.HashMap;
import java.util.Map;

public class AptitudeProblem {
    private String id;
    private String userId;
    private String title;
    private String topic; // Numbers, Divisibility, HCF and LCM, Ratio and Proportion, etc.
    private String difficulty; // Easy, Medium, Hard
    private String platform;   // IndiaBIX, GeeksforGeeks, HackerRank, Custom, Other
    private String notes;
    private String datePracticed; // YYYY-MM-DD
    private String status; // Completed, In Progress, Not Started
    private long createdAt;

    public AptitudeProblem() {}

    public AptitudeProblem(String id, String userId, String title, String topic, String difficulty, String platform, String notes, String datePracticed, String status) {
        this.id = id;
        this.userId = userId;
        this.title = title;
        this.topic = topic;
        this.difficulty = difficulty != null ? difficulty : "Medium";
        this.platform = platform != null ? platform : "IndiaBIX";
        this.notes = notes != null ? notes : "";
        this.datePracticed = datePracticed != null ? datePracticed : "";
        this.status = status != null ? status : "Completed";
        this.createdAt = System.currentTimeMillis();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getTopic() { return topic; }
    public void setTopic(String topic) { this.topic = topic; }

    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }

    public String getPlatform() { return platform; }
    public void setPlatform(String platform) { this.platform = platform; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public String getDatePracticed() { return datePracticed; }
    public void setDatePracticed(String datePracticed) { this.datePracticed = datePracticed; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public long getCreatedAt() { return createdAt; }
    public void setCreatedAt(long createdAt) { this.createdAt = createdAt; }

    public Map<String, Object> toMap() {
        Map<String, Object> map = new HashMap<>();
        map.put("id", id);
        map.put("userId", userId);
        map.put("title", title);
        map.put("topic", topic);
        map.put("difficulty", difficulty);
        map.put("platform", platform);
        map.put("notes", notes != null ? notes : "");
        map.put("datePracticed", datePracticed != null ? datePracticed : "");
        map.put("status", status != null ? status : "Completed");
        map.put("createdAt", createdAt);
        return map;
    }

    public static AptitudeProblem fromMap(Map<String, Object> map) {
        AptitudeProblem p = new AptitudeProblem();
        p.id = (String) map.get("id");
        p.userId = (String) map.get("userId");
        p.title = (String) map.get("title");
        if (p.title == null) {
            p.title = (String) map.get("name");
        }
        p.topic = (String) map.get("topic");
        if (p.topic == null) {
            p.topic = (String) map.get("category");
        }
        p.difficulty = (String) map.getOrDefault("difficulty", "Medium");
        p.platform = (String) map.getOrDefault("platform", "IndiaBIX");
        p.notes = (String) map.getOrDefault("notes", "");
        p.datePracticed = (String) map.getOrDefault("datePracticed", "");
        p.status = (String) map.getOrDefault("status", "Completed");
        if (map.get("createdAt") instanceof Number) {
            p.createdAt = ((Number) map.get("createdAt")).longValue();
        } else {
            p.createdAt = System.currentTimeMillis();
        }
        return p;
    }
}
