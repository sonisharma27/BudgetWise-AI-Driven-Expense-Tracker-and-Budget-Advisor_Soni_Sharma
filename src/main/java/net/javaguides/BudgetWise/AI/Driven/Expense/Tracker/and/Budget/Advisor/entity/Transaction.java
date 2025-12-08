package net.javaguides.BudgetWise.AI.Driven.Expense.Tracker.and.Budget.Advisor.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document(collection = "transactions")
public class Transaction {

    @Id
    private String id;

    private String userId;        // Linked to logged-in user
    private String category;      // e.g., Food, Rent, Travel
    private double amount;        // expense/income amount
    private LocalDate date;       // transaction date
    private String type;          // "income" or "expense"
    private String description;          // optional note

}
