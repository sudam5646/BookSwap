const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model("User");
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../config/key');
const requireLogin = require('../middleware/requireLogin')
const nodemailer = require('nodemailer')
const crypto = require('crypto');

router.post('/signup', (req,res) =>{
    var {name,email,password} = req.body
    email = email.trim()
    password = password.trim()
    console.log("email",email)
    console.log("password",password)

    if(!name || !email || !password){
       return res.status(422).json({error:"please add all the fields"})
    }
    User.findOne({email:email})
    .then((savedUser => {
        if(savedUser){
            return res.status(422).send({error:"user already exist"})
        }
        else{
            bcrypt.hash(password,12)
            .then(hashedpassword =>{
                const user = new User({
                    email,
                    password:hashedpassword,
                    name
                })
                user.save()
                .then(user => {
                    res.json({message :"saved successfully"})
                }).catch(err => {
                    console.log(err)
                })
            }).catch(err =>{
                console.log(err)
            })
            
        }
    })).catch(err => {
        console.log(err)
    })
})

router.post('/signin', (req,res) =>{
    var {email,password} = req.body;
    email = email.trim()
    password = password.trim()
    console.log("email",email)
    console.log("password",password)
    if(!email || !password){
        res.status(400).send({error:"please add email and password both"})
    }
    else{
        User.findOne({email:email})
        .then(savedUser =>{
            if(!savedUser){
                return res.status(400).send({error:"Email is not registered"})
            }
            bcrypt.compare(password,savedUser.password)
            .then(doMath =>{
                if(doMath){
                    //res.send({message:"Signed in successfully"});
                    const token = jwt.sign({_id:savedUser._id},JWT_SECRET)
                    const {_id,name,email} = savedUser
                    res.json({token,user:{_id,name,email}});
                }else{
                    return res.status(400).send({error:"invalid email or password"})
                }
            })
        })
    }
})

router.post('/reset-password',(req,res)=>{
    var {email} = req.body
    email = email.trim()
    crypto.randomBytes(32,(err,buffer)=>{
        if(err){
            console.log(err)
        }
        const token = buffer.toString('hex')
        User.findOne({email:email})
        .then(user=>{
            if(!user){
                return res.status(400).json({message:`${email} This email id is not registered`})
            }
            console.log(user.email)
            user.resetToken = token
            user.expireToken = Date.now() + 3600000
            req.token = token
            user.save().then((result)=>{
                sendmail(req, info => {
                    res.json({message:"Check your mail"})
                })
            })
        })
        .catch(err=>{
        console.log(err)
        })
    })    
})

async function sendmail(req, callback){
    let transport = nodemailer.createTransport({
        service : 'gmail',
        auth : {
            user : 'pccoerbookseller@gmail.com',
            pass : '9503165458'
        }
    });
    let mailoptions = {
        from : 'Book Swap <no-reply@gmail.com>',
        to : req.body.email, 
        subject : 'Password reset',
        //text :  textBody,
        html : `
        <p>You requested for password reset</p>
        <h5>click in this 
            <a href="https://book-swappp.herokuapp.com/reset/${req.token}">
                link
            </a>
            to reset password
        </h5>
        `
    };
    let info = await transport.sendMail(mailoptions);
    callback(info);
    
}

router.post('/new-password',(req,res)=>{
    if(!req.body.password){
        return res.status(400).json({message:"Please enter new passwors"})
    }
    const Newpassword = req.body.password
    const setToken = req.body.token
    User.findOne({resetToken:setToken,expireToken:{$gt:Date.now()}})
    .then(user=>{
        if(!user){
            return res.status(400).json({message:"Session expired"})
        }
        bcrypt.hash(Newpassword,12).then(hashedpassword=>{
            user.password = hashedpassword
            user.resetToken = undefined
            user.expireToken = undefined
            user.save().then(saveduser=>{
                res.json({message:"Password updated successfully"})
            })
        })
    }).catch(err=>{
        console.log(err)
    })
})


module.exports = router
