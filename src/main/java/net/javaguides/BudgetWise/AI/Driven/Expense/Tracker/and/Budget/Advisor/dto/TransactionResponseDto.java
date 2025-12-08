package net.javaguides.BudgetWise.AI.Driven.Expense.Tracker.and.Budget.Advisor.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;

@Data
@Builder
public class TransactionResponseDto {
    private String id;
    private String category;
    private double amount;
    private LocalDate date;
    private String type;
    private String description;
}
