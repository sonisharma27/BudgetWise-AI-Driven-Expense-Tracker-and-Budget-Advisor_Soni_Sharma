package net.javaguides.BudgetWise.AI.Driven.Expense.Tracker.and.Budget.Advisor.services;

import lombok.RequiredArgsConstructor;
import net.javaguides.BudgetWise.AI.Driven.Expense.Tracker.and.Budget.Advisor.dto.*;
import net.javaguides.BudgetWise.AI.Driven.Expense.Tracker.and.Budget.Advisor.entity.*;
import net.javaguides.BudgetWise.AI.Driven.Expense.Tracker.and.Budget.Advisor.repository.*;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BudgetService {

    private final BudgetRepository budgetRepository;
    private final TransactionRepository transactionRepository;

    // ADD OR UPDATE BUDGET
    public BudgetResponseDto saveBudget(String userId, BudgetRequestDto dto) {

        Budget existing = budgetRepository.findByUserIdAndCategory(userId, dto.getCategory());

        Budget budget = (existing != null)
                ? existing
                : new Budget();

        budget.setUserId(userId);
        budget.setCategory(dto.getCategory());
        budget.setLimit(dto.getLimit());

        budgetRepository.save(budget);

        return mapToResponse(userId, budget);
    }

    // FETCH ALL BUDGETS WITH SPENT + REMAINING
    public List<BudgetResponseDto> getBudgets(String userId) {

        return budgetRepository.findByUserId(userId)
                .stream()
                .map(b -> mapToResponse(userId, b))
                .collect(Collectors.toList());
    }

    // MAP ENTITY → DTO
    private BudgetResponseDto mapToResponse(String userId, Budget b) {

        // Fetch all transactions for this category
        List<Transaction> transactions =
                transactionRepository.findByUserIdAndCategory(userId, b.getCategory());

        // Calculate spent total
        double spent = transactions.stream()
                .mapToDouble(Transaction::getAmount)
                .sum();

        double remaining = b.getLimit() - spent;

        return BudgetResponseDto.builder()
                .id(b.getId())
                .category(b.getCategory())
                .limit(b.getLimit())
                .spent(spent)
                .remaining(remaining)
                .build();
    }
    // DELETE BUDGET BY ID
    public void deleteBudget(String userId, String budgetId) {
        Budget budget = budgetRepository.findById(budgetId)
                .orElseThrow(() -> new RuntimeException("Budget not found"));

        // Optional: check if the budget belongs to the user
        if (!budget.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        budgetRepository.delete(budget);
    }


}
