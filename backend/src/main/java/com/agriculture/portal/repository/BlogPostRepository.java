package com.agriculture.portal.repository;

import com.agriculture.portal.entity.BlogPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BlogPostRepository extends JpaRepository<BlogPost, Long> {
    List<BlogPost> findAllByOrderByDateDesc();
    List<BlogPost> findByCategoryIgnoreCase(String category);
}
