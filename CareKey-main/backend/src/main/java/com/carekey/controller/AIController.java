package com.carekey.controller;

import com.carekey.dto.AIRequest;
import com.carekey.dto.AIResponse;
import com.carekey.security.SecurityUtils;
import com.carekey.service.AIService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AIController {

    private final AIService aiService;

    @PostMapping("/clinical-summary")
    @PreAuthorize("hasAnyRole('CLINICIAN', 'DOCTOR')")
    public ResponseEntity<?> generateClinicalSummary(@RequestBody AIRequest request) {
        String clinicianId = SecurityUtils.getCurrentUserId();
        try {
            return ResponseEntity.ok(aiService.generateClinicalSummary(request, clinicianId));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/patient-explanation")
    @PreAuthorize("hasAnyRole('CLINICIAN', 'DOCTOR')")
    public ResponseEntity<?> generatePatientExplanation(@RequestBody AIRequest request) {
        String clinicianId = SecurityUtils.getCurrentUserId();
        try {
            return ResponseEntity.ok(aiService.generatePatientExplanation(request.getMedicalText(), request.getContext(), clinicianId));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/admin-assistant")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> queryAdminAssistant(@RequestBody AIRequest request) {
        String adminId = SecurityUtils.getCurrentUserId();
        try {
            return ResponseEntity.ok(aiService.queryAdminAssistant(request.getQuestion(), request.getAggregateContext(), adminId));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/chat")
    public ResponseEntity<?> chat(@RequestBody AIRequest request) {
        String userId = SecurityUtils.getCurrentUserId();
        if (request != null && request.getQuestion() != null && request.getQuestion().length() > 4000) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Input prompt exceeds 4000 character limit."));
        }
        try {
            return ResponseEntity.ok(aiService.chat(request != null ? request.getQuestion() : "", userId));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }
}

