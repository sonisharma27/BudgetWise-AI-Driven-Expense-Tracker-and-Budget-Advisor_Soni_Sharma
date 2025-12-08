package net.javaguides.BudgetWise.AI.Driven.Expense.Tracker.and.Budget.Advisor.dto;

import lombok.Data;

@Data
public class SavingGoalRequestDto {
    private String title;   // Goal name
    private double target; // Target amount
    private double saved;  // Already saved
}
