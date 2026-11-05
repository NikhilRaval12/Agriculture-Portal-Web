
package com.agriculture.portal.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class WelcomeController {

    @GetMapping("/")
    public Map<String, String> welcome() {
        return Map.of(
            "application", "Agriculture Portal Backend",
            "status", "Running",
            "message", "Welcome to Agriculture Portal API",
            "version", "1.0.0"
        );
    }
}