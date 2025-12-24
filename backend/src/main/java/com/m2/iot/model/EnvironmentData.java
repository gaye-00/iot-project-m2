package com.m2.iot.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "environment_data")
public class EnvironmentData {
    
    @Id
    private String id;
    
    private Instant timestamp;
    
    @Field("temperature_celsius")
    private Double temperatureCelsius;
    
    @Field("humidity_percent")
    private Integer humidityPercent;
    
    private String sensor;
    private String device;
    private String location;
    
    @Field("data_source")
    private String dataSource;
}