package net.javaguides.BudgetWise.AI.Driven.Expense.Tracker.and.Budget.Advisor.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/budget")
@CrossOrigin(origins = "http://localhost:5173")
public class CategoryController {

    @GetMapping("/categories")
    public List<String> getCategories() {

        return List.of(
                "Food & Dining",
                "Transportation",
                "Entertainment",
                "Shopping",
                "Bills",
                "Health",
                "Education",
                "Others"
        );
    }
}
