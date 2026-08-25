package com.profootballdraft.backend.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/dashboard")
public class DashboardController {

    // HARDCODED NOTE: Game modes are static for now. In a future phase, 
    // these could be moved to a PostgreSQL 'game_modes' table.
    @GetMapping("/modes")
    public List<Map<String, Object>> getModes() {
        return List.of(
            Map.of("id", "draft", "title", "Simple Draft", "subtitle", "Draft a team of 11 players and compete in a fast-paced tournament.", "icon", "📋", "cta", "Enter Draft", "status", "Active"),
            Map.of("id", "live-season", "title", "Live Season Fantasy", "subtitle", "Manage your squad across real-world match weeks.", "icon", "🌍", "cta", "Manage Squad"),
            Map.of("id", "toty", "title", "TOTY Mode", "subtitle", "Exclusive Team of the Year challenges with premium rewards.", "icon", "🏆", "cta", "View Events", "status", "2 Days Left"),
            Map.of("id", "builder", "title", "Favorite Builder", "subtitle", "Build your ultimate dream team without budget constraints.", "icon", "⚙️", "cta", "Build Team")
        );
    }

    // HARDCODED NOTE: Authentication is not yet implemented. 
    // We are mocking the user's hub data (e.g. My Team rating = 86) for Phase 2.
    // In Phase 3+, we will fetch the User's actual squad rating and clan matches based on Auth header.
    @GetMapping("/hub")
    public Map<String, Object> getHub() {
        return Map.of(
            "teamRating", 86,
            "objectivesCompleted", 2,
            "objectivesTotal", 5,
            "upcomingMatch", "Clan War vs [TIGERS] at 20:00"
        );
    }
}
