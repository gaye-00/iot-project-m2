package com.m2.iot.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.m2.iot.model.EnvironmentData;

import java.time.Instant;
import java.util.List;

@Repository
public interface EnvironmentDataRepository extends MongoRepository<EnvironmentData, String> {
    List<EnvironmentData> findTop100ByOrderByTimestampDesc();
    List<EnvironmentData> findByTimestampAfterOrderByTimestampAsc(Instant timestamp);
}