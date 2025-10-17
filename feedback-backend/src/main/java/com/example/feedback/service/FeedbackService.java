package com.example.feedback.service;

import com.example.feedback.dto.FeedbackResponse;
import com.example.feedback.model.Feedback;
import org.springframework.web.bind.annotation.RequestBody;

public interface FeedbackService {
    FeedbackResponse submitFeedback(@RequestBody Feedback feedback);
}
