package repository;

import model.User;
import util.SimpleJson;

import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.util.*;

public class UserRepository {
    private final File file;
    private final Map<String, User> userMap = new LinkedHashMap<>();

    public UserRepository(String dataDir) {
        this.file = new File(dataDir, "users.json");
        load();
    }

    private synchronized void load() {
        if (!file.exists()) {
            return;
        }
        try {
            String content = Files.readString(file.toPath(), StandardCharsets.UTF_8);
            List<Object> list = SimpleJson.parseArray(content);
            for (Object obj : list) {
                if (obj instanceof Map) {
                    @SuppressWarnings("unchecked")
                    Map<String, Object> map = (Map<String, Object>) obj;
                    User u = User.fromMap(map);
                    userMap.put(u.getId(), u);
                }
            }
        } catch (Exception e) {
            System.err.println("Error loading users: " + e.getMessage());
        }
    }

    public synchronized void save() {
        try {
            List<Map<String, Object>> list = new ArrayList<>();
            for (User u : userMap.values()) {
                list.add(u.toMap(true));
            }
            if (file.getParentFile() != null && !file.getParentFile().exists()) {
                file.getParentFile().mkdirs();
            }
            Files.writeString(file.toPath(), SimpleJson.stringify(list), StandardCharsets.UTF_8);
        } catch (IOException e) {
            System.err.println("Error saving users: " + e.getMessage());
        }
    }

    public synchronized Optional<User> findById(String id) {
        return Optional.ofNullable(userMap.get(id));
    }

    public synchronized Optional<User> findByUsername(String username) {
        if (username == null) return Optional.empty();
        for (User u : userMap.values()) {
            if (username.equalsIgnoreCase(u.getUsername())) {
                return Optional.of(u);
            }
        }
        return Optional.empty();
    }

    public synchronized void saveUser(User user) {
        userMap.put(user.getId(), user);
        save();
    }

    public synchronized List<User> findAll() {
        return new ArrayList<>(userMap.values());
    }
}
