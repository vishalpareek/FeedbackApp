package com.example.feedback.service;

import com.example.feedback.dto.FeedbackRequest;
import com.example.feedback.dto.FeedbackResponse;

import java.util.List;

public interface FeedbackService {
    FeedbackResponse submitFeedback(FeedbackRequest feedback);
    List<FeedbackResponse> getAllFeedback();
}
