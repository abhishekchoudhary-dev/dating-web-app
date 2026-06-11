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

    @PostMapping("/{id}/match")
    public ResponseEntity<ConnectionStatus> match(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        return ResponseEntity.ok(connectionService.match(user, id));
    }

    @PostMapping("/{id}/dismiss")
    public ResponseEntity<ConnectionStatus> dismiss(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        return ResponseEntity.ok(connectionService.dismiss(user, id));
    }
}