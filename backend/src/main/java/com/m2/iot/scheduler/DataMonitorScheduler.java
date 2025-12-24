package com.m2.iot.scheduler;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.m2.iot.model.EnvironmentData;
import com.m2.iot.service.EnvironmentDataService;

@Component
@EnableScheduling
@RequiredArgsConstructor
public class DataMonitorScheduler {
    
    private final SimpMessagingTemplate messagingTemplate;
    private final EnvironmentDataService service;
    
    @Scheduled(fixedRate = 2000) // Toutes les 2 secondes
    public void sendLatestData() {
        EnvironmentData latest = service.getLatest();
        if (latest != null) {
            messagingTemplate.convertAndSend("/topic/environment", latest);
        }
    }
}