package com.profootballdraft.backend.services;

import com.profootballdraft.backend.dto.PlayerCreateRequest;
import com.profootballdraft.backend.dto.PlayerFilter;
import com.profootballdraft.backend.dto.PlayerResponseDTO;
import com.profootballdraft.backend.models.CardType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class PlayerServiceTest {

    @Autowired
    private PlayerService playerService;

    @BeforeEach
    void setUp() {
        // Seed some data
        playerService.createPlayer(new PlayerCreateRequest(
                "Lionel", "Messi", "RW", 90, 80, 87, 90, 94, 33, 64, null, CardType.BASE, null, null
        ));
        
        playerService.createPlayer(new PlayerCreateRequest(
                "Jude", "Bellingham", "CM", 86, 82, 84, 85, 88, 78, 82, null, CardType.BASE, null, null
        ));
        
        playerService.createPlayer(new PlayerCreateRequest(
                "Random", "Silver", "CB", 72, 60, 40, 50, 55, 75, 78, null, CardType.BASE, null, null
        ));
        
        playerService.createPlayer(new PlayerCreateRequest(
                "Random", "Bronze", "GK", 64, 40, 20, 40, 45, 20, 60, null, CardType.BASE, null, null
        ));
    }

    @Test
    void testGetPlayersByTier() {
        List<PlayerResponseDTO> golds = playerService.getPlayersByTier("gold");
        assertThat(golds).hasSize(1);
        assertThat(golds.get(0).lastName()).isEqualTo("Messi");

        List<PlayerResponseDTO> reds = playerService.getPlayersByTier("red");
        assertThat(reds).hasSize(1);
        assertThat(reds.get(0).lastName()).isEqualTo("Bellingham");
        
        List<PlayerResponseDTO> blues = playerService.getPlayersByTier("blue");
        assertThat(blues).hasSize(1);
        assertThat(blues.get(0).lastName()).isEqualTo("Silver");
        
        List<PlayerResponseDTO> greens = playerService.getPlayersByTier("green");
        assertThat(greens).hasSize(1);
        assertThat(greens.get(0).lastName()).isEqualTo("Bronze");
    }
    
    @Test
    void testGetPlayersGridFiltered() {
        // Filter by position = RW
        PlayerFilter filter = new PlayerFilter("RW", null, null);
        Page<PlayerResponseDTO> result = playerService.getPlayers(filter, PageRequest.of(0, 10));
        
        assertThat(result.getTotalElements()).isEqualTo(1);
        assertThat(result.getContent().get(0).lastName()).isEqualTo("Messi");
        
        // Filter by min rating 80
        PlayerFilter filter2 = new PlayerFilter(null, 80, null);
        Page<PlayerResponseDTO> result2 = playerService.getPlayers(filter2, PageRequest.of(0, 10));
        
        assertThat(result2.getTotalElements()).isEqualTo(2); // Messi and Bellingham
    }
}
