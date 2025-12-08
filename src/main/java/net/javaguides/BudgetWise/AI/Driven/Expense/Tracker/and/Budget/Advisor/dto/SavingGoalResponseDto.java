package net.javaguides.BudgetWise.AI.Driven.Expense.Tracker.and.Budget.Advisor.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SavingGoalResponseDto {
    private String id;
    private String title;
    private double target;
    private double saved;
    private double remaining; // calculated as target - saved
    private double progress;  // % progress
}
