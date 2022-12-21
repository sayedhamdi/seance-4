const dotenv = require("dotenv")
const path = require("path")
const express = require("express");
const bodyParser = require("body-parser")

dotenv.config()

const port = process.env.port || 8000 


const app = express();
// configuration pug
app.set('view engine', 'pug')

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }))

//Ajouter un route handler pour la page d'accueil
app.get("/",(req,res)=>{
    res.render('index')
})
//Ajouter un route handler pour la page signup
app.get("/signup",(req,res)=>{
    res.render('signup')
})
//Ajouter un route handler pour la page signin
app.get("/signin",(req,res)=>{
    res.render('signin')
})

app.post("/signin",(req,res)=>{
    res.end("login successful")
})
app.post("/signup",(req,res)=>{
    
    // verification des données 
    let {fullname,email,password} = req.body
    if( !fullname || !email || !password ){
        console.log("vide")
        res.render("signup",{msg:"Please fill in your information"})
        return
    }
    // verifier unicité mtaa el email
    
    //
    
    // traitement 


    console.log("hello")
    //response

    //traitement du success
    //créer une ligne dans mon fichier csv
    res.render("signin",{msg:"your account has been created"})
})
app.get("*",(req,res)=>{
    res.end("404")
})


app.listen(port,()=>{
    console.log(`listening on port ${port}`)
})

