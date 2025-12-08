package net.javaguides.BudgetWise.AI.Driven.Expense.Tracker.and.Budget.Advisor.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.*;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/ai")
public class Ai {

//    private static final String GEMINI_API_URL =
//            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";
private static final String GEMINI_API_URL ="https://generativelanguage.googleapis.com/v1beta/models";
    private static final String GEMINI_API_KEY =
            "AIzaSyDFgEvPMSHKyfgxkn0VtJ1llioqPG0aygU";

    @PostMapping("/chat")
    public Map<String, String> chat(@RequestBody Map<String, String> payload) {

        String userMessage = payload.get("message");

        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        String url = GEMINI_API_URL + "?key=" + GEMINI_API_KEY;

        // Correct Gemini Request Format
        Map<String, Object> textPart = Map.of("text", userMessage);

        Map<String, Object> content = Map.of(
                "role", "user",
                "parts", List.of(textPart)
        );

        Map<String, Object> requestBody = Map.of(
                "contents", List.of(content)
        );

        HttpEntity<Object> entity = new HttpEntity<>(requestBody, headers);

        String aiReply = "No response from AI.";

        try {
            ResponseEntity<Map> response =
                    restTemplate.postForEntity(url, entity, Map.class);

            Map body = response.getBody();

            if (body != null && body.containsKey("candidates")) {

                List candidates = (List) body.get("candidates");
                if (!candidates.isEmpty()) {

                    Map candidate = (Map) candidates.get(0);

                    List contentList = (List) candidate.get("content");
                    if (!contentList.isEmpty()) {

                        Map contentObj = (Map) contentList.get(0);
                        List parts = (List) contentObj.get("parts");

                        if (!parts.isEmpty()) {
                            Map firstPart = (Map) parts.get(0);
                            aiReply = (String) firstPart.get("text");
                        }
                    }
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
            aiReply = "Error while calling Gemini API.";
        }

        return Map.of("reply", aiReply);
    }
}
