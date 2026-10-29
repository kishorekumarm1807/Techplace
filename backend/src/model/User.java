package model;

import java.util.HashMap;
import java.util.Map;

public class User {
    private String id;
    private String username;
    private String password;
    private String name;
    private String college;
    private String targetRole;
    private String graduationYear;
    private long createdAt;

    public User() {}

    public User(String id, String username, String password, String name, String college, String targetRole, String graduationYear) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.name = name;
        this.college = college;
        this.targetRole = targetRole;
        this.graduationYear = graduationYear;
        this.createdAt = System.currentTimeMillis();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCollege() { return college; }
    public void setCollege(String college) { this.college = college; }

    public String getTargetRole() { return targetRole; }
    public void setTargetRole(String targetRole) { this.targetRole = targetRole; }

    public String getGraduationYear() { return graduationYear; }
    public void setGraduationYear(String graduationYear) { this.graduationYear = graduationYear; }

    public long getCreatedAt() { return createdAt; }
    public void setCreatedAt(long createdAt) { this.createdAt = createdAt; }

    public Map<String, Object> toMap(boolean includePassword) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", id);
        map.put("username", username);
        if (includePassword) map.put("password", password);
        map.put("name", name != null ? name : username);
        map.put("college", college != null ? college : "");
        map.put("targetRole", targetRole != null ? targetRole : "Software Engineer");
        map.put("graduationYear", graduationYear != null ? graduationYear : "2027");
        map.put("createdAt", createdAt);
        return map;
    }

    public static User fromMap(Map<String, Object> map) {
        User u = new User();
        u.id = (String) map.get("id");
        u.username = (String) map.get("username");
        u.password = (String) map.get("password");
        u.name = (String) map.get("name");
        u.college = (String) map.get("college");
        u.targetRole = (String) map.get("targetRole");
        u.graduationYear = (String) map.get("graduationYear");
        if (map.get("createdAt") instanceof Number) {
            u.createdAt = ((Number) map.get("createdAt")).longValue();
        } else {
            u.createdAt = System.currentTimeMillis();
        }
        return u;
    }
}
