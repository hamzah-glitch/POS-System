package com.posSystem.payload.response;

import com.posSystem.payload.dto.UserDto;
import lombok.Data;

@Data
public class AuthResponse {
    private String jwt;
    private String message;
    private UserDto user;

}
