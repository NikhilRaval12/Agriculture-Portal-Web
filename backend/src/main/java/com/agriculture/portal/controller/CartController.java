package com.agriculture.portal.controller;

import com.agriculture.portal.dto.CartSummaryDto;
import com.agriculture.portal.entity.User;
import com.agriculture.portal.service.AuthService;
import com.agriculture.portal.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @Autowired
    private AuthService authService;

    @GetMapping
    public ResponseEntity<CartSummaryDto> getCart() {
        User user = authService.getCurrentAuthenticatedUser();
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(cartService.getCartSummary(user));
    }

    @PostMapping("/add/{productId}")
    public ResponseEntity<CartSummaryDto> addToCart(
            @PathVariable Long productId,
            @RequestParam(defaultValue = "1") int quantity
    ) {
        User user = authService.getCurrentAuthenticatedUser();
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(cartService.addToCart(user, productId, quantity));
    }

    @PutMapping("/item/{itemId}")
    public ResponseEntity<CartSummaryDto> updateCartItem(
            @PathVariable Long itemId,
            @RequestBody Map<String, Integer> body
    ) {
        User user = authService.getCurrentAuthenticatedUser();
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        int quantity = body.getOrDefault("quantity", 1);
        return ResponseEntity.ok(cartService.updateQuantity(user, itemId, quantity));
    }

    @DeleteMapping("/item/{itemId}")
    public ResponseEntity<CartSummaryDto> removeCartItem(@PathVariable Long itemId) {
        User user = authService.getCurrentAuthenticatedUser();
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(cartService.removeFromCart(user, itemId));
    }

    @DeleteMapping("/clear")
    public ResponseEntity<?> clearCart() {
        User user = authService.getCurrentAuthenticatedUser();
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        cartService.clearCart(user);
        return ResponseEntity.ok().build();
    }
}
