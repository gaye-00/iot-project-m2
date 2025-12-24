package com.m2.iot.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.m2.iot.model.EnvironmentData;
import com.m2.iot.repository.EnvironmentDataRepository;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EnvironmentDataService {
    
    private final EnvironmentDataRepository repository;
    
    public List<EnvironmentData> getLatestData(int limit) {
        return repository.findTop100ByOrderByTimestampDesc()
                .stream()
                .limit(limit)
                .toList();
    }
    
    public List<EnvironmentData> getDataSince(Instant since) {
        return repository.findByTimestampAfterOrderByTimestampAsc(since);
    }
    
    public EnvironmentData getLatest() {
        return repository.findTop100ByOrderByTimestampDesc()
                .stream()
                .findFirst()
                .orElse(null);
    }
}