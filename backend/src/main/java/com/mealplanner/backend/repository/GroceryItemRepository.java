package com.mealplanner.backend.repository;

import com.mealplanner.backend.model.GroceryItem;
import com.mealplanner.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface GroceryItemRepository extends JpaRepository<GroceryItem, Long> {
    List<GroceryItem> findByUser(User user);
    void deleteByUser(User user);
}