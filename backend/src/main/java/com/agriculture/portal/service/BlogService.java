package com.agriculture.portal.service;

import com.agriculture.portal.dto.BlogPostDto;
import com.agriculture.portal.entity.BlogPost;
import com.agriculture.portal.repository.BlogPostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BlogService {

    @Autowired
    private BlogPostRepository blogPostRepository;

    public List<BlogPostDto> getAllBlogs() {
        return blogPostRepository.findAllByOrderByDateDesc().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public BlogPostDto getBlogById(Long id) {
        BlogPost blog = blogPostRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Blog post not found with id: " + id));
        return mapToDto(blog);
    }

    private BlogPostDto mapToDto(BlogPost b) {
        BlogPostDto dto = new BlogPostDto();
        dto.setId(b.getId());
        dto.setTitle(b.getTitle());
        dto.setExcerpt(b.getExcerpt());
        dto.setContent(b.getContent());
        dto.setAuthor(b.getAuthor());
        dto.setDate(b.getDate());
        dto.setCategory(b.getCategory());
        dto.setImageUrl(b.getImageUrl());
        dto.setReadTime(b.getReadTime());
        return dto;
    }
}
