package com.matchme.backend.user.chat.dto;

import lombok.Data;
import java.time.Instant;

@Data
public class StatusEvent {
    private Long userId;
    private boolean online;
    private Instant lastSeenAt;
}