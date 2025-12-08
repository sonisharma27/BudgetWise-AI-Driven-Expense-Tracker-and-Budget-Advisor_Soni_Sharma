package net.javaguides.BudgetWise.AI.Driven.Expense.Tracker.and.Budget.Advisor.repository;

import net.javaguides.BudgetWise.AI.Driven.Expense.Tracker.and.Budget.Advisor.entity.SavingGoal;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface SavingGoalRepository extends MongoRepository<SavingGoal, String> {
    List<SavingGoal> findByUserId(String userId);
}
