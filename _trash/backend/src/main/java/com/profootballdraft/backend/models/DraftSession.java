package com.profootballdraft.backend.models;

import lombok.Data;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
public class DraftSession {
    private UUID sessionId;
    private int round;
    private String status; // IN_PROGRESS, BOARDROOM
    private List<UUID> squadPlayerIds = new ArrayList<>();
    private List<UUID> currentPackPlayerIds = new ArrayList<>();
    private int pityGold = 0;
    private int pityRed = 0;

    public DraftSession() {
        this.sessionId = UUID.randomUUID();
        this.round = 1;
        this.status = "IN_PROGRESS";
    }
}
