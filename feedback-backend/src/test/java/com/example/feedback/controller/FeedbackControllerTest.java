package com.example.feedback.controller;

import com.example.feedback.dto.FeedbackRequest;
import com.example.feedback.dto.FeedbackResponse;
import com.example.feedback.service.FeedbackService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import com.fasterxml.jackson.databind.ObjectMapper;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.mockito.ArgumentMatchers.any;

@WebMvcTest(FeedbackController.class)
class FeedbackControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private FeedbackService feedbackService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void submitFeedback_shouldReturnSuccess() throws Exception {
        FeedbackRequest request = new FeedbackRequest("Vishal", "Great app!", "vishal@example.com");
        FeedbackResponse response = new FeedbackResponse(1L, "Vishal", "Great app!");

        Mockito.when(feedbackService.submitFeedback(any(FeedbackRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/feedbacks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.name").value("Vishal"))
                .andExpect(jsonPath("$.message").value("Great app!"));
    }

    @Test
    void submitFeedback_shouldReturnBadRequest_whenNameEmpty() throws Exception {
        FeedbackRequest request = new FeedbackRequest("", "Some message", "user@example.com");
        mockMvc.perform(post("/api/feedbacks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Name is required"));
    }

    @Test
    void submitFeedback_shouldReturnBadRequest_whenMessageEmpty() throws Exception {
        FeedbackRequest request = new FeedbackRequest("Vishal", "", "user@example.com");

        mockMvc.perform(post("/api/feedbacks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Message is required"));
    }

    @Test
    void submitFeedback_shouldReturnBadRequest_whenEmailEmpty() throws Exception {
        FeedbackRequest request = new FeedbackRequest("Vishal", "Some message", null);

        mockMvc.perform(post("/api/feedbacks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Email is required"));
    }

    @Test
    void submitFeedback_shouldReturnBadRequest_whenEmailInvalid() throws Exception {
        FeedbackRequest request = new FeedbackRequest("Vishal", "Some message", "INVALID_EMAIL");

        mockMvc.perform(post("/api/feedbacks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Invalid email format"));
    }
}
