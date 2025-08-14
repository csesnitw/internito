/* This code snippet is setting up a Node.js server using Express framework along with various
middleware and dependencies. Here's a breakdown of what each part is doing: */
const express = require("express"); // express backend frameworkhttp://localhost:3000/search
const passport = require("passport"); /// Node.js Authentication middleware library (for sign in with google)
const session = require("express-session"); //This module is commonly used for managing user sessions in Express.js 
//applications.

const cors = require('cors');/// The `cors` module is commonly used to enable Cross-Origin Resource Sharing (CORS) in web
// applications to allow requests from different origins.

const mongoose = require("mongoose"); ///This library is commonly used for interacting with MongoDB databases in JavaScript
//applications.

const dotenv = require("dotenv");  /// This library is commonly used for setting up environment variables for 
/// our application. This allows you to keep sensitive data like API keys, 
//database credentials, and other configuration variables out of your source code for security purposes

const passportSetup = require("./passport-setup"); /// importing our student authentication middleware written in another file
const experience_router = require("./routes/experiences"); /// importing our experience routes written in another file
const User = require("./models/User");
const feedbackRouter = require("./routes/feedback");
/* 
Status codes returned in the responses of various API endpoints are mostly in line with
RESTFul API Practices
*/


// Creating our express application
const app = express();

/* The `app.use(session({ ... }))` middleware in the provided code snippet is setting up session
management for the Express application. Here's a breakdown of the options being passed to the
`session` middleware: */
app.use(session({
    /* The `secret: 'my-secret-key'` in the `session` middleware configuration is setting a secret key
    used to sign the session ID cookie. This secret key is used to encrypt the session data stored
    on the client-side and prevent tampering or unauthorized access to the session data. */

    // TODO: make sure this is saved properly in prod
    secret: process.env.SESSION_SECRET,
    /* The `resave: true` option in the `session` middleware configuration indicates that the session
    data should be saved back to the session store even if the session was never modified during the
    request. */
    resave: false,
    /* The `saveUninitialized: false` option in the `session` middleware configuration indicates that
    the session will not be saved for a session that is uninitialized. In other words, if a session
    is new and has not been modified during the request, it will not be saved to the session store. */
    saveUninitialized: false,
    /* The `cookie` object within the `session` middleware configuration is used to define settings
    related to the session cookie that is stored on the client-side. Here's a breakdown of the
    properties being set: */
    cookie: {
        //httpOnly: true,
        //maxAge: 5 * 60 * 60 * 24 * 1000, // 5 days
        /* The `secure: false` option within the `session` middleware configuration is used to specify
        whether the session cookie should be set with the `Secure` attribute or not. */
        // TODO: probably should be true in production if we use http
        secure: false
    },
}));

/* The `app.use(cors(...))` middleware in the provided code snippet is configuring Cross-Origin
Resource Sharing (CORS) for the Express application.  */
app.use(
    cors({
        origin: "http://localhost:3000",
        methods: "GET,POST,PUT,DELETE,PATCH",
        credentials: true
    }
))

app.use(passport.initialize());
app.use(passport.session());
// const User = require("./models/User");
dotenv.config();

mongoose.connect(process.env.mongo_link); // connects to our mongodb database
app.use(express.json()); /* The above code is configuring an Express application to use the built-in middleware express.json().
This middleware is used to parse incoming requests with JSON payloads. */

app.use("/api/feedback", feedbackRouter);
app.use("/api/experiences", experience_router); // Update the experiences route to include /api

/// Basic endpoint to see if our backend server is running without any complications
app.get("/api", (req, res) => {
    try {
        return res.status(200).json("JSON Server is running");
    } catch (error) {
        console.log(error)
    }
})

/* This is the route which we redirect to incase of a login success*/
app.get("/api/login/success", (req, res) => {
    if (req.user) {
        res.status(200).json({
            success: true,
            user: req.user.user, // Send user details
        });
    } else {
        res.status(403).json({ error: true, message: "Not Authorized" });
    }
});

/* This is the route which we redirect to incase of a login failure */
app.get("/api/login/failed", (req, res) => {
    res.status(401).json({
        error: true,
        message: "Log in failure",
    });
});

/* When a user accesses
the "/api/auth/google/" endpoint, the code initiates the authentication process with Google using the
Passport.js library. It specifies that the authentication strategy to be used is 'google' and
requests access to the user's profile, email, and Google Calendar. */
app.get("/api/auth/google/",
    passport.authenticate('google', { scope: ['profile', 'email'] })
)

/* The below code is setting up a route for handling the callback after a user authenticates with
Google. When a user is redirected to the '/api/auth/google/callback' endpoint, the code uses Passport.js
to authenticate the user using the 'google' strategy. If the authentication fails, the user is
redirected to 'http://localhost:3000/'. If the authentication is successful, the user is redirected
to the frontend experiences page. */
app.get('/api/auth/google/callback',
    passport.authenticate('google', { failureRedirect: `${process.env.REACT_APP_CLIENT_URL || 'http://localhost:3000'}/` }),
    (req, res) => {
        // Redirect to the frontend experiences page after successful login
        res.redirect(`${process.env.REACT_APP_CLIENT_URL || 'http://localhost:3000'}/search`);
    }
);

/* When a GET request is
made to the '/api/user' endpoint, the server will respond with a status code of 200 and send the data
stored in the `req.user` object back to the client. */
app.get('/api/user', (req, res) => {
    res.status(200).send(req.user)
})

app.get('/api/user/:userId', (req, res) => {
    const { userId } = req.params;
    User.findById(userId).then((user) => {
        res.status(200).json({ success: true, user: user });
    }).catch((err) => {
        res.status(500).json({ error: true, message: err });
    });
})

app.put('/api/user/modify/:userId', (req, res) => {
    const { userId } = req.params;
    const {linkedIn, github, resume } = req.body;

    User.findOneAndUpdate(
        { _id: userId },
        { $set: { linkedIn, github, resume } },
        { new: true } //new returns the updated document
    ).then((user) => {
        res.status(200).json({ success: true, user: user });
    }).catch((err) => {
        res.status(500).json({ error: true, message: err });
    });
})

/* The below code is a route handler for the "/api/logout" endpoint in a Node.js application using Express
framework. When a user accesses this endpoint, it logs out the current user session. */
app.get('/api/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ error: true, message: 'Logout failed' });
        }
        req.session.destroy(); // Destroy the session
        res.clearCookie('connect.sid'); // Clear the session cookie
        res.status(200).json({ success: true, message: 'Logged out successfully' });
    });
});

passportSetup();


app.listen(8000 || process.env.PORT, () => {
    console.log("Backend server is running!");
});