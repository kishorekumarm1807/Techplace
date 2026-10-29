package model;

import java.util.HashMap;
import java.util.Map;

public class StudyActivity {
    private String id;
    private String userId;
    private String date; // YYYY-MM-DD
    private String type; // coding, aptitude, core_cs, quiz, session
    private String title;
    private String description;
    private long timestamp;

    public StudyActivity() {}

    public StudyActivity(String id, String userId, String date, String type, String title, String description) {
        this.id = id;
        this.userId = userId;
        this.date = date;
        this.type = type;
        this.title = title;
        this.description = description != null ? description : "";
        this.timestamp = System.currentTimeMillis();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public long getTimestamp() { return timestamp; }
    public void setTimestamp(long timestamp) { this.timestamp = timestamp; }

    public Map<String, Object> toMap() {
        Map<String, Object> map = new HashMap<>();
        map.put("id", id);
        map.put("userId", userId);
        map.put("date", date);
        map.put("type", type);
        map.put("title", title);
        map.put("description", description);
        map.put("timestamp", timestamp);
        return map;
    }

    public static StudyActivity fromMap(Map<String, Object> map) {
        StudyActivity a = new StudyActivity();
        a.id = (String) map.get("id");
        a.userId = (String) map.get("userId");
        a.date = (String) map.get("date");
        a.type = (String) map.get("type");
        a.title = (String) map.get("title");
        a.description = (String) map.getOrDefault("description", "");
        if (map.get("timestamp") instanceof Number) {
            a.timestamp = ((Number) map.get("timestamp")).longValue();
        } else {
            a.timestamp = System.currentTimeMillis();
        }
        return a;
    }
}
