package com.mealplanner.backend.repository;

import com.mealplanner.backend.model.MealIngredient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MealIngredientRepository extends JpaRepository<MealIngredient, Long> {
}