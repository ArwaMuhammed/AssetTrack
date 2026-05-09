package com.assettrack.backend.service;

import com.assettrack.backend.domain.Notification;
import com.assettrack.backend.domain.NotificationType;
import com.assettrack.backend.domain.User;
import com.assettrack.backend.dto.notification.NotificationResponse;
import com.assettrack.backend.exception.ForbiddenOperationException;
import com.assettrack.backend.exception.ResourceNotFoundException;
import com.assettrack.backend.mapper.NotificationMapper;
import com.assettrack.backend.repository.NotificationRepository;
import com.assettrack.backend.repository.UserRepository;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final NotificationMapper notificationMapper;
    private final JavaMailSender mailSender;

    public NotificationService(NotificationRepository notificationRepository,
                               UserRepository userRepository,
                               NotificationMapper notificationMapper,
                               JavaMailSender mailSender) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
        this.notificationMapper = notificationMapper;
        this.mailSender = mailSender;
    }

    /**
     * Saves an in-app notification and also sends it to the user's email.
     */
    public void sendNotification(User user, String title, String message, NotificationType type) {
        // 1. Save in-app notification (same as before)
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setType(type);
        notificationRepository.save(notification);

        // 2. Also send an email to the user
        sendEmail(user.getEmail(), title, message);
    }

    /**
     * Sends a plain-text email using the configured SMTP settings (Mailtrap).
     * If sending fails, it logs the error but does NOT crash the app.
     */
    private void sendEmail(String toEmail, String subject, String body) {
        try {
            SimpleMailMessage mailMessage = new SimpleMailMessage();
            mailMessage.setFrom("assettrack@test.com");
            mailMessage.setTo(toEmail);
            mailMessage.setSubject("[AssetTrack] " + subject);
            mailMessage.setText(body);
            mailSender.send(mailMessage);
        } catch (Exception e) {
            System.err.println("Failed to send email to " + toEmail + ": " + e.getMessage());
        }
    }

    public List<NotificationResponse> getMyNotifications(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return notificationRepository.findByUser(user)
                .stream()
                .map(notificationMapper::toResponse)
                .toList();
    }

    public List<NotificationResponse> getUnreadNotifications(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return notificationRepository.findByUserAndIsReadFalse(user)
                .stream()
                .map(notificationMapper::toResponse)
                .toList();
    }

    public void markAsRead(Long notificationId, Long userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));

        if (!notification.getUser().getId().equals(userId)) {
            throw new ForbiddenOperationException("Unauthorized");
        }

        notification.setRead(true);
        notificationRepository.save(notification);
    }

    public void markAllAsRead(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<Notification> unread = notificationRepository.findByUserAndIsReadFalse(user);
        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
    }
}