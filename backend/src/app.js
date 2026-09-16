const express=require('express');
const cors = require("cors");
const authRoute=require('./routes/auth.route')
const profileRoute=require('./routes/profile.route')
const internshipRoute=require('./routes/internship.route')
const applicationRoute=require('./routes/application.route')
const cookieParser=require('cookie-parser')
const recommendationRoute = require("./routes/recommendation.route");

const app=express()
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json())
app.use(cookieParser())

app.use('/api/auth',authRoute)
app.use('/api/profile',profileRoute)
app.use('/api/internship',internshipRoute)
app.use('/api/application',applicationRoute)
app.use("/api/recommendation", recommendationRoute);

module.exports = app;