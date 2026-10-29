package service;

import model.AptitudeProblem;
import model.AptitudeTopic;
import repository.AptitudeProblemRepository;
import repository.ProgressRepository;

import java.util.*;

public class AptitudeService {
    private final ProgressRepository progressRepository;
    private final AptitudeProblemRepository aptitudeProblemRepository;
    private StreakService streakService;
    private final List<AptitudeTopic> topics = new ArrayList<>();
    private final Map<String, AptitudeTopic> topicMap = new HashMap<>();

    public AptitudeService(ProgressRepository progressRepository, AptitudeProblemRepository aptitudeProblemRepository) {
        this.progressRepository = progressRepository;
        this.aptitudeProblemRepository = aptitudeProblemRepository;
        initTopics();
    }

    public void setStreakService(StreakService streakService) {
        this.streakService = streakService;
    }

    private void initTopics() {
        add("apt_numbers", "Numbers", "Classification of numbers, place values, prime numbers, unit digits, and remainders.", "IndiaBIX Number System", "https://www.indiabix.com/aptitude/numbers/");
        add("apt_rel_func", "Relations and Functions", "Domain, range, reflexive, symmetric, transitive relations, and function mappings.", "GeeksforGeeks Relations and Functions", "https://www.geeksforgeeks.org/relations-and-functions/");
        add("apt_divisibility", "Divisibility", "Divisibility rules for numbers (2 through 19), prime factorization, and remainder theorems.", "Hitbullseye Divisibility Rules", "https://www.hitbullseye.com/Divisibility-Rules.php");
        add("apt_hcf_lcm", "HCF and LCM", "Highest Common Factor, Least Common Multiple, co-primes, and product property formulas.", "IndiaBIX HCF and LCM", "https://www.indiabix.com/aptitude/hcf-and-lcm/");
        add("apt_series", "Series and Progression", "Arithmetic Progression (AP), Geometric Progression (GP), Harmonic Progression, and sum formulas.", "GeeksforGeeks AP and GP", "https://www.geeksforgeeks.org/arithmetic-progression/");
        add("apt_ratio_prop", "Ratio and Proportion", "Direct, inverse proportions, mean proportion, duplicate ratios, and compounding.", "IndiaBIX Ratio and Proportion", "https://www.indiabix.com/aptitude/ratio-and-proportion/");
        add("apt_time_work", "Time and Work", "Individual work efficiency, work equivalence, wages distribution, and alternate work days.", "IndiaBIX Time and Work", "https://www.indiabix.com/aptitude/time-and-work/");
        add("apt_profit_loss", "Profit and Loss", "Cost price, selling price, marked price, discount formulas, and false weight calculations.", "IndiaBIX Profit and Loss", "https://www.indiabix.com/aptitude/profit-and-loss/");
        add("apt_percentage", "Percentage", "Percentage increase/decrease, successive percentage changes, and base population problems.", "IndiaBIX Percentage", "https://www.indiabix.com/aptitude/percentage/");
        add("apt_speed_dist", "Speed and Distance", "Average speed, relative speed, trains crossing platforms, boats and streams.", "IndiaBIX Time and Distance", "https://www.indiabix.com/aptitude/time-and-distance/");
        add("apt_simple_int", "Simple Interest", "Principal, rate of interest, time period, maturity amount, and rate comparison.", "IndiaBIX Simple Interest", "https://www.indiabix.com/aptitude/simple-interest/");
        add("apt_compound_int", "Compound Interest", "Compounding annually, half-yearly, quarterly, difference between CI and SI.", "IndiaBIX Compound Interest", "https://www.indiabix.com/aptitude/compound-interest/");
        add("apt_probability", "Probability", "Sample space, independent events, conditional probability, card draws, and dice throws.", "IndiaBIX Probability", "https://www.indiabix.com/aptitude/probability/");
        add("apt_perm_comb", "Permutation and Combination", "Fundamental counting principles, arrangement of letters/numbers, and committee selection.", "IndiaBIX Permutation and Combination", "https://www.indiabix.com/aptitude/permutation-and-combination/");
        add("apt_mix_all", "Mixture and Allegation", "Rule of alligation, mean price, repeated dilution, and liquid mixture ratios.", "IndiaBIX Alligation or Mixture", "https://www.indiabix.com/aptitude/alligation-or-mixture/");
        add("apt_pipes_cist", "Pipes and Cisterns", "Inlet and outlet filling/emptying rates, combined pipe efficiency, and leakage problems.", "IndiaBIX Pipes and Cistern", "https://www.indiabix.com/aptitude/pipes-and-cistern/");
    }

    private void add(String id, String name, String desc, String refTitle, String refUrl) {
        AptitudeTopic t = new AptitudeTopic(id, name, desc, refTitle, refUrl);
        topics.add(t);
        topicMap.put(id, t);
    }

    public List<AptitudeProblem> getUserProblems(String userId) {
        return aptitudeProblemRepository.findByUserId(userId);
    }

