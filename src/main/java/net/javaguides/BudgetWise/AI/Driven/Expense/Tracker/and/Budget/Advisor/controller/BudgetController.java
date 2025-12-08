package net.javaguides.BudgetWise.AI.Driven.Expense.Tracker.and.Budget.Advisor.controller;

import lombok.RequiredArgsConstructor;
import net.javaguides.BudgetWise.AI.Driven.Expense.Tracker.and.Budget.Advisor.dto.*;
import net.javaguides.BudgetWise.AI.Driven.Expense.Tracker.and.Budget.Advisor.services.BudgetService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/budget")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class BudgetController {

    private final BudgetService budgetService;

    @PostMapping
    public ResponseEntity<?> saveBudget(@RequestBody BudgetRequestDto dto, Authentication auth) {
        String userEmail = auth.getName();
        return ResponseEntity.ok(budgetService.saveBudget(userEmail, dto));
    }

    @GetMapping
    public ResponseEntity<?> getBudget(Authentication auth) {
        String userEmail = auth.getName();
        return ResponseEntity.ok(budgetService.getBudgets(userEmail));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBudget(@PathVariable String id, Authentication auth) {
        String userEmail = auth.getName(); // get logged-in user
        budgetService.deleteBudget(userEmail, id);
        return ResponseEntity.noContent().build();
    }


}
