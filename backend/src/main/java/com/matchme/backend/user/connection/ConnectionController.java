package com.matchme.backend.user.connection;

import com.matchme.backend.user.User;
import com.matchme.backend.user.connection.enums.ConnectionStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/connections")
@RequiredArgsConstructor
public class ConnectionController {

    private final ConnectionService connectionService;

    @GetMapping
    public ResponseEntity<List<Long>> getConnections(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(connectionService.getConnections(user));
    }

    //to match with user
    @PostMapping("/{id}/match")
    public ResponseEntity<ConnectionStatus> match(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        return ResponseEntity.ok(connectionService.match(user, id));
    }

    //get pending likes
    @GetMapping("/pending")
    public ResponseEntity<List<Long>> getPendingLikes(@AuthenticationPrincipal User user) {
    return ResponseEntity.ok(connectionService.getPendingLikes(user));
    }
    //get pending count likes tab
    @GetMapping("/pending/count")
    public ResponseEntity<Long> getPendingLikesCount(@AuthenticationPrincipal User user) {
    return ResponseEntity.ok(connectionService.getPendingLikesCount(user));
    }

    //to dismiss a discovery to not have them recommended again
    @PostMapping("/{id}/dismiss")
    public ResponseEntity<ConnectionStatus> dismiss(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        return ResponseEntity.ok(connectionService.dismiss(user, id));
    }

    //to unmatch with someone who is matched currently 
    @DeleteMapping("/{id}/unmatch")
    public ResponseEntity<Void> unmatch(
        @AuthenticationPrincipal User user,
        @PathVariable Long id){
            connectionService.unmatch(user,id);
            return ResponseEntity.noContent().build(); //because we deleted so 204 code

        }
    
}