package com.agriculture.portal.service;

import com.agriculture.portal.dto.WishlistItemDto;
import com.agriculture.portal.entity.Product;
import com.agriculture.portal.entity.User;
import com.agriculture.portal.entity.WishlistItem;
import com.agriculture.portal.repository.ProductRepository;
import com.agriculture.portal.repository.WishlistItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class WishlistService {

    @Autowired
    private WishlistItemRepository wishlistRepository;

    @Autowired
    private ProductRepository productRepository;

    public List<WishlistItemDto> getWishlist(User user) {
        return wishlistRepository.findByUserOrderByCreatedAtDesc(user).stream()
                .map(item -> {
                    WishlistItemDto dto = new WishlistItemDto();
                    dto.setId(item.getId());
                    dto.setProductId(item.getProduct().getId());
                    dto.setProductName(item.getProduct().getName());
                    dto.setImageUrl(item.getProduct().getImageUrl());
                    dto.setPrice(item.getProduct().getPrice());
                    dto.setDiscountedPrice(item.getProduct().getDiscountedPrice());
                    dto.setDiscount(item.getProduct().getDiscount());
                    dto.setAvailableQuantity(item.getProduct().getAvailableQuantity());
                    if (item.getProduct().getCategory() != null) {
                        dto.setCategoryName(item.getProduct().getCategory().getName());
                    }
                    return dto;
                }).collect(Collectors.toList());
    }

    @Transactional
    public List<WishlistItemDto> toggleWishlist(User user, Long productId) {
        if (wishlistRepository.existsByUserIdAndProductId(user.getId(), productId)) {
            wishlistRepository.deleteByUserIdAndProductId(user.getId(), productId);
        } else {
            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));
            wishlistRepository.save(new WishlistItem(user, product));
        }
        return getWishlist(user);
    }

    @Transactional
    public List<WishlistItemDto> removeFromWishlist(User user, Long itemId) {
        WishlistItem item = wishlistRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Wishlist item not found with id: " + itemId));

        if (!item.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized wishlist access");
        }

        wishlistRepository.delete(item);
        return getWishlist(user);
    }

    public boolean isInWishlist(User user, Long productId) {
        if (user == null) return false;
        return wishlistRepository.existsByUserIdAndProductId(user.getId(), productId);
    }
}
