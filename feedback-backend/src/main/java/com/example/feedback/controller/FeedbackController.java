package com.example.feedback.controller;

import com.example.feedback.dto.FeedbackResponse;
import com.example.feedback.model.Feedback;
import com.example.feedback.service.FeedbackService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {

    private final FeedbackService feedbackService;

    public FeedbackController(FeedbackService feedbackService) {
        this.feedbackService = feedbackService;
    }

    @PostMapping("/submit")
    public FeedbackResponse submitFeedback(@RequestBody Feedback feedbackRequest) {
        return feedbackService.submitFeedback(feedbackRequest);
    }
}
