package com.twitter;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

/**
 * Main Application Entry Point
 * Starts the Spring Boot server
 */
@SpringBootApplication
@ComponentScan(basePackages = {"com.twitter"})
public class TwitterAltApplication {
    
    public static void main(String[] args) {
        SpringApplication.run(TwitterAltApplication.class, args);
    }
}
