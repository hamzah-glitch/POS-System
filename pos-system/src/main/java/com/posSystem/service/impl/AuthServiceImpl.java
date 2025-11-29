package com.posSystem.service.impl;

import com.posSystem.configuration.JwtProvider;
import com.posSystem.domain.UserRole;
import com.posSystem.exception.UserException;
import com.posSystem.mapper.UserMapper;
import com.posSystem.models.User;
import com.posSystem.payload.dto.UserDto;
import com.posSystem.payload.response.AuthResponse;
import com.posSystem.repository.UserRepository;
import com.posSystem.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collection;

import static tools.jackson.databind.type.LogicalType.Collection;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;
    private final CustomUserImplementation customUserImplementation;


    @Override
    public AuthResponse register(UserDto userDto) throws UserException {
        User user = userRepository.findByEmail(userDto.getEmail());
        if (user != null){
            throw new UserException("email id already registered!");
        }
        if(userDto.getRole().equals(UserRole.ROLE_ADMIN)){
            throw new UserException("role admin is not allowed !");
        }

        User newUser = new User();
        newUser.setEmail(userDto.getEmail());
        newUser.setPassword(passwordEncoder.encode(userDto.getPassword()));
        newUser.setRole(userDto.getRole());
        newUser.setFullName(userDto.getFullName());
        newUser.setPhone(userDto.getPhone());
        newUser.setLastLogin(LocalDateTime.now());
        newUser.setCreatedAt(LocalDateTime.now());
        newUser.setUpdateAt(LocalDateTime.now());

        User saveUser = userRepository.save(newUser);
        Authentication authentication=
                new UsernamePasswordAuthenticationToken(userDto.getEmail(), userDto.getPassword());
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = jwtProvider.generateToken(authentication);

        AuthResponse authResponse = new AuthResponse();
        authResponse.setJwt(jwt);
        authResponse.setMessage("Register Successful");
        authResponse.setUser(UserMapper.toDTO(saveUser));


        return authResponse;
    }

    @Override
    public AuthResponse login(UserDto userDto) throws UserException {
        String email = userDto.getEmail();
        String password = userDto.getPassword();
        Authentication authentication = authenticate(email,password);

        SecurityContextHolder.getContext().setAuthentication(authentication);

        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();

        String role = authorities.iterator().next().getAuthority();

        String jwt = jwtProvider.generateToken(authentication);

        User user = userRepository.findByEmail(email);

        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        AuthResponse authResponse = new AuthResponse();
        authResponse.setJwt(jwt);
        authResponse.setMessage("Login Successful");
        authResponse.setUser(UserMapper.toDTO(user));
        return authResponse;
    }

    private Authentication authenticate(String email, String password) throws UserException {

        UserDetails userDetails= customUserImplementation.loadUserByUsername(email);

        if(userDetails == null) {
            throw new UserException("email id does not exist"+ email);
        }

        if(!passwordEncoder.matches(password, userDetails.getPassword())){
            throw new UserException("password does not match");
        }

        return new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
    }
}
