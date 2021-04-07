const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Message = mongoose.model("Message")
const requireLogin = require('../middleware/requireLogin')

router.post('/getmessages',requireLogin,async(req,res)=>{
    const {chatroomId} = req.body
    var messagesarray = []
    var message2;
    await Message.find({chatroom:chatroomId})
    .populate('user','name')
    .sort('createdAt')
    .then((messages)=>{
        messages.map((message)=>{
            
            message2={message:message.message,
                name:message.user.name,
                userId:message.user._id}
            messagesarray.push(message2);
        })
        res.json(messagesarray)
    })
    
    
})

module.exports = router