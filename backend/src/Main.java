import com.sun.net.httpserver.HttpServer;
import controller.*;
import repository.*;
import service.*;

import java.io.File;
import java.io.IOException;
import java.net.InetSocketAddress;
import java.util.concurrent.Executors;

public class Main {
    private static final int PORT = 8080;

    public static void main(String[] args) {
        try {
            // Ensure local data storage directory exists
            File dataDir = new File("data");
            if (!dataDir.exists() && new File("backend/data").exists()) {
                dataDir = new File("backend/data");
            } else if (!dataDir.exists()) {
                dataDir.mkdirs();
            }
            String dataPath = dataDir.getAbsolutePath();
            System.out.println("TechPlace Local Data Storage: " + dataPath);

            // Initialize Repositories (pure local file-based storage)
            UserRepository userRepository = new UserRepository(dataPath);
            DSARepository dsaRepository = new DSARepository(dataPath);
            ProgressRepository progressRepository = new ProgressRepository(dataPath);
            QuizRepository quizRepository = new QuizRepository(dataPath);
            AptitudeProblemRepository aptitudeProblemRepository = new AptitudeProblemRepository(dataPath);
            StudyActivityRepository studyActivityRepository = new StudyActivityRepository(dataPath);

            // Initialize Services (OOP business logic & scoring)
            AuthService authService = new AuthService(userRepository);
            StreakService streakService = new StreakService(studyActivityRepository);
            DSAService dsaService = new DSAService(dsaRepository);
            dsaService.setStreakService(streakService);

            CoreSubjectService coreSubjectService = new CoreSubjectService(progressRepository);
            coreSubjectService.setStreakService(streakService);

            AptitudeService aptitudeService = new AptitudeService(progressRepository, aptitudeProblemRepository);
            aptitudeService.setStreakService(streakService);

            ScoreService scoreService = new ScoreService(dsaRepository, progressRepository, quizRepository, coreSubjectService, aptitudeService, aptitudeProblemRepository);
            scoreService.setStreakService(streakService);

            QuizService quizService = new QuizService(quizRepository);
            quizService.setStreakService(streakService);

            // Initialize Controllers (HTTP handlers)
            AuthController authController = new AuthController(authService);
            DSAController dsaController = new DSAController(authService, dsaService);
            CoreCSController coreCSController = new CoreCSController(authService, coreSubjectService, scoreService);
            AptitudeController aptitudeController = new AptitudeController(authService, aptitudeService, scoreService);
            QuizController quizController = new QuizController(authService, quizService);
            DashboardController dashboardController = new DashboardController(authService, scoreService, dsaService, quizService, streakService);

            // Create and start standard Java SE HttpServer
            HttpServer server = HttpServer.create(new InetSocketAddress(PORT), 0);

            server.createContext("/api/auth", authController);
            server.createContext("/api/dsa", dsaController);
            server.createContext("/api/core-cs", coreCSController);
            server.createContext("/api/aptitude", aptitudeController);
            server.createContext("/api/quiz", quizController);
            server.createContext("/api/dashboard", dashboardController);

            // Health check endpoint
            server.createContext("/api/health", exchange -> {
                exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
                byte[] response = "{\"status\":\"UP\",\"product\":\"TechPlace\"}".getBytes();
                exchange.sendResponseHeaders(200, response.length);
                exchange.getResponseBody().write(response);
                exchange.close();
            });

            server.setExecutor(Executors.newFixedThreadPool(10));
            server.start();

            System.out.println("==================================================");
            System.out.println("TechPlace Core Java Backend started on port " + PORT);
            System.out.println("No external databases. Pure Core Java OOP & Local Storage.");
            System.out.println("==================================================");

        } catch (IOException e) {
            System.err.println("Failed to start server: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
