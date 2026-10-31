package com.agriculture.portal.dto;

import java.util.List;

public class AiChatResponse {
    private String reply;
    private String emotion; // e.g. "HAPPY", "THINKING", "EXCITED", "CURIOUS", "SUCCESS", "CONFUSED"
    private List<ProductDto> suggestedProducts;
    private String suggestedAction; // e.g. "VIEW_PRODUCT", "VIEW_CART", "TRACK_ORDER"
    private List<String> followUpQuestions;

    public AiChatResponse() {}

    public AiChatResponse(String reply, String emotion) {
        this.reply = reply;
        this.emotion = emotion;
    }

    public String getReply() { return reply; }
    public void setReply(String reply) { this.reply = reply; }
    public String getEmotion() { return emotion; }
    public void setEmotion(String emotion) { this.emotion = emotion; }
    public List<ProductDto> getSuggestedProducts() { return suggestedProducts; }
    public void setSuggestedProducts(List<ProductDto> suggestedProducts) { this.suggestedProducts = suggestedProducts; }
    public String getSuggestedAction() { return suggestedAction; }
    public void setSuggestedAction(String suggestedAction) { this.suggestedAction = suggestedAction; }
    public List<String> getFollowUpQuestions() { return followUpQuestions; }
    public void setFollowUpQuestions(List<String> followUpQuestions) { this.followUpQuestions = followUpQuestions; }
}
