package com.agriculture.portal.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class CartSummaryDto {
    private List<CartItemDto> items = new ArrayList<>();
    private Integer cartCount = 0;
    private BigDecimal subtotal = BigDecimal.ZERO;
    private BigDecimal discount = BigDecimal.ZERO;
    private BigDecimal delivery = BigDecimal.ZERO;
    private BigDecimal total = BigDecimal.ZERO;

    public CartSummaryDto() {}

    public List<CartItemDto> getItems() { return items; }
    public void setItems(List<CartItemDto> items) { this.items = items; }
    public Integer getCartCount() { return cartCount; }
    public void setCartCount(Integer cartCount) { this.cartCount = cartCount; }
    public BigDecimal getSubtotal() { return subtotal; }
    public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }
    public BigDecimal getDiscount() { return discount; }
    public void setDiscount(BigDecimal discount) { this.discount = discount; }
    public BigDecimal getDelivery() { return delivery; }
    public void setDelivery(BigDecimal delivery) { this.delivery = delivery; }
    public BigDecimal getTotal() { return total; }
    public void setTotal(BigDecimal total) { this.total = total; }
}
