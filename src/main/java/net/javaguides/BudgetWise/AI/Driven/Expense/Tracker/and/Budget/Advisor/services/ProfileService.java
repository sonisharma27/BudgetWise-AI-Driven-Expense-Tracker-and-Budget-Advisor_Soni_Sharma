package net.javaguides.BudgetWise.AI.Driven.Expense.Tracker.and.Budget.Advisor.services;

import lombok.RequiredArgsConstructor;
import net.javaguides.BudgetWise.AI.Driven.Expense.Tracker.and.Budget.Advisor.entity.UserProfile;
import net.javaguides.BudgetWise.AI.Driven.Expense.Tracker.and.Budget.Advisor.repository.ProfileRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final ProfileRepository profileRepository;

    public UserProfile updateProfile(String email, String fullName, String country, String currency, MultipartFile profilePicture) throws IOException {
        Optional<UserProfile> existingOpt = profileRepository.findByEmail(email);
        UserProfile profile = existingOpt.orElseGet(() -> UserProfile.builder().email(email).build());

        profile.setFullName(fullName);
        profile.setCountry(country);
        profile.setCurrency(currency);

        //  Save image to a local folder (you can change this to S3 or DB)
        if (profilePicture != null && !profilePicture.isEmpty()) {
            String uploadDir = "uploads/profilepictures/";
            File dir = new File(uploadDir);
            if (!dir.exists()) dir.mkdirs();

            String filePath = uploadDir + System.currentTimeMillis() + "_" + profilePicture.getOriginalFilename();
            profilePicture.transferTo(new File(filePath));
            profile.setProfilePicturePath(filePath);
        }

        return profileRepository.save(profile);
    }

    public Optional<UserProfile> getProfileByEmail(String email) {
        return profileRepository.findByEmail(email);
    }
}
