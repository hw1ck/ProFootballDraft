import os

PLAYER_REPO_PATH = "backend/src/main/java/com/profootballdraft/backend/repositories/PlayerRepository.java"
PLAYER_SERVICE_PATH = "backend/src/main/java/com/profootballdraft/backend/services/PlayerService.java"
PLAYER_FILTER_PATH = "backend/src/main/java/com/profootballdraft/backend/dto/PlayerFilter.java"
CACHE_CONFIG_PATH = "backend/src/main/java/com/profootballdraft/backend/config/CacheConfig.java"
POM_PATH = "backend/pom.xml"


# 1. Update pom.xml for caching
with open(POM_PATH, "r") as f:
    pom = f.read()

if "<artifactId>spring-boot-starter-cache</artifactId>" not in pom:
    pom = pom.replace(
        "<dependencies>",
        "<dependencies>\n\t\t<dependency>\n\t\t\t<groupId>org.springframework.boot</groupId>\n\t\t\t<artifactId>spring-boot-starter-cache</artifactId>\n\t\t</dependency>"
    )
    with open(POM_PATH, "w") as f:
        f.write(pom)


# 2. Cache Config
CACHE_CONFIG = """package com.profootballdraft.backend.config;

import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableCaching
public class CacheConfig {
    // Uses default ConcurrentMapCacheManager. 
    // Keys space is strictly bounded by design in the Service layer.
}
"""
os.makedirs(os.path.dirname(CACHE_CONFIG_PATH), exist_ok=True)
with open(CACHE_CONFIG_PATH, "w") as f:
    f.write(CACHE_CONFIG)


# 3. PlayerFilter DTO
PLAYER_FILTER = """package com.profootballdraft.backend.dto;

public record PlayerFilter(
    String position,
    Integer minRating,
    Integer maxRating
) {}
"""
with open(PLAYER_FILTER_PATH, "w") as f:
    f.write(PLAYER_FILTER)


# 4. Player Repository
PLAYER_REPO = """package com.profootballdraft.backend.repositories;

import com.profootballdraft.backend.models.Player;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PlayerRepository extends JpaRepository<Player, UUID>, JpaSpecificationExecutor<Player> {

    @EntityGraph(attributePaths = {"club.league", "nation"})
    Optional<Player> findById(UUID id);

    @EntityGraph(attributePaths = {"club.league", "nation"})
    Page<Player> findAll(Specification<Player> spec, Pageable pageable);
    
    // Explicit queries for caching (to avoid fetching Pageable which is hard to cache optimally)
    @EntityGraph(attributePaths = {"club.league", "nation"})
    @Query("SELECT p FROM Player p WHERE p.overallRating BETWEEN :min AND :max ORDER BY p.overallRating DESC")
    List<Player> findPlayersByRatingRange(@Param("min") int min, @Param("max") int max);
    
    @EntityGraph(attributePaths = {"club.league", "nation"})
    @Query("SELECT p FROM Player p ORDER BY p.overallRating DESC LIMIT :limit")
    List<Player> findTopPlayers(@Param("limit") int limit);
}
"""
with open(PLAYER_REPO_PATH, "w") as f:
    f.write(PLAYER_REPO)


# 5. Player Service
PLAYER_SERVICE = """package com.profootballdraft.backend.services;

import com.profootballdraft.backend.dto.PlayerCreateRequest;
import com.profootballdraft.backend.dto.PlayerFilter;
import com.profootballdraft.backend.dto.PlayerResponseDTO;
import com.profootballdraft.backend.mappers.PlayerMapper;
import com.profootballdraft.backend.models.Club;
import com.profootballdraft.backend.models.Nation;
import com.profootballdraft.backend.models.Player;
import com.profootballdraft.backend.repositories.ClubRepository;
import com.profootballdraft.backend.repositories.NationRepository;
import com.profootballdraft.backend.repositories.PlayerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PlayerService {

    private final PlayerRepository playerRepository;
    private final ClubRepository clubRepository;
    private final NationRepository nationRepository;
    private final PlayerMapper playerMapper;

    /**
     * Gets a single player by ID.
     */
    @Transactional(readOnly = true)
    public Optional<PlayerResponseDTO> getPlayerById(UUID id) {
        return playerRepository.findById(id).map(playerMapper::toResponseDTO);
    }

    /**
     * UNBOUNDED QUERY: Not cached. Relies on DB indexes.
     */
    @Transactional(readOnly = true)
    public Page<PlayerResponseDTO> getPlayers(PlayerFilter filter, Pageable pageable) {
        Specification<Player> spec = Specification.where(null);
        
        if (filter.position() != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("position"), filter.position()));
        }
        if (filter.minRating() != null) {
            spec = spec.and((root, query, cb) -> cb.greaterThanOrEqualTo(root.get("overallRating"), filter.minRating()));
        }
        if (filter.maxRating() != null) {
            spec = spec.and((root, query, cb) -> cb.lessThanOrEqualTo(root.get("overallRating"), filter.maxRating()));
        }

        return playerRepository.findAll(spec, pageable).map(playerMapper::toResponseDTO);
    }

    /**
     * BOUNDED QUERY: Cached. 
     * Uses explicit string key (e.g. "gold", "red", "blue", "green").
     */
    @Cacheable(value = "playersByTier", key = "#tier")
    @Transactional(readOnly = true)
    public List<PlayerResponseDTO> getPlayersByTier(String tier) {
        int min = 0;
        int max = 99;
        
        switch (tier.toLowerCase()) {
            case "green": // < 70
                max = 69;
                break;
            case "blue": // 70-79
                min = 70; max = 79;
                break;
            case "red": // 80-89
                min = 80; max = 89;
                break;
            case "gold": // 90+
                min = 90;
                break;
            default:
                throw new IllegalArgumentException("Unknown tier: " + tier);
        }
        
        return playerRepository.findPlayersByRatingRange(min, max)
                .stream().map(playerMapper::toResponseDTO).collect(Collectors.toList());
    }

    /**
     * BOUNDED QUERY: Cached.
     */
    @Cacheable(value = "topPlayers", key = "'top100'")
    @Transactional(readOnly = true)
    public List<PlayerResponseDTO> getTopPlayers() {
        return playerRepository.findTopPlayers(100)
                .stream().map(playerMapper::toResponseDTO).collect(Collectors.toList());
    }

    /**
     * Creates a player. Evicts caches to maintain integrity.
     */
    @CacheEvict(value = {"playersByTier", "topPlayers"}, allEntries = true)
    @Transactional
    public PlayerResponseDTO createPlayer(PlayerCreateRequest data) {
        Player p = new Player();
        p.setFirstName(data.firstName());
        p.setLastName(data.lastName());
        p.setPosition(data.position());
        p.setOverallRating(data.overallRating());
        p.setPace(data.pace());
        p.setShooting(data.shooting());
        p.setPassing(data.passing());
        p.setDribbling(data.dribbling());
        p.setDefending(data.defending());
        p.setPhysicality(data.physicality());
        p.setPlayerImageUrl(data.playerImageUrl());
        p.setCardType(data.cardType());

        if (data.clubId() != null) {
            Club club = clubRepository.findById(data.clubId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid Club ID"));
            p.setClub(club);
        }
        
        if (data.nationId() != null) {
            Nation nation = nationRepository.findById(data.nationId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid Nation ID"));
            p.setNation(nation);
        }

        Player saved = playerRepository.save(p);
        return playerMapper.toResponseDTO(saved);
    }
}
"""
with open(PLAYER_SERVICE_PATH, "w") as f:
    f.write(PLAYER_SERVICE)

print("Generated Player Service Layer")
