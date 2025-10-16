package com.example.feedback.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.CommonsRequestLoggingFilter;

import jakarta.servlet.http.HttpServletRequest;

@Component
public class RequestLoggingFilter extends CommonsRequestLoggingFilter {

    private static final Logger logger = LoggerFactory.getLogger(RequestLoggingFilter.class);

    public RequestLoggingFilter() {
        setIncludePayload(true);
        setIncludeQueryString(true);
        setIncludeClientInfo(false);
        setIncludeHeaders(false);
        setMaxPayloadLength(1000);
        setAfterMessagePrefix("REQUEST DATA : ");
    }

    @Override
    protected void beforeRequest(HttpServletRequest request, String message) {
        // No logging before request
    }

    @Override
    protected void afterRequest(HttpServletRequest request, String message) {
        String maskedMessage = maskSensitiveData(message);
        logger.debug(maskedMessage);
    }

    // Mask sensitive fields (like email) in JSON payload
    private String maskSensitiveData(String message) {
        if (message == null) return null;
        // Regex to mask "email":"something"
        return message.replaceAll(
                "(\"email\"\\s*:\\s*\")([^\"]+)(\")",
                "$1***masked***$3"
        );
    }
}
