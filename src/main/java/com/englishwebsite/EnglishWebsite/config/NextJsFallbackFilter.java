package com.englishwebsite.EnglishWebsite.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Filter to gracefully handle Next.js Static Export routing.
 * When Next.js exports a SPA, it creates files like /dashboard/teacher/courses.html.
 * If a user manually hits HTTP GET /dashboard/teacher/courses, Spring Boot natively throws 404.
 * This Filter intercepts the request and silently forwards to the .html suffix if it exists.
 */
@Component
public class NextJsFallbackFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();

        // 1. We only care about GET requests.
        // 2. We skip any /api/ Backend endpoints.
        // 3. We skip any paths that already have file extensions (like .js, .css, .png, .html)
        if (request.getMethod().equalsIgnoreCase("GET") && !path.startsWith("/api/") && !path.contains(".")) {
            
            // Allow root to just be processed by standard WelcomePageHandlerMapping (index.html)
            if (!path.equals("/")) {
                // Check if <path>.html exists
                if (new ClassPathResource("static" + path + ".html").exists()) {
                    request.getRequestDispatcher(path + ".html").forward(request, response);
                    return;
                }
                // Check if <path>/index.html exists (fallback for some nested architectures)
                String indexPath = path.endsWith("/") ? path + "index.html" : path + "/index.html";
                if (new ClassPathResource("static" + indexPath).exists()) {
                    request.getRequestDispatcher(indexPath).forward(request, response);
                    return;
                }
            }
        }

        // Continue the chain as normal if no static override found
        filterChain.doFilter(request, response);
    }
}
