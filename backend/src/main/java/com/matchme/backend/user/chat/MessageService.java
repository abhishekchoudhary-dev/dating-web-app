package com.matchme.backend.user.chat;

import com.matchme.backend.exception.ResourceNotFoundException;
import com.matchme.backend.user.User;
import com.matchme.backend.user.UserRepository;
import com.matchme.backend.user.chat.dto.MessageRequest;
import com.matchme.backend.user.chat.dto.MessageResponse;
import com.matchme.backend.user.chat.dto.StatusEvent;
import com.matchme.backend.user.chat.dto.TypingEvent;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;
import com.matchme.backend.user.connection.ConnectionRepository;
import com.matchme.backend.user.connection.enums.ConnectionStatus;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
@Service
public class MessageService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final ConnectionRepository connectionRepository;
    private final SimpMessagingTemplate messagingTemplate;

    // Track online users in memory
    private final Map<Long, Boolean> onlineUsers = new ConcurrentHashMap<>();

    @Transactional
    public MessageResponse sendMessage(User sender, MessageRequest request) {
        // Fetch fresh managed instances from database
        User managedSender = userRepository.findById(sender.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Sender not found"));
        User managedReceiver = userRepository.findById(request.getReceiverId())
                .orElseThrow(() -> new ResourceNotFoundException("Receiver not found"));

        log.info("Sending message from {} to {}", managedSender.getEmail(), managedReceiver.getEmail());
        Message message = Message.builder()
                .sender(managedSender)
                .receiver(managedReceiver)
                .content(request.getContent())
                .build();

        messageRepository.save(message);

        MessageResponse response = toResponse(message);

        log.info("Publishing to user: {}", managedReceiver.getEmail());

        messagingTemplate.convertAndSendToUser(
                managedReceiver.getEmail(),
                "/queue/messages",
                response
        );

        //send updated unread count to the sender
        messagingTemplate.convertAndSendToUser(
                managedReceiver.getEmail(),
                "/queue/unread",
                Map.of("senderId", managedSender.getId(), "count", 
                messageRepository.countUnreadFrom(managedSender, managedReceiver)) 
        );
        
        return response;
    }

    //sending typing event on subscribed endpoint
    public void sendTypingEvent(User sender, TypingEvent event) {
        event.setSenderId(sender.getId());
        messagingTemplate.convertAndSendToUser(
                event.getReceiverId().toString(),
                "/queue/typing",
                event
        );
    }
    
    //put in map when someone comes online irrespective of status
    public void trackUserOnline(Long userId) {
        onlineUsers.put(userId, true);
    }

    //presently unused as now we have direct function calls from web socket event listener
    public void userConnected(Long userId) {
    onlineUsers.put(userId, true);
    userRepository.findById(userId).ifPresent(user -> {
        if (!user.isHideOnlineStatus()) {
            broadcastStatus(userId, true);
        }
    });
    }

    public void userDisconnected(Long userId) {
        onlineUsers.remove(userId);
        // Update lastSeenAt in database
        userRepository.findById(userId).ifPresent(user -> {
            user.setLastSeenAt(Instant.now());
            userRepository.save(user);
        });
        broadcastStatus(userId, false);
    }

    //broadcast users new status to everyone who is subscribed to his socket
    public void broadcastStatus(Long userId, boolean online) {
    StatusEvent event = new StatusEvent();
    event.setUserId(userId);
    event.setOnline(online);
    event.setLastSeenAt(online ? null : Instant.now());

    // Send to topic instead of user destination
    messagingTemplate.convertAndSend("/topic/status", event);
    }

    //get online status
    public boolean isOnline(Long userId) {
        return onlineUsers.getOrDefault(userId, false);
    }

    //get chat conversation with user
    public List<MessageResponse> getConversation(User currentUser, Long otherUserId) {
        //exlude self
        if (currentUser.getId().equals(otherUserId)) {
            throw new ResourceNotFoundException("User not found");
        }
        
        User otherUser = userRepository.findById(otherUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        //get convo only when users are matched  
        boolean isMatched = connectionRepository
            .findByRequesterAndStatusOrReceiverAndStatus(
                currentUser, ConnectionStatus.MATCHED,
                currentUser, ConnectionStatus.MATCHED
            )
            .stream()
            .anyMatch(c -> 
                c.getRequester().getId().equals(otherUserId) || 
                c.getReceiver().getId().equals(otherUserId)
            );

        if (!isMatched) {
            throw new ResourceNotFoundException("User not found");
        }

        return messageRepository.findConversation(currentUser, otherUser)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public Long getUnreadCount(User currentUser, Long otherUserId) {
        User otherUser = userRepository.findById(otherUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return messageRepository.countUnreadFrom(otherUser, currentUser);
    }

    @Transactional
    public void markAsRead(User currentUser, Long otherUserId) {
        User otherUser = userRepository.findById(otherUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        log.info("Marking messages as read from {} for {}", otherUser.getEmail(), currentUser.getEmail());
        messageRepository.markAsRead(otherUser, currentUser);
    }

    private MessageResponse toResponse(Message message) {
        return MessageResponse.builder()
                .id(message.getId())
                .senderId(message.getSender().getId())
                .receiverId(message.getReceiver().getId())
                .content(message.getContent())
                .sentAt(message.getSentAt())
                .readAt(message.getReadAt())
                .build();
    }
}