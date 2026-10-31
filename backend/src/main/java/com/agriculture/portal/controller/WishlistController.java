package com.agriculture.portal.controller;

import com.agriculture.portal.dto.WishlistItemDto;
import com.agriculture.portal.entity.User;
import com.agriculture.portal.service.AuthService;
import com.agriculture.portal.service.WishlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    @Autowired
    private WishlistService wishlistService;

    @Autowired
    private AuthService authService;

    @GetMapping
    public ResponseEntity<List<WishlistItemDto>> getWishlist() {
        User user = authService.getCurrentAuthenticatedUser();
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(wishlistService.getWishlist(user));
    }

    @PostMapping("/toggle/{productId}")
    public ResponseEntity<List<WishlistItemDto>> toggleWishlist(@PathVariable Long productId) {
        User user = authService.getCurrentAuthenticatedUser();
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(wishlistService.toggleWishlist(user, productId));
    }

    @DeleteMapping("/item/{itemId}")
    public ResponseEntity<List<WishlistItemDto>> removeFromWishlist(@PathVariable Long itemId) {
        User user = authService.getCurrentAuthenticatedUser();
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(wishlistService.removeFromWishlist(user, itemId));
    }
}
