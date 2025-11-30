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
        userDto.setBranchId(saveUser.getBranch() != null?saveUser.getBranch().getId():null);
        userDto.setStoreId(saveUser.getStore()!=null?saveUser.getStore().getId():null);
        return userDto;
    }

    public static User toEntity(UserDto userDto){
        User createdUser = new User();
        //createdUser.setId(userDto.getId());
        createdUser.setEmail(userDto.getEmail());
        createdUser.setFullName(userDto.getFullName());
        createdUser.setRole(userDto.getRole());
        createdUser.setCreatedAt(userDto.getCreatedAt());
        createdUser.setUpdateAt(userDto.getUpdateAt());
        createdUser.setLastLogin(userDto.getLastLogin());
        createdUser.setPhone(userDto.getPhone());
        createdUser.setPassword(userDto.getPassword());

        return createdUser;
    }
}
