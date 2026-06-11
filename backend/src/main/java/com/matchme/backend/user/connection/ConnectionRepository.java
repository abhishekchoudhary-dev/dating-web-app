package com.matchme.backend.user.connection;

import com.matchme.backend.user.User;
import com.matchme.backend.user.connection.enums.ConnectionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ConnectionRepository extends JpaRepository<Connection, Long> {

    // Find connection between two users regardless of direction
    Optional<Connection> findByRequesterAndReceiver(User requester, User receiver);

    // Find all connections where user is requester with specific status
    List<Connection> findByRequesterAndStatus(User requester, ConnectionStatus status);

    // Find all connections where user is receiver with specific status
    List<Connection> findByReceiverAndStatus(User receiver, ConnectionStatus status);

    // Find all matched connections for a user
    List<Connection> findByRequesterAndStatusOrReceiverAndStatus(
            User requester, ConnectionStatus status1,
            User receiver, ConnectionStatus status2
    );
}
