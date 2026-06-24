package com.matchme.backend.user.chat;

import com.matchme.backend.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;
import java.time.Instant;
//to support pagination
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface MessageRepository extends JpaRepository<Message, Long> {

    @Query("""
        SELECT m FROM Message m
        WHERE (m.sender = :user1 AND m.receiver = :user2)
        OR (m.sender = :user2 AND m.receiver = :user1)
        ORDER BY m.sentAt DESC
        """)
    Page<Message> findConversation(
        @Param("user1") User user1,
        @Param("user2") User user2,
        Pageable pageable
    );

    @Query("SELECT COUNT(m) FROM Message m WHERE m.sender = :sender AND m.receiver = :receiver AND m.readAt IS NULL")
    Long countUnreadFrom(@Param("sender") User sender, @Param("receiver") User receiver);

    //@Query("SELECT COUNT(m) FROM Message m WHERE m.receiver = :receiver AND m.readAt IS NULL")
    //Long countAllUnread(@Param("receiver") User receiver);
    @Query("""
    SELECT COUNT(m) FROM Message m
    WHERE m.receiver = :receiver
    AND m.readAt IS NULL
    AND EXISTS (
        SELECT c FROM Connection c
        WHERE c.status = 'MATCHED'
        AND ((c.requester = m.sender AND c.receiver = :receiver)
        OR (c.receiver = m.sender AND c.requester = :receiver))
    )
    """)
    Long countAllUnread(@Param("receiver") User receiver);

    @Modifying
    @Query("UPDATE Message m SET m.readAt = CURRENT_TIMESTAMP WHERE m.sender = :sender AND m.receiver = :receiver AND m.readAt IS NULL")
    void markAsRead(@Param("sender") User sender, @Param("receiver") User receiver);

    @Query("""
    SELECT MAX(m.sentAt) FROM Message m
    WHERE (m.sender = :user1 AND m.receiver = :user2)
    OR (m.sender = :user2 AND m.receiver = :user1)
    """)
    Optional<Instant> findLastMessageTime(@Param("user1") User user1, @Param("user2") User user2);

}
