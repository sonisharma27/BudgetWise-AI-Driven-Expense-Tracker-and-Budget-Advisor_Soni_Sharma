package net.javaguides.BudgetWise.AI.Driven.Expense.Tracker.and.Budget.Advisor.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class TransactionRequestDto {
    private String category;
    private double amount;
    private LocalDate date;
    private String type;
    private String description;
}
