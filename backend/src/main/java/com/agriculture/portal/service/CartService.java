package com.agriculture.portal.service;

import com.agriculture.portal.dto.CartItemDto;
import com.agriculture.portal.dto.CartSummaryDto;
import com.agriculture.portal.entity.CartItem;
import com.agriculture.portal.entity.Product;
import com.agriculture.portal.entity.User;
import com.agriculture.portal.repository.CartItemRepository;
import com.agriculture.portal.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CartService {

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private ProductRepository productRepository;

    public CartSummaryDto getCartSummary(User user) {
        List<CartItem> items = cartItemRepository.findByUserOrderByProduct_NameAsc(user);

        List<CartItemDto> itemDtos = items.stream().map(item -> {
            CartItemDto dto = new CartItemDto();
            dto.setId(item.getId());
            dto.setProductId(item.getProduct().getId());
            dto.setProductName(item.getProduct().getName());
            dto.setImageUrl(item.getProduct().getImageUrl());
            dto.setPrice(item.getPrice());
            dto.setDiscountedPrice(item.getDiscountedPrice());
            dto.setQuantity(item.getQuantity());
            dto.setTotal(item.getTotal());
            dto.setAvailableQuantity(item.getProduct().getAvailableQuantity());
            return dto;
        }).collect(Collectors.toList());

        BigDecimal subtotal = BigDecimal.ZERO;
        BigDecimal totalSavings = BigDecimal.ZERO;

        for (CartItem item : items) {
            BigDecimal originalTotal = item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
            BigDecimal effectiveTotal = item.getTotal();
            subtotal = subtotal.add(effectiveTotal);
            if (originalTotal.compareTo(effectiveTotal) > 0) {
                totalSavings = totalSavings.add(originalTotal.subtract(effectiveTotal));
            }
        }

        BigDecimal delivery = BigDecimal.ZERO;
        if (!items.isEmpty()) {
            if (subtotal.compareTo(BigDecimal.valueOf(500)) <= 0) {
                delivery = BigDecimal.valueOf(70);
            }
        }

        BigDecimal grandTotal = subtotal.add(delivery);

        CartSummaryDto summary = new CartSummaryDto();
        summary.setItems(itemDtos);
        summary.setCartCount(items.stream().mapToInt(CartItem::getQuantity).sum());
        summary.setSubtotal(subtotal);
        summary.setDiscount(totalSavings);
        summary.setDelivery(delivery);
        summary.setTotal(grandTotal);

        return summary;
    }

    @Transactional
    public CartSummaryDto addToCart(User user, Long productId, int quantity) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));

        CartItem cartItem = cartItemRepository.findByUserIdAndProductId(user.getId(), productId)
                .orElse(new CartItem(user, product, 0));

        int newQuantity = cartItem.getQuantity() + Math.max(1, quantity);
        if (product.getAvailableQuantity() != null && newQuantity > product.getAvailableQuantity()) {
            newQuantity = product.getAvailableQuantity();
        }

        cartItem.setQuantity(newQuantity);
        cartItem.recalculateTotal();
        cartItemRepository.save(cartItem);

        return getCartSummary(user);
    }

    @Transactional
    public CartSummaryDto updateQuantity(User user, Long cartItemId, int quantity) {
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found with id: " + cartItemId));

        if (!cartItem.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized cart access");
        }

        if (quantity <= 0) {
            cartItemRepository.delete(cartItem);
        } else {
            if (cartItem.getProduct().getAvailableQuantity() != null && quantity > cartItem.getProduct().getAvailableQuantity()) {
                quantity = cartItem.getProduct().getAvailableQuantity();
            }
            cartItem.setQuantity(quantity);
            cartItem.recalculateTotal();
            cartItemRepository.save(cartItem);
        }

        return getCartSummary(user);
    }

    @Transactional
    public CartSummaryDto removeFromCart(User user, Long cartItemId) {
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found with id: " + cartItemId));

        if (!cartItem.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized cart access");
        }

        cartItemRepository.delete(cartItem);
        return getCartSummary(user);
    }

    @Transactional
    public void clearCart(User user) {
        cartItemRepository.deleteByUserId(user.getId());
    }
}
