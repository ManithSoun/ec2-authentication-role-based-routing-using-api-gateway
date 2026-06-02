const express = require('express');
const app = express()

//USE PROXY SERVER TO REDIRECT THE INCOMMING REQUEST
const httpProxy = require('http-proxy')
const proxy = httpProxy.createProxyServer();

const jwt = require('jsonwebtoken')
require('dotenv').config()
const JWT_SECRET = process.env.JWT_SECRET;

function authToken(req, res, next) {
    console.log(req.headers.authorization)
    const header = req?.headers.authorization;
    const token = header && header.split(' ')[1];

    if (token == null) return res.status(401).json("Please send token");

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json("Invalid token", err);
        req.user = user;
        next()
    })
}

function authRole(role) {
    return (req, res, next) => {
        if (req.user.role !== role) {
            return res.status(403).json("Unauthorized");
        }
        next();
    }
}

app.use('/register', (req, res) => {
    console.log("INSIDE REGISTER ROUTE")
    req.url = '/register' + req.url
    proxy.web(req, res, { target: 'http://localhost:5003' });
  })

//REDIRECT TO THE STUDENT MICROSERVICE
app.use('/student',authToken, authRole('student'), (req, res) => {
    console.log("INSIDE API GATEWAY STUDENT ROUTE")
    req.url = req.url === '/' ? '/' : req.url
    proxy.web(req, res, { target: 'http://52.71.253.15:5004' });
})

//REDIRECT TO THE TEACHER MICROSERVICE
app.use('/teacher', authToken, authRole('teacher'),(req, res) => {
    console.log("INSIDE API GATEWAY TEACHER ROUTE")
    req.url = req.url === '/' ? '/' : req.url
    proxy.web(req, res, { target: 'http://18.215.146.238:5001' });
})

//REDIRECT TO THE LOGIN(Authentication) MICROSERVICE
app.use('/auth', (req, res) => {
    proxy.web(req, res, { target: 'http://localhost:5002' });
})

app.listen(4000, () => {
    console.log("API Gateway Service is running on PORT NO : 4000")
})