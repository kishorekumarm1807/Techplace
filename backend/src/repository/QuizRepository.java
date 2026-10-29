package repository;

import model.QuizAttempt;
import model.QuizQuestion;
import util.SimpleJson;

import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.util.*;

public class QuizRepository {
    private final File questionsFile;
    private final File attemptsFile;
    private final List<QuizQuestion> questions = new ArrayList<>();
    private final List<QuizAttempt> attempts = new ArrayList<>();

    public QuizRepository(String dataDir) {
        this.questionsFile = new File(dataDir, "quiz_questions.json");
        this.attemptsFile = new File(dataDir, "quiz_attempts.json");
        load();
    }

    private synchronized void load() {
        if (questionsFile.exists()) {
            try {
                String content = Files.readString(questionsFile.toPath(), StandardCharsets.UTF_8);
                List<Object> list = SimpleJson.parseArray(content);
                for (Object o : list) {
                    if (o instanceof Map) {
                        @SuppressWarnings("unchecked")
                        QuizQuestion q = QuizQuestion.fromMap((Map<String, Object>) o);
                        questions.add(q);
                    }
                }
            } catch (Exception e) {
                System.err.println("Error loading quiz questions: " + e.getMessage());
            }
        }

        if (attemptsFile.exists()) {
            try {
                String content = Files.readString(attemptsFile.toPath(), StandardCharsets.UTF_8);
                List<Object> list = SimpleJson.parseArray(content);
                for (Object o : list) {
                    if (o instanceof Map) {
                        @SuppressWarnings("unchecked")
                        QuizAttempt a = QuizAttempt.fromMap((Map<String, Object>) o);
                        attempts.add(a);
                    }
                }
            } catch (Exception e) {
                System.err.println("Error loading quiz attempts: " + e.getMessage());
            }
        }
    }

    public synchronized void saveQuestions() {
        try {
            List<Map<String, Object>> list = new ArrayList<>();
            for (QuizQuestion q : questions) {
                list.add(q.toMap(true));
            }
            if (questionsFile.getParentFile() != null && !questionsFile.getParentFile().exists()) {
                questionsFile.getParentFile().mkdirs();
            }
            Files.writeString(questionsFile.toPath(), SimpleJson.stringify(list), StandardCharsets.UTF_8);
        } catch (IOException e) {
            System.err.println("Error saving quiz questions: " + e.getMessage());
        }
    }

    public synchronized void saveAttempts() {
        try {
            List<Map<String, Object>> list = new ArrayList<>();
            for (QuizAttempt a : attempts) {
                list.add(a.toMap());
            }
            if (attemptsFile.getParentFile() != null && !attemptsFile.getParentFile().exists()) {
                attemptsFile.getParentFile().mkdirs();
            }
            Files.writeString(attemptsFile.toPath(), SimpleJson.stringify(list), StandardCharsets.UTF_8);
        } catch (IOException e) {
            System.err.println("Error saving quiz attempts: " + e.getMessage());
        }
    }

    public synchronized void addQuestions(List<QuizQuestion> newQuestions) {
        questions.addAll(newQuestions);
        saveQuestions();
    }

    public synchronized List<QuizQuestion> getAllQuestions() {
        return new ArrayList<>(questions);
    }

    public synchronized List<QuizQuestion> getQuestionsByTopic(String topicId) {
        List<QuizQuestion> result = new ArrayList<>();
        for (QuizQuestion q : questions) {
            if (topicId.equalsIgnoreCase(q.getTopicId())) {
                result.add(q);
            }
        }
        return result;
    }

    public synchronized List<QuizQuestion> getQuestionsByType(String type) {
        List<QuizQuestion> result = new ArrayList<>();
        for (QuizQuestion q : questions) {
            if (type.equalsIgnoreCase(q.getSubjectOrType())) {
                result.add(q);
            }
        }
        return result;
    }

    public synchronized Optional<QuizQuestion> getQuestionById(String id) {
        for (QuizQuestion q : questions) {
            if (q.getId().equals(id)) {
                return Optional.of(q);
            }
        }
        return Optional.empty();
    }

    public synchronized void recordAttempt(QuizAttempt attempt) {
        attempts.add(attempt);
        saveAttempts();
    }

    public synchronized List<QuizAttempt> getAttemptsByUser(String userId) {
        List<QuizAttempt> list = new ArrayList<>();
        for (QuizAttempt a : attempts) {
            if (userId.equals(a.getUserId())) {
                list.add(a);
            }
        }
        list.sort((a, b) -> Long.compare(b.getTimestamp(), a.getTimestamp()));
        return list;
    }

    public synchronized int getAttemptCountForTopic(String userId, String topicId) {
        int count = 0;
        for (QuizAttempt a : attempts) {
            if (userId.equals(a.getUserId()) && topicId.equalsIgnoreCase(a.getTopicId())) {
                count++;
            }
        }
        return count;
    }
}
