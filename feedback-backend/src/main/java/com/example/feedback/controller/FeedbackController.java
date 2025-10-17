package com.example.feedback.controller;

import com.example.feedback.dto.FeedbackRequest;
import com.example.feedback.dto.FeedbackResponse;
import com.example.feedback.service.FeedbackService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class FeedbackController {

    private final FeedbackService feedbackService;

    public FeedbackController(FeedbackService feedbackService) {
        this.feedbackService = feedbackService;
    }

    @PostMapping("/feedback")
    public FeedbackResponse submitFeedback(@Valid @RequestBody FeedbackRequest feedbackRequest) {
        return feedbackService.submitFeedback(feedbackRequest);
    }
}
