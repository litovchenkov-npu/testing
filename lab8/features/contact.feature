Feature: Contact Us Form

    Scenario: User submits contact form
        Given I open the browser and navigate to "https://automationexercise.com"
        When I click on the element with selector "a[href='/contact_us']"
        And I enter "Test User" into the input with selector "input[data-qa='name']"
        And I enter "testuser123@example.com" into the input with selector "input[data-qa='email']"
        And I enter "Subject Test" into the input with selector "input[data-qa='subject']"
        And I enter "This is a message." into the input with selector "textarea[data-qa='message']"
        And I click on the element with selector "input[data-qa='submit-button']"
        Then I should see the text "Success! Your details have been submitted successfully."