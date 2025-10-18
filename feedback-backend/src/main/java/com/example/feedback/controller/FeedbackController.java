package com.example.feedback.controller;

import com.example.feedback.dto.FeedbackRequest;
import com.example.feedback.dto.FeedbackResponse;
import com.example.feedback.service.FeedbackService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/feedbacks")
public class FeedbackController {

    private final FeedbackService feedbackService;

    public FeedbackController(FeedbackService feedbackService) {
        this.feedbackService = feedbackService;
    }

    @PostMapping
    public FeedbackResponse submitFeedback(@Valid @RequestBody FeedbackRequest feedbackRequest) {
        return feedbackService.submitFeedback(feedbackRequest);
    }

    @GetMapping
    public List<FeedbackResponse> getAllFeedbacks() {
        return feedbackService.getAllFeedback();
    }
}
