package model;

import java.util.*;

public class QuizQuestion {
    private String id;
    private String topicId;
    private String subjectOrType; // "core_cs" or "aptitude"
    private String question;
    private List<String> options = new ArrayList<>();
    private int correctOptionIndex;
    private String explanation;

    public QuizQuestion() {}

    public QuizQuestion(String id, String topicId, String subjectOrType, String question, List<String> options, int correctOptionIndex, String explanation) {
        this.id = id;
        this.topicId = topicId;
        this.subjectOrType = subjectOrType;
        this.question = question;
        this.options = options;
        this.correctOptionIndex = correctOptionIndex;
        this.explanation = explanation;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTopicId() { return topicId; }
    public void setTopicId(String topicId) { this.topicId = topicId; }

    public String getSubjectOrType() { return subjectOrType; }
    public void setSubjectOrType(String subjectOrType) { this.subjectOrType = subjectOrType; }

    public String getQuestion() { return question; }
    public void setQuestion(String question) { this.question = question; }

    public List<String> getOptions() { return options; }
    public void setOptions(List<String> options) { this.options = options; }

    public int getCorrectOptionIndex() { return correctOptionIndex; }
    public void setCorrectOptionIndex(int correctOptionIndex) { this.correctOptionIndex = correctOptionIndex; }

    public String getExplanation() { return explanation; }
    public void setExplanation(String explanation) { this.explanation = explanation; }

    public Map<String, Object> toMap(boolean includeAnswer) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", id);
        map.put("topicId", topicId);
        map.put("subjectOrType", subjectOrType);
        map.put("question", question);
        map.put("options", options);
        if (includeAnswer) {
            map.put("correctOptionIndex", correctOptionIndex);
            map.put("explanation", explanation != null ? explanation : "");
        }
        return map;
    }

    @SuppressWarnings("unchecked")
    public static QuizQuestion fromMap(Map<String, Object> map) {
        QuizQuestion q = new QuizQuestion();
        q.id = (String) map.get("id");
        q.topicId = (String) map.get("topicId");
        q.subjectOrType = (String) map.get("subjectOrType");
        q.question = (String) map.get("question");
        if (map.get("options") instanceof List) {
            q.options = (List<String>) map.get("options");
        }
        if (map.get("correctOptionIndex") instanceof Number) {
            q.correctOptionIndex = ((Number) map.get("correctOptionIndex")).intValue();
        }
        q.explanation = (String) map.get("explanation");
        return q;
    }
}
