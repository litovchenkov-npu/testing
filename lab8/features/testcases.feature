Feature: Verify Test Cases Page

    Scenario: User views test cases
        Given I open the browser and navigate to "https://automationexercise.com"
        When I click on the element with selector "a[href='/test_cases']"
        Then I should see the text "Test Cases"