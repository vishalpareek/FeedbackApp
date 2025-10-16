package com.example.feedback.controller;

import com.example.feedback.model.Feedback;
import com.example.feedback.repository.FeedbackRepository;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {

    private final FeedbackRepository feedbackRepository;

    public FeedbackController(FeedbackRepository feedbackRepository) {
        this.feedbackRepository = feedbackRepository;
    }

    @PostMapping("/submit")
    public Feedback submitFeedback(@RequestBody Feedback feedbackRequest) {
        return feedbackRepository.save(feedbackRequest);
    }
}
