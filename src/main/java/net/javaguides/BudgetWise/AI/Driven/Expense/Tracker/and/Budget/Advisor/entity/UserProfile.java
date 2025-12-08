package net.javaguides.BudgetWise.AI.Driven.Expense.Tracker.and.Budget.Advisor.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "user_profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfile {
    @Id
    private String id;

    private String fullName;
    private String email;
    private String country;
    private String currency;
    private String profilePicturePath; // store only the image path or URL
}
