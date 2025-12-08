package net.javaguides.BudgetWise.AI.Driven.Expense.Tracker.and.Budget.Advisor.controller;

import lombok.RequiredArgsConstructor;
import net.javaguides.BudgetWise.AI.Driven.Expense.Tracker.and.Budget.Advisor.entity.UserProfile;
import net.javaguides.BudgetWise.AI.Driven.Expense.Tracker.and.Budget.Advisor.services.ProfileService;
import net.javaguides.BudgetWise.AI.Driven.Expense.Tracker.and.Budget.Advisor.security.JwtService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173") // ✅ frontend origin
public class ProfileController {

    private final ProfileService profileService;
    private final JwtService jwtService;

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(
            @RequestParam String fullName,
            @RequestParam String email,
            @RequestParam(required = false) String country,
            @RequestParam(required = false) String currency,
            @RequestParam(required = false) MultipartFile profilePicture
    ) throws IOException {
        UserProfile updatedProfile = profileService.updateProfile(email, fullName, country, currency, profilePicture);
        return ResponseEntity.ok(updatedProfile);
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String email = jwtService.extractUsername(token);
        return profileService.getProfileByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
