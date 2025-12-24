package com.m2.iot.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.m2.iot.model.EnvironmentData;
import com.m2.iot.service.EnvironmentDataService;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/environment")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class EnvironmentDataController {
    
    private final EnvironmentDataService service;
    
    @GetMapping("/latest")
    public ResponseEntity<EnvironmentData> getLatest() {
        return ResponseEntity.ok(service.getLatest());
    }
    
    @GetMapping("/history")
    public ResponseEntity<List<EnvironmentData>> getHistory(
            @RequestParam(defaultValue = "50") int limit) {
        return ResponseEntity.ok(service.getLatestData(limit));
    }
    
    @GetMapping("/since")
    public ResponseEntity<List<EnvironmentData>> getSince(
            @RequestParam String timestamp) {
        Instant since = Instant.parse(timestamp);
        return ResponseEntity.ok(service.getDataSince(since));
    }
}