package com.example.feedback.dto;

public class FeedbackResponse {
    private Long id;
    private String name;
    private String message;

    public FeedbackResponse(Long id, String name, String message) {
        this.id = id;
        this.name = name;
        this.message = message;
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
}
