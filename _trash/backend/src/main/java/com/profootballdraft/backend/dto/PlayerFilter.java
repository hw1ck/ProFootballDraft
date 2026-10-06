package com.profootballdraft.backend.dto;

public record PlayerFilter(
    String position,
    Integer minRating,
    Integer maxRating
) {}
