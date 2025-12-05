package com.posSystem.controller;

import com.posSystem.exception.UserException;
import com.posSystem.mapper.UserMapper;
import com.posSystem.models.User;
import com.posSystem.payload.dto.UserDto;
import com.posSystem.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    public final UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<UserDto> getUserProfile(
            @RequestHeader("Authorization") String jwt) throws UserException {
        User user = userService.getUserFromJwtToken(jwt);
        return ResponseEntity.ok(UserMapper.toDTO(user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUserById(
            @RequestHeader("Authorization") String jwt,
            @PathVariable Long id) throws UserException, Exception {
        User user = userService.getUserById(id);
        return ResponseEntity.ok(UserMapper.toDTO(user));
    }

    @PutMapping("/profile")
    public ResponseEntity<UserDto> updateUserProfile(
            @RequestHeader("Authorization") String jwt,
            @RequestBody UserDto userDto) throws UserException {
        User user = userService.getUserFromJwtToken(jwt);
        User updatedUser = userService.updateUser(UserMapper.toEntity(userDto), user.getId());
        return ResponseEntity.ok(UserMapper.toDTO(updatedUser));
    }
}
