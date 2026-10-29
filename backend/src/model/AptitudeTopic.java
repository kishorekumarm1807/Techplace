package model;

import java.util.HashMap;
import java.util.Map;

public class AptitudeTopic {
    private String id;
    private String name;
    private String description;
    private String referenceUrl;
    private String referenceTitle;

    public AptitudeTopic() {}

    public AptitudeTopic(String id, String name, String description, String referenceTitle, String referenceUrl) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.referenceTitle = referenceTitle;
        this.referenceUrl = referenceUrl;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getReferenceUrl() { return referenceUrl; }
    public void setReferenceUrl(String referenceUrl) { this.referenceUrl = referenceUrl; }

    public String getReferenceTitle() { return referenceTitle; }
    public void setReferenceTitle(String referenceTitle) { this.referenceTitle = referenceTitle; }

    public Map<String, Object> toMap() {
        Map<String, Object> map = new HashMap<>();
        map.put("id", id);
        map.put("name", name);
        map.put("description", description);
        map.put("referenceUrl", referenceUrl);
        map.put("referenceTitle", referenceTitle);
        return map;
    }

    public static AptitudeTopic fromMap(Map<String, Object> map) {
        AptitudeTopic t = new AptitudeTopic();
        t.id = (String) map.get("id");
        t.name = (String) map.get("name");
        t.description = (String) map.get("description");
        t.referenceUrl = (String) map.get("referenceUrl");
        t.referenceTitle = (String) map.get("referenceTitle");
        return t;
    }
}
