 package com.posSystem.service.impl;
import com.posSystem.models.User;
import com.posSystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;


@Service
public class CustomUserImplementation implements UserDetailsService {
    @Autowired
    private UserRepository userRepository;
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {


        User user = userRepository.findByEmail(username);
        if(user == null){
            throw new UsernameNotFoundException("User Not Found");
        }

        GrantedAuthority authority= new SimpleGrantedAuthority(
                user.getRole().toString()
        );

        Collection<GrantedAuthority> authorities =
                Collections.singletonList(authority);

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(), user.getPassword(), authorities
        );
    }
}
