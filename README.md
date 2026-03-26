# Citizen Complaint and Feedback Management System (CCFMS)

This is the fully consolidated React Application for the CCFMS platform. It utilizes LocalStorage to provide a fully functioning frontend demonstration without requiring a backend database setup, making it very easy to evaluate the UI and workflows.

## Features Included
1. **Citizen Portal:** Lodge complaints securely and provide feedback on resolved issues.
2. **Admin Dashboard:** Access all complaints and assign tasks to available Officers.
3. **Officer Dashboard:** Handle assigned complaints and update status to "Resolved".
4. **Mock Database System:** Everything works offline using browser LocalStorage for simplicity.

## Step-by-Step Setup Instructions

All dependencies are included in the local environment configuration. Follow these steps to review the project.

### 1. Installation
Open your terminal, navigate to the `ccfms/` directory and run:

```bash
npm install
```

### 2. Start the Application
Once dependencies have been resolved, start the development server:

```bash
npm start
```
By default, this will launch the application locally at `http://localhost:3000`.

### 3. Using the Test Accounts

When you load the app, you will see a stylish login screen. The app is pre-seeded with multiple user accounts so you can test every workflow right away.

1. **Citizen workflow:** Click on **Alice Citizen**. Lodge a new test complaint. After submitting, log out.
2. **Admin workflow:** Click on **Bob Admin**. You will see the complaint Alice just submitted. Under "Assign Officer", select an available officer (e.g., Charlie). Log out.
3. **Officer workflow:** Click on **Charlie Officer**. You will see the assigned issue. Click the "Mark as Resolved" button. Log out.
4. **Citizen Feedback:** Log in as **Alice Citizen** again. You will now see a prompt to leave feedback on your resolved complaint!

---

*All styling uses custom CSS with modern Glassmorphism aesthetics to ensure a vibrant and structured design without relying on bulky CSS libraries.*
