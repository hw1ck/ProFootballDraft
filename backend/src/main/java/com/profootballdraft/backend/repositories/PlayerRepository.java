package com.profootballdraft.backend.repositories;

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
