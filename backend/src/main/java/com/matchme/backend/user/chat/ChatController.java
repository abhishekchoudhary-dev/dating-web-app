package com.matchme.backend.user.chat;

import com.matchme.backend.user.User;
import com.matchme.backend.user.UserRepository;
import com.matchme.backend.user.chat.dto.MessageRequest;
import com.matchme.backend.user.chat.dto.MessageResponse;
import com.matchme.backend.user.chat.dto.StatusEvent;
import com.matchme.backend.user.chat.dto.TypingEvent;
import com.matchme.backend.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.RequestParam;

import java.security.Principal;
import java.util.*;
import java.time.Instant;

@RestController
@RequiredArgsConstructor
public class ChatController {

    private final MessageService messageService;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;

    // REST — load message history
    @GetMapping("/api/messages/{userId}")
    public ResponseEntity<List<MessageResponse>> getConversation(
            @AuthenticationPrincipal User user,
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page) {
        return ResponseEntity.ok(messageService.getConversation(user, userId, page));
    }

    //endpoint to get unread message count
    @GetMapping("/api/messages/{userId}/unread")
    public ResponseEntity<Long> getUnreadCount(
            @AuthenticationPrincipal User user,
            @PathVariable Long userId) {
        return ResponseEntity.ok(messageService.getUnreadCount(user, userId));
    }

    @GetMapping("/api/messages/unread")
    public ResponseEntity<Long> getAllUnreadCount(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(messageService.getAllUnreadCount(user));
    }

    //endpoint to mark messages as read
    @PostMapping("/api/messages/{userId}/read")
    public ResponseEntity<Void> markAsRead(
            @AuthenticationPrincipal User user,
            @PathVariable Long userId) {
        messageService.markAsRead(user, userId);
        return ResponseEntity.ok().build();
    }

    // WebSocket — send message
    @MessageMapping("/chat")
    public void sendMessage(
            Principal principal,
            @Payload MessageRequest request) {
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        messageService.sendMessage(user, request);
    }

    // WebSocket — typing indicator
    @MessageMapping("/typing")
    public void typing(
            Principal principal,
            @Payload TypingEvent event) {
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        messageService.sendTypingEvent(user, event);
    }

    // handles online status check requests for a user
    @MessageMapping("/status/request")
    public void requestStatus(Principal principal, @Payload Map<String, Long> request) {
        Long userId = request.get("userId");

        // Check if user is hiding their status explicitly
        // ensuring status is always updated
        User targetUser = userRepository.findById(userId).orElse(null);
        boolean online = targetUser != null 
        && !targetUser.isHideOnlineStatus() 
        && messageService.isOnline(userId);
        
        StatusEvent event = new StatusEvent();
        event.setUserId(userId);
        event.setOnline(online);
        
        messagingTemplate.convertAndSendToUser(
            principal.getName(),
            "/queue/status",
            event
        );
    }

    //get last message timestamp for matches page
    @GetMapping("/api/messages/{userId}/last")
    public ResponseEntity<Instant> getLastMessageTime(
        @AuthenticationPrincipal User user,
        @PathVariable Long userId) {
        User otherUser = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return messageService.getLastMessageTime(user, otherUser)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.noContent().build());
    }

}