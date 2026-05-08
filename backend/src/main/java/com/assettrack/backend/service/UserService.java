package com.assettrack.backend.service;

import com.assettrack.backend.domain.User;
import com.assettrack.backend.dto.user.UserResponse;
import com.assettrack.backend.exception.ResourceNotFoundException;
import com.assettrack.backend.mapper.UserMapper;
import com.assettrack.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    public UserService(UserRepository userRepository,
                       UserMapper userMapper) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
    }

    // ======================================================
    // GET ALL USERS
    // ======================================================
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(userMapper::toResponse)
                .toList();
    }

    // ======================================================
    // GET USER BY ID
    // ======================================================
    public UserResponse getUserById(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                new ResourceNotFoundException("User not found with id: " + id));

        return userMapper.toResponse(user);
    }

    // ======================================================
    // DELETE USER
    // ======================================================
    public void deleteUser(Long id) {

        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found with id: " + id);
        }

        userRepository.deleteById(id);
    }
}
