package net.javaguides.BudgetWise.AI.Driven.Expense.Tracker.and.Budget.Advisor.services;

import lombok.RequiredArgsConstructor;
import net.javaguides.BudgetWise.AI.Driven.Expense.Tracker.and.Budget.Advisor.entity.SavingGoal;
import net.javaguides.BudgetWise.AI.Driven.Expense.Tracker.and.Budget.Advisor.repository.SavingGoalRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SavingGoalService {

    private final SavingGoalRepository goalRepository;

    public SavingGoal addGoal(String userId, SavingGoal goal) {
        goal.setUserId(userId);
        return goalRepository.save(goal);
    }

    public List<SavingGoal> getGoals(String userId) {
        return goalRepository.findByUserId(userId);
    }

    public SavingGoal updateGoal(String userId, SavingGoal updatedGoal) {
        SavingGoal existing = goalRepository.findById(updatedGoal.getId()).orElse(null);
        if (existing != null && existing.getUserId().equals(userId)) {
            existing.setTitle(updatedGoal.getTitle());
            existing.setTarget(updatedGoal.getTarget());
            existing.setSaved(updatedGoal.getSaved());
            return goalRepository.save(existing);
        }
        return null;
    }

    public void deleteGoal(String userId, String goalId) {
        SavingGoal existing = goalRepository.findById(goalId).orElse(null);
        if (existing != null && existing.getUserId().equals(userId)) {
            goalRepository.delete(existing);
        }
    }
}
