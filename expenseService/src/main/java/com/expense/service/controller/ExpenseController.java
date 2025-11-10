package com.expense.service.controller;

import com.expense.service.dto.CategoryRequestDto;
import com.expense.service.dto.ExpenseRequestDto;
import com.expense.service.entities.Expense;
import com.expense.service.entities.ExpenseCategory;
import com.expense.service.service.ExpenseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/expense/v1")
public class ExpenseController {
    
    private final ExpenseService expenseService;
    
    @Autowired
    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }
    
    @PostMapping("/categories")
    public ResponseEntity<ExpenseCategory> createCategory(
            @RequestHeader("X-User-Id") String userId,
            @RequestBody CategoryRequestDto dto) {
        ExpenseCategory category = expenseService.createCategory(userId, dto.getName(), dto.getParentId());
        return new ResponseEntity<>(category, HttpStatus.CREATED);
    }
    
    @GetMapping("/categories")
    public ResponseEntity<List<ExpenseCategory>> getCategories(
            @RequestHeader("X-User-Id") String userId) {
        List<ExpenseCategory> categories = expenseService.getCategoriesByUser(userId);
        return new ResponseEntity<>(categories, HttpStatus.OK);
    }
    
    @PostMapping("/expenses")
    public ResponseEntity<Expense> createExpense(
            @RequestHeader("X-User-Id") String userId,
            @RequestBody ExpenseRequestDto dto) {
        Expense expense = expenseService.createExpense(userId, dto);
        return new ResponseEntity<>(expense, HttpStatus.CREATED);
    }
    
    @GetMapping("/expenses")
    public ResponseEntity<List<Expense>> getExpenses(
            @RequestHeader("X-User-Id") String userId) {
        List<Expense> expenses = expenseService.getExpensesByUser(userId);
        return new ResponseEntity<>(expenses, HttpStatus.OK);
    }
    
    @DeleteMapping("/expenses/{externalId}")
    public ResponseEntity<Void> deleteExpense(
            @RequestHeader("X-User-Id") String userId,
            @PathVariable String externalId) {
        expenseService.deleteExpense(userId, externalId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
