package net.javaguides.BudgetWise.AI.Driven.Expense.Tracker.and.Budget.Advisor.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document(collection = "saving_goals")
public class SavingGoal {

    @Id
    private String id;

    private String userId;
    private String title;       // Goal name
    private double target;     // Target amount
    private double saved;      // Amount saved so far
}
