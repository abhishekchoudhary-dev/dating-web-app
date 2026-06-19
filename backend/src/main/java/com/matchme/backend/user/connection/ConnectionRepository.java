package com.matchme.backend.user.connection;

import com.matchme.backend.user.User;
import com.matchme.backend.user.connection.enums.ConnectionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface ConnectionRepository extends JpaRepository<Connection, Long> {

    // Find connection between two users regardless of direction
    Optional<Connection> findByRequesterAndReceiver(User requester, User receiver);

    // Find all connections where user is requester with specific status
    List<Connection> findByRequesterAndStatus(User requester, ConnectionStatus status);

    // Find all connections where user is receiver with specific status
    List<Connection> findByReceiverAndStatus(User receiver, ConnectionStatus status);

    //query to find matches in recent order
    @Query("""
    SELECT c FROM Connection c
    WHERE (c.requester = :user OR c.receiver = :user)
    AND c.status = 'MATCHED'
    ORDER BY (
        SELECT COALESCE(MAX(m.sentAt), c.createdAt) FROM Message m
        WHERE (m.sender = c.requester AND m.receiver = c.receiver)
        OR (m.sender = c.receiver AND m.receiver = c.requester)
    ) DESC
    """)
    List<Connection> findMatchedConnectionsOrderedByRecentMessage(@Param("user") User user);

    // Find all matched connections for a user
    List<Connection> findByRequesterAndStatusOrReceiverAndStatus(
            User requester, ConnectionStatus status1,
            User receiver, ConnectionStatus status2
    );
}
