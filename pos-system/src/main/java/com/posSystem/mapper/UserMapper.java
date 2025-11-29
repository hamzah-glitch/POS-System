package com.posSystem.mapper;

import com.posSystem.models.User;
import com.posSystem.payload.dto.UserDto;

public class UserMapper {
    public static UserDto toDTO(User saveUser) {
        UserDto userDto = new UserDto();
        userDto.setId(saveUser.getId());
        userDto.setFullName(saveUser.getFullName());
        userDto.setEmail(saveUser.getEmail());
        userDto.setRole(saveUser.getRole());
        userDto.setCreatedAt(saveUser.getCreatedAt());
        userDto.setLastLogin(saveUser.getLastLogin());
        userDto.setPhone(saveUser.getPhone());
        return userDto;
    }
}
