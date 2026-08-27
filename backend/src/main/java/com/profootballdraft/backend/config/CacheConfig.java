package com.profootballdraft.backend.config;

import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableCaching
public class CacheConfig {
    // Uses default ConcurrentMapCacheManager. 
    // Keys space is strictly bounded by design in the Service layer.
}
