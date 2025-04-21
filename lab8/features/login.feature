Feature: User login

    Scenario: User logs in with valid email and password
        Given I open the browser and navigate to "https://automationexercise.com"
        When I click on the element with selector "a[href='/login']"
        And I enter "testuser_NvL8YJZ0@mail.com" into the input with selector "input[data-qa='login-email']"
        And I enter "123456789" into the input with selector "input[data-qa='login-password']"
        And I click on the element with selector "button[data-qa='login-button']"
        Then I should see the text "Logged in as"