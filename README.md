### MadData 2026
### Names: Dylan Dorschner, Neil Fitzsimons
# Burnout Bound

## 1. Overview
Burnout Bound helps students visualize their schedules and assignments during the semester. Burnout Bound also gives students a tool to evaluate potential stress points in a semester and potential stressful class schedules based on our state-of-the-art ***Screwed Score***. 

## 2. How does Burnout Bound work?
1. First we get input for the user's classes, which involves the class name, instructor name, number of credits, class days, class times, and optionally the semester.
2. Next we take all the input data and call the Madgrades API to aggregate all the class data in order to get the cumulative grade distributions for each of the user's classes.
3. We output the user's classes onto a simple calendar for visualization. The user is able to remove any added classes as well (any removed classes will not be taken into account when calculating the ***Screwed Score***).
4. Once the user hits the *Recalculate* button, we take the data obtained from Madgrades and compute a ***Screwed Score*** for the user based on their current classes on a scale of 0 - 100 (0 is an easy A and 100 is very difficult). This score is calculated using each class's difficulty (grade distribution) weighted by its number of credits. We then take the sum of the weighted class difficulties and divide it by the average amount of credits taken by a student each semester at UW-Madison.
5. We then print the graphs of each class's cumulative grade distribution and allow the user to toggle between which one is shown. We calculate the distributions locally as we drop all incomplete grades.
6.  Lastly, we provide an interactive heatmap where users can enter assignments and identify stressful points in the semester. This is done through assigning different weights for different assignments and uses a color gradient from tan to red to reflect difficult days with many assignments due.

## Features
### Schedule Previewer
- Easy to use interface
- Visualizes class schedules similar to Course Search and Enroll
- Includes easy add/remove features
### Grade Distribution Graphs
- Ability to toggle between different class graphs
- Easily see grade distributions for given classes
- In an easily digestible bar graph format
### Screwed Score
- Multiple data points considered for calculation
- 0 - 100 rating based on potential stress 
- Classes weighted by difficulty (grade distribution) and time commitment (credits)
### Assignment Heatmap
- Easy to add/remove assignments 
- Visualizes potential stress points in a semester based on due dates
- Color gradient highlights difficult points on the schedule with red being very stressful and tan being calm

## Tech Stack
### Backend
- Flask API to locally run our server
- Used Madgrades API to retrieve grade distribution data
- Used pandas, numpy, matplotlib, and seaborn for server-side graph generation
- Runs in a Python virtual environment
- The heatmap and schedule preview are client-side components, and assignment data is stored locally
### Frontend
- React (JSX) + Vite
- Used Tailwind and custom CSS styles
- Ran locally using npm/Node as a Vite dev server

## Important Use Commands
### Frontend
- npm run dev
### Backend
- python -m venv .venv
- .venv\Scripts\activate
- source .venv/bin/activate
- pip install -r requirements.txt
- python server.py
- deactivate

## Our Inspiration
- We realized that class enrollment is a very stressful time of the semester, and students often enroll without taking into account class balance and mental health consequences
- We wanted to help students manage their classes in a unique and fun way
- We decided to help students by creating an all-in-one platform for evaluating schedule difficulty using our ***Screwed Score***
- We wanted to increase student awareness of online tools used for class enrollment an provide a one-stop-shop for managing stress levels during the school year

## The Future of Burnout Bound
- We want to add more functionalites to the user inputs to help users more easily enter their class information
- We want to automate assignment/exam entry for our heatmap by parsing syllabi for assignments and due dates
- We want to include more graph customization like distribution graphs for specific instructors or certain semesters
- We could refine our function to calculate our ***Screwed Score*** to include professor ratings, degree requirements, how spread out classes are, and traveling distances between classes
- We also want to add something to help with stress during the semester like a time management system through our app
- Since the app is being hosted locally right now, we want to fully launch it as a web app to everyone in the future