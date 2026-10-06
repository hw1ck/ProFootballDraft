package com.profootballdraft.backend.repositories;
import com.profootballdraft.backend.models.Club;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;
public interface ClubRepository extends JpaRepository<Club, UUID> {
    Optional<Club> findByName(String name);
}