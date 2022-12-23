const dotenv = require("dotenv")
const path = require("path")
const express = require("express");
const bodyParser = require("body-parser")
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csv = require("csvtojson")
const session = require('express-session')
const cookieParser = require("cookie-parser");


const csvWriter = createCsvWriter({
    path: 'users.csv',
    header: [
        {id: 'fullname', title: 'fullname'},
        {id: 'password', title: 'password'},
        {id : 'email' , title: 'email'}
    ]
});
dotenv.config()

const port = process.env.port || 8000 


const app = express();
// configuration pug
app.set('view engine', 'pug')

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }))
const oneDay = 1000 * 60 * 60 * 24;

app.use(session({
    secret: '123456789',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true, maxAge: oneDay }
}))
app.use(cookieParser());

//Ajouter un route handler pour la page d'accueil
app.get("/",(req,res)=>{
    console.log(req.session)
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
app.get("/profile",(req,res)=>{
    console.log(req.session.cookie)
    res.render("profile")
})

app.post("/signin",async (req,res)=>{
    
    let {email,password} = req.body;
    if (!email || !password){
        res.render("signin",{msg:"Please fill in your information"})
        return
    }
    let users = await csv().fromFile("./users.csv")
    let user = users.filter((user)=>user.email ==email && user.password==password)

    if (user.length==0){
        res.render("signin",{msg:"Email or password incorrect"})
        return
    }
    res.cookie('userEmail', user[0].email)
    res.redirect("/profile")
    
})
app.post("/signup",async (req,res)=>{
    
    // verification des données 
    let {fullname,email,password} = req.body
    if( !fullname || !email || !password ){
        console.log("vide")
        res.render("signup",{msg:"Please fill in your information"})
        return
    }
    // verifier unicité mtaa el email
    //a9ra el ficheir users.csv
    //creation compte
    let users = await csv().fromFile("./users.csv")
    console.log(users)
    let userWithEmail = users.filter((user)=>user.email ==email) 
    if(userWithEmail.length>0){
        res.render("signup",{msg:"Email already exists use another email"})
        return
    }
    // redirection page login
    const newUser = {email,fullname,password}
    csvWriter.writeRecords([...users,newUser])
   
    res.render("signin",{msg:"your account has been created"})
})

app.get("*",(req,res)=>{
    res.end("404")
})


app.listen(port,()=>{
    console.log(`listening on port ${port}`)
})

