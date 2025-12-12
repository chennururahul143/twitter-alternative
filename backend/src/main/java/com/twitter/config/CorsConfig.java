package com.twitter.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

/**
 * CORS Configuration - Allows frontend to communicate with backend
 * Without this, browser blocks requests from different origins
 */
@Configuration
public class CorsConfig {
    
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Allow frontend URL
        configuration.addAllowedOrigin("http://localhost:3000");
        
        // Allow all HTTP methods
        configuration.addAllowedMethod("*");
        
        // Allow all headers
        configuration.addAllowedHeader("*");
        
        // Allow credentials (cookies, auth headers)
        configuration.setAllowCredentials(true);
        
        // Set max age for preflight requests
        configuration.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
