package com.agriculture.portal.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.math.RoundingMode;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(precision = 5, scale = 2)
    private BigDecimal discount = BigDecimal.ZERO;

    @Column(name = "discounted_price", precision = 10, scale = 2)
    private BigDecimal discountedPrice;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "available_quantity")
    private Integer availableQuantity = 0;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id")
    private Category category;

    @Column(name = "image_url")
    private String imageUrl;

    private Double rating = 4.8;

    @Column(name = "vendor_name")
    private String vendorName = "Gujarat Organic Farmers Association";

    public Product() {
    }

    public Product(String name, BigDecimal price, BigDecimal discount, String description, Integer availableQuantity, Category category, String imageUrl, Double rating, String vendorName) {
        this.name = name;
        this.price = price;
        this.discount = discount != null ? discount : BigDecimal.ZERO;
        this.description = description;
        this.availableQuantity = availableQuantity;
        this.category = category;
        this.imageUrl = imageUrl;
        this.rating = rating != null ? rating : 4.8;
        this.vendorName = vendorName != null ? vendorName : "Gujarat Organic Farmers Association";
        calculateDiscountedPrice();
    }

    @PrePersist
    @PreUpdate
    public void calculateDiscountedPrice() {
        if (price != null) {
            if (discount != null && discount.compareTo(BigDecimal.ZERO) > 0) {
                BigDecimal discountFactor = BigDecimal.ONE.subtract(discount.divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP));
                this.discountedPrice = price.multiply(discountFactor).setScale(2, RoundingMode.HALF_UP);
            } else {
                this.discountedPrice = price;
            }
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
        calculateDiscountedPrice();
    }

    public BigDecimal getDiscount() {
        return discount;
    }

    public void setDiscount(BigDecimal discount) {
        this.discount = discount;
        calculateDiscountedPrice();
    }

    public BigDecimal getDiscountedPrice() {
        if (discountedPrice == null) {
            calculateDiscountedPrice();
        }
        return discountedPrice;
    }

    public void setDiscountedPrice(BigDecimal discountedPrice) {
        this.discountedPrice = discountedPrice;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getAvailableQuantity() {
        return availableQuantity;
    }

    public void setAvailableQuantity(Integer availableQuantity) {
        this.availableQuantity = availableQuantity;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public String getVendorName() {
        return vendorName;
    }

    public void setVendorName(String vendorName) {
        this.vendorName = vendorName;
    }
}
