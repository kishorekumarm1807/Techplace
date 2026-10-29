package service;

import model.AptitudeProblem;
import model.DSAProblem;
import model.QuizAttempt;
import repository.AptitudeProblemRepository;
import repository.DSARepository;
import repository.ProgressRepository;
import repository.QuizRepository;

import java.util.*;

public class ScoreService {
    private final DSARepository dsaRepository;
    private final ProgressRepository progressRepository;
    private final QuizRepository quizRepository;
    private final CoreSubjectService coreSubjectService;
    private final AptitudeService aptitudeService;
    private final AptitudeProblemRepository aptitudeProblemRepository;
    private StreakService streakService;

    public ScoreService(DSARepository dsaRepository,
                        ProgressRepository progressRepository,
                        QuizRepository quizRepository,
                        CoreSubjectService coreSubjectService,
                        AptitudeService aptitudeService,
                        AptitudeProblemRepository aptitudeProblemRepository) {
        this.dsaRepository = dsaRepository;
        this.progressRepository = progressRepository;
        this.quizRepository = quizRepository;
        this.coreSubjectService = coreSubjectService;
        this.aptitudeService = aptitudeService;
        this.aptitudeProblemRepository = aptitudeProblemRepository;
    }

    public void setStreakService(StreakService streakService) {
        this.streakService = streakService;
    }

    public Map<String, Object> calculateUserScores(String userId) {
        return calculateUserScores(userId, null);
    }

