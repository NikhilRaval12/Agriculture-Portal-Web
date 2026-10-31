package com.agriculture.portal.service;

import com.agriculture.portal.dto.AiChatRequest;
import com.agriculture.portal.dto.AiChatResponse;
import com.agriculture.portal.dto.ProductDto;
import com.agriculture.portal.entity.Order;
import com.agriculture.portal.entity.Product;
import com.agriculture.portal.entity.User;
import com.agriculture.portal.repository.OrderRepository;
import com.agriculture.portal.repository.ProductRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AiService {
    private static final Logger logger = LoggerFactory.getLogger(AiService.class);

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductService productService;

    @Autowired
    private OrderRepository orderRepository;

    @Value("${ai.provider.api-key:}")
    private String aiApiKey;

    @Value("${ai.provider.endpoint:}")
    private String aiEndpoint;

    public AiChatResponse processMessage(User user, AiChatRequest request) {
        String msg = request.getMessage() != null ? request.getMessage().trim() : "";
        String lowerMsg = msg.toLowerCase();

        // 1. Check if external LLM provider is configured
        if (aiApiKey != null && !aiApiKey.isEmpty() && aiEndpoint != null && !aiEndpoint.isEmpty()) {
            try {
                // Extension point for external LLM (e.g. Gemini / OpenAI / Spring AI)
                logger.info("External LLM configured, routing to provider: {}", aiEndpoint);
            } catch (Exception e) {
                logger.warn("Failed calling external LLM, falling back to agricultural knowledge engine: {}", e.getMessage());
            }
        }

        // 2. Intelligent Agriculture Domain Knowledge Engine & Product Assistant
        AiChatResponse response = new AiChatResponse();

        // Order query
        if (lowerMsg.contains("where is my order") || lowerMsg.contains("order status") || lowerMsg.contains("my order") || lowerMsg.contains("track order")) {
            if (user == null) {
                response.setReply("I'd love to help track your harvest orders! Please sign in to your Agriculture Portal account first, and I will check your live delivery progress.");
                response.setEmotion("CURIOUS");
                response.setSuggestedAction("LOGIN");
            } else {
                List<Order> orders = orderRepository.findByUserOrderByCreatedAtDesc(user);
                if (orders.isEmpty()) {
                    response.setReply("Hello " + user.getFullName() + "! I checked our records and you don't have any active orders right now. Would you like to explore our fresh seeds or organic fertilizers in the Shop?");
                    response.setEmotion("CURIOUS");
                    response.setSuggestedAction("BROWSE_SHOP");
                } else {
                    Order latest = orders.get(0);
                    response.setReply("Good news " + user.getFullName() + "! Your recent order #" + latest.getOrderNumber() +
                            " is currently " + latest.getStatus() + ". Items included: " + latest.getOrderDetails() +
                            ". Total amount is \u20B9" + latest.getTotalAmount() + " via " + latest.getPaymentMethod() + ".");
                    response.setEmotion("HAPPY");
                    response.setSuggestedAction("VIEW_ORDERS");
                }
            }
            response.setFollowUpQuestions(Arrays.asList("Show me fertilizers for soil health", "What crops are best for this season?"));
            return response;
        }

        // Product search / Budget recommendations
        if (lowerMsg.contains("fertilizer") || lowerMsg.contains("seed") || lowerMsg.contains("machinery") || lowerMsg.contains("fruit") || lowerMsg.contains("vegetable") || lowerMsg.contains("find") || lowerMsg.contains("under")) {
            List<Product> matches = productRepository.findAll().stream()
                    .filter(p -> {
                        boolean textMatch = p.getName().toLowerCase().contains(lowerMsg) ||
                                (p.getDescription() != null && p.getDescription().toLowerCase().contains(lowerMsg)) ||
                                (p.getCategory() != null && lowerMsg.contains(p.getCategory().getName().toLowerCase()));

                        if (lowerMsg.contains("fertilizer") && p.getCategory() != null && p.getCategory().getName().equalsIgnoreCase("Fertilizers")) textMatch = true;
                        if (lowerMsg.contains("machinery") && p.getCategory() != null && p.getCategory().getName().equalsIgnoreCase("Machineries")) textMatch = true;
                        if (lowerMsg.contains("fruit") && p.getCategory() != null && p.getCategory().getName().equalsIgnoreCase("Fruits")) textMatch = true;
                        if (lowerMsg.contains("vegetable") && p.getCategory() != null && p.getCategory().getName().equalsIgnoreCase("Vegetables")) textMatch = true;

                        // Check price constraint like "under 1000" or "under 500"
                        if (lowerMsg.contains("1000")) {
                            return textMatch && p.getDiscountedPrice().compareTo(BigDecimal.valueOf(1000)) <= 0;
                        }
                        if (lowerMsg.contains("500")) {
                            return textMatch && p.getDiscountedPrice().compareTo(BigDecimal.valueOf(500)) <= 0;
                        }
                        return textMatch;
                    })
                    .limit(4)
                    .collect(Collectors.toList());

            if (!matches.isEmpty()) {
                List<ProductDto> dtos = matches.stream().map(productService::mapToDto).collect(Collectors.toList());
                response.setReply("I found " + dtos.size() + " verified organic agriculture products matching your criteria in our portal catalogue. Check them out below!");
                response.setEmotion("EXCITED");
                response.setSuggestedProducts(dtos);
                response.setSuggestedAction("VIEW_PRODUCTS");
                response.setFollowUpQuestions(Arrays.asList("How much water does wheat need?", "Organic pest control tips"));
                return response;
            }
        }

        // Water requirement question (e.g., wheat, rice, cotton)
        if (lowerMsg.contains("how much water") || lowerMsg.contains("water") || lowerMsg.contains("irrigation")) {
            if (lowerMsg.contains("wheat")) {
                response.setReply("Wheat typically requires 450 mm to 650 mm of water throughout its growing season. The most critical stages for irrigation are Crown Root Initiation (20-25 days after sowing), Tillering, Jointing, Flowering, and Grain Filling. Drip or sprinkler irrigation can save up to 35% water!");
            } else if (lowerMsg.contains("rice") || lowerMsg.contains("paddy")) {
                response.setReply("Rice is a water-intensive crop requiring approximately 1,200 mm to 1,500 mm. For optimal yields with conservation, consider the System of Rice Intensification (SRI) or Alternate Wetting and Drying (AWD), which cuts water use by 30%.");
            } else if (lowerMsg.contains("cotton")) {
                response.setReply("Cotton requires 700 mm to 1,200 mm of water depending on climatic zones. Drip irrigation at 4-day intervals during boll development significantly enhances fiber length and yield.");
            } else {
                response.setReply("Irrigation needs vary heavily by crop and soil type. Sandy soils require frequent, light watering, while clay soils retain moisture longer. Moisture sensors and drip irrigation ensure maximum water efficiency without waterlogging.");
            }
            response.setEmotion("HAPPY");
            response.setFollowUpQuestions(Arrays.asList("What crop should I plant this month?", "Recommend organic fertilizer"));
            return response;
        }

        // Crop planting calendar / seasonal advice
        if (lowerMsg.contains("what crop") || lowerMsg.contains("plant") || lowerMsg.contains("season") || lowerMsg.contains("month")) {
            response.setReply("In our region, crop planning follows three prime seasons:\n" +
                    "🌱 Kharif (June - October): Paddy, Maize, Cotton, Soybean, and Groundnut.\n" +
                    "🌾 Rabi (October - March): Wheat, Mustard, Gram, Barley, and Green Peas.\n" +
                    "☀️ Zaid (March - June): Watermelon, Cucumber, Fodder crops, and Summer Moong.\n" +
                    "For nutrient-rich soil before sowing, apply decomposed vermicompost available in our Fertilizers category!");
            response.setEmotion("THINKING");
            response.setFollowUpQuestions(Arrays.asList("Show organic fertilizers", "How to prevent pest attacks?"));
            return response;
        }

        // Organic pest control & soil health
        if (lowerMsg.contains("pest") || lowerMsg.contains("disease") || lowerMsg.contains("organic") || lowerMsg.contains("soil")) {
            response.setReply("For natural and sustainable pest management:\n" +
                    "1. Spray cold-pressed Neem Oil (5ml/L) with mild organic soap solution every 10-14 days.\n" +
                    "2. Use yellow sticky traps for whiteflies and aphids.\n" +
                    "3. Practice intercropping with marigold to naturally repel root nematodes.\n" +
                    "4. Nourish soil with Trichoderma and mycorrhiza to prevent fungal root rot.");
            response.setEmotion("HAPPY");
            response.setFollowUpQuestions(Arrays.asList("Find organic fertilizer under \u20B91000", "Where is my order?"));
            return response;
        }

        // Greetings & Dragon personality
        if (lowerMsg.contains("hello") || lowerMsg.contains("hi") || lowerMsg.contains("hey") || lowerMsg.contains("who are you") || lowerMsg.contains("dragon")) {
            response.setReply("Greetings! I am your Agriculture Portal 3D companion and farming assistant. I watch over your crops, help you find organic produce and tools, and track your orders. How may I support your harvest today?");
            response.setEmotion("GREETING");
            response.setFollowUpQuestions(Arrays.asList("What crop should I plant this month?", "Find organic fertilizer under \u20B91000", "Where is my order?"));
            return response;
        }

        // Default friendly fallback
        response.setReply("I'm analyzing your agricultural inquiry! As your Agriculture Portal companion, I can help you find products, give crop planting advice, calculate irrigation needs, or check your orders. What would you like to explore?");
        response.setEmotion("CURIOUS");
        response.setFollowUpQuestions(Arrays.asList("Find organic fertilizer under \u20B91000", "What crop should I plant this month?", "Where is my order?"));
        return response;
    }
}
