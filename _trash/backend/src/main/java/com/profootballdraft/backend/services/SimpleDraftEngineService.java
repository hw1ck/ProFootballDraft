package com.profootballdraft.backend.services;

import com.profootballdraft.backend.dto.DraftSessionResponse;
import com.profootballdraft.backend.dto.PlayerResponseDTO;
import com.profootballdraft.backend.models.DraftSession;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SimpleDraftEngineService {
    
    private final PlayerService playerService;
    private final Map<UUID, DraftSession> sessions = new ConcurrentHashMap<>();
    
    private static final int MAX_ROUNDS = 16;
    private static final Map<String, Integer> QUOTAS = Map.of(
        "GK", 2, "DEF", 5, "MID", 5, "FWD", 4
    );

    public DraftSessionResponse startDraft() {
        DraftSession session = new DraftSession();
        List<PlayerResponseDTO> initialPack = generatePack(session);
        session.setCurrentPackPlayerIds(initialPack.stream().map(PlayerResponseDTO::id).collect(Collectors.toList()));
        sessions.put(session.getSessionId(), session);
        return toResponse(session, new ArrayList<>(), initialPack);
    }

    public DraftSessionResponse makePick(UUID sessionId, UUID playerId) {
        DraftSession session = sessions.get(sessionId);
        if (session == null) throw new IllegalArgumentException("Session not found");
        if (session.getStatus().equals("BOARDROOM")) throw new IllegalStateException("Draft already completed");
        if (!session.getCurrentPackPlayerIds().contains(playerId)) {
            throw new IllegalArgumentException("Player not in current pack");
        }

        session.getSquadPlayerIds().add(playerId);
        
        if (session.getRound() >= MAX_ROUNDS) {
            session.setStatus("BOARDROOM");
            session.getCurrentPackPlayerIds().clear();
        } else {
            session.setRound(session.getRound() + 1);
            List<PlayerResponseDTO> nextPack = generatePack(session);
            session.setCurrentPackPlayerIds(nextPack.stream().map(PlayerResponseDTO::id).collect(Collectors.toList()));
        }
        
        return getSession(sessionId);
    }

    public DraftSessionResponse getSession(UUID sessionId) {
        DraftSession session = sessions.get(sessionId);
        if (session == null) throw new IllegalArgumentException("Session not found");
        
        List<PlayerResponseDTO> squad = session.getSquadPlayerIds().stream()
            .map(playerService::getPlayerById)
            .filter(Optional::isPresent)
            .map(Optional::get)
            .collect(Collectors.toList());
            
        List<PlayerResponseDTO> pack = session.getCurrentPackPlayerIds().stream()
            .map(playerService::getPlayerById)
            .filter(Optional::isPresent)
            .map(Optional::get)
            .collect(Collectors.toList());
            
        return toResponse(session, squad, pack);
    }

    private List<PlayerResponseDTO> generatePack(DraftSession session) {
        List<PlayerResponseDTO> squad = session.getSquadPlayerIds().stream()
            .map(playerService::getPlayerById)
            .filter(Optional::isPresent)
            .map(Optional::get)
            .collect(Collectors.toList());

        int gkCount = 0, defCount = 0, midCount = 0, fwdCount = 0;
        for (PlayerResponseDTO p : squad) {
            String pos = p.position();
            if (List.of("GK").contains(pos)) gkCount++;
            else if (List.of("CB", "LB", "RB", "LWB", "RWB").contains(pos)) defCount++;
            else if (List.of("CM", "CDM", "CAM", "LM", "RM").contains(pos)) midCount++;
            else fwdCount++;
        }

        List<String> neededPositions = new ArrayList<>();
        if (gkCount < QUOTAS.get("GK")) neededPositions.addAll(List.of("GK"));
        if (defCount < QUOTAS.get("DEF")) neededPositions.addAll(List.of("CB", "LB", "RB", "LWB", "RWB"));
        if (midCount < QUOTAS.get("MID")) neededPositions.addAll(List.of("CM", "CDM", "CAM", "LM", "RM"));
        if (fwdCount < QUOTAS.get("FWD")) neededPositions.addAll(List.of("ST", "CF", "LW", "RW"));
        
        if (neededPositions.isEmpty()) {
            neededPositions = List.of("GK", "CB", "LB", "RB", "LWB", "RWB", "CDM", "CM", "CAM", "LM", "RM", "LW", "RW", "CF", "ST");
        }

        List<PlayerResponseDTO> pack = new ArrayList<>();
        
        if (session.getRound() >= 12) {
            if (session.getPityGold() < 3) {
                List<PlayerResponseDTO> gold = playerService.getRandomPlayers(neededPositions, 90, 99, session.getSquadPlayerIds(), 1);
                if (!gold.isEmpty()) {
                    pack.add(gold.get(0));
                    session.setPityGold(session.getPityGold() + 1);
                }
            }
            if (session.getPityRed() < 4 && pack.size() < 2) {
                List<UUID> ex = new ArrayList<>(session.getSquadPlayerIds());
                ex.addAll(pack.stream().map(PlayerResponseDTO::id).collect(Collectors.toList()));
                List<PlayerResponseDTO> red = playerService.getRandomPlayers(neededPositions, 80, 89, ex, 1);
                if (!red.isEmpty()) {
                    pack.add(red.get(0));
                    session.setPityRed(session.getPityRed() + 1);
                }
            }
        }
        
        int remaining = 6 - pack.size();
        List<UUID> excludedIds = new ArrayList<>(session.getSquadPlayerIds());
        excludedIds.addAll(pack.stream().map(PlayerResponseDTO::id).collect(Collectors.toList()));
        
        List<PlayerResponseDTO> randoms = playerService.getRandomPlayers(neededPositions, 76, 99, excludedIds, remaining);
        pack.addAll(randoms);
        
        for (PlayerResponseDTO p : pack) {
            if (p.overallRating() >= 90) session.setPityGold(session.getPityGold() + 1);
            else if (p.overallRating() >= 80) session.setPityRed(session.getPityRed() + 1);
        }
        
        Collections.shuffle(pack);
        return pack;
    }

    private DraftSessionResponse toResponse(DraftSession session, List<PlayerResponseDTO> squad, List<PlayerResponseDTO> currentPack) {
        return new DraftSessionResponse(session.getSessionId(), session.getRound(), session.getStatus(), squad, currentPack);
    }
}
