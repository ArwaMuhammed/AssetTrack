package com.assettrack.backend.mapper;

import com.assettrack.backend.domain.User;
import com.assettrack.backend.dto.user.UserResponse;
import com.assettrack.backend.dto.user.UserSummary;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserResponse toResponse(User user);

    UserSummary toSummary(User user);
}