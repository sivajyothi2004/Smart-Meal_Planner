package com.mealplanner.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "meal_ingredients")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MealIngredient {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "meal_id", nullable = false)
    @JsonIgnoreProperties({"mealIngredients", "user"})
    private Meal meal;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ingredient_id", nullable = false)
    @JsonIgnoreProperties({"user"})
    private Ingredient ingredient;
    
    @Column(nullable = false)
    private Double quantity;
    
    @Column(nullable = false)
    private String unit;
}