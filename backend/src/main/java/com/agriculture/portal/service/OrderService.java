package com.agriculture.portal.service;

import com.agriculture.portal.dto.OrderDto;
import com.agriculture.portal.dto.OrderItemDto;
import com.agriculture.portal.dto.OrderRequest;
import com.agriculture.portal.entity.*;
import com.agriculture.portal.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private ProductRepository productRepository;

    @Transactional
    public OrderDto createOrder(User user, OrderRequest request) {
        List<CartItem> cartItems = cartItemRepository.findByUserOrderByProduct_NameAsc(user);
        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cannot place order with empty cart");
        }

        BigDecimal subtotal = BigDecimal.ZERO;
        BigDecimal totalSavings = BigDecimal.ZERO;
        StringBuilder orderDetailsBuilder = new StringBuilder();

        for (CartItem item : cartItems) {
            BigDecimal effectivePrice = item.getDiscountedPrice() != null ? item.getDiscountedPrice() : item.getPrice();
            BigDecimal originalPrice = item.getPrice();
            BigDecimal itemTotal = effectivePrice.multiply(BigDecimal.valueOf(item.getQuantity()));
            subtotal = subtotal.add(itemTotal);

            if (originalPrice.compareTo(effectivePrice) > 0) {
                totalSavings = totalSavings.add(originalPrice.subtract(effectivePrice).multiply(BigDecimal.valueOf(item.getQuantity())));
            }

            orderDetailsBuilder.append(item.getProduct().getName())
                    .append(" (x").append(item.getQuantity()).append("), ");
        }

        if (orderDetailsBuilder.length() > 2) {
            orderDetailsBuilder.setLength(orderDetailsBuilder.length() - 2);
        }

        BigDecimal delivery = BigDecimal.ZERO;
        if (subtotal.compareTo(BigDecimal.valueOf(500)) <= 0) {
            delivery = BigDecimal.valueOf(70);
        }
        BigDecimal grandTotal = subtotal.add(delivery);

        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyMMddHHmmss"));
        int randomSuffix = new Random().nextInt(900) + 100;
        String orderNumber = "AGRI-" + timestamp + "-" + randomSuffix;
        String invoiceNumber = "INV-" + timestamp + "-" + randomSuffix;

        Order order = new Order();
        order.setOrderNumber(orderNumber);
        order.setUser(user);
        String defaultFirstName = user != null && user.getFullName() != null ? user.getFullName().split(" ")[0] : (user != null ? user.getUsername() : "Farmer");
        String defaultLastName = user != null && user.getFullName() != null && user.getFullName().contains(" ") ? user.getFullName().substring(user.getFullName().indexOf(" ") + 1) : "Member";
        String defaultEmail = user != null && user.getEmail() != null ? user.getEmail() : "nikhilraval7473@gmail.com";
        String defaultPhone = user != null && user.getPhone() != null ? user.getPhone() : "+91 95582 54569";

        order.setFirstName(request.getFirstName() != null && !request.getFirstName().trim().isEmpty() ? request.getFirstName().trim() : defaultFirstName);
        order.setLastName(request.getLastName() != null && !request.getLastName().trim().isEmpty() ? request.getLastName().trim() : defaultLastName);
        order.setEmail(request.getEmail() != null && !request.getEmail().trim().isEmpty() ? request.getEmail().trim() : defaultEmail);
        order.setPhone(request.getPhone() != null && !request.getPhone().trim().isEmpty() ? request.getPhone().trim() : defaultPhone);
        order.setStreetAddress(request.getStreetAddress() != null && !request.getStreetAddress().trim().isEmpty() ? request.getStreetAddress().trim() : "Langhanaj Farm Area");
        order.setCity(request.getCity() != null && !request.getCity().trim().isEmpty() ? request.getCity().trim() : "Mahesana");
        order.setState(request.getState() != null && !request.getState().trim().isEmpty() ? request.getState().trim() : "Gujarat");
        order.setZipCode(request.getZipCode() != null && !request.getZipCode().trim().isEmpty() ? request.getZipCode().trim() : "384315");
        order.setSubtotal(subtotal);
        order.setDiscount(totalSavings);
        order.setDeliveryFee(delivery);
        order.setTotalAmount(grandTotal);
        order.setPaymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : "Cash on Delivery");
        order.setStatus("CONFIRMED");
        order.setOrderDetails(orderDetailsBuilder.toString());
        order.setCreatedAt(LocalDateTime.now());

        List<OrderItem> orderItems = new ArrayList<>();
        for (CartItem ci : cartItems) {
            BigDecimal unitPrice = ci.getDiscountedPrice() != null ? ci.getDiscountedPrice() : ci.getPrice();
            BigDecimal itemTotal = unitPrice.multiply(BigDecimal.valueOf(ci.getQuantity()));
            OrderItem oi = new OrderItem(order, ci.getProduct(), ci.getQuantity(), unitPrice, itemTotal);
            orderItems.add(oi);

            // Deduct available inventory
            Product p = ci.getProduct();
            if (p.getAvailableQuantity() != null && p.getAvailableQuantity() >= ci.getQuantity()) {
                p.setAvailableQuantity(p.getAvailableQuantity() - ci.getQuantity());
                productRepository.save(p);
            }
        }
        order.setItems(orderItems);

        Order savedOrder = orderRepository.save(order);

        // Record payment
        Payment payment = new Payment();
        payment.setOrder(savedOrder);
        payment.setCustomerId(user.getId());
        payment.setPaymentAmount(grandTotal);
        payment.setPaymentMethod(savedOrder.getPaymentMethod());
        payment.setPaymentStatus("COMPLETED");
        payment.setInvoiceNumber(invoiceNumber);
        payment.setPaymentDescription("Order payment for " + orderNumber);
        paymentRepository.save(payment);

        // Clear cart
        cartItemRepository.deleteByUserId(user.getId());

        return mapToDto(savedOrder);
    }

    public List<OrderDto> getOrdersForUser(User user) {
        return orderRepository.findByUserOrderByCreatedAtDesc(user).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public OrderDto getOrderByOrderNumber(String orderNumber) {
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new RuntimeException("Order not found: " + orderNumber));
        return mapToDto(order);
    }

    public OrderDto mapToDto(Order order) {
        OrderDto dto = new OrderDto();
        dto.setId(order.getId());
        dto.setOrderNumber(order.getOrderNumber());
        dto.setFirstName(order.getFirstName());
        dto.setLastName(order.getLastName());
        dto.setEmail(order.getEmail());
        dto.setPhone(order.getPhone());
        dto.setStreetAddress(order.getStreetAddress());
        dto.setCity(order.getCity());
        dto.setState(order.getState());
        dto.setZipCode(order.getZipCode());
        dto.setSubtotal(order.getSubtotal());
        dto.setDiscount(order.getDiscount());
        dto.setDeliveryFee(order.getDeliveryFee());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setPaymentMethod(order.getPaymentMethod());
        dto.setStatus(order.getStatus());
        dto.setOrderDetails(order.getOrderDetails());
        dto.setCreatedAt(order.getCreatedAt());

        if (order.getItems() != null) {
            List<OrderItemDto> itemDtos = order.getItems().stream().map(oi -> {
                OrderItemDto idto = new OrderItemDto();
                idto.setId(oi.getId());
                idto.setProductId(oi.getProduct().getId());
                idto.setProductName(oi.getProduct().getName());
                idto.setImageUrl(oi.getProduct().getImageUrl());
                idto.setQuantity(oi.getQuantity());
                idto.setUnitPrice(oi.getUnitPrice());
                idto.setTotalPrice(oi.getTotalPrice());
                return idto;
            }).collect(Collectors.toList());
            dto.setItems(itemDtos);
        }

        return dto;
    }
}
