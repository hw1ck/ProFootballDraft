package com.profootballdraft.backend.dto;

import com.profootballdraft.backend.models.CardType;
import java.util.UUID;

public record PlayerResponseDTO(
    UUID id,
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
    String clubName,
    String nationName,
    String leagueName
) {}
