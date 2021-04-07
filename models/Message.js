const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types

const messageSchema = new mongoose.Schema({
    chatroom:{
        type:ObjectId,
        require:"chatroom is required",
        ref:"Chatroom"
    },
    user:{
        type:ObjectId,
        require:"user is required",
        ref:"User"
    },
    message:{
        type:String,
        require:"Empty message cant be sent"
    }  
},{
    timestamps:true
})

mongoose.model("Message",messageSchema)