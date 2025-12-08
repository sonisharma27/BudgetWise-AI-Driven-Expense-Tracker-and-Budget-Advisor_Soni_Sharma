package net.javaguides.BudgetWise.AI.Driven.Expense.Tracker.and.Budget.Advisor.controller;

import lombok.RequiredArgsConstructor;
import net.javaguides.BudgetWise.AI.Driven.Expense.Tracker.and.Budget.Advisor.entity.Transaction;
import net.javaguides.BudgetWise.AI.Driven.Expense.Tracker.and.Budget.Advisor.repository.TransactionRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class TransactionController {

    private final TransactionRepository transactionRepository;

    //  Get all transactions for logged-in user
    @GetMapping
    public ResponseEntity<?> getTransactions(Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            List<Transaction> transactions = transactionRepository.findByUserId(userEmail);
            return ResponseEntity.ok(transactions);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to fetch transactions: " + e.getMessage());
        }
    }

    //  Add a new transaction for logged-in user
    @PostMapping
    public ResponseEntity<?> addTransaction(@RequestBody Transaction transaction, Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            transaction.setUserId(userEmail);
            transactionRepository.save(transaction);
            return ResponseEntity.ok("Transaction added successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Transaction failed: " + e.getMessage());
        }
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTransaction(@PathVariable String id, Authentication authentication) {
        try {
            String userEmail = authentication.getName();

            Transaction transaction = transactionRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Transaction not found"));

            // Optional security check (only allow user to delete their own transaction)
            if (!transaction.getUserId().equals(userEmail)) {
                return ResponseEntity.status(403).body("Unauthorized to delete this transaction");
            }

            transactionRepository.deleteById(id);
            return ResponseEntity.ok("Transaction deleted successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to delete transaction: " + e.getMessage());
        }
    }
    //  Update an existing transaction
    @PutMapping("/{id}")
    public ResponseEntity<?> updateTransaction(
            @PathVariable String id,
            @RequestBody Transaction transaction,
            Authentication authentication
    ) {
        try {
            String userEmail = authentication.getName();

            Transaction existing = transactionRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Transaction not found"));

            // Security: allow only owner to update
            if (!existing.getUserId().equals(userEmail)) {
                return ResponseEntity.status(403).body("Unauthorized to update this transaction");
            }

            existing.setCategory(transaction.getCategory());
            existing.setAmount(transaction.getAmount());
            existing.setType(transaction.getType());
            existing.setDescription(transaction.getDescription());
            existing.setDate(transaction.getDate());

            transactionRepository.save(existing);

            return ResponseEntity.ok("Transaction updated successfully!");

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to update transaction: " + e.getMessage());
        }
    }

}
