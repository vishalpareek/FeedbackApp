package com.example.feedback.controller;

import com.example.feedback.dto.FeedbackResponse;
import com.example.feedback.model.Feedback;
import com.example.feedback.repository.FeedbackRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.server.ResponseStatusException;


@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {
    private static final Logger logger = LoggerFactory.getLogger(FeedbackController.class);

    private final FeedbackRepository feedbackRepository;

    public FeedbackController(FeedbackRepository feedbackRepository) {
        this.feedbackRepository = feedbackRepository;
    }

    @PostMapping("/submit")
    public FeedbackResponse submitFeedback(@RequestBody Feedback feedbackRequest) {

        String maskedEmail = maskEmail(feedbackRequest.getEmail());
        logger.info("Received feedback request from email: {}", maskedEmail);

        validateFeedback(feedbackRequest, maskedEmail);
        try {
            Feedback savedFeedback = feedbackRepository.save(feedbackRequest);
            logger.info("Feedback saved successfully for user: {}", savedFeedback.getName());
            logger.debug("Response DTO: id={}, name={}, message={}", savedFeedback.getId(), savedFeedback.getName(), savedFeedback.getMessage());

            return new FeedbackResponse(savedFeedback.getId(), savedFeedback.getName(), savedFeedback.getMessage());
        } catch (Exception e) {
            logger.error("Error saving feedback for id {}: {}", feedbackRequest.getId(), e.getMessage(), e);
            throw e;
        }
    }

    private String maskEmail(String email) {
        if (email == null || !email.contains("@")) return "N/A";
        String[] parts = email.split("@");
        String prefix = parts[0];
        String maskedPrefix = prefix.length() <= 2 ? "**" : prefix.substring(0, 2) + "***";
        return maskedPrefix + "@" + parts[1];
    }

    private void validateFeedback(Feedback feedback, String maskedEmail) {
        if (feedback.getName() == null || feedback.getName().trim().isEmpty()) {
            logger.error("Validation failed: name is empty for email {}", maskedEmail);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Name cannot be empty");
        }

        if (feedback.getMessage() == null || feedback.getMessage().trim().isEmpty()) {
            logger.error("Validation failed: message is empty for email {}", maskedEmail);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Message cannot be empty");
        }

        if (feedback.getEmail() == null || feedback.getEmail().trim().isEmpty()) {
            logger.error("Validation failed: email is empty");
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email cannot be empty");
        }
    }
}
