package com.posSystem.service;

import com.posSystem.exception.UserException;
import com.posSystem.models.User;

import java.util.List;

public interface UserService {

    User getUserFromJwtToken(String token) throws UserException;

    User getCurrentUser() throws UserException;

    User getUserByEmail(String email) throws UserException;

    User getUserById(Long id) throws UserException, Exception;

    List<User> getAllUsers();

    User updateUser(User user, Long id) throws UserException;
}
