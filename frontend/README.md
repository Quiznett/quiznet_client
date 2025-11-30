# QuizNet – Frontend (React + Vite)
### Author: Nishtha Srivastava

QuizNet is an interactive quiz platform that allows users to create quizzes, attempt quizzes, view results, and manage quiz submissions.
This repository contains the frontend built using React (Vite), styled with Tailwind CSS, and uses Context API for global state (authentication + theme).

## Features
**Authentication**

* User login & registration

* Email OTP verification for registration

* Auto-login after signup

* Secure cookie-based session handling

* Logout with session clearing

*  Dark/Light Theme

* Global theme toggle using Context API

* Theme stored in localStorage

**Quiz Management**

* Create quizzes with:



* View created quizzes

* Delete quizzes

* Generate quiz link for sharing

**Attempting Quizzes**

* Live quiz UI

* Timer bar with progress

* Auto-save answers (PATCH API)

* Prevent re-attempts

* Submit quiz

**Results**

* Personalized result page

* Score breakdown:


* View answer sheet

* Download PDF of complete answer sheet

**Submission Management**

* View all participants of a quiz

* Open each participant’s response

* Read-only review mode for creators

* Admin-style list of all attempts

**Other Key Features**

* Responsive design



* Global loading skeleton

* Sidebar navigation

* Header for logged-in & guest users


## Tech Stack of Frontend


* React (Vite)

* React Router DOM

* Tailwind CSS

* Axios

* Context API (for Auth + Theme)

* Lucide Icons

* html2pdf.js (PDF generation)
* js-Cookie


js
