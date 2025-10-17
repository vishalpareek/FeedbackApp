package com.example.feedback.service;

import com.example.feedback.dto.FeedbackRequest;
import com.example.feedback.dto.FeedbackResponse;

public interface FeedbackService {
    FeedbackResponse submitFeedback(FeedbackRequest feedback);
}
