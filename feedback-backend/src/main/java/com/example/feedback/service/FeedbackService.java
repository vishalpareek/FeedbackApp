package com.example.feedback.service;

import com.example.feedback.dto.FeedbackRequest;
import com.example.feedback.dto.FeedbackResponse;
import org.springframework.web.bind.annotation.RequestBody;

public interface FeedbackService {
    FeedbackResponse submitFeedback(@RequestBody FeedbackRequest feedback);
}
