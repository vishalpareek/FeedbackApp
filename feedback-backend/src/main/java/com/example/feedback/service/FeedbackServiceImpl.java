package com.example.feedback.service;

import com.example.feedback.dto.FeedbackResponse;
import com.example.feedback.dto.FeedbackRequest;
import com.example.feedback.model.Feedback;
import com.example.feedback.repository.FeedbackRepository;
import org.assertj.core.util.VisibleForTesting;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class FeedbackServiceImpl implements FeedbackService {

    private static final Logger logger = LoggerFactory.getLogger(FeedbackServiceImpl.class);
    private final FeedbackRepository feedbackRepository;

    public FeedbackServiceImpl(FeedbackRepository feedbackRepository) {
        this.feedbackRepository = feedbackRepository;
    }

    @Override
    public FeedbackResponse submitFeedback(FeedbackRequest feedbackRequest) {
        String maskedEmail = maskEmail(feedbackRequest.getEmail());
        logger.info("Received feedback request from email: {}", maskedEmail);

        validateFeedback(feedbackRequest, maskedEmail);

        Feedback feedback = new Feedback();
        feedback.setName(feedbackRequest.getName());
        feedback.setEmail(feedbackRequest.getEmail());
        feedback.setMessage(feedbackRequest.getMessage());

        Feedback savedFeedback = feedbackRepository.save(feedback);
        logger.info("Feedback saved successfully for user: {}", savedFeedback.getName());
        logger.debug("Response DTO: id={}, name={}, message={}",
                savedFeedback.getId(), savedFeedback.getName(), savedFeedback.getMessage());

        return new FeedbackResponse(
                savedFeedback.getId(),
                savedFeedback.getName(),
                savedFeedback.getMessage()
        );
    }

    @VisibleForTesting
    void validateFeedback(FeedbackRequest feedback, String maskedEmail) {

        // Sample validations. as per business logic this method may contain different validations
        if (!feedback.getName().matches("[A-Za-z ]+")) {
            logger.error("Validation failed: Invalid name {}  for email {}", feedback.getName(), maskedEmail);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Name cannot be empty");
        }
    }

    @VisibleForTesting
    String maskEmail(String email) {
        if (email == null || !email.contains("@")) return "N/A";
        String[] parts = email.split("@");
        String prefix = parts[0];
        String maskedPrefix = prefix.length() <= 2 ? "**" : prefix.substring(0, 2) + "***";
        return maskedPrefix + "@" + parts[1];
    }
}
