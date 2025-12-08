package net.javaguides.BudgetWise.AI.Driven.Expense.Tracker.and.Budget.Advisor.controller;

import lombok.RequiredArgsConstructor;
import net.javaguides.BudgetWise.AI.Driven.Expense.Tracker.and.Budget.Advisor.entity.SavingGoal;
import net.javaguides.BudgetWise.AI.Driven.Expense.Tracker.and.Budget.Advisor.services.SavingGoalService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/saving-goal")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class SavingGoalController {

    private final SavingGoalService goalService;

    @PostMapping
    public ResponseEntity<?> addGoal(@RequestBody SavingGoal goal, Authentication auth) {
        String userEmail = auth.getName();
        return ResponseEntity.ok(goalService.addGoal(userEmail, goal));
    }

    @GetMapping
    public ResponseEntity<List<SavingGoal>> getGoals(Authentication auth) {
        String userEmail = auth.getName();
        return ResponseEntity.ok(goalService.getGoals(userEmail));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateGoal(@PathVariable String id, @RequestBody SavingGoal goal, Authentication auth) {
        String userEmail = auth.getName();
        goal.setId(id);
        return ResponseEntity.ok(goalService.updateGoal(userEmail, goal));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteGoal(@PathVariable String id, Authentication auth) {
        String userEmail = auth.getName();
        goalService.deleteGoal(userEmail, id);
        return ResponseEntity.ok().build();
    }
}
