package com.agriculture.portal.controller;

import com.agriculture.portal.dto.AiChatRequest;
import com.agriculture.portal.dto.AiChatResponse;
import com.agriculture.portal.entity.User;
import com.agriculture.portal.service.AiService;
import com.agriculture.portal.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    @Autowired
    private AiService aiService;

    @Autowired
    private AuthService authService;

    @PostMapping("/chat")
    public ResponseEntity<AiChatResponse> chatWithAssistant(@RequestBody AiChatRequest request) {
        User user = authService.getCurrentAuthenticatedUser();
        return ResponseEntity.ok(aiService.processMessage(user, request));
    }
}
