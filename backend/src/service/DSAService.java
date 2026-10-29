package service;

import model.DSAProblem;
import repository.DSARepository;

import java.util.*;

public class DSAService {
    private final DSARepository dsaRepository;
    private StreakService streakService;

    public DSAService(DSARepository dsaRepository) {
        this.dsaRepository = dsaRepository;
    }

    public void setStreakService(StreakService streakService) {
        this.streakService = streakService;
    }

    public List<DSAProblem> getUserProblems(String userId) {
        return dsaRepository.findByUserId(userId);
    }

    public DSAProblem addProblem(String userId, String name, String category, String difficulty, String platform, String notes) {
        return addProblem(userId, name, category, difficulty, platform, notes, "Completed", null);
    }

    public DSAProblem addProblem(String userId, String name, String category, String difficulty, String platform, String notes, String status, String datePracticed) {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Problem name is required");
        }
        if (category == null || category.trim().isEmpty()) {
            category = "Array";
        }
        if (difficulty == null || difficulty.trim().isEmpty()) {
            difficulty = "Easy";
        }
        if (platform == null || platform.trim().isEmpty()) {
            platform = "LeetCode";
        }
        if (status == null || status.trim().isEmpty()) {
            status = "Completed";
        }

        String id = "dsa_" + UUID.randomUUID().toString().substring(0, 8);
        DSAProblem problem = new DSAProblem(id, userId, name.trim(), category.trim(), difficulty.trim(), platform.trim(), notes, status.trim(), datePracticed);
        dsaRepository.saveProblem(problem);

        if (streakService != null && "Completed".equalsIgnoreCase(status)) {
            streakService.recordActivity(userId, datePracticed, "coding", "Solved: " + name.trim(), category + " • " + difficulty);
        }

        return problem;
    }

    public DSAProblem updateProblem(String id, String userId, String name, String category, String difficulty, String platform, String notes) {
        return updateProblem(id, userId, name, category, difficulty, platform, notes, null, null);
    }

    public DSAProblem updateProblem(String id, String userId, String name, String category, String difficulty, String platform, String notes, String status, String datePracticed) {
        Optional<DSAProblem> opt = dsaRepository.findById(id);
        if (opt.isEmpty() || !opt.get().getUserId().equals(userId)) {
            throw new IllegalArgumentException("Problem not found or unauthorized");
        }

        DSAProblem problem = opt.get();
        if (name != null && !name.trim().isEmpty()) problem.setName(name.trim());
        if (category != null && !category.trim().isEmpty()) problem.setCategory(category.trim());
        if (difficulty != null && !difficulty.trim().isEmpty()) problem.setDifficulty(difficulty.trim());
        if (platform != null && !platform.trim().isEmpty()) problem.setPlatform(platform.trim());
        if (notes != null) problem.setNotes(notes);
        if (status != null && !status.trim().isEmpty()) problem.setStatus(status.trim());
        if (datePracticed != null) problem.setDatePracticed(datePracticed);

        dsaRepository.saveProblem(problem);

        if (streakService != null && "Completed".equalsIgnoreCase(problem.getStatus())) {
            streakService.recordActivity(userId, problem.getDatePracticed(), "coding", "Completed: " + problem.getName(), problem.getCategory() + " • " + problem.getDifficulty());
        }

        return problem;
    }

    public boolean deleteProblem(String id, String userId) {
        return dsaRepository.deleteProblem(id, userId);
    }

    public Map<String, Object> getDsaStats(String userId) {
        List<DSAProblem> problems = dsaRepository.findByUserId(userId);
        int easyCount = 0;
        int mediumCount = 0;
        int hardCount = 0;
        int completedCount = 0;
        Map<String, Integer> categoryCounts = new LinkedHashMap<>();
        Map<String, Integer> platformCounts = new LinkedHashMap<>();

        for (DSAProblem p : problems) {
            String diff = p.getDifficulty();
            if ("Easy".equalsIgnoreCase(diff)) easyCount++;
            else if ("Medium".equalsIgnoreCase(diff)) mediumCount++;
            else if ("Hard".equalsIgnoreCase(diff)) hardCount++;

            if ("Completed".equalsIgnoreCase(p.getStatus())) {
                completedCount++;
            }

            categoryCounts.put(p.getCategory(), categoryCounts.getOrDefault(p.getCategory(), 0) + 1);
            platformCounts.put(p.getPlatform(), platformCounts.getOrDefault(p.getPlatform(), 0) + 1);
        }

        Map<String, Object> stats = new HashMap<>();
        stats.put("total", problems.size());
        stats.put("completedCount", completedCount > 0 ? completedCount : problems.size());
        stats.put("easyCount", easyCount);
        stats.put("mediumCount", mediumCount);
        stats.put("hardCount", hardCount);
        stats.put("categoryCounts", categoryCounts);
        stats.put("platformCounts", platformCounts);
        stats.put("distinctCategories", categoryCounts.size());
        return stats;
    }
}
