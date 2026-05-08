package com.assettrack.backend.mapper;

import com.assettrack.backend.domain.Notification;
import com.assettrack.backend.dto.notification.NotificationResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface NotificationMapper {

    @Mapping(target = "isRead", source = "read")
    NotificationResponse toResponse(Notification notification);
}
