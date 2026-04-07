# Citizen Complaint and Feedback Management System (CCFMS) 

The **Citizen Complaint and Feedback Management System (CCFMS)** is a web-based platform designed to improve communication between citizens and authorities. It provides a structured and accessible way for citizens to report issues in their communities, while enabling administrators and officers to manage and resolve those issues efficiently.

The system enhances transparency, accountability, and responsiveness by digitizing the complaint handling process.

---

## Features

### Citizen Portal
- Sign up and create a personal account  
- Log in securely  
- Submit complaints related to community issues  
- Track the status of submitted complaints  
- Provide feedback after complaints are resolved  

### Admin Dashboard
- View all complaints submitted by citizens  
- Categorize and manage complaints  
- Assign complaints to officers  
- Update complaint statuses  
- Create officer accounts  

### Officer Dashboard
- View complaints assigned by the admin  
- Update complaint status (e.g., *In Progress*, *Resolved*)  
- Add notes for tracking and accountability  

---

## System Requirements

- A modern web browser (Google Chrome, Microsoft Edge, or Firefox)  
- Optional (for local setup):
  - Node.js (version 18 or later)  
  - npm (Node Package Manager)  

---

## Deployment & Access

The system is publicly accessible online via the following link:

**🔗 Live Application:**  
https://ccfms-01.onrender.com/


## User Workflow

The system supports three main user roles: **Citizen**, **Admin**, and **Officer**. Each role interacts with the system differently, as outlined below.

### Citizen

A citizen interacts with the system independently by:

- Creating an account through the **Sign Up** option  
- Logging into the system using their credentials  
- Submitting complaints through the complaint submission form  
- Tracking the progress of submitted complaints  
- Providing feedback once a complaint has been resolved  

---

### Admin

The administrator is responsible for managing the overall system by:

- Logging into the admin dashboard  
- Viewing all complaints submitted by citizens  
- Categorizing complaints based on relevance or urgency  
- Assigning complaints to available officers  
- Updating the status of complaints  
- Creating accounts for officers  

---

### Officer

Officers are responsible for handling assigned complaints by:

- Logging into the system using credentials provided by the admin  
- Viewing complaints assigned to them  
- Updating the status of complaints (e.g., *In Progress*, *Resolved*)  
- Adding notes where necessary for tracking and accountability  

---

## Testing the System

To effectively evaluate the system, the following steps can be followed:

### Citizen Perspective

- Register a new account and log in  
- Submit a complaint  
- Confirm that the complaint appears in the admin dashboard  

---

### Admin Perspective

- Assign the submitted complaint to an officer  
- Verify that the complaint is successfully assigned  

---

### Officer Perspective

- Log in and update the complaint status  
- Confirm that updates are reflected on the citizen’s dashboard  

---

### Feedback Process

- After the complaint is resolved, log in as a citizen  
- Submit feedback  
- Verify that the feedback is recorded in the system  

---

## Project Structure

The project follows a structured and modular organization:

```bash
ccfms/
│
├── public/              # Static assets (HTML, images)
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/           # Application pages for each user role
│   ├── utils/           # Utility and helper functions
│   ├── App.js           # Root component
│   └── index.js         # Application entry point
│
├── package.json         # Project configuration and dependencies
└── README.md            # Project documentation
 ```


![CCFMS Screenshot](https://github.com/user-attachments/assets/588528ae-41a1-4cf5-9e44-131812b42072)
Fig: Screenshot of the Admin's Dashboard



 **Project**: CCFMS 
 
 **Author**:Laura KARANGWA KWIZERA 