    public AptitudeProblem addProblem(String userId, String title, String topic, String difficulty, String platform, String notes, String datePracticed, String status) {
        if (title == null || title.trim().isEmpty()) {
            throw new IllegalArgumentException("Problem title is required");
        }
        if (topic == null || topic.trim().isEmpty()) {
            topic = "Numbers";
        }
        if (difficulty == null || difficulty.trim().isEmpty()) {
            difficulty = "Medium";
        }
        if (platform == null || platform.trim().isEmpty()) {
            platform = "IndiaBIX";
        }
        if (status == null || status.trim().isEmpty()) {
            status = "Completed";
        }

        String id = "apt_prob_" + UUID.randomUUID().toString().substring(0, 8);
        AptitudeProblem p = new AptitudeProblem(id, userId, title.trim(), topic.trim(), difficulty.trim(), platform.trim(), notes, datePracticed, status.trim());
        aptitudeProblemRepository.saveProblem(p);

        if (streakService != null && "Completed".equalsIgnoreCase(status)) {
            streakService.recordActivity(userId, datePracticed, "aptitude", "Solved: " + title.trim(), topic + " • " + difficulty);
        }

        return p;
    }

    public AptitudeProblem updateProblem(String id, String userId, String title, String topic, String difficulty, String platform, String notes, String datePracticed, String status) {
        Optional<AptitudeProblem> opt = aptitudeProblemRepository.findById(id);
        if (opt.isEmpty() || !opt.get().getUserId().equals(userId)) {
            throw new IllegalArgumentException("Problem not found or unauthorized");
        }

        AptitudeProblem p = opt.get();
        if (title != null && !title.trim().isEmpty()) p.setTitle(title.trim());
        if (topic != null && !topic.trim().isEmpty()) p.setTopic(topic.trim());
        if (difficulty != null && !difficulty.trim().isEmpty()) p.setDifficulty(difficulty.trim());
        if (platform != null && !platform.trim().isEmpty()) p.setPlatform(platform.trim());
        if (notes != null) p.setNotes(notes);
        if (datePracticed != null) p.setDatePracticed(datePracticed);
        if (status != null && !status.trim().isEmpty()) p.setStatus(status.trim());

        aptitudeProblemRepository.saveProblem(p);

        if (streakService != null && "Completed".equalsIgnoreCase(p.getStatus())) {
            streakService.recordActivity(userId, p.getDatePracticed(), "aptitude", "Completed: " + p.getTitle(), p.getTopic() + " • " + p.getDifficulty());
        }

        return p;
    }

    public boolean deleteProblem(String id, String userId) {
        return aptitudeProblemRepository.deleteProblem(id, userId);
    }

    public Map<String, Object> getAptitudeStats(String userId) {
        List<AptitudeProblem> problems = aptitudeProblemRepository.findByUserId(userId);
        Map<String, Integer> userAptProgress = progressRepository.getAptitudeProgress(userId);

        int totalSaved = problems.size();
        int completedCount = 0;
        int easyCount = 0;
        int mediumCount = 0;
        int hardCount = 0;

        Set<String> activeTopics = new HashSet<>();
        for (AptitudeProblem p : problems) {
            if ("Completed".equalsIgnoreCase(p.getStatus())) {
                completedCount++;
                activeTopics.add(p.getTopic());
            }
            if ("Easy".equalsIgnoreCase(p.getDifficulty())) easyCount++;
            else if ("Medium".equalsIgnoreCase(p.getDifficulty())) mediumCount++;
            else if ("Hard".equalsIgnoreCase(p.getDifficulty())) hardCount++;
        }

        // Also incorporate any legacy counts from progress.json
        int legacyCount = 0;
        for (Map.Entry<String, Integer> entry : userAptProgress.entrySet()) {
            if (entry.getValue() > 0) {
                legacyCount += entry.getValue();
                activeTopics.add(entry.getKey());
            }
        }

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalSaved", totalSaved);
        stats.put("completedCount", completedCount);
        stats.put("totalSolvedEffective", completedCount + legacyCount);
        stats.put("topicsCovered", activeTopics.size());
        stats.put("easyCount", easyCount);
        stats.put("mediumCount", mediumCount);
        stats.put("hardCount", hardCount);
        return stats;
    }

    public List<Map<String, Object>> getTopicsWithProgress(String userId) {
        Map<String, Integer> userAptProgress = progressRepository.getAptitudeProgress(userId);
        List<AptitudeProblem> problems = aptitudeProblemRepository.findByUserId(userId);

        Map<String, Integer> topicProblemCounts = new HashMap<>();
        for (AptitudeProblem p : problems) {
            String topicName = p.getTopic();
            topicProblemCounts.put(topicName, topicProblemCounts.getOrDefault(topicName, 0) + 1);
        }

        List<Map<String, Object>> result = new ArrayList<>();
        for (AptitudeTopic t : topics) {
            Map<String, Object> map = t.toMap();
            int legacySolved = userAptProgress.getOrDefault(t.getId(), 0);
            int individualSolved = topicProblemCounts.getOrDefault(t.getName(), 0);
            int totalForTopic = legacySolved + individualSolved;
            map.put("problemsSolved", totalForTopic);
            map.put("isPracticed", totalForTopic > 0);
            result.add(map);
        }
        return result;
    }

    public void updateProblemsSolved(String userId, String topicId, int count) {
        progressRepository.setAptitudeProblemsSolved(userId, topicId, count);
    }

    public List<AptitudeTopic> getTopics() {
        return topics;
    }

    public AptitudeTopic getTopicById(String id) {
        return topicMap.get(id);
    }
}
