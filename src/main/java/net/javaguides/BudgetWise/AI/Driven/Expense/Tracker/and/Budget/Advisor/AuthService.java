package net.javaguides.BudgetWise.AI.Driven.Expense.Tracker.and.Budget.Advisor;

import lombok.RequiredArgsConstructor;
import net.javaguides.BudgetWise.AI.Driven.Expense.Tracker.and.Budget.Advisor.dto.AuthenticationRequest;
import net.javaguides.BudgetWise.AI.Driven.Expense.Tracker.and.Budget.Advisor.dto.AuthenticationResponse;
import net.javaguides.BudgetWise.AI.Driven.Expense.Tracker.and.Budget.Advisor.dto.RegisterRequestDto;
import net.javaguides.BudgetWise.AI.Driven.Expense.Tracker.and.Budget.Advisor.entity.User;
import net.javaguides.BudgetWise.AI.Driven.Expense.Tracker.and.Budget.Advisor.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;

public interface AuthService {
    String register(RegisterRequestDto request);

    AuthenticationResponse authenticate(AuthenticationRequest request);

    @Service
    @RequiredArgsConstructor
    class AuthServiceImpl implements AuthService {

        private final UserRepository userRepository;
        private final PasswordEncoder passwordEncoder;

        @Override
        public String register(RegisterRequestDto request) {
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new RuntimeException("Email already exists");
            }

            User user = User.builder()
                    .name(request.getName())
                    .email(request.getEmail())
                    .password(passwordEncoder.encode(request.getPassword()))
                    .roles(Collections.singletonList("USER"))
                    .build();

            userRepository.save(user);
            return "User registered successfully";
        }

        @Override
        public AuthenticationResponse authenticate(AuthenticationRequest request) {
            return null;
        }
    }
}
