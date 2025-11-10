package com.expense.service.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.NonNull;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ExpenseRequestDto {
    
    @NonNull
    private BigDecimal amount;
    
    @NonNull
    private String description;
    
    @NonNull
    private LocalDate expenseDate;
    
    @NonNull
    private Long categoryId;
}
