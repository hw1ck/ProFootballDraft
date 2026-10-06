package com.profootballdraft.backend.repositories;
import com.profootballdraft.backend.models.Nation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;
public interface NationRepository extends JpaRepository<Nation, UUID> {
    Optional<Nation> findByName(String name);
}