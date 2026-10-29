package controller;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import model.User;
import service.AuthService;
import util.HttpUtil;
import util.SimpleJson;

import java.io.IOException;
import java.util.Map;
import java.util.Optional;

public class AuthController extends BaseController implements HttpHandler {

    public AuthController(AuthService authService) {
        super(authService);
    }

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        if (HttpUtil.handlePreflight(exchange)) return;

        String path = exchange.getRequestURI().getPath();
        String method = exchange.getRequestMethod();

        try {
            if ("POST".equalsIgnoreCase(method) && path.endsWith("/register")) {
                handleRegister(exchange);
            } else if ("POST".equalsIgnoreCase(method) && path.endsWith("/login")) {
                handleLogin(exchange);
            } else if ("POST".equalsIgnoreCase(method) && path.endsWith("/logout")) {
                handleLogout(exchange);
            } else if ("GET".equalsIgnoreCase(method) && path.endsWith("/me")) {
                handleMe(exchange);
            } else if ("PUT".equalsIgnoreCase(method) && path.endsWith("/profile")) {
                handleUpdateProfile(exchange);
            } else {
                HttpUtil.sendError(exchange, 404, "Endpoint not found");
            }
        } catch (Exception e) {
            HttpUtil.sendError(exchange, 500, "Internal server error: " + e.getMessage());
        }
    }

    private void handleRegister(HttpExchange exchange) throws IOException {
        String body = HttpUtil.readBody(exchange);
        Map<String, Object> req = SimpleJson.parseObject(body);
        String username = (String) req.get("username");
        String password = (String) req.get("password");
        String name = (String) req.get("name");
        String college = (String) req.get("college");
        String targetRole = (String) req.get("targetRole");
        String graduationYear = (String) req.get("graduationYear");

        Map<String, Object> res = authService.register(username, password, name, college, targetRole, graduationYear);
        if (res.containsKey("error")) {
            HttpUtil.sendJson(exchange, 400, res);
        } else {
            HttpUtil.sendJson(exchange, 201, res);
        }
    }

    private void handleLogin(HttpExchange exchange) throws IOException {
        String body = HttpUtil.readBody(exchange);
        Map<String, Object> req = SimpleJson.parseObject(body);
        String username = (String) req.get("username");
        String password = (String) req.get("password");

        Map<String, Object> res = authService.login(username, password);
        if (res.containsKey("error")) {
            HttpUtil.sendJson(exchange, 401, res);
        } else {
            HttpUtil.sendJson(exchange, 200, res);
        }
    }

    private void handleLogout(HttpExchange exchange) throws IOException {
        String authHeader = exchange.getRequestHeaders().getFirst("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            authService.logout(authHeader.substring(7).trim());
        }
        Map<String, Object> res = Map.of("success", true, "message", "Logged out successfully");
        HttpUtil.sendJson(exchange, 200, res);
    }

    private void handleMe(HttpExchange exchange) throws IOException {
        Optional<User> userOpt = authenticate(exchange);
        if (userOpt.isEmpty()) {
            HttpUtil.sendError(exchange, 401, "Unauthorized");
            return;
        }
        HttpUtil.sendJson(exchange, 200, Map.of("user", userOpt.get().toMap(false)));
    }

    private void handleUpdateProfile(HttpExchange exchange) throws IOException {
        Optional<User> userOpt = authenticate(exchange);
        if (userOpt.isEmpty()) {
            HttpUtil.sendError(exchange, 401, "Unauthorized");
            return;
        }
        String body = HttpUtil.readBody(exchange);
        Map<String, Object> req = SimpleJson.parseObject(body);
        String name = (String) req.get("name");
        String college = (String) req.get("college");
        String targetRole = (String) req.get("targetRole");
        String graduationYear = (String) req.get("graduationYear");

        Map<String, Object> res = authService.updateProfile(userOpt.get().getId(), name, college, targetRole, graduationYear);
        HttpUtil.sendJson(exchange, 200, res);
    }
}
