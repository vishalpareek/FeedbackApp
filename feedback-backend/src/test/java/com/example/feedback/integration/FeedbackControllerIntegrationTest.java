package com.example.feedback.integration;

import com.example.feedback.dto.FeedbackRequest;
import com.example.feedback.dto.FeedbackResponse;
import com.example.feedback.model.Feedback;
import com.example.feedback.repository.FeedbackRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.*;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Transactional
class FeedbackControllerIntegrationTest {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private FeedbackRepository feedbackRepository;

    private String baseUrl() {
        return "http://localhost:" + port + "/api/feedbacks";
    }

    @BeforeEach
    void cleanDb() {
        feedbackRepository.deleteAll();
    }

    @Test
    void submitFeedback_shouldSaveAndReturnResponse() {
        FeedbackRequest request = new FeedbackRequest("Vishal", "Very nice app!!", "vishal@example.com");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<FeedbackRequest> entity = new HttpEntity<>(request, headers);

        ResponseEntity<FeedbackResponse> response = restTemplate.postForEntity(
                baseUrl(), entity, FeedbackResponse.class);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Vishal", response.getBody().getName());
        assertEquals("Very nice app!!", response.getBody().getMessage());

        Optional<Feedback> persisted = feedbackRepository.findById(response.getBody().getId());
        assertTrue(persisted.isPresent());
        assertEquals("Vishal", persisted.get().getName());
        assertEquals("vishal@example.com", persisted.get().getEmail());
        assertEquals("Very nice app!!", persisted.get().getMessage());
    }

    @Test
    void submitFeedback_shouldReturnBadRequest_whenNameEmpty() throws Exception {
        FeedbackRequest request = new FeedbackRequest("", "Test message", "test@example.com");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<FeedbackRequest> entity = new HttpEntity<>(request, headers);

        ResponseEntity<String> response = restTemplate.postForEntity(baseUrl(), entity, String.class);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());

        // Confirm nothing persisted
        assertEquals(0, feedbackRepository.count());
    }

    @Test
    void submitFeedback_shouldReturnBadRequest_whenMessageEmpty() throws Exception {
        FeedbackRequest request = new FeedbackRequest("Vishal", "", "vishal@example.com");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<FeedbackRequest> entity = new HttpEntity<>(request, headers);

        ResponseEntity<String> response = restTemplate.postForEntity(baseUrl(), entity, String.class);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());

        assertEquals(0, feedbackRepository.count());
    }

    @Test
    void submitFeedback_shouldReturnBadRequest_whenEmailEmpty() throws Exception {
        FeedbackRequest request = new FeedbackRequest("Vishal", "Hello", "");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<FeedbackRequest> entity = new HttpEntity<>(request, headers);

        ResponseEntity<String> response = restTemplate.postForEntity(baseUrl(), entity, String.class);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());

        assertEquals(0, feedbackRepository.count());
    }
}
