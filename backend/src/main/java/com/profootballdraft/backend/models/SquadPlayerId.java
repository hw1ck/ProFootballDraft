package com.profootballdraft.backend.models;

import lombok.Data;
import lombok.NoArgsConstructor;
import java.io.Serializable;
import java.util.UUID;

@Data
@NoArgsConstructor
public class SquadPlayerId implements Serializable {
    private UUID squadId;
    private UUID playerId;
}
