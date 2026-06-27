package com.tutu.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import com.tutu.entity.User;
import com.tutu.repository.UserRepository;
import java.util.Optional;

@Component
public class CurrentUser {

    private final UserRepository userRepository;

    public CurrentUser(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Long getUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            Optional<User> user = userRepository.findByEmail(userDetails.getUsername());
            return user.map(User::getId).orElse(null);
        }
        return null;
    }

    public User getUser() {
        Long userId = getUserId();
        if (userId != null) {
            return userRepository.findById(userId).orElse(null);
        }
        return null;
    }
}
