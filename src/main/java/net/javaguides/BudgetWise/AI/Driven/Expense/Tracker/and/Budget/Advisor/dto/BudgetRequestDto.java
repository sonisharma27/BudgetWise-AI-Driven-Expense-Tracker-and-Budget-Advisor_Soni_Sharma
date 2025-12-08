package net.javaguides.BudgetWise.AI.Driven.Expense.Tracker.and.Budget.Advisor.dto;

import lombok.Data;

@Data
public class BudgetRequestDto {
    private String category;
    private double limit;
}
