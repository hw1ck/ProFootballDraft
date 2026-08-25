package com.profootballdraft.backend.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.UUID;

@Entity
@Table(name = "squad_players")
@Data
@NoArgsConstructor
@IdClass(SquadPlayerId.class)
public class SquadPlayer {
    @Id
    @Column(name = "squad_id")
    private UUID squadId;

    @Id
    @Column(name = "player_id")
    private UUID playerId;

    @Column(name = "position_index", nullable = false)
    private Integer positionIndex;
}
