package service;

import model.User;
import repository.UserRepository;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

public class AuthService {
    private final UserRepository userRepository;
    // token -> userId
    private final Map<String, String> sessionTokens = new ConcurrentHashMap<>();

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public synchronized Map<String, Object> register(String username, String password, String name, String college, String targetRole, String graduationYear) {
        Map<String, Object> response = new HashMap<>();
        if (username == null || username.trim().isEmpty()) {
            response.put("error", "Username is required");
            return response;
        }
        if (password == null || password.trim().length() < 4) {
            response.put("error", "Password must be at least 4 characters");
            return response;
        }

        if (userRepository.findByUsername(username.trim()).isPresent()) {
            response.put("error", "Username already taken");
            return response;
        }

        String userId = "u_" + UUID.randomUUID().toString().substring(0, 8);
        User user = new User(userId, username.trim(), password, name, college, targetRole, graduationYear);
        userRepository.saveUser(user);

        String token = "tok_" + UUID.randomUUID().toString();
        sessionTokens.put(token, userId);

        response.put("success", true);
        response.put("token", token);
        response.put("user", user.toMap(false));
        return response;
    }

    public synchronized Map<String, Object> login(String username, String password) {
        Map<String, Object> response = new HashMap<>();
        if (username == null || password == null) {
            response.put("error", "Username and password required");
            return response;
        }

        Optional<User> opt = userRepository.findByUsername(username.trim());
        if (opt.isEmpty() || !opt.get().getPassword().equals(password)) {
            response.put("error", "Invalid username or password");
            return response;
        }

        User user = opt.get();
        String token = "tok_" + UUID.randomUUID().toString();
        sessionTokens.put(token, user.getId());

        response.put("success", true);
        response.put("token", token);
        response.put("user", user.toMap(false));
        return response;
    }

    public synchronized void logout(String token) {
        if (token != null) {
            sessionTokens.remove(token);
        }
    }

    public synchronized Optional<User> authenticate(String token) {
        if (token == null) return Optional.empty();
        String userId = sessionTokens.get(token);
        if (userId == null) return Optional.empty();
        return userRepository.findById(userId);
    }

    public synchronized Map<String, Object> updateProfile(String userId, String name, String college, String targetRole, String graduationYear) {
        Map<String, Object> res = new HashMap<>();
        Optional<User> opt = userRepository.findById(userId);
        if (opt.isEmpty()) {
            res.put("error", "User not found");
            return res;
        }
        User u = opt.get();
        if (name != null) u.setName(name);
        if (college != null) u.setCollege(college);
        if (targetRole != null) u.setTargetRole(targetRole);
        if (graduationYear != null) u.setGraduationYear(graduationYear);

        userRepository.saveUser(u);
        res.put("success", true);
        res.put("user", u.toMap(false));
        return res;
    }
}
