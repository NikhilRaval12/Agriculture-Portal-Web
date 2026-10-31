package com.agriculture.portal.dto;

import java.util.List;

public class AiChatRequest {
    private String message;
    private String context; // e.g. "SHOP", "HOME", "PRODUCT", "CART", "ORDER"
    private Long currentProductId;

    public AiChatRequest() {}

    public AiChatRequest(String message) {
        this.message = message;
    }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public String getContext() { return context; }
    public void setContext(String context) { this.context = context; }
    public Long getCurrentProductId() { return currentProductId; }
    public void setCurrentProductId(Long currentProductId) { this.currentProductId = currentProductId; }
}
