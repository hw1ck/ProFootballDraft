package com.profootballdraft.backend.mappers;

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
