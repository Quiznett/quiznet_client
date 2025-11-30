QuizNet – Frontend (React + Vite)

QuizNet is an interactive quiz platform that allows users to create quizzes, attempt quizzes, view results, and manage quiz submissions.
This repository contains the frontend built using React (Vite), styled with Tailwind CSS, and uses Context API for global state (authentication + theme).

🚀 Features
👤 Authentication

User login & registration

Email OTP verification for registration

Auto-login after signup

Secure cookie-based session handling

Logout with session clearing

🌓 Dark/Light Theme

Global theme toggle using Context API

Theme stored in localStorage

🧠 Quiz Management

Create quizzes with:

Title

Date

Start & End Time

Time Limit

View created quizzes

Delete quizzes

Generate quiz link for sharing

📝 Attempting Quizzes

Live quiz UI

Timer bar with progress

Auto-save answers (PATCH API)

Prevent re-attempts

Submit quiz

📊 Results

Personalized result page

Score breakdown:

Correct

Wrong

Unanswered

View answer sheet

Download PDF of complete answer sheet

🗂️ Submission Management

View all participants of a quiz

Open each participant’s response

Read-only review mode for creators

Admin-style list of all attempts

🧩 Other Key Features

Responsive design

Smooth UI animations

Global loading skeleton

Sidebar navigation

Header for logged-in & guest users


Tech Stack
Frontend

React (Vite)

React Router DOM

Tailwind CSS

Axios

Context API (for Auth + Theme)

Lucide Icons

html2pdf.js (PDF generation)


src/
│── App.jsx
│── main.jsx
│── index.css
│
├── Pages/
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── User.jsx
│   ├── MyQuizzes.jsx
│   ├── AttemptedQuizzes.jsx
│   ├── JoinQuiz.jsx
│   ├── Instructions.jsx
│   ├── AttemptQuiz.jsx
│   ├── Result.jsx
│   ├── QuizSubmissions.jsx
│  
│
├── components/
│   ├── Header.jsx
│   ├── HeaderUser.jsx
│   ├── Sidebar.jsx
│   ├── InputField.jsx
│   ├── CreateQuizForm.jsx
│   ├── TimerBar.jsx
│   ├── ResponseSheet.jsx
│   ├── QuizCard.jsx
│   ├── QuizSidePanel.jsx
│   └── GlobalLoader.jsx
│
├── context/
│   ├── AuthContext.jsx
│   └── ThemeContext.jsx
│
└── api/
    ├── axios.js
    └── attempt.js
