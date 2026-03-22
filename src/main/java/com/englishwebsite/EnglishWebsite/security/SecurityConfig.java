package com.englishwebsite.EnglishWebsite.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        // Allow static frontend files
                        .requestMatchers("/", "/index.html", "/*.html", "/*.css", "/*.js", "/*.ico", "/*.txt", "/*.png", "/*.svg",
                                // Next.js static assets
                                "/_next/**", "/next/**",
                                // All frontend page routes
                                "/courses/**", "/vocabulary/**", "/grammar/**",
                                "/listening/**", "/speaking/**", "/quiz/**", "/writing/**",
                                "/plan/**", "/forum/**", "/login/**", "/register/**",
                                "/dashboard/**", "/admin/**", "/404/**", "/placement/**", "/profile/**",
                                // Legacy group routes
                                "/nhom1-auth/**", "/nhom2-vocab-grammar/**", "/nhom3-listening-speaking/**",
                                "/nhom4-writing-quiz-progress/**", "/nhom5-plan-forum/**", "/nhom6-teacher-admin/**",
                                "/english-website-app/**", "/assets/**", "/static/**", "/images/**").permitAll()

                        .requestMatchers("/api/health", "/error").permitAll()
                        // New Auth Endpoints
                        .requestMatchers("/api/auth/**").permitAll()
                        // Explicitly allow public endpoints for the React app
                        .requestMatchers(HttpMethod.POST, "/api/v1/auth/login").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/v1/users").permitAll()
                        .requestMatchers("/api/v1/realtime/**").permitAll()
                        // Allow nhom5 endpoints without authentication for frontend demo
                        .requestMatchers("/api/achievements/**").permitAll()
                        .requestMatchers("/api/daily-plan/**").permitAll()
                        .requestMatchers("/api/forum/**").permitAll()
                        // Allow vocab/grammar endpoints for frontend demo
                        .requestMatchers("/api/v1/vocab/**").permitAll()
                        .requestMatchers("/api/v1/grammar/**").permitAll()
                        .requestMatchers("/api/v1/skills/**").permitAll()
                        .requestMatchers("/api/v1/forum/**").permitAll()
                        .requestMatchers("/api/writing-quiz-progress/**").permitAll()
                        .requestMatchers("/api/vocab-grammar/**").permitAll()
                        .requestMatchers("/api/admin/**").permitAll()
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000", "http://localhost:4200", "http://localhost:5173"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
