package net.javaguides.BudgetWise.AI.Driven.Expense.Tracker.and.Budget.Advisor.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User {
//data enteries for db
    @Id
    private String id;
    private String name;
    private String email;
    private String password;
    private List<String> roles;

}
