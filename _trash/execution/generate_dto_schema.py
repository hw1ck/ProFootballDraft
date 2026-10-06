import os
import subprocess

INIT_SQL_PATH = "database/init.sql"
PLAYER_ENTITY_PATH = "backend/src/main/java/com/profootballdraft/backend/models/Player.java"
CARD_TYPE_PATH = "backend/src/main/java/com/profootballdraft/backend/models/CardType.java"

PLAYER_DTO_PATH = "backend/src/main/java/com/profootballdraft/backend/dto/PlayerResponseDTO.java"
PLAYER_REQ_PATH = "backend/src/main/java/com/profootballdraft/backend/dto/PlayerCreateRequest.java"
PLAYER_MAPPER_PATH = "backend/src/main/java/com/profootballdraft/backend/mappers/PlayerMapper.java"
TIER_CONSTANTS_PATH = "backend/src/main/java/com/profootballdraft/backend/constants/TierConstants.java"

PLAYER_SERVICE_PATH = "backend/src/main/java/com/profootballdraft/backend/services/PlayerService.java"
CACHE_CONFIG_PATH = "backend/src/main/java/com/profootballdraft/backend/config/CacheConfig.java"
BACKEND_APP_PATH = "backend/src/main/java/com/profootballdraft/backend/BackendApplication.java"

os.makedirs(os.path.dirname(PLAYER_DTO_PATH), exist_ok=True)
os.makedirs(os.path.dirname(PLAYER_MAPPER_PATH), exist_ok=True)
os.makedirs(os.path.dirname(TIER_CONSTANTS_PATH), exist_ok=True)
os.makedirs(os.path.dirname(PLAYER_SERVICE_PATH), exist_ok=True)
os.makedirs(os.path.dirname(CACHE_CONFIG_PATH), exist_ok=True)


# 1. UPDATE INIT.SQL
with open(INIT_SQL_PATH, 'r') as f:
    init_sql = f.read()

if "card_type" not in init_sql:
    # Add card_type
    init_sql = init_sql.replace(
        "physicality INT,",
        "physicality INT,\n    card_type VARCHAR(20) DEFAULT 'BASE',"
    )
    # Add indexes
    indexes = """
CREATE INDEX IF NOT EXISTS idx_players_overall_rating ON players(overall_rating);
CREATE INDEX IF NOT EXISTS idx_players_position ON players(position);
CREATE INDEX IF NOT EXISTS idx_players_club_id ON players(club_id);
CREATE INDEX IF NOT EXISTS idx_players_nation_id ON players(nation_id);
"""
    init_sql += indexes
    with open(INIT_SQL_PATH, 'w') as f:
        f.write(init_sql)


# 2. CREATE CARD TYPE ENUM
CARD_TYPE = """package com.profootballdraft.backend.models;

public enum CardType {
    BASE,
    FEATURE,
    TOTW,
    ICON,
    SPECIAL
}
"""
with open(CARD_TYPE_PATH, 'w') as f:
    f.write(CARD_TYPE)


# 3. UPDATE PLAYER ENTITY
PLAYER_ENTITY = """package com.profootballdraft.backend.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(
    name = "players",
    indexes = {
        @Index(name = "idx_players_overall_rating", columnList = "overall_rating"),
        @Index(name = "idx_players_position", columnList = "position"),
        @Index(name = "idx_players_club_id", columnList = "club_id"),
        @Index(name = "idx_players_nation_id", columnList = "nation_id")
    }
)
@Data
@NoArgsConstructor
public class Player {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "first_name", nullable = false, length = 100)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 100)
    private String lastName;

    @Column(nullable = false, length = 10)
    private String position;

    @Column(name = "overall_rating", nullable = false)
    private Integer overallRating;

    private Integer pace;
    private Integer shooting;
    private Integer passing;
    private Integer dribbling;
    private Integer defending;
    private Integer physicality;

    @Column(name = "player_image_url")
    private String playerImageUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "card_type", length = 20)
    private CardType cardType = CardType.BASE;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "club_id")
    private Club club;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nation_id")
    private Nation nation;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;
}
"""
with open(PLAYER_ENTITY_PATH, 'w') as f:
    f.write(PLAYER_ENTITY)


# 4. TIER CONSTANTS
TIER_CONSTANTS = """package com.profootballdraft.backend.constants;

/**
 * See PlannerContext.md for the single source of truth regarding Tier Thresholds.
 * IF these values change, they MUST also be updated in the React frontend constants.
 */
public class TierConstants {
    public static final String GREEN = "green";
    public static final String BLUE = "blue";
    public static final String RED = "red";
    public static final String GOLD = "gold";
}
"""
with open(TIER_CONSTANTS_PATH, 'w') as f:
    f.write(TIER_CONSTANTS)


# 5. DTOs
PLAYER_DTO = """package com.profootballdraft.backend.dto;

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
"""
with open(PLAYER_DTO_PATH, 'w') as f:
    f.write(PLAYER_DTO)

PLAYER_REQ = """package com.profootballdraft.backend.dto;

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
"""
with open(PLAYER_REQ_PATH, 'w') as f:
    f.write(PLAYER_REQ)


# 6. MAPPER
PLAYER_MAPPER = """package com.profootballdraft.backend.mappers;

import com.profootballdraft.backend.dto.PlayerResponseDTO;
import com.profootballdraft.backend.models.Player;
import org.springframework.stereotype.Component;

@Component
public class PlayerMapper {

    public PlayerResponseDTO toResponseDTO(Player player) {
        String clubName = player.getClub() != null ? player.getClub().getName() : null;
        String leagueName = (player.getClub() != null && player.getClub().getLeague() != null) 
            ? player.getClub().getLeague().getName() : null;
        String nationName = player.getNation() != null ? player.getNation().getName() : null;

        return new PlayerResponseDTO(
            player.getId(),
            player.getFirstName(),
            player.getLastName(),
            player.getPosition(),
            player.getOverallRating(),
            player.getPace(),
            player.getShooting(),
            player.getPassing(),
            player.getDribbling(),
            player.getDefending(),
            player.getPhysicality(),
            player.getPlayerImageUrl(),
            player.getCardType(),
            clubName,
            nationName,
            leagueName
        );
    }
}
"""
with open(PLAYER_MAPPER_PATH, 'w') as f:
    f.write(PLAYER_MAPPER)

print("Generated Schema, Enums, DTOs, Mappers.")
