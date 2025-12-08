package net.javaguides.BudgetWise.AI.Driven.Expense.Tracker.and.Budget.Advisor.services;

import lombok.RequiredArgsConstructor;
import net.javaguides.BudgetWise.AI.Driven.Expense.Tracker.and.Budget.Advisor.dto.TransactionRequestDto;
import net.javaguides.BudgetWise.AI.Driven.Expense.Tracker.and.Budget.Advisor.dto.TransactionResponseDto;
import net.javaguides.BudgetWise.AI.Driven.Expense.Tracker.and.Budget.Advisor.entity.Transaction;
import net.javaguides.BudgetWise.AI.Driven.Expense.Tracker.and.Budget.Advisor.repository.TransactionRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;

    //  Add transaction
    public TransactionResponseDto addTransaction(String userId, TransactionRequestDto dto) {
        Transaction transaction = Transaction.builder()
                .userId(userId)
                .category(dto.getCategory())
                .amount(dto.getAmount())
                .date(dto.getDate())
                .type(dto.getType())
                .description(dto.getDescription())
                .build();

        transactionRepository.save(transaction);
        return mapToDto(transaction);
    }

    //  Get all transactions for a user
    public List<TransactionResponseDto> getTransactionsByUser(String userId) {
        return transactionRepository.findByUserId(userId)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    //  Update transaction
    public Transaction updateTransaction(String id, Transaction dto) {
        Transaction existing = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        existing.setCategory(dto.getCategory());
        existing.setAmount(dto.getAmount());
        existing.setDate(dto.getDate());
        existing.setType(dto.getType());
        existing.setDescription(dto.getDescription());

        return transactionRepository.save(existing);
    }

    //  Delete transaction
    public void deleteTransaction(String id) {
        transactionRepository.deleteById(id);
    }

    //  Helper
    private TransactionResponseDto mapToDto(Transaction t) {
        return TransactionResponseDto.builder()
                .id(t.getId())
                .category(t.getCategory())
                .amount(t.getAmount())
                .date(t.getDate())
                .type(t.getType())
                .description(t.getDescription())
                .build();
    }
}
