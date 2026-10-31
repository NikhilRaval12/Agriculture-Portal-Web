package com.agriculture.portal.service;

import com.agriculture.portal.dto.ProductDto;
import com.agriculture.portal.entity.Product;
import com.agriculture.portal.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    public List<ProductDto> getAllProducts() {
        return productRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public Map<String, Object> getProductsPaged(Long categoryId, String search, int page, int size) {
        Pageable pageable = PageRequest.of(Math.max(0, page), size);
        Page<Product> productPage;

        if (categoryId != null && categoryId > 0) {
            productPage = productRepository.findByCategoryId(categoryId, pageable);
        } else {
            productPage = productRepository.findAll(pageable);
        }

        List<ProductDto> dtos = productPage.getContent().stream()
                .filter(p -> search == null || search.trim().isEmpty() ||
                        p.getName().toLowerCase().contains(search.toLowerCase()) ||
                        (p.getDescription() != null && p.getDescription().toLowerCase().contains(search.toLowerCase())))
                .map(this::mapToDto)
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("products", dtos);
        response.put("currentPage", productPage.getNumber());
        response.put("totalItems", productPage.getTotalElements());
        response.put("totalPages", productPage.getTotalPages());
        return response;
    }

    public ProductDto getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        return mapToDto(product);
    }

    public List<ProductDto> getFeaturedProducts() {
        return productRepository.findTop8ByOrderByRatingDesc().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<ProductDto> searchProducts(String query) {
        return productRepository.searchProducts(query).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public ProductDto mapToDto(Product p) {
        ProductDto dto = new ProductDto();
        dto.setId(p.getId());
        dto.setName(p.getName());
        dto.setPrice(p.getPrice());
        dto.setDiscount(p.getDiscount());
        dto.setDiscountedPrice(p.getDiscountedPrice());
        dto.setDescription(p.getDescription());
        dto.setAvailableQuantity(p.getAvailableQuantity());
        if (p.getCategory() != null) {
            dto.setCategoryId(p.getCategory().getId());
            dto.setCategoryName(p.getCategory().getName());
        }
        dto.setImageUrl(p.getImageUrl());
        dto.setRating(p.getRating());
        dto.setVendorName(p.getVendorName());
        return dto;
    }
}
