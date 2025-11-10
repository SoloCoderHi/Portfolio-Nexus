package com.expense.service.service;

import com.expense.service.dto.ExpenseRequestDto;
import com.expense.service.entities.Expense;
import com.expense.service.entities.ExpenseCategory;
import com.expense.service.repository.ExpenseCategoryRepository;
import com.expense.service.repository.ExpenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ExpenseService {
    
    private final ExpenseRepository expenseRepository;
    private final ExpenseCategoryRepository expenseCategoryRepository;
    
    @Autowired
    public ExpenseService(ExpenseRepository expenseRepository, 
                         ExpenseCategoryRepository expenseCategoryRepository) {
        this.expenseRepository = expenseRepository;
        this.expenseCategoryRepository = expenseCategoryRepository;
    }
    
    public ExpenseCategory createCategory(String userId, String categoryName, Long parentId) {
        ExpenseCategory category = new ExpenseCategory();
        category.setUserId(userId);
        category.setName(categoryName);
        category.setParentId(parentId);
        return expenseCategoryRepository.save(category);
    }
    
    public List<ExpenseCategory> getCategoriesByUser(String userId) {
        return expenseCategoryRepository.findByUserId(userId);
    }
    
    public Expense createExpense(String userId, ExpenseRequestDto dto) {
        Optional<ExpenseCategory> categoryOpt = expenseCategoryRepository.findById(dto.getCategoryId());
        
        if (categoryOpt.isEmpty() || !categoryOpt.get().getUserId().equals(userId)) {
            throw new RuntimeException("Category not found");
        }
        
        ExpenseCategory category = categoryOpt.get();
        
        Expense expense = new Expense();
        expense.setUserId(userId);
        expense.setAmount(dto.getAmount());
        expense.setDescription(dto.getDescription());
        expense.setExpenseDate(dto.getExpenseDate());
        expense.setCategory(category);
        
        return expenseRepository.save(expense);
    }
    
    public List<Expense> getExpensesByUser(String userId) {
        return expenseRepository.findByUserId(userId);
    }
    
    public void deleteExpense(String userId, String externalId) {
        Optional<Expense> expenseOpt = expenseRepository.findByExternalId(externalId);
        
        if (expenseOpt.isEmpty() || !expenseOpt.get().getUserId().equals(userId)) {
            throw new RuntimeException("Expense not found");
        }
        
        expenseRepository.delete(expenseOpt.get());
    }
}
