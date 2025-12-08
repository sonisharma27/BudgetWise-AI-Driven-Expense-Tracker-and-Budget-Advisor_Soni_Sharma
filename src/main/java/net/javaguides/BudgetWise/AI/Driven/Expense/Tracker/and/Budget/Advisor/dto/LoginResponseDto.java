package net.javaguides.BudgetWise.AI.Driven.Expense.Tracker.and.Budget.Advisor.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponseDto {
    private String token;
    private String message;
}
