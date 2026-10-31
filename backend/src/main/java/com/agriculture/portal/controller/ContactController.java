package com.agriculture.portal.controller;

import com.agriculture.portal.dto.ContactMessageRequest;
import com.agriculture.portal.service.ContactService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/contact")
public class ContactController {

    @Autowired
    private ContactService contactService;

    @PostMapping
    public ResponseEntity<Map<String, Object>> submitContactForm(@RequestBody ContactMessageRequest request) {
        return ResponseEntity.ok(contactService.handleContactMessage(request));
    }
}
