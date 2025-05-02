# interNito

**About:**  
A collaborative MERN stack platform for NIT Warangal students to share and discover real internship and placement experiences, built by CSES.

---

## 🚀 Features

- Share and browse real interview experiences  
- Search by company or CGPA  
- Modern, responsive UI (React)  
- Google OAuth login (Passport.js)  
- Admin dashboard for experience moderation  
- Feedback system with email notifications  
- Built with MongoDB, Express, React, Node.js (MERN stack)  

---

## 🛠️ Getting Started

### Prerequisites

- Node.js (v16+ recommended)  
- MongoDB database (Atlas or local)  
- Google Cloud project with OAuth credentials  

---

### 🚧 Clone the repo

```bash
git clone https://github.com/yourusername/internito.git
cd internito
```

---

### 🔐 Setup Environment Variables

Create a `.env` file inside the `/api` directory with the following content:

```
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
mongo_link=your-mongodb-uri
FEEDBACK_MAIL_USER=your-email@gmail.com
FEEDBACK_MAIL_PASS=your-app-password
```

---

### 📦 Install Dependencies

```bash
# Backend
cd api
npm install

# Frontend
cd ../client
npm install
```

---

### ▶️ Run the App

```bash
# Backend
cd api
npm start

# Frontend
cd ../client
npm start
```

- Frontend: http://localhost:3000  
- Backend: http://localhost:8000  

---

## 🏗️ Folder Structure

```
internito/
  api/        # Express backend (Node.js, MongoDB, Passport)
  client/     # React frontend
```

---

## 👨‍💻 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## 🙏 Credits

**Original Developers**  
- Sufiyan Ansari  
- Chaitanya Hardikar – Backend Developer  
- Chirantan Muliya  
- Divya Soni  
- Abhishek Upadhyayula  

**MERN Rebuild Team**  
- Devashish Dubal  
- Chetan Kar  
- Shubham Pahilwani  

---

**interNito – Bridging the gap between coursework and career, together.**
