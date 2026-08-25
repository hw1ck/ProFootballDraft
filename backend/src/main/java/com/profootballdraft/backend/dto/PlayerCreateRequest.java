package com.profootballdraft.backend.dto;

import com.profootballdraft.backend.models.CardType;
import java.util.UUID;

public record PlayerCreateRequest(
    String firstName,
    String lastName,
    String position,
    Integer overallRating,
    Integer pace,
    Integer shooting,
    Integer passing,
    Integer dribbling,
    Integer defending,
    Integer physicality,
    String playerImageUrl,
    CardType cardType,
    UUID clubId,
    UUID nationId
) {}
