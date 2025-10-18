package com.example.feedback.dto;

import java.time.LocalDateTime;

public class FeedbackResponse {
    private final Long id;
    private final String name;
    private final String message;
    private final LocalDateTime createdAt;

    public FeedbackResponse(Long id, String name, String message, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.message = message;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getMessage() {
        return message;
    }

    public LocalDateTime getCreatedAt() { return createdAt; }
}