    public Map<String, Object> calculateUserScores(String userId, String clientToday) {
        // 1. DSA Score Calculation
        List<DSAProblem> dsaProblems = dsaRepository.findByUserId(userId);
        double dsaVolumePoints = 0;
        Set<String> dsaCategories = new HashSet<>();
        int easyCount = 0, medCount = 0, hardCount = 0;
        int completedDsaCount = 0;

        for (DSAProblem p : dsaProblems) {
            String diff = p.getDifficulty();
            if ("Easy".equalsIgnoreCase(diff)) {
                dsaVolumePoints += 1.5;
                easyCount++;
            } else if ("Medium".equalsIgnoreCase(diff)) {
                dsaVolumePoints += 3.5;
                medCount++;
            } else if ("Hard".equalsIgnoreCase(diff)) {
                dsaVolumePoints += 6.0;
                hardCount++;
            } else {
                dsaVolumePoints += 1.5;
            }
            if (p.getCategory() != null && !p.getCategory().isBlank()) {
                dsaCategories.add(p.getCategory());
            }
            if ("Completed".equalsIgnoreCase(p.getStatus())) {
                completedDsaCount++;
            }
        }

        // Volume component (up to 70 pts), target ~40 weighted points
        double dsaVolumeScore = Math.min(70.0, (dsaVolumePoints / 40.0) * 70.0);
        // Category variety component (up to 30 pts), target 8 categories
        double dsaVarietyScore = Math.min(30.0, ((double) dsaCategories.size() / 8.0) * 30.0);
        int dsaScore = (int) Math.round(Math.min(100.0, dsaVolumeScore + dsaVarietyScore));

        // 2. Core CS Score Calculation
        int totalCoreTopics = coreSubjectService.getTotalTopicCount();
        int completedCoreTopics = progressRepository.getCompletedCoreTopics(userId).size();
        int coreCsScore = totalCoreTopics > 0
                ? (int) Math.round(Math.min(100.0, ((double) completedCoreTopics / totalCoreTopics) * 100.0))
                : 0;

        // 3. Aptitude Score Calculation (Combine individual problem entries + legacy topic counts)
        List<AptitudeProblem> aptProblems = aptitudeProblemRepository != null
                ? aptitudeProblemRepository.findByUserId(userId)
                : Collections.emptyList();

        Map<String, Integer> aptMap = progressRepository.getAptitudeProgress(userId);
        int totalAptProblems = 0;
        Set<String> activeTopics = new HashSet<>();

        // Individual aptitude problems
        int aptCompletedCount = 0;
        int aptEasy = 0, aptMed = 0, aptHard = 0;
        for (AptitudeProblem p : aptProblems) {
            if ("Completed".equalsIgnoreCase(p.getStatus())) {
                totalAptProblems++;
                aptCompletedCount++;
                if (p.getTopic() != null) activeTopics.add(p.getTopic());
            }
            if ("Easy".equalsIgnoreCase(p.getDifficulty())) aptEasy++;
            else if ("Medium".equalsIgnoreCase(p.getDifficulty())) aptMed++;
            else if ("Hard".equalsIgnoreCase(p.getDifficulty())) aptHard++;
        }

        // Legacy counts
        for (Map.Entry<String, Integer> entry : aptMap.entrySet()) {
            if (entry.getValue() > 0) {
                totalAptProblems += entry.getValue();
                activeTopics.add(entry.getKey());
            }
        }

        int totalAptTopics = aptitudeService.getTopics().size();
        // Volume: target 80 solved problems = 70 pts
        double aptVolumeScore = Math.min(70.0, ((double) totalAptProblems / 80.0) * 70.0);
        // Breadth: target 12 topics = 30 pts
        double aptBreadthScore = totalAptTopics > 0 ? Math.min(30.0, ((double) activeTopics.size() / 12.0) * 30.0) : 0;
        int aptitudeScore = (int) Math.round(Math.min(100.0, aptVolumeScore + aptBreadthScore));

        // 4. Overall Placement Readiness Score
        // Weighting: DSA: 40%, Core CS: 35%, Aptitude: 25%
        int overallReadiness = (int) Math.round((dsaScore * 0.40) + (coreCsScore * 0.35) + (aptitudeScore * 0.25));
        overallReadiness = Math.min(100, Math.max(0, overallReadiness));

        // 5. Quiz Statistics (strictly separate from readiness score)
        List<QuizAttempt> attempts = quizRepository.getAttemptsByUser(userId);
        int coreCsQuizTotal = 0, coreCsQuizScoreSum = 0, coreCsQuizAttempts = 0;
        int aptQuizTotal = 0, aptQuizScoreSum = 0, aptQuizAttempts = 0;

        for (QuizAttempt a : attempts) {
            if ("core_cs".equalsIgnoreCase(a.getType())) {
                coreCsQuizAttempts++;
                coreCsQuizScoreSum += a.getScore();
                coreCsQuizTotal += a.getTotalQuestions();
            } else {
                aptQuizAttempts++;
                aptQuizScoreSum += a.getScore();
                aptQuizTotal += a.getTotalQuestions();
            }
        }

        int avgCoreCsQuizPercent = coreCsQuizTotal > 0 ? (int) Math.round(((double) coreCsQuizScoreSum / coreCsQuizTotal) * 100) : 0;
        int avgAptQuizPercent = aptQuizTotal > 0 ? (int) Math.round(((double) aptQuizScoreSum / aptQuizTotal) * 100) : 0;

        // Strong and Weak Areas
        List<String> strongAreas = new ArrayList<>();
        List<String> weakAreas = new ArrayList<>();

        if (dsaProblems.size() >= 10) strongAreas.add("DSA Problem Solving");
        else weakAreas.add("DSA Practice (Target 15+ problems)");

        if (coreCsScore >= 50) strongAreas.add("Core CS Fundamentals");
        else weakAreas.add("Core CS Theory (" + (totalCoreTopics - completedCoreTopics) + " topics pending)");

        if (aptitudeScore >= 50) strongAreas.add("Quantitative Aptitude");
        else weakAreas.add("Aptitude Practice (" + (totalAptTopics - activeTopics.size()) + " topics pending)");

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("overallReadiness", overallReadiness);
        result.put("dsaScore", dsaScore);
        result.put("coreCsScore", coreCsScore);
        result.put("aptitudeScore", aptitudeScore);

        Map<String, Object> dsaStats = new HashMap<>();
        dsaStats.put("totalSolved", dsaProblems.size());
        dsaStats.put("completedCount", completedDsaCount > 0 ? completedDsaCount : dsaProblems.size());
        dsaStats.put("easyCount", easyCount);
        dsaStats.put("mediumCount", medCount);
        dsaStats.put("hardCount", hardCount);
        dsaStats.put("categoriesCovered", dsaCategories.size());
        result.put("dsaStats", dsaStats);

        Map<String, Object> coreStats = new HashMap<>();
        coreStats.put("totalTopics", totalCoreTopics);
        coreStats.put("completedTopics", completedCoreTopics);
        coreStats.put("remainingTopics", totalCoreTopics - completedCoreTopics);
        result.put("coreStats", coreStats);

        Map<String, Object> aptStats = new HashMap<>();
        aptStats.put("totalProblemsSolved", totalAptProblems);
        aptStats.put("individualSaved", aptProblems.size());
        aptStats.put("individualCompleted", aptCompletedCount);
        aptStats.put("topicsCovered", activeTopics.size());
        aptStats.put("totalTopics", totalAptTopics);
        aptStats.put("easyCount", aptEasy);
        aptStats.put("mediumCount", aptMed);
        aptStats.put("hardCount", aptHard);
        result.put("aptitudeStats", aptStats);

        Map<String, Object> quizStats = new HashMap<>();
        quizStats.put("totalAttempts", attempts.size());
        quizStats.put("coreCsAttempts", coreCsQuizAttempts);
        quizStats.put("coreCsAverageScore", avgCoreCsQuizPercent);
        quizStats.put("aptitudeAttempts", aptQuizAttempts);
        quizStats.put("aptitudeAverageScore", avgAptQuizPercent);
        result.put("quizStats", quizStats);

        result.put("strongAreas", strongAreas);
        result.put("weakAreas", weakAreas);

        // Include streak info if available
        if (streakService != null) {
            Map<String, Object> streak = streakService.getStreakInfo(userId, clientToday);
            result.put("streak", streak);
        }

        return result;
    }
}
