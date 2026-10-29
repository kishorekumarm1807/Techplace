package controller;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import model.User;
import service.AuthService;
import service.CoreSubjectService;
import service.ScoreService;
import util.HttpUtil;
import util.SimpleJson;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public class CoreCSController extends BaseController implements HttpHandler {
    private final CoreSubjectService coreSubjectService;
    private final ScoreService scoreService;

    public CoreCSController(AuthService authService, CoreSubjectService coreSubjectService, ScoreService scoreService) {
        super(authService);
        this.coreSubjectService = coreSubjectService;
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
        String method = exchange.getRequestMethod();

        try {
            if ("GET".equalsIgnoreCase(method)) {
                List<Map<String, Object>> subjects = coreSubjectService.getSubjectsWithProgress(userId);
                Map<String, Object> scores = scoreService.calculateUserScores(userId);
                HttpUtil.sendJson(exchange, 200, Map.of(
                        "subjects", subjects,
                        "coreCsScore", scores.get("coreCsScore"),
                        "coreStats", scores.get("coreStats")
                ));
            } else if ("POST".equalsIgnoreCase(method)) {
                String body = HttpUtil.readBody(exchange);
                Map<String, Object> req = SimpleJson.parseObject(body);
                String topicId = (String) req.get("topicId");
                Boolean completed = (Boolean) req.get("completed");

                if (topicId == null || completed == null) {
                    HttpUtil.sendError(exchange, 400, "topicId and completed boolean required");
                    return;
                }

                coreSubjectService.toggleTopic(userId, topicId, completed);
                List<Map<String, Object>> subjects = coreSubjectService.getSubjectsWithProgress(userId);
                Map<String, Object> scores = scoreService.calculateUserScores(userId);

                HttpUtil.sendJson(exchange, 200, Map.of(
                        "success", true,
                        "subjects", subjects,
                        "coreCsScore", scores.get("coreCsScore"),
                        "overallReadiness", scores.get("overallReadiness")
                ));
            } else {
                HttpUtil.sendError(exchange, 405, "Method not allowed");
            }
        } catch (Exception e) {
            HttpUtil.sendError(exchange, 500, "Error: " + e.getMessage());
        }
    }
}
