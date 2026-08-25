package com.profootballdraft.backend.repositories;
import com.profootballdraft.backend.models.Player;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
public interface PlayerRepository extends JpaRepository<Player, UUID> {
}