package controller;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import model.DSAProblem;
import model.User;
import service.AuthService;
import service.DSAService;
import util.HttpUtil;
import util.SimpleJson;

import java.io.IOException;
import java.util.*;

public class DSAController extends BaseController implements HttpHandler {
    private final DSAService dsaService;

    public DSAController(AuthService authService, DSAService dsaService) {
        super(authService);
        this.dsaService = dsaService;
    }

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        if (HttpUtil.handlePreflight(exchange)) return;

        Optional<User> userOpt = authenticate(exchange);
        if (userOpt.isEmpty()) {
            HttpUtil.sendError(exchange, 401, "Unauthorized");
            return;
        }

        String userId = userOpt.get().getId();
        String method = exchange.getRequestMethod();

        try {
            if ("GET".equalsIgnoreCase(method)) {
                handleGet(exchange, userId);
            } else if ("POST".equalsIgnoreCase(method)) {
                handlePost(exchange, userId);
            } else if ("PUT".equalsIgnoreCase(method)) {
                handlePut(exchange, userId);
            } else if ("DELETE".equalsIgnoreCase(method)) {
                handleDelete(exchange, userId);
            } else {
                HttpUtil.sendError(exchange, 405, "Method not allowed");
            }
        } catch (IllegalArgumentException e) {
            HttpUtil.sendError(exchange, 400, e.getMessage());
        } catch (Exception e) {
            HttpUtil.sendError(exchange, 500, "Error: " + e.getMessage());
        }
    }

    private void handleGet(HttpExchange exchange, String userId) throws IOException {
        List<DSAProblem> problems = dsaService.getUserProblems(userId);
        List<Map<String, Object>> list = new ArrayList<>();
        for (DSAProblem p : problems) {
            list.add(p.toMap());
        }
        Map<String, Object> stats = dsaService.getDsaStats(userId);

        Map<String, Object> response = new HashMap<>();
        response.put("problems", list);
        response.put("stats", stats);
        HttpUtil.sendJson(exchange, 200, response);
    }

    private void handlePost(HttpExchange exchange, String userId) throws IOException {
        String body = HttpUtil.readBody(exchange);
        Map<String, Object> req = SimpleJson.parseObject(body);
        String name = (String) req.get("name");
        String category = (String) req.get("category");
        String difficulty = (String) req.get("difficulty");
        String platform = (String) req.get("platform");
        String notes = (String) req.get("notes");
        String status = (String) req.get("status");
        String datePracticed = (String) req.get("datePracticed");

        DSAProblem problem = dsaService.addProblem(userId, name, category, difficulty, platform, notes, status, datePracticed);
        HttpUtil.sendJson(exchange, 201, Map.of("success", true, "problem", problem.toMap()));
    }

    private void handlePut(HttpExchange exchange, String userId) throws IOException {
        String body = HttpUtil.readBody(exchange);
        Map<String, Object> req = SimpleJson.parseObject(body);
        String id = (String) req.get("id");
        if (id == null) {
            Map<String, String> q = HttpUtil.parseQueryParams(exchange.getRequestURI().getQuery());
            id = q.get("id");
        }
        if (id == null) {
            HttpUtil.sendError(exchange, 400, "Problem ID required");
            return;
        }

        String name = (String) req.get("name");
        String category = (String) req.get("category");
        String difficulty = (String) req.get("difficulty");
        String platform = (String) req.get("platform");
        String notes = (String) req.get("notes");
        String status = (String) req.get("status");
        String datePracticed = (String) req.get("datePracticed");

        DSAProblem updated = dsaService.updateProblem(id, userId, name, category, difficulty, platform, notes, status, datePracticed);
        HttpUtil.sendJson(exchange, 200, Map.of("success", true, "problem", updated.toMap()));
    }

    private void handleDelete(HttpExchange exchange, String userId) throws IOException {
        Map<String, String> q = HttpUtil.parseQueryParams(exchange.getRequestURI().getQuery());
        String id = q.get("id");
        if (id == null) {
            HttpUtil.sendError(exchange, 400, "Problem ID required");
            return;
        }

        boolean deleted = dsaService.deleteProblem(id, userId);
        if (deleted) {
            HttpUtil.sendJson(exchange, 200, Map.of("success", true, "message", "Problem deleted"));
        } else {
            HttpUtil.sendError(exchange, 404, "Problem not found or not owned by user");
        }
    }
}
