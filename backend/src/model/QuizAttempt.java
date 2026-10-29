package model;

import java.util.HashMap;
import java.util.Map;

public class QuizAttempt {
    private String id;
    private String userId;
    private String topicId;
    private String topicName;
    private String type; // "core_cs" or "aptitude"
    private int score;
    private int totalQuestions;
    private int attemptNumber;
    private long timestamp;

    public QuizAttempt() {}

    public QuizAttempt(String id, String userId, String topicId, String topicName, String type, int score, int totalQuestions, int attemptNumber) {
        this.id = id;
        this.userId = userId;
        this.topicId = topicId;
        this.topicName = topicName;
        this.type = type;
        this.score = score;
        this.totalQuestions = totalQuestions;
        this.attemptNumber = attemptNumber;
        this.timestamp = System.currentTimeMillis();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getTopicId() { return topicId; }
    public void setTopicId(String topicId) { this.topicId = topicId; }

    public String getTopicName() { return topicName; }
    public void setTopicName(String topicName) { this.topicName = topicName; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public int getScore() { return score; }
    public void setScore(int score) { this.score = score; }

    public int getTotalQuestions() { return totalQuestions; }
    public void setTotalQuestions(int totalQuestions) { this.totalQuestions = totalQuestions; }

    public int getAttemptNumber() { return attemptNumber; }
    public void setAttemptNumber(int attemptNumber) { this.attemptNumber = attemptNumber; }

    public long getTimestamp() { return timestamp; }
    public void setTimestamp(long timestamp) { this.timestamp = timestamp; }

    public Map<String, Object> toMap() {
        Map<String, Object> map = new HashMap<>();
        map.put("id", id);
        map.put("userId", userId);
        map.put("topicId", topicId);
        map.put("topicName", topicName);
        map.put("type", type);
        map.put("score", score);
        map.put("totalQuestions", totalQuestions);
        map.put("percentage", totalQuestions > 0 ? Math.round(((double) score / totalQuestions) * 100) : 0);
        map.put("attemptNumber", attemptNumber);
        map.put("timestamp", timestamp);
        return map;
    }

    public static QuizAttempt fromMap(Map<String, Object> map) {
        QuizAttempt a = new QuizAttempt();
        a.id = (String) map.get("id");
        a.userId = (String) map.get("userId");
        a.topicId = (String) map.get("topicId");
        a.topicName = (String) map.get("topicName");
        a.type = (String) map.get("type");
        if (map.get("score") instanceof Number) {
            a.score = ((Number) map.get("score")).intValue();
        }
        if (map.get("totalQuestions") instanceof Number) {
            a.totalQuestions = ((Number) map.get("totalQuestions")).intValue();
        }
        if (map.get("attemptNumber") instanceof Number) {
            a.attemptNumber = ((Number) map.get("attemptNumber")).intValue();
        }
        if (map.get("timestamp") instanceof Number) {
            a.timestamp = ((Number) map.get("timestamp")).longValue();
        } else {
            a.timestamp = System.currentTimeMillis();
        }
        return a;
    }
}
