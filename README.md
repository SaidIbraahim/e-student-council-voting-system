# Online Student Council Voting System - Backend  

## Overview  
The **Online Student Council Voting System** backend is a robust, scalable, and secure API built with **Node.js** and **Express.js**. It supports functionalities like user authentication, voter registration, election management, real-time voting, result declaration, and report generation. The backend is integrated with **MongoDB Atlas** for data storage and **Socket.IO** for real-time updates.

## Features  

1. **Authentication**  
   - Secure login and registration for voters and admins.  
   - Multi-factor authentication (MFA) via **Twilio Verify API** for voter login.  
   - Sub-admin invitation and account activation via email using **Nodemailer**.  

2. **User Roles**  
   - **Voter**: Register, log in, and cast votes securely.  
   - **Admin**: Manage candidate registrations and monitor elections.  
   - **Super Admin**: Manage elections, approve/reject candidates, and generate reports.  

3. **Election Management**  
   - Create, manage, and monitor elections.  
   - Support for multiple elections with unique schedules.  

4. **Voting**  
   - One vote per election per voter.  
   - Ensures voters can only vote for verified candidates.  

5. **Result Management**  
   - Real-time results with **Socket.IO**.  
   - Automatic winner declaration.  

6. **Report Generation**  
   - Generate detailed CSV reports of election results.  
   - Reports include candidate name, department, total votes, and election details.

## API Endpoints  

1. **Authentication**  
   - **Register Voter**  
     - `POST /api/auth/register-voter`  
     - Request Body:  
       ```
       {
         "studentId": "EAUGRW0002736",
         "name": "Said Ibrahim",
         "gender": "Male",
         "department": "Computer Science",
         "year": "4",
         "mobile": "+252907841570",
         "password": "12345"
       }
       ```
   - **Login Voter**  
     - `POST /api/auth/login-voter`  
     - Request Body:  
       ```
       {
         "mobile": "+252907841570",
         "password": "12345"
       }
       ```
   - **Verify OTP**  
     - `POST /api/auth/verify-otp`  
     - Request Body:  
       ```
       {
         "mobile": "+252907841570",
         "otpCode": "569312"
       }
       ```

2. **Admin Management**  
   - **Invite Sub-Admin**  
     - `POST /api/admin/invite-sub-admin`  
     - Request Body:  
       ```
       {
         "name": "Admin One",
         "email": "admin1@example.com",
         "department": "Operations"
       }
       ```  

3. **Election Management**  
   - **Create Election**  
     - `POST /api/elections/create`  
     - Request Body:  
       ```
       {
         "name": "Student Council Election 2024",
         "startDate": "2024-12-01",
         "endDate": "2024-12-07",
         "candidateSubmissionDeadline": "2024-11-20"
       }
       ```  

4. **Candidate Management**  
   - **Add Candidate**  
     - `POST /api/candidates/add`  
     - Form Data:  
       - `fullName`: Candidate name  
       - `faculty`: Faculty name  
       - `manifesto`: Candidate manifesto  
       - `candidateImage`: Image file  

   - **Approve/Reject Candidate**  
     - `POST /api/candidates/approve`  
     - Request Body:  
       ```
       {
         "candidateId": "candidate123",
         "approvalStatus": "approved"
       }
       ```  

5. **Voting**  
   - **Cast Vote**  
     - `POST /api/votes/cast`  
     - Request Body:  
       ```
       {
         "electionId": "election123",
         "candidateId": "candidate123"
       }
       ```  

6. **Result Management**  
   - **Calculate Results**  
     - `POST /api/results/calculate/:electionId`  

   - **Generate Report**  
     - `GET /api/results/report/:electionId`  

## Instructions for Frontend Developer  

1. Connect to the Backend  
   - Update `BASE_URL` in the frontend to point to the backend server (e.g., `http://localhost:5000`).  

2. Endpoints Interaction  
   - Use the provided API documentation for route interactions.  
   - Use `Authorization` headers with JWT tokens for protected routes.  

3. Real-time Updates  
   - Integrate **Socket.IO** for live result updates.  

4. Static Assets  
   - Fetch candidate images from `http://localhost:5000/uploads/<image-file-name>`.

5. Sample Workflows  
   - **Voter Registration** → OTP Verification → Voting.  
   - **Admin Workflow** → Invite Sub-Admin → Approve Candidates → Generate Reports.

## Testing Locally  

1. Clone the frontend and backend repositories into separate folders.  
2. Start the backend server:  
   ```
   cd backend
   npm install
   npm start
   ```  
3. Start the frontend server:  
   ```
   cd frontend
   npm install
   npm start
   ```  
4. Access the frontend at `http://localhost:3000` and ensure it communicates with the backend at `http://localhost:5000`.  
