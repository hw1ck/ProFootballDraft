package com.profootballdraft.backend.dto;

import java.util.List;
import java.util.UUID;

public record DraftSessionResponse(
        UUID sessionId,
        int round,
        String status,
        List<PlayerResponseDTO> squad,
        List<PlayerResponseDTO> currentPack
) {}
