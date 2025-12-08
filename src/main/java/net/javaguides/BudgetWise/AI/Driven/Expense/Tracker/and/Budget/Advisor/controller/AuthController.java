

package net.javaguides.BudgetWise.AI.Driven.Expense.Tracker.and.Budget.Advisor.controller;

import lombok.RequiredArgsConstructor;
import net.javaguides.BudgetWise.AI.Driven.Expense.Tracker.and.Budget.Advisor.dto.AuthenticationRequest;
import net.javaguides.BudgetWise.AI.Driven.Expense.Tracker.and.Budget.Advisor.dto.AuthenticationResponse;
import net.javaguides.BudgetWise.AI.Driven.Expense.Tracker.and.Budget.Advisor.dto.RegisterRequestDto;
import net.javaguides.BudgetWise.AI.Driven.Expense.Tracker.and.Budget.Advisor.services.AuthenticationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final AuthenticationService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(@RequestBody RegisterRequestDto request) {
        AuthenticationResponse response = authService.register(request);
        System.out.println("✅ Register Token: " + response.getToken());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> login(@RequestBody AuthenticationRequest request) {
        AuthenticationResponse response = authService.authenticate(request);
        System.out.println("🔑 Login Token: " + response.getToken());
        return ResponseEntity.ok(response);
    }
}
