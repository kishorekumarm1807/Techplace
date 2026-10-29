package controller;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import model.AptitudeProblem;
import model.User;
import service.AptitudeService;
import service.AuthService;
import service.ScoreService;
import util.HttpUtil;
import util.SimpleJson;

import java.io.IOException;
import java.util.*;

public class AptitudeController extends BaseController implements HttpHandler {
    private final AptitudeService aptitudeService;
    private final ScoreService scoreService;

    public AptitudeController(AuthService authService, AptitudeService aptitudeService, ScoreService scoreService) {
        super(authService);
        this.aptitudeService = aptitudeService;
        this.scoreService = scoreService;
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
        String path = exchange.getRequestURI().getPath();
        String method = exchange.getRequestMethod();

        try {
            if ("GET".equalsIgnoreCase(method)) {
                handleGet(exchange, userId);
            } else if ("POST".equalsIgnoreCase(method)) {
                if (path.endsWith("/update")) {
                    handleLegacyUpdate(exchange, userId);
                } else {
                    handlePostProblem(exchange, userId);
                }
            } else if ("PUT".equalsIgnoreCase(method)) {
                handlePutProblem(exchange, userId);
            } else if ("DELETE".equalsIgnoreCase(method)) {
                handleDeleteProblem(exchange, userId);
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
        List<AptitudeProblem> problems = aptitudeService.getUserProblems(userId);
        List<Map<String, Object>> probList = new ArrayList<>();
        for (AptitudeProblem p : problems) {
            probList.add(p.toMap());
        }

        List<Map<String, Object>> topics = aptitudeService.getTopicsWithProgress(userId);
        Map<String, Object> stats = aptitudeService.getAptitudeStats(userId);
        Map<String, Object> scores = scoreService.calculateUserScores(userId);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("problems", probList);
        response.put("topics", topics);
        response.put("stats", stats);
        response.put("aptitudeScore", scores.get("aptitudeScore"));
        response.put("aptitudeStats", scores.get("aptitudeStats"));

        HttpUtil.sendJson(exchange, 200, response);
    }

    private void handlePostProblem(HttpExchange exchange, String userId) throws IOException {
        String body = HttpUtil.readBody(exchange);
        Map<String, Object> req = SimpleJson.parseObject(body);
        String title = (String) req.get("title");
        if (title == null || title.isBlank()) {
            title = (String) req.get("name");
        }
        String topic = (String) req.get("topic");
        if (topic == null || topic.isBlank()) {
            topic = (String) req.get("category");
        }
        String difficulty = (String) req.get("difficulty");
        String platform = (String) req.get("platform");
        String notes = (String) req.get("notes");
        String datePracticed = (String) req.get("datePracticed");
        String status = (String) req.get("status");

        AptitudeProblem p = aptitudeService.addProblem(userId, title, topic, difficulty, platform, notes, datePracticed, status);
        Map<String, Object> scores = scoreService.calculateUserScores(userId);

        HttpUtil.sendJson(exchange, 201, Map.of(
                "success", true,
                "problem", p.toMap(),
                "aptitudeScore", scores.get("aptitudeScore"),
                "overallReadiness", scores.get("overallReadiness")
        ));
    }

    private void handlePutProblem(HttpExchange exchange, String userId) throws IOException {
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

        String title = (String) req.get("title");
        if (title == null) title = (String) req.get("name");
        String topic = (String) req.get("topic");
        if (topic == null) topic = (String) req.get("category");
        String difficulty = (String) req.get("difficulty");
        String platform = (String) req.get("platform");
        String notes = (String) req.get("notes");
        String datePracticed = (String) req.get("datePracticed");
        String status = (String) req.get("status");

        AptitudeProblem p = aptitudeService.updateProblem(id, userId, title, topic, difficulty, platform, notes, datePracticed, status);
        Map<String, Object> scores = scoreService.calculateUserScores(userId);

        HttpUtil.sendJson(exchange, 200, Map.of(
                "success", true,
                "problem", p.toMap(),
                "aptitudeScore", scores.get("aptitudeScore"),
                "overallReadiness", scores.get("overallReadiness")
        ));
    }

    private void handleDeleteProblem(HttpExchange exchange, String userId) throws IOException {
        Map<String, String> q = HttpUtil.parseQueryParams(exchange.getRequestURI().getQuery());
        String id = q.get("id");
        if (id == null) {
            HttpUtil.sendError(exchange, 400, "Problem ID required");
            return;
        }

        boolean deleted = aptitudeService.deleteProblem(id, userId);
        if (deleted) {
            Map<String, Object> scores = scoreService.calculateUserScores(userId);
            HttpUtil.sendJson(exchange, 200, Map.of(
                    "success", true,
                    "message", "Aptitude problem deleted",
                    "aptitudeScore", scores.get("aptitudeScore"),
                    "overallReadiness", scores.get("overallReadiness")
            ));
        } else {
            HttpUtil.sendError(exchange, 404, "Problem not found or not owned by user");
        }
    }

    private void handleLegacyUpdate(HttpExchange exchange, String userId) throws IOException {
        String body = HttpUtil.readBody(exchange);
        Map<String, Object> req = SimpleJson.parseObject(body);
        String topicId = (String) req.get("topicId");
        Number countNum = (Number) req.get("count");

        if (topicId == null || countNum == null) {
            HttpUtil.sendError(exchange, 400, "topicId and count are required");
            return;
        }

        aptitudeService.updateProblemsSolved(userId, topicId, countNum.intValue());
        List<Map<String, Object>> topics = aptitudeService.getTopicsWithProgress(userId);
        Map<String, Object> scores = scoreService.calculateUserScores(userId);

        HttpUtil.sendJson(exchange, 200, Map.of(
                "success", true,
                "topics", topics,
                "aptitudeScore", scores.get("aptitudeScore"),
                "overallReadiness", scores.get("overallReadiness")
        ));
    }
}
