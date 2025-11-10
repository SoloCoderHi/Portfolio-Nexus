package com.expense.service.repository;

import com.expense.service.entities.ExpenseCategory;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExpenseCategoryRepository extends CrudRepository<ExpenseCategory, Long> {
    
    List<ExpenseCategory> findByUserId(String userId);
}
