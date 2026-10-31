package com.agriculture.portal.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "blog_posts")
public class BlogPost {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String excerpt;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(length = 100)
    private String author = "Nikhil Raval";

    private LocalDate date = LocalDate.now();

    @Column(length = 50)
    private String category = "Organic Farming";

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "read_time", length = 30)
    private String readTime = "5 min read";

    public BlogPost() {
    }

    public BlogPost(String title, String excerpt, String content, String author, LocalDate date, String category, String imageUrl, String readTime) {
        this.title = title;
        this.excerpt = excerpt;
        this.content = content;
        this.author = author != null ? author : "Nikhil Raval";
        this.date = date != null ? date : LocalDate.now();
        this.category = category != null ? category : "Organic Farming";
        this.imageUrl = imageUrl;
        this.readTime = readTime != null ? readTime : "5 min read";
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getExcerpt() {
        return excerpt;
    }

    public void setExcerpt(String excerpt) {
        this.excerpt = excerpt;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getReadTime() {
        return readTime;
    }

    public void setReadTime(String readTime) {
        this.readTime = readTime;
    }
}
