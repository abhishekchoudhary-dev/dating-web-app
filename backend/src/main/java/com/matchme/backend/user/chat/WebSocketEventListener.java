package com.matchme.backend.user.chat;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;
import com.matchme.backend.user.UserRepository;
import com.matchme.backend.user.User;

import java.security.Principal;

@Slf4j
@Component
@RequiredArgsConstructor
public class WebSocketEventListener {

    private final MessageService messageService;
    private final UserRepository userRepository;

    @EventListener
    public void handleWebSocketConnectListener(SessionConnectedEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        Principal principal = headerAccessor.getUser();
        log.info("websocket connection established: {}", principal);
        if (principal instanceof UsernamePasswordAuthenticationToken auth) {
            var user = (com.matchme.backend.user.User) auth.getPrincipal();
            log.info("User connected: {}", user.getEmail());
            if (user.getId() != null) {
                User freshUser = userRepository.findById(user.getId()).orElse(null);
                if (freshUser != null){
                    //if there is user we must add to online map
                    messageService.trackUserOnline(user.getId());
                    //user online status only broadcasted if they want to
                    if (!freshUser.isHideOnlineStatus()){
                        messageService.broadcastStatus(user.getId(),true);
                    }
                }
                    
            }
        }
    }
    

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        Principal principal = headerAccessor.getUser();
        if (principal instanceof UsernamePasswordAuthenticationToken auth) {
            var user = (com.matchme.backend.user.User) auth.getPrincipal();
            if (user.getId() != null) {
                messageService.userDisconnected(user.getId());
            }
        }
    }
}