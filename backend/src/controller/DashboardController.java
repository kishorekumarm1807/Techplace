package controller;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import model.DSAProblem;
import model.User;
import service.*;
import util.HttpUtil;
import util.SimpleJson;

import java.io.IOException;
import java.util.*;

public class DashboardController extends BaseController implements HttpHandler {
    private final ScoreService scoreService;
    private final DSAService dsaService;
    private final QuizService quizService;
    private final StreakService streakService;

    public DashboardController(AuthService authService,
                               ScoreService scoreService,
                               DSAService dsaService,
                               QuizService quizService,
                               StreakService streakService) {
        super(authService);
        this.scoreService = scoreService;
        this.dsaService = dsaService;
        this.quizService = quizService;
        this.streakService = streakService;
    }

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        if (HttpUtil.handlePreflight(exchange)) return;

        Optional<User> userOpt = authenticate(exchange);
        if (userOpt.isEmpty()) {
            HttpUtil.sendError(exchange, 401, "Unauthorized");
            return;
        }

        User user = userOpt.get();
        String userId = user.getId();
        String method = exchange.getRequestMethod();

        try {
            if ("GET".equalsIgnoreCase(method)) {
                Map<String, String> q = HttpUtil.parseQueryParams(exchange.getRequestURI().getQuery());
                String clientToday = q.get("today");

                Map<String, Object> scores = scoreService.calculateUserScores(userId, clientToday);

                // Recent DSA problems (limit 5)
                List<DSAProblem> problems = dsaService.getUserProblems(userId);
                List<Map<String, Object>> recentDsa = new ArrayList<>();
                for (int i = 0; i < Math.min(5, problems.size()); i++) {
                    recentDsa.add(problems.get(i).toMap());
                }

                // Recent quiz attempts (limit 5)
                List<Map<String, Object>> quizAttempts = quizService.getUserAttempts(userId);
                List<Map<String, Object>> recentQuizzes = new ArrayList<>();
                for (int i = 0; i < Math.min(5, quizAttempts.size()); i++) {
                    recentQuizzes.add(quizAttempts.get(i));
                }

                Map<String, Object> streak = streakService != null
                        ? streakService.getStreakInfo(userId, clientToday)
                        : Collections.emptyMap();

                Map<String, Object> response = new LinkedHashMap<>();
                response.put("user", user.toMap(false));
                response.put("scores", scores);
                response.put("streak", streak);
                response.put("recentDsa", recentDsa);
                response.put("recentQuizzes", recentQuizzes);

                HttpUtil.sendJson(exchange, 200, response);
            } else if ("POST".equalsIgnoreCase(method)) {
                // Record quick study session
                String body = HttpUtil.readBody(exchange);
                Map<String, Object> req = SimpleJson.parseObject(body);
                String title = (String) req.getOrDefault("title", "Study Session");
                String description = (String) req.getOrDefault("description", "Dedicated preparation session");
                String date = (String) req.get("date");

                if (streakService != null) {
                    streakService.recordActivity(userId, date, "session", title, description);
                }

                Map<String, Object> streak = streakService != null
                        ? streakService.getStreakInfo(userId, date)
                        : Collections.emptyMap();

                HttpUtil.sendJson(exchange, 200, Map.of("success", true, "message", "Study session recorded", "streak", streak));
            } else {
                HttpUtil.sendError(exchange, 405, "Method not allowed");
            }
        } catch (Exception e) {
            HttpUtil.sendError(exchange, 500, "Error: " + e.getMessage());
        }
    }
}
