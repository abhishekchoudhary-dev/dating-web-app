package com.matchme.backend.user.chat.dto;

import lombok.Data;

@Data
public class MessageRequest {
    private Long receiverId;
    private String content;
}
