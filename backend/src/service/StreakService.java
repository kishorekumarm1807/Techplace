package service;

import model.StudyActivity;
import repository.StudyActivityRepository;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.*;

public class StreakService {
    private final StudyActivityRepository activityRepository;
    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    public StreakService(StudyActivityRepository activityRepository) {
        this.activityRepository = activityRepository;
    }

    public synchronized void recordActivity(String userId, String clientDate, String type, String title, String description) {
        if (userId == null || userId.isBlank()) return;

        String dateStr = (clientDate != null && clientDate.matches("^\\d{4}-\\d{2}-\\d{2}$"))
                ? clientDate
                : LocalDate.now().format(DATE_FMT);

        String id = "act_" + UUID.randomUUID().toString().substring(0, 8);
        StudyActivity activity = new StudyActivity(id, userId, dateStr, type, title, description);
        activityRepository.addActivity(activity);
    }

    public synchronized Map<String, Object> getStreakInfo(String userId, String clientTodayStr) {
        List<StudyActivity> userActivities = activityRepository.findByUserId(userId);

        LocalDate today;
        try {
            today = (clientTodayStr != null && clientTodayStr.matches("^\\d{4}-\\d{2}-\\d{2}$"))
                    ? LocalDate.parse(clientTodayStr, DATE_FMT)
                    : LocalDate.now();
        } catch (Exception e) {
            today = LocalDate.now();
        }

        TreeSet<LocalDate> activeDates = new TreeSet<>();
        for (StudyActivity a : userActivities) {
            try {
                if (a.getDate() != null && a.getDate().matches("^\\d{4}-\\d{2}-\\d{2}$")) {
                    activeDates.add(LocalDate.parse(a.getDate(), DATE_FMT));
                }
            } catch (Exception ignored) {}
        }

        boolean todayRecorded = activeDates.contains(today);

        // Calculate Current Streak
        int currentStreak = 0;
        if (!activeDates.isEmpty()) {
            LocalDate checkDate = today;
            if (activeDates.contains(checkDate)) {
                // Streak includes today
                while (activeDates.contains(checkDate)) {
                    currentStreak++;
                    checkDate = checkDate.minusDays(1);
                }
            } else {
                // Check if yesterday was active; if so, streak is active pending today's study
                LocalDate yesterday = today.minusDays(1);
                if (activeDates.contains(yesterday)) {
                    checkDate = yesterday;
                    while (activeDates.contains(checkDate)) {
                        currentStreak++;
                        checkDate = checkDate.minusDays(1);
                    }
                } else {
                    currentStreak = 0;
                }
            }
        }

        // Calculate Longest Streak across all history
        int longestStreak = 0;
        if (!activeDates.isEmpty()) {
            int running = 0;
            LocalDate prev = null;
            for (LocalDate d : activeDates) {
                if (prev == null) {
                    running = 1;
                } else {
                    long diff = ChronoUnit.DAYS.between(prev, d);
                    if (diff == 1) {
                        running++;
                    } else if (diff > 1) {
                        running = 1;
                    }
                }
                if (running > longestStreak) {
                    longestStreak = running;
                }
                prev = d;
            }
        }

        // Convert active dates to list of strings
        List<String> activeDateStrings = new ArrayList<>();
        for (LocalDate d : activeDates) {
            activeDateStrings.add(d.format(DATE_FMT));
        }

        // Recent activity feed (limit 10)
        List<Map<String, Object>> recent = new ArrayList<>();
        int count = Math.min(10, userActivities.size());
        for (int i = 0; i < count; i++) {
            recent.add(userActivities.get(i).toMap());
        }

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("currentStreak", currentStreak);
        result.put("longestStreak", Math.max(longestStreak, currentStreak));
        result.put("totalActiveDays", activeDates.size());
        result.put("todayRecorded", todayRecorded);
        result.put("activeDates", activeDateStrings);
        result.put("recentActivities", recent);
        return result;
    }
}
