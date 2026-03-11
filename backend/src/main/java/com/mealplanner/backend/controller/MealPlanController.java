package com.mealplanner.backend.controller;

import com.mealplanner.backend.model.MealPlan;
import com.mealplanner.backend.service.MealPlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/meal-plans")
public class MealPlanController {
    
    @Autowired
    private MealPlanService mealPlanService;
    
    @PostMapping
    public ResponseEntity<MealPlan> createMealPlan(@RequestBody Map<String, Object> request, 
                                                    Authentication authentication) {
        MealPlan.DayOfWeek day = MealPlan.DayOfWeek.valueOf(request.get("day").toString());
        MealPlan.MealTime mealTime = MealPlan.MealTime.valueOf(request.get("mealTime").toString());
        Long mealId = Long.valueOf(request.get("mealId").toString());
        
        return ResponseEntity.ok(mealPlanService.createMealPlan(day, mealTime, mealId, authentication.getName()));
    }
    
    @GetMapping
    public ResponseEntity<List<MealPlan>> getWeeklyMealPlan(Authentication authentication) {
        return ResponseEntity.ok(mealPlanService.getWeeklyMealPlan(authentication.getName()));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<MealPlan> updateMealPlan(@PathVariable Long id, 
                                                    @RequestBody Map<String, Object> request,
                                                    Authentication authentication) {
        Long mealId = Long.valueOf(request.get("mealId").toString());
        return ResponseEntity.ok(mealPlanService.updateMealPlan(id, mealId, authentication.getName()));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMealPlan(@PathVariable Long id, Authentication authentication) {
        mealPlanService.deleteMealPlan(id, authentication.getName());
        return ResponseEntity.ok().build();
    }
}