const { faker } = require('@faker-js/faker');
const mysql = require("mysql2");
const express =require("express");
const app=express();
const path=require("path");
const methodOverride=require("method-override");

app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'sigma_app',
    password: "Cricket~22"
});

let getRandomUser=() => {
  return [
    faker.string.uuid(),
    faker.internet.userName(),
    faker.internet.email(),
    faker.internet.password(),
   
  ];
};


// count values of data from database

app.get("/", (req,res)=>{
  let q= `SELECT count(*) FROM user`;
  try{
    connection.query(q,(err,result)=>{
      if(err) throw err;
      let count=result[0]["count(*)"]
      res.render("home.ejs",{count});
    });
   }catch (err){
    console.log(err);
    res.render("Some error in DB")
   }
});
//show the tables of all data user from database
app.get("/user", (req,res) => {
  let q=`SELECT * FROM user`;
  try{
  connection.query(q, (err, users) => {
      if(err) throw err;
      
      res.render("showusers.ejs", { users });
  });
  }catch (err){
  console.log(err);
  res.render("Some error in DB");
  }
});
//update the database username
app.get("/user/:id/edit",(req,res)=>{
  let {id} = req.params;
  let q=`SELECT * FROM user WHERE id='${id}'`;
  try{
    connection.query(q, (err, result) => {
        if(err) throw err;
        let user=result[0];
        res.render("edit.ejs",{user});
    });
    }catch (err){
    console.log(err);
    res.render("Some error in DB");
    }
  
});

//update the database username
app.patch("/user/:id",(req,res)=>{
  let {id} = req.params;
  let{password:formPass,username:newUsername}=req.body;
  let q=`SELECT * FROM user WHERE id='${id}'`;
  try{
    connection.query(q, (err, result) => {
        if(err) throw err;
        let user=result[0];
        if(formPass!=user.password){
          res.send("Wrong Password");
        }else{
          let q2=`Update user set username='${newUsername}' where id='${id}'`;
          connection.query(q2,(err,result)=>{
             if(err) throw err;
             res.redirect("/user");
          });
        }
        
    });
    }catch (err){
    console.log(err);
    res.render("Some error in DB");
    }
});


// app.get("/user/new",(req,res)=>{
//   let {id,email,username}=req.params;
//   let q=`select * from user where username='${username}'`;
//   try{
//     connection.query(q, (err, result) => {
//         if(err) throw err;
//         let username=result;
//         res.render("new.ejs",{id,email,username});
//     });
//     }catch (err){
//     console.log(err);
//     res.render("Some error in DB");
//     }
// });
// app.post("/user",(req,res)=>{
//   let { id , email, username} = req.body;
//   let q=`select * from user where username='${username}'`;
//   try{
//     connection.query(q, (err, result) => {
//         if(err) throw err;
        
//         let id,email,username=result[0][1][2];

//         posts.push({id , email,username});
//         res.redirect("/user");
//     });
//     }catch (err){
//     console.log(err);
//     res.render("Some error in DB");
//     }
  
// });


app.listen("8080",()=>{
  console.log("server is listening to port 8080");
});



