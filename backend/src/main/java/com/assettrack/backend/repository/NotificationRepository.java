package com.assettrack.backend.repository;

import com.assettrack.backend.domain.Notification;
import com.assettrack.backend.domain.NotificationType;
import com.assettrack.backend.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByUser(User user);

    List<Notification> findByUserAndIsReadFalse(User user);

    List<Notification> findByType(NotificationType type);
}