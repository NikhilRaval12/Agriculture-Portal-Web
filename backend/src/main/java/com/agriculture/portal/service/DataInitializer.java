package com.agriculture.portal.service;

import com.agriculture.portal.entity.*;
import com.agriculture.portal.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private BlogPostRepository blogPostRepository;

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedUsers();
        seedCategoriesAndProducts();
        seedBlogPosts();
        seedFeedback();
    }

    private void seedUsers() {
        if (!userRepository.existsByUsername("nikhil")) {
            User admin = new User(
                    "nikhil",
                    "Nikhil Raval",
                    "nikhilraval7473@gmail.com",
                    passwordEncoder.encode("nikhil123"),
                    "+91 9558254569"
            );
            admin.setRole("ROLE_ADMIN");
            userRepository.save(admin);
            logger.info("Seeded admin user 'nikhil'");
        }

        if (!userRepository.existsByUsername("farmer")) {
            User demo = new User(
                    "farmer",
                    "Kishan Patel",
                    "farmer@example.com",
                    passwordEncoder.encode("farmer123"),
                    "+91 9876543210"
            );
            userRepository.save(demo);
            logger.info("Seeded demo user 'farmer'");
        }
    }

    private void seedCategoriesAndProducts() {
        if (categoryRepository.count() == 0) {
            Category veg = categoryRepository.save(new Category("Vegetables", "Fresh organic vegetables harvested directly from regional farms.", "/images/category-1.jpg"));
            Category fruits = categoryRepository.save(new Category("Fruits", "Crisp, sweet, and sun-ripened seasonal fruits.", "/images/category-2.jpg"));
            Category fert = categoryRepository.save(new Category("Fertilizers", "Certified bio-fertilizers and organic soil nourishment enhancers.", "/images/fertilizers.jpg"));
            Category mach = categoryRepository.save(new Category("Machineries", "Reliable agricultural machinery and precision tools for modern cultivation.", "/images/machineries.jpg"));

            List<Product> products = Arrays.asList(
                    new Product("Bell Pepper", BigDecimal.valueOf(120.00), BigDecimal.valueOf(30), "Crisp and juicy sweet bell peppers grown in controlled organic shade netting.", 150, veg, "/images/product-1.jpg", 4.9, "Green Valley Organics"),
                    new Product("Strawberry", BigDecimal.valueOf(250.00), BigDecimal.valueOf(20), "Sweet, fragrant farm strawberries picked fresh at peak ripeness.", 80, fruits, "/images/product-2.jpg", 4.8, "Sahyadri Farms"),
                    new Product("Green Beans", BigDecimal.valueOf(60.00), BigDecimal.ZERO, "Tender and stringless organic green beans packed with crisp freshness.", 200, veg, "/images/product-3.jpg", 4.7, "Narmada Agro"),
                    new Product("Purple Cabbage", BigDecimal.valueOf(80.00), BigDecimal.valueOf(15), "Vibrant, nutrient-dense purple cabbage cultivated with zero chemical pesticides.", 120, veg, "/images/product-4.jpg", 4.8, "Gujarat Natural Growers"),
                    new Product("Tomato", BigDecimal.valueOf(40.00), BigDecimal.valueOf(25), "Vine-ripened plump red tomatoes bursting with rich natural flavor.", 300, veg, "/images/product-5.jpg", 4.9, "Mahesana Farmers Club"),
                    new Product("Broccoli", BigDecimal.valueOf(110.00), BigDecimal.ZERO, "Compact, dark green broccoli heads packed with antioxidants and fiber.", 90, veg, "/images/product-6.jpg", 4.7, "Himalayan Agro"),
                    new Product("Carrot", BigDecimal.valueOf(50.00), BigDecimal.valueOf(10), "Sweet crunchy organic carrots freshly harvested and cold-washed.", 250, veg, "/images/product-7.jpg", 4.9, "Patan Farm Cooperative"),
                    new Product("Fresh Farm Juice", BigDecimal.valueOf(140.00), BigDecimal.ZERO, "Pure cold-pressed seasonal fruit elixir without added sugar or preservatives.", 60, fruits, "/images/product-8.jpg", 4.8, "Pure Harvest"),
                    new Product("Red Onion", BigDecimal.valueOf(45.00), BigDecimal.valueOf(10), "Firm and pungent red onions with excellent shelf life and flavor.", 400, veg, "/images/product-9.jpg", 4.6, "Nashik & Gujarat Agro"),
                    new Product("Kashmiri Apple", BigDecimal.valueOf(180.00), BigDecimal.valueOf(15), "Crisp, sweet mountain apples directly sourced from natural orchards.", 110, fruits, "/images/product-10.jpg", 5.0, "Valley Orchards"),
                    new Product("Organic Garlic", BigDecimal.valueOf(160.00), BigDecimal.ZERO, "Strong aromatic cloves grown with microbial bio-fertilizers.", 180, veg, "/images/product-11.jpg", 4.8, "Palanpur Agro"),
                    new Product("Green Chilli", BigDecimal.valueOf(70.00), BigDecimal.valueOf(20), "Fiery and fresh green chillies hand-picked daily.", 150, veg, "/images/product-12.jpg", 4.7, "Anand Agri Producers"),
                    new Product("Bio-Enriched Vermicompost", BigDecimal.valueOf(450.00), BigDecimal.valueOf(25), "Premium 25kg bag of organic earthworm compost enriched with neem cake.", 85, fert, "/images/fertilizers.jpg", 4.9, "Gujarat Bio Agro"),
                    new Product("Rotary Mini Cultivator Tiller", BigDecimal.valueOf(24500.00), BigDecimal.valueOf(12), "Fuel-efficient 7HP 4-stroke rotary power weeder and tiller for horticulture and farming.", 25, mach, "/images/machineries.jpg", 4.9, "AgriTech Engineering")
            );

            productRepository.saveAll(products);
            logger.info("Seeded {} products across 4 categories", products.size());
        }
    }

    private void seedBlogPosts() {
        if (blogPostRepository.count() == 0) {
            List<BlogPost> posts = Arrays.asList(
                    new BlogPost(
                            "Sustainable Organic Farming Practices for Gujarat's Semi-Arid Soil",
                            "Discover how zero-budget natural farming and indigenous microbial cultures revitalize soil texture and retain groundwater in arid regions.",
                            "Natural farming techniques have proven essential for transforming semi-arid agricultural tracts. By employing multi-cropping, mulching with crop residue, and inoculating soil with Jeevamrutha, farmers can eliminate synthetic inputs while increasing drought resilience. Studies across Saurashtra and North Gujarat demonstrate a 30% reduction in water requirements coupled with significantly higher micronutrient density in harvested produce.",
                            "Nikhil Raval",
                            LocalDate.of(2026, 8, 15),
                            "Organic Farming",
                            "/images/image_1.jpg",
                            "6 min read"
                    ),
                    new BlogPost(
                            "Why Micro-Drip Irrigation is the Future of Water Conservation",
                            "Precision watering techniques that cut irrigation requirements by 40% while maximizing fruit and vegetable yields.",
                            "Drip irrigation delivers water directly to plant root zones, minimizing evaporation and weed growth. When paired with smart soil moisture tensiometers, farmers can automate watering schedules according to diurnal crop evapotranspiration patterns. This article reviews gravity-fed drip kits and solar-powered pressure pumps suited for smallholder farms.",
                            "Nikhil Raval",
                            LocalDate.of(2026, 9, 2),
                            "Irrigation & Tech",
                            "/images/image_2.jpg",
                            "4 min read"
                    ),
                    new BlogPost(
                            "Integrated Pest Management Using Companion Planting and Neem Oil",
                            "Safeguard your crops from aphids, whiteflies, and fruit borers without toxic chemicals.",
                            "Integrated Pest Management (IPM) represents an ecological approach to plant protection. Marigold buffer zones deter nematodes and attract predatory ladybugs that feed on aphids. Applying 10,000 PPM azadirachtin (neem extract) disrupts insect hormonal molting without harming pollinating honeybees or soil micro-fauna.",
                            "Nikhil Raval",
                            LocalDate.of(2026, 9, 20),
                            "Pest Control",
                            "/images/image_3.jpg",
                            "5 min read"
                    )
            );

            blogPostRepository.saveAll(posts);
            logger.info("Seeded {} blog posts", posts.size());
        }
    }

    private void seedFeedback() {
        if (feedbackRepository.count() == 0) {
            List<Feedback> reviews = Arrays.asList(
                    new Feedback(1L, "Ramesh Patel", "The Agriculture Portal delivered exceptional organic fertilizers right to our farm in Mehsana. Prompt shipping and genuine quality!", 5),
                    new Feedback(2L, "Suresh Chaudhary", "Superb fresh vegetables and very smooth portal ordering. The companion dragon made navigating through the categories really fun!", 5),
                    new Feedback(3L, "Anand Shah", "Honest prices and transparent discounts. The delivery was free since my order was above ₹500.", 5)
            );
            feedbackRepository.saveAll(reviews);
            logger.info("Seeded feedback entries");
        }
    }
}
