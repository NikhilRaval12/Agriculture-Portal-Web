package com.agriculture.portal.service;

import com.agriculture.portal.dto.ContactMessageRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class ContactService {
    private static final Logger logger = LoggerFactory.getLogger(ContactService.class);

    public Map<String, Object> handleContactMessage(ContactMessageRequest request) {
        logger.info("Received contact inquiry from: {} <{}>, subject: {}",
                request.getName(), request.getEmail(), request.getSubject());

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Thank you, " + request.getName() + "! Your message has been forwarded to Nikhil Raval at the Agriculture Portal headquarters in Mahesana, Gujarat. We will get back to you shortly.");
        return response;
    }
}
