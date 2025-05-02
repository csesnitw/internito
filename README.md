# interNito

A collaborative MERN stack platform for NIT Warangal students to share and discover real internship and placement experiences, built by CSES.

---

## Features

- Share and browse real interview experiences  
- Search by company or CGPA  
- Modern, responsive UI (React)  
- Google OAuth login (Passport.js)  
- Admin dashboard for experience moderation  
- Feedback system with email notifications  
- Built with MongoDB, Express, React, Node.js (MERN stack)  

---

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)  
- MongoDB database (Atlas or local)  
- Google Cloud project with OAuth credentials  

---

### Clone the Repository

```bash
git clone https://github.com/yourusername/internito.git
cd internito
```

---

### Setup Environment Variables

Create a `.env` file inside the `/api` directory with the following content:

```
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
mongo_link=your-mongodb-uri
FEEDBACK_MAIL_USER=your-email@gmail.com
FEEDBACK_MAIL_PASS=your-app-password
```

---

### Install Dependencies

```bash
# Backend
cd api
npm install

# Frontend
cd ../client
npm install
```

---

### Run the Application

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

## Folder Structure

```
internito/
  api/        # Express backend (Node.js, MongoDB, Passport)
  client/     # React frontend
```

---

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

---

## Credits

**Original Developers**  
- [Sufiyan Ansari](https://github.com/suffisme)  
- [Chaitanya Hardikar](https://github.com/chaitanyahardikar)  
- [Chirantan Muliya](https://github.com/chirantan24)  
- [Divya Soni](https://github.com/divya-soni-14)  
- [Abhishek Upadhyayula](https://github.com)  

**MERN Rebuild Team**  
- [Devashish Dubal](https://github.com/devashishdubal)  
- [Chetan Kar](https://github.com/chetankar65)  
- [Shubham Pahilwani](https://github.com/shub2726)  

---

**interNito – Bridging the gap between coursework and career, together.**
