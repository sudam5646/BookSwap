const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types

const chatRoomSchema = new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    id1:{
        type:ObjectId,
        require:true,
        ref:"User"
    },
    id2:{
        type:ObjectId,
        require:true,
        ref:"User"
    },
},{
    timestamps:true
})

mongoose.model("Chatroom",chatRoomSchema)