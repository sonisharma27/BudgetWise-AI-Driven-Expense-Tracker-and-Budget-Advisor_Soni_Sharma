package net.javaguides.BudgetWise.AI.Driven.Expense.Tracker.and.Budget.Advisor.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BudgetResponseDto {

    private String id;
    private String category;
    private double limit;

    private double spent;     // calculated from transactions
    private double remaining; // limit - spent
}
