package com.profootballdraft.backend.controllers;

import com.profootballdraft.backend.dto.DraftSessionResponse;
import com.profootballdraft.backend.services.SimpleDraftEngineService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/draft")
@RequiredArgsConstructor
public class DraftController {

    private final SimpleDraftEngineService draftEngineService;

    @PostMapping("/start")
    public DraftSessionResponse startDraft() {
        return draftEngineService.startDraft();
    }

    @PostMapping("/{sessionId}/pick/{playerId}")
    public DraftSessionResponse makePick(@PathVariable UUID sessionId, @PathVariable UUID playerId) {
        return draftEngineService.makePick(sessionId, playerId);
    }

    @GetMapping("/{sessionId}")
    public DraftSessionResponse getSession(@PathVariable UUID sessionId) {
        return draftEngineService.getSession(sessionId);
    }
}
