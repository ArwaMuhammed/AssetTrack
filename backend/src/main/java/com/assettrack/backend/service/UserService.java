package com.assettrack.backend.service;

import com.assettrack.backend.domain.Role;
import com.assettrack.backend.domain.User;
import com.assettrack.backend.dto.user.UpdateUserRoleRequest;
import com.assettrack.backend.dto.user.UserResponse;
import com.assettrack.backend.exception.ConflictException;
import com.assettrack.backend.exception.ForbiddenOperationException;
import com.assettrack.backend.exception.ResourceNotFoundException;
import com.assettrack.backend.mapper.UserMapper;
import com.assettrack.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, 
                       UserMapper userMapper, 
                       org.springframework.security.crypto.password.PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
    }

    // CREATE
    public UserResponse createUser(com.assettrack.backend.dto.user.UserRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ConflictException("Email already exists: " + request.getEmail());
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());

        return userMapper.toResponse(userRepository.save(user));
    }

    // UPDATE
    public UserResponse updateUser(Long id, com.assettrack.backend.dto.user.UserRequest request, String currentAdminEmail) {
        User targetUser = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        // Check if new email is taken by another user
        userRepository.findByEmail(request.getEmail()).ifPresent(u -> {
            if (!u.getId().equals(id)) {
                throw new ConflictException("Email already taken: " + request.getEmail());
            }
        });

        targetUser.setName(request.getName());
        targetUser.setEmail(request.getEmail());
        
        // Only update password if provided
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            targetUser.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        }
        
        targetUser.setRole(request.getRole());

        return userMapper.toResponse(userRepository.save(targetUser));
    }

    // GET ALL
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(userMapper::toResponse)
                .toList();
    }

    // GET BY ID
    public UserResponse getUserById(Long id) {
        return userMapper.toResponse(
                userRepository.findById(id)
                        .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id))
        );
    }

    // UPDATE ROLE
    public UserResponse updateUserRole(Long id, UpdateUserRoleRequest request, String currentAdminEmail) {

        User currentAdmin = userRepository.findByEmail(currentAdminEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found"));

        User targetUser = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        // admin not change himself
        if (targetUser.getId().equals(currentAdmin.getId())) {
            throw new ForbiddenOperationException("You cannot change your own role");
        }

        // not change anthor admin
        if (targetUser.getRole() == Role.ADMIN) {
            throw new ForbiddenOperationException("Cannot change the role of another Admin");
        }

        // same role
        if (targetUser.getRole() == request.getRole()) {
            throw new ConflictException("User already has this role");
        }

        targetUser.setRole(request.getRole());
        return userMapper.toResponse(userRepository.save(targetUser));
    }

    // GET CURRENT USER
    public UserResponse getCurrentUser(String email) {
        return userMapper.toResponse(
                userRepository.findByEmail(email)
                        .orElseThrow(() -> new ResourceNotFoundException("User not found"))
        );
    }

    // DELETE
    public void deleteUser(Long id, String currentAdminEmail) {

        User currentAdmin = userRepository.findByEmail(currentAdminEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found"));

        User targetUser = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        // not delete himself
        if (targetUser.getId().equals(currentAdmin.getId())) {
            throw new ForbiddenOperationException("You cannot delete your own account");
        }

        // Admin not delete anthor admin
        if (targetUser.getRole() == Role.ADMIN) {
            throw new ForbiddenOperationException("Cannot delete another Admin");
        }

        userRepository.delete(targetUser);
    }
}
