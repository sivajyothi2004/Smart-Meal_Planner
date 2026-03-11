package com.mealplanner.backend.service;

import com.mealplanner.backend.model.GroceryItem;
import com.mealplanner.backend.model.MealPlan;
import com.mealplanner.backend.model.User;
import com.mealplanner.backend.repository.GroceryItemRepository;
import com.mealplanner.backend.repository.MealPlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class GroceryListService {
    
    @Autowired
    private GroceryItemRepository groceryItemRepository;
    
    @Autowired
    private MealPlanRepository mealPlanRepository;
    
    @Autowired
    private UserService userService;
    
    @Transactional
    public List<GroceryItem> generateGroceryList(String email) {
        User user = userService.getUserByEmail(email);
        
        groceryItemRepository.deleteByUser(user);
        
        List<MealPlan> mealPlans = mealPlanRepository.findByUser(user);
        
        Map<String, GroceryItem> groceryMap = new HashMap<>();
        
        for (MealPlan mealPlan : mealPlans) {
            mealPlan.getMeal().getMealIngredients().forEach(mealIngredient -> {
                String ingredientName = mealIngredient.getIngredient().getName();
                String unit = mealIngredient.getUnit();
                Double quantity = mealIngredient.getQuantity();
                
                String key = ingredientName + "_" + unit;
                
                if (groceryMap.containsKey(key)) {
                    GroceryItem existing = groceryMap.get(key);
                    existing.setTotalQuantity(existing.getTotalQuantity() + quantity);
                } else {
                    GroceryItem groceryItem = new GroceryItem();
                    groceryItem.setName(ingredientName);
                    groceryItem.setTotalQuantity(quantity);
                    groceryItem.setUnit(unit);
                    groceryItem.setBought(false);
                    groceryItem.setUser(user);
                    groceryMap.put(key, groceryItem);
                }
            });
        }
        
        return groceryItemRepository.saveAll(groceryMap.values());
    }
    
    public List<GroceryItem> getGroceryList(String email) {
        User user = userService.getUserByEmail(email);
        return groceryItemRepository.findByUser(user);
    }
    
    public GroceryItem markAsBought(Long id, Boolean bought, String email) {
        User user = userService.getUserByEmail(email);
        GroceryItem groceryItem = groceryItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Grocery item not found"));
        
        if (!groceryItem.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }
        
        groceryItem.setBought(bought);
        return groceryItemRepository.save(groceryItem);
    }
    
    public void clearGroceryList(String email) {
        User user = userService.getUserByEmail(email);
        groceryItemRepository.deleteByUser(user);
    }
}