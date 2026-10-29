package model;

import java.util.*;

public class CoreSubject {
    private String id;
    private String name;
    private String description;
    private List<CoreTopic> topics = new ArrayList<>();

    public CoreSubject() {}

    public CoreSubject(String id, String name, String description) {
        this.id = id;
        this.name = name;
        this.description = description;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public List<CoreTopic> getTopics() { return topics; }
    public void setTopics(List<CoreTopic> topics) { this.topics = topics; }

    public Map<String, Object> toMap() {
        Map<String, Object> map = new HashMap<>();
        map.put("id", id);
        map.put("name", name);
        map.put("description", description);
        List<Map<String, Object>> tList = new ArrayList<>();
        for (CoreTopic t : topics) {
            tList.add(t.toMap());
        }
        map.put("topics", tList);
        return map;
    }
}
