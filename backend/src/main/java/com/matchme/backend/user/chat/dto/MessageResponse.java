package com.matchme.backend.user.chat.dto;

import lombok.Builder;
import lombok.Data;
import java.time.Instant;

@Data
@Builder
public class MessageResponse {
    private Long id;
    private Long senderId;
    private Long receiverId;
    private String content;
    private Instant sentAt;
    private Instant readAt;
}
