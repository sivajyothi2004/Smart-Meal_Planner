package com.mealplanner.backend.repository;

import com.mealplanner.backend.model.Meal;
import com.mealplanner.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MealRepository extends JpaRepository<Meal, Long> {
    List<Meal> findByUser(User user);
    List<Meal> findByUserAndMealType(User user, Meal.MealType mealType);
}