package com.profootballdraft.backend.controllers;

import com.profootballdraft.backend.models.*;
import com.profootballdraft.backend.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/players")
public class PlayerController {

    @Autowired private PlayerRepository playerRepository;
    @Autowired private ClubRepository clubRepository;
    @Autowired private NationRepository nationRepository;
    @Autowired private LeagueRepository leagueRepository;

    private Integer safeGetInteger(Map<String, Object> data, String key) {
        Object val = data.get(key);
        if (val instanceof Integer) return (Integer) val;
        if (val instanceof String) {
            try { return Integer.parseInt((String) val); } catch (NumberFormatException e) { return 0; }
        }
        return 0; // fallback safe default
    }

    @PostMapping("/batch")
    @Transactional
    public String batchImport(@RequestBody List<Map<String, Object>> playersData) {
        int count = 0;
        for (Map<String, Object> data : playersData) {
            
            // 1. Resolve League
            String leagueName = (String) data.getOrDefault("leagueName", "Unknown League");
            League league = leagueRepository.findByName(leagueName).orElseGet(() -> {
                League newLeague = new League();
                newLeague.setName(leagueName);
                return leagueRepository.save(newLeague);
            });

            // 2. Resolve Club
            String clubName = (String) data.getOrDefault("clubName", "Unknown Club");
            String clubLogo = (String) data.getOrDefault("clubLogoUrl", "");
            Club club = clubRepository.findByName(clubName).orElseGet(() -> {
                Club newClub = new Club();
                newClub.setName(clubName);
                newClub.setLogoUrl(clubLogo);
                newClub.setLeague(league);
                return clubRepository.save(newClub);
            });

            // 3. Resolve Nation
            String nationName = (String) data.getOrDefault("nationName", "Unknown Nation");
            String countryCode = (String) data.getOrDefault("countryCode", "xx");
            Nation nation = nationRepository.findByName(nationName).orElseGet(() -> {
                Nation newNation = new Nation();
                newNation.setName(nationName);
                newNation.setCountryCode(countryCode);
                return nationRepository.save(newNation);
            });

            // 4. Create Player (with safe casts)
            Player player = new Player();
            player.setFirstName((String) data.getOrDefault("firstName", ""));
            player.setLastName((String) data.getOrDefault("lastName", "Unknown"));
            player.setPosition((String) data.getOrDefault("position", "RES"));
            player.setPlayerImageUrl((String) data.getOrDefault("playerImageUrl", ""));
            
            player.setOverallRating(safeGetInteger(data, "overallRating"));
            player.setPace(safeGetInteger(data, "pace"));
            player.setShooting(safeGetInteger(data, "shooting"));
            player.setPassing(safeGetInteger(data, "passing"));
            player.setDribbling(safeGetInteger(data, "dribbling"));
            player.setDefending(safeGetInteger(data, "defending"));
            player.setPhysicality(safeGetInteger(data, "physicality"));
            
            player.setClub(club);
            player.setNation(nation);

            playerRepository.save(player);
            count++;
        }
        return "Successfully imported " + count + " players.";
    }
}
