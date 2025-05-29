# Tshimologong-Assignment
This repository contains a survey for gathering data on people's lifestyle  preferences.

# 1. User Journeys
When the application starts up the user will be presented with the survey screen and navigation menu.

- Favourite food question utilises checkboxes to allow users to select multiple options.
- Rating employs radio buttons, restricting the user to one choice.
- The chosen response is translated into a number from 1 to 5.
- When the user clicks submit, the entered data should be saved to a database of your choosing.
- When the "View Survey Results" menu link is clicked, the screen should display thesurvey results as
  below if there is data in the database; otherwise, it should show a essage stating, "No Surveys Available.

# 2. Calculations
  - TheTotal number of surveys completed. This is just a count of the total number of rows in the database.
  - Average age of the people that participated in the survey
  - Oldest person that participated in the survey.
  - Youngest person that participated in the survey.
  - Percentage of people who like Pizza is calculated by the number of people that like.
  - Pizza divided by the total number of surveys. Multiply by 100 to get the percentage.
  - Present the result rounded off to 1 decimal place.
  - People like to eat out is calculated by working out the average of the rating. Present the result rounded off to 1 decimal place
 
# 3. Design & Data validation
  - Validate the fields. Check that the user has not left any of the text fields empty before they submit.
  - The user may NOT enter a value for Age that is less than 5 and should not be more than 120.
  - Ensure that the user has actually selected a rating for each of the four rating questions.
  - They cannot submit a survey without selecting a rating.
  - Design the screens to look like the ones shown above.
  - Wheretheuser is expected to enter the date, use a date picker.
