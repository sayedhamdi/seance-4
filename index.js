const dotenv = require("dotenv")
const path = require("path")
const express = require("express");

dotenv.config()

const port = process.env.port || 8000 


const app = express();

app.set('view engine', 'pug')


//Ajouter un route handler pour la page d'accueil
app.get("/",(req,res)=>{
    res.render('index', { title: 'Hey', message: 'Hello there!' })
})
//Ajouter un route handler pour la page signup
app.get("/signup",(req,res)=>{
    res.end("page sign up")
})
//Ajouter un route handler pour la page signin
app.get("/signin",(req,res)=>{
    res.render('signin')
})

app.post("/signin",(req,res)=>{
    res.end("login successful")
})
app.get("*",(req,res)=>{
    res.end("404")
})


app.listen(port,()=>{
    console.log(`listening on port ${port}`)
})

