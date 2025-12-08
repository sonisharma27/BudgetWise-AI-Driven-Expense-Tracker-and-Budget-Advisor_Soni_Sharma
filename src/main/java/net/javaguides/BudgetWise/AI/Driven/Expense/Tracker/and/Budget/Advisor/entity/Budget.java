package net.javaguides.BudgetWise.AI.Driven.Expense.Tracker.and.Budget.Advisor.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document(collection = "budgets")
public class Budget {

    @Id
    private String id;

    private String userId;    // same as transactions
    private String category;  // Food, Rent, Travel
    private double limit;     // monthly budget limit
}
