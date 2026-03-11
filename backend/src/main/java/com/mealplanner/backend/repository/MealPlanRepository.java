package com.mealplanner.backend.repository;

import com.mealplanner.backend.model.MealPlan;
import com.mealplanner.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface MealPlanRepository extends JpaRepository<MealPlan, Long> {
    List<MealPlan> findByUser(User user);
    Optional<MealPlan> findByUserAndDayAndMealTime(User user, MealPlan.DayOfWeek day, MealPlan.MealTime mealTime);
}