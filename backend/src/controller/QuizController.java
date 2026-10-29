package controller;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import model.User;
import service.AuthService;
import service.QuizService;
import util.HttpUtil;
import util.SimpleJson;

import java.io.IOException;
import java.util.*;

public class QuizController extends BaseController implements HttpHandler {
    private final QuizService quizService;

    public QuizController(AuthService authService, QuizService quizService) {
        super(authService);
        this.quizService = quizService;
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
            if ("GET".equalsIgnoreCase(method) && path.endsWith("/generate")) {
                handleGenerate(exchange);
            } else if ("POST".equalsIgnoreCase(method) && path.endsWith("/submit")) {
                handleSubmit(exchange, userId);
            } else if ("GET".equalsIgnoreCase(method) && path.endsWith("/history")) {
                handleHistory(exchange, userId);
            } else {
                HttpUtil.sendError(exchange, 404, "Endpoint not found");
            }
        } catch (Exception e) {
            HttpUtil.sendError(exchange, 500, "Error: " + e.getMessage());
        }
    }

    private void handleGenerate(HttpExchange exchange) throws IOException {
        Map<String, String> q = HttpUtil.parseQueryParams(exchange.getRequestURI().getQuery());
        String topic = q.getOrDefault("topic", "core_cs");

        List<Map<String, Object>> questions = quizService.generateQuizSession(topic);
        HttpUtil.sendJson(exchange, 200, Map.of(
                "topic", topic,
                "count", questions.size(),
                "questions", questions
        ));
    }

    @SuppressWarnings("unchecked")
    private void handleSubmit(HttpExchange exchange, String userId) throws IOException {
        String body = HttpUtil.readBody(exchange);
        Map<String, Object> req = SimpleJson.parseObject(body);
        String topicId = (String) req.getOrDefault("topicId", "core_cs");
        String topicName = (String) req.getOrDefault("topicName", "Practice Quiz");
        String type = (String) req.getOrDefault("type", "core_cs");

        Map<String, Integer> answers = new HashMap<>();
        if (req.get("answers") instanceof Map) {
            Map<?, ?> raw = (Map<?, ?>) req.get("answers");
            for (Map.Entry<?, ?> entry : raw.entrySet()) {
                if (entry.getValue() instanceof Number) {
                    answers.put(entry.getKey().toString(), ((Number) entry.getValue()).intValue());
                }
            }
        }

        Map<String, Object> result = quizService.evaluateQuiz(userId, topicId, topicName, type, answers);
        HttpUtil.sendJson(exchange, 200, result);
    }

    private void handleHistory(HttpExchange exchange, String userId) throws IOException {
        List<Map<String, Object>> history = quizService.getUserAttempts(userId);
        HttpUtil.sendJson(exchange, 200, Map.of("history", history));
    }
}
