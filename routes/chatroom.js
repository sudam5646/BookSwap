const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Chatroom = mongoose.model("Chatroom")
const requireLogin = require('../middleware/requireLogin')

router.post('/create-chatroom',async(req,res)=>{
    var id = req.body._id1.toString() + req.body._id2.toString();
    const chatroomExists = await Chatroom.findOne({name:id})
    if(chatroomExists){
        res.json({
            message:"Chatroom already exists"
        })
    }else{
        const chatroom = new Chatroom({
        name:id
    })
    chatroom.save().then(()=>{
        res.json(chatroom)
    })
    }   
})

router.get("/getallchatroom", requireLogin, async(req,res)=>{
    const chatrooms = await Chatroom.find({$or:[
        {id1:req.user._id},
        {id2:req.user._id}
    ]}
).populate('id1','name')
.populate('id2','name');
    res.json(chatrooms);
});
router.post('/chatroom',requireLogin,async(req,res)=>{
    const {chatroomname1,chatroomname2} = req.body
    var chatroom = await Chatroom.findOne({name:chatroomname1})
    if(chatroom){
        res.json(chatroom)
    }else{
        chatroom = await Chatroom.findOne({name:chatroomname2})
        res.json(chatroom)
    }
    
})

module.exports = router