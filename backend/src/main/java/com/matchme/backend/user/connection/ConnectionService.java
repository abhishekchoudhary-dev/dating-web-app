package com.matchme.backend.user.connection;

import com.matchme.backend.exception.ResourceNotFoundException;
import com.matchme.backend.user.User;
import com.matchme.backend.user.UserRepository;
import com.matchme.backend.user.connection.enums.ConnectionStatus;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class ConnectionService {

    private final ConnectionRepository connectionRepository;
    private final UserRepository userRepository;

    @Transactional
    public ConnectionStatus match(User currentUser, Long targetUserId) {
        User targetUser = userRepository.findById(targetUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Check if target user already sent a PENDING request to current user
        Optional<Connection> existingRequest = connectionRepository
                .findByRequesterAndReceiver(targetUser, currentUser);

        if (existingRequest.isPresent()) {
            Connection connection = existingRequest.get();

            if (connection.getStatus() == ConnectionStatus.PENDING) {
                // Instant match — other user already liked current user
                connection.setStatus(ConnectionStatus.MATCHED);
                connectionRepository.save(connection);
                return ConnectionStatus.MATCHED;
            }

            if (connection.getStatus() == ConnectionStatus.DISMISSED) {
                // Target user dismissed current user — cannot match
                // Keep as DISMISSED — these two never match
                return ConnectionStatus.DISMISSED;
            }
        }

        // Check if current user already acted on target user
        Optional<Connection> existingConnection = connectionRepository
                .findByRequesterAndReceiver(currentUser, targetUser);

        if (existingConnection.isPresent()) {
            return existingConnection.get().getStatus();
        }

        // No existing connection — create new PENDING request
        Connection connection = Connection.builder()
                .requester(currentUser)
                .receiver(targetUser)
                .status(ConnectionStatus.PENDING)
                .build();
        connectionRepository.save(connection);
        return ConnectionStatus.PENDING;
    }

    @Transactional
    public ConnectionStatus dismiss(User currentUser, Long targetUserId) {
        User targetUser = userRepository.findById(targetUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Check if target user already sent request to current user
        Optional<Connection> existingRequest = connectionRepository
                .findByRequesterAndReceiver(targetUser, currentUser);

        if (existingRequest.isPresent()) {
            // Update existing connection to DISMISSED
            Connection connection = existingRequest.get();
            connection.setStatus(ConnectionStatus.DISMISSED);
            connectionRepository.save(connection);
            return ConnectionStatus.DISMISSED;
        }

        // Check if connection already exists
        Optional<Connection> existingConnection = connectionRepository
                .findByRequesterAndReceiver(currentUser, targetUser);

        if (existingConnection.isPresent()) {
            Connection connection = existingConnection.get();
            connection.setStatus(ConnectionStatus.DISMISSED);
            connectionRepository.save(connection);
            return ConnectionStatus.DISMISSED;
        }

        // Create new DISMISSED connection
        Connection connection = Connection.builder()
                .requester(currentUser)
                .receiver(targetUser)
                .status(ConnectionStatus.DISMISSED)
                .build();
        connectionRepository.save(connection);
        return ConnectionStatus.DISMISSED;
    }

    // Get all matched connection IDs for current user
    public List<Long> getConnections(User currentUser) {
        List<Connection> matched = connectionRepository
                .findByRequesterAndStatusOrReceiverAndStatus(
                        currentUser, ConnectionStatus.MATCHED,
                        currentUser, ConnectionStatus.MATCHED
                );

        return matched.stream()
                .map(c -> c.getRequester().getId().equals(currentUser.getId())
                        ? c.getReceiver().getId()
                        : c.getRequester().getId())
                .collect(Collectors.toList());
    }

    // Get IDs to exclude from recommendations - tricky part - discuss?
    public List<Long> getExcludedUserIds(User currentUser) {
        // Exclude where current user is requester + DISMISSED or PENDING or MATCHED
        List<Connection> asRequester = connectionRepository
                .findByRequesterAndStatus(currentUser, ConnectionStatus.DISMISSED);
        asRequester.addAll(connectionRepository
                .findByRequesterAndStatus(currentUser, ConnectionStatus.PENDING));
        asRequester.addAll(connectionRepository
                .findByRequesterAndStatus(currentUser, ConnectionStatus.MATCHED));

        // Exclude where current user is receiver + MATCHED or DISMISSED
        List<Connection> asReceiver = connectionRepository
            .findByReceiverAndStatus(currentUser, ConnectionStatus.MATCHED);
        asReceiver.addAll(connectionRepository
            .findByReceiverAndStatus(currentUser, ConnectionStatus.DISMISSED));

        List<Long> excluded = asRequester.stream()
                .map(c -> c.getReceiver().getId())
                .collect(Collectors.toList());

        asReceiver.stream()
                .map(c -> c.getRequester().getId())
                .forEach(excluded::add);

        return excluded;
    }

    //unmatch a user who was currently matched
    @Transactional
    public void unmatch(User currentUser, Long targetUserId) {
        User targetUser = userRepository.findById(targetUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Find existing connection in both directions
        Optional<Connection> connection = connectionRepository
                .findByRequesterAndReceiver(currentUser, targetUser);
        
        if (connection.isPresent()) {
                // Current user is already requester - just set to DISMISSED
                connection.get().setStatus(ConnectionStatus.DISMISSED);
                connectionRepository.save(connection.get());
        } else {
                connection = connectionRepository
                        .findByRequesterAndReceiver(targetUser, currentUser);
                
                if (connection.isPresent()) {
                // Current user is receiver - delete old connection and create new one
                // with currentUser as requester so exclusion logic works correctly
                connectionRepository.delete(connection.get());
                Connection newConnection = Connection.builder()
                        .requester(currentUser)
                        .receiver(targetUser)
                        .status(ConnectionStatus.DISMISSED)
                        .build();
                connectionRepository.save(newConnection);
                }
        }
    }

}
