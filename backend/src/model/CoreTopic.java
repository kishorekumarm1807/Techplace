package model;

import java.util.HashMap;
import java.util.Map;

public class CoreTopic {
    private String id;
    private String subjectId;
    private String name;
    private String description;
    private String whyItMatters;
    private String referenceUrl;
    private String referenceTitle;

    public CoreTopic() {}

    public CoreTopic(String id, String subjectId, String name, String description, String whyItMatters, String referenceTitle, String referenceUrl) {
        this.id = id;
        this.subjectId = subjectId;
        this.name = name;
        this.description = description;
        this.whyItMatters = whyItMatters;
        this.referenceTitle = referenceTitle;
        this.referenceUrl = referenceUrl;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getSubjectId() { return subjectId; }
    public void setSubjectId(String subjectId) { this.subjectId = subjectId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getWhyItMatters() { return whyItMatters; }
    public void setWhyItMatters(String whyItMatters) { this.whyItMatters = whyItMatters; }

    public String getReferenceUrl() { return referenceUrl; }
    public void setReferenceUrl(String referenceUrl) { this.referenceUrl = referenceUrl; }

    public String getReferenceTitle() { return referenceTitle; }
    public void setReferenceTitle(String referenceTitle) { this.referenceTitle = referenceTitle; }

    public Map<String, Object> toMap() {
        Map<String, Object> map = new HashMap<>();
        map.put("id", id);
        map.put("subjectId", subjectId);
        map.put("name", name);
        map.put("description", description);
        map.put("whyItMatters", whyItMatters);
        map.put("referenceUrl", referenceUrl);
        map.put("referenceTitle", referenceTitle);
        return map;
    }

    public static CoreTopic fromMap(Map<String, Object> map) {
        CoreTopic t = new CoreTopic();
        t.id = (String) map.get("id");
        t.subjectId = (String) map.get("subjectId");
        t.name = (String) map.get("name");
        t.description = (String) map.get("description");
        t.whyItMatters = (String) map.get("whyItMatters");
        t.referenceUrl = (String) map.get("referenceUrl");
        t.referenceTitle = (String) map.get("referenceTitle");
        return t;
    }
}
