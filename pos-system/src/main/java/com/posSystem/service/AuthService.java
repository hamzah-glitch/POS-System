package com.posSystem.service;

import com.posSystem.exception.UserException;
import com.posSystem.payload.dto.UserDto;
import com.posSystem.payload.response.AuthResponse;

public interface AuthService {

    AuthResponse register(UserDto user) throws Exception, UserException;
    AuthResponse login(UserDto user) throws UserException;
}
