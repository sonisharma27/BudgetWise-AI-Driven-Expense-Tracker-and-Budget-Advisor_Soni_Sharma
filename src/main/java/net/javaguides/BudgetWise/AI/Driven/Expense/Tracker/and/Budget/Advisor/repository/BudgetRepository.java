package net.javaguides.BudgetWise.AI.Driven.Expense.Tracker.and.Budget.Advisor.repository;

import net.javaguides.BudgetWise.AI.Driven.Expense.Tracker.and.Budget.Advisor.entity.Budget;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface BudgetRepository extends MongoRepository<Budget, String> {

    List<Budget> findByUserId(String userId);

    Budget findByUserIdAndCategory(String userId, String category);
}
