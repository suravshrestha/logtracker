# Log Tracker

Note: This repo has some improvement over: https://gitlab.com/ersauravadhikari/logtracker

Log Tracker is a web application to track the updates of a project or a thesis. The application has three modes:
* **Admin Mode**   
An admin 
	* Can create/edit a new project
	* Can assign/edit students and supervisors associated with the project
	* Can read the minutes, comments and download related attachments from each meeting  
	* Can call students for mid-term defence and final defence
* **Student Mode**   
A student
    * Can add/edit minutes, comments and related attachments for each meeting
    * Can create upcoming events 
    * Can ask approval from supervisor(teacher) for mid-term and final defence
* **Teacher Mode**   
A teacher
	* Can verify the minutes and related attachments written by students and add comments
	* Can create upcoming events 
	* Can approve a project for mid-term and final defence

## Tech stack
* Bootstrap in the frontend (v5.0.1)
* Node.js in the backend (v13.6.0)
* Express, ejs as the template engine (v4.16.1)
* MongoDB as the database (v3.6.8)

## Usage
1. Clone the repository
```
git clone https://github.com/suravshrestha/logtracker.git
```

2. Navigate to the repository :open_file_folder:
```
cd logtracker
```

3. Install the dependencies
```
npm install
```
This might take a while to complete.

4. Create a `.env` file inside the backend folder and set the following credentials:
```
#.env
SECRET=

# Nodemailer
SMTP_EMAIL=
SMTP_PASSWORD=
```
For development, get the Nodemailer credentials from [Ethereal](https://ethereal.email/)

5. Start the development server
```
npm run start
```

You can view the application at http://localhost:3000/.

**Note**:
- For admin and teacher signup use `ioe.edu.np` domain
- For student signup use `pcampus.edu.np` domain

Log Tracker was built as the Software Engineering Project in 5th semester, Computer Engineering.

## Team Members
* [Sandhya Baral](https://github.com/Sandukkk) (077BCT076)
* [Sujan Kapali](https://github.com/Sk47R) (077BCT086)
* [Surav Krishna Shrestha](https://github.com/suravshrestha) (077BCT089)
