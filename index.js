const dotenv = require("dotenv")
const path = require("path")
const express = require("express");
const bodyParser = require("body-parser")
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csv = require("csvtojson")
const session = require('express-session')
const cookieParser = require("cookie-parser");
const url = require('url');
const querystring = require('querystring');


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
const auth = (req,res,next)=>{
    if(req.session.email){
        next()
    }
    else{
        res.redirect("/signin");
    }
}   

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(session({
    secret: '123456789',
    cookie:{
        maxAge:10*1000
    }
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
    let parsedUrl = url.parse(req.url);
    console.log(parsedUrl)
    res.render('signin')
})
app.get("/profile",auth,async (req,res)=>{
    
    let users = await csv().fromFile("./users.csv")
    let user = users.filter((user)=>user.email == req.session.email )
    res.render("profile",{fullname : user[0].fullname,email:user[0].email})
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
    req.session.email = user[0].email
    res.redirect("/profile")
    
})
app.get("/logout",(req,res)=>{
    req.session.destroy();
    res.redirect("/signin")
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
    
    res.redirect("signin?msg=account created")
})

app.get("*",(req,res)=>{
    res.end("404")
})

app.listen(port,()=>{
    console.log(`listening on port ${port}`)
})

