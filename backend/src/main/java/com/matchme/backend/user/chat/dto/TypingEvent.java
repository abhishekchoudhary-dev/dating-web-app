package com.matchme.backend.user.chat.dto;

import lombok.Data;

@Data
public class TypingEvent {
    private Long senderId;
    private Long receiverId;
    private boolean typing;
}
