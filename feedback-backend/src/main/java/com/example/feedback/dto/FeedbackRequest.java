package com.example.feedback.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class FeedbackRequest {

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Message is required")
    private String message;

    @Email(message = "Invalid email format")
    @NotBlank(message = "Email is required")
    private String email;

    public FeedbackRequest() {}

    public FeedbackRequest(String name, String message, String email) {
        this.name = name;
        this.message = message;
        this.email = email;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}
