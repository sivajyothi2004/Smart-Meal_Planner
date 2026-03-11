package com.mealplanner.backend.service;

import com.mealplanner.backend.model.Meal;
import com.mealplanner.backend.model.MealPlan;
import com.mealplanner.backend.model.User;
import com.mealplanner.backend.repository.MealPlanRepository;
import com.mealplanner.backend.repository.MealRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class MealPlanService {
    
    @Autowired
    private MealPlanRepository mealPlanRepository;
    
    @Autowired
    private MealRepository mealRepository;
    
    @Autowired
    private UserService userService;
    
    public MealPlan createMealPlan(MealPlan.DayOfWeek day, MealPlan.MealTime mealTime, Long mealId, String email) {
        User user = userService.getUserByEmail(email);
        Meal meal = mealRepository.findById(mealId)
                .orElseThrow(() -> new RuntimeException("Meal not found"));
        
        mealPlanRepository.findByUserAndDayAndMealTime(user, day, mealTime)
                .ifPresent(mealPlanRepository::delete);
        
        MealPlan mealPlan = new MealPlan();
        mealPlan.setDay(day);
        mealPlan.setMealTime(mealTime);
        mealPlan.setMeal(meal);
        mealPlan.setUser(user);
        
        return mealPlanRepository.save(mealPlan);
    }
    
    public List<MealPlan> getWeeklyMealPlan(String email) {
        User user = userService.getUserByEmail(email);
        return mealPlanRepository.findByUser(user);
    }
    
    public MealPlan updateMealPlan(Long id, Long mealId, String email) {
        User user = userService.getUserByEmail(email);
        MealPlan mealPlan = mealPlanRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Meal plan not found"));
        
        if (!mealPlan.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }
        
        Meal meal = mealRepository.findById(mealId)
                .orElseThrow(() -> new RuntimeException("Meal not found"));
        
        mealPlan.setMeal(meal);
        return mealPlanRepository.save(mealPlan);
    }
    
    public void deleteMealPlan(Long id, String email) {
        User user = userService.getUserByEmail(email);
        MealPlan mealPlan = mealPlanRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Meal plan not found"));
        
        if (!mealPlan.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }
        
        mealPlanRepository.delete(mealPlan);
    }
}