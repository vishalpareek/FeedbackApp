package com.example.feedback.service;

import com.example.feedback.dto.FeedbackRequest;
import com.example.feedback.dto.FeedbackResponse;
import com.example.feedback.model.Feedback;
import com.example.feedback.repository.FeedbackRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

import static java.util.Arrays.asList;
import static java.util.Collections.emptyList;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class FeedbackServiceImplTest {

    @Mock
    private FeedbackRepository feedbackRepository;

    @InjectMocks
    private FeedbackServiceImpl feedbackService;

    @Test
    public void submitFeedback_shouldSaveSuccessfully() {
        FeedbackRequest request = new FeedbackRequest("Vishal", "Great app!", "vishal@example.com");

        Feedback savedFeedback = new Feedback();
        savedFeedback.setId(1L);
        savedFeedback.setName(request.getName());
        savedFeedback.setEmail(request.getEmail());
        savedFeedback.setMessage(request.getMessage());

        when(feedbackRepository.save(any(Feedback.class))).thenReturn(savedFeedback);

        FeedbackResponse response = feedbackService.submitFeedback(request);

        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("Vishal", response.getName());
        assertEquals("Great app!", response.getMessage());

        verify(feedbackRepository, times(1)).save(any(Feedback.class));
    }

    @Test
    public void submitFeedback_shouldThrowWhenNameEmpty() {
        FeedbackRequest request = new FeedbackRequest("", "Some message", "user@example.com");

        ResponseStatusException exception = assertThrows(ResponseStatusException.class,
                () -> feedbackService.submitFeedback(request));

        assertTrue(exception.getReason().contains("Name cannot be empty"));
        verify(feedbackRepository, never()).save(any());
    }

    @Test
    public void submitFeedback_shouldThrowWhenRepositoryFails() {
        FeedbackRequest request = new FeedbackRequest("Vishal", "Message", "vishal@example.com");

        when(feedbackRepository.save(any(Feedback.class)))
                .thenThrow(new RuntimeException("DB error"));

        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> feedbackService.submitFeedback(request));

        assertEquals("DB error", exception.getMessage());
        verify(feedbackRepository, times(1)).save(any(Feedback.class));
    }

    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Name cannot be empty");
}
    }

    @Test
    public void testMaskEmail_shortEmail() {
        assertEquals("**@test.fi", feedbackService.maskEmail("vp@test.fi"));
        assertEquals("**@test.fi", feedbackService.maskEmail("v@test.fi"));
    }

    @Test
    public void testMaskEmail_longEmail() {
        assertEquals("vi***@test.fi", feedbackService.maskEmail("vishal.pareek@test.fi"));
    }

    @Test
    public void testValidateFeedback_InvalidName() {
        FeedbackRequest request = new FeedbackRequest("Vishal12345", "Message", "vishal@example.com");
        assertThrows(ResponseStatusException.class, () -> feedbackService.validateFeedback(request, "vi***@example.com"));
    }

    @Test
    public void testValidateFeedback_ValidName() {
        FeedbackRequest request = new FeedbackRequest("Vishal Pareek", "Message", "vishal@example.com");
        assertDoesNotThrow(() -> feedbackService.validateFeedback(request, "vi***@example.com"));
    }

    @Test
    void testGetAllFeedback_returnsFeedbackList() {
        Feedback f1 = new Feedback();
        f1.setId(1L);
        f1.setName("Vishal");
        f1.setMessage("Great app!");
        f1.setEmail("vishal@example.com");
        f1.setCreatedAt(LocalDateTime.of(2025, 10, 18, 20, 0));

        Feedback f2 = new Feedback();
        f2.setId(2L);
        f2.setName("Nishant");
        f2.setMessage("Nice work!");
        f2.setEmail("nishant@example.com");
        f2.setCreatedAt(LocalDateTime.of(2025, 10, 18, 21, 0));

        when(feedbackRepository.findAll()).thenReturn(asList(f1, f2));

        List<FeedbackResponse> result = feedbackService.getAllFeedback();

        assertEquals(2, result.size());
        assertEquals("Vishal", result.get(0).getName());
        assertEquals("Nishant", result.get(1).getName());

        // extra check for created at
        assertEquals(f1.getCreatedAt(), result.get(0).getCreatedAt());
        assertEquals(f2.getCreatedAt(), result.get(1).getCreatedAt());

        verify(feedbackRepository, times(1)).findAll();
    }

    @Test
    void testGetAllFeedback_returnsEmptyList() {
        when(feedbackRepository.findAll()).thenReturn(emptyList());

        List<FeedbackResponse> result = feedbackService.getAllFeedback();
        assertTrue(result.isEmpty());
        verify(feedbackRepository, times(1)).findAll();
    }

    @Test
    void testGetAllFeedback_repositoryThrowsException() {
        when(feedbackRepository.findAll()).thenThrow(new RuntimeException("DB down"));

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> feedbackService.getAllFeedback());
        assertEquals("DB down", ex.getMessage());

        verify(feedbackRepository, times(1)).findAll();
    }
}
