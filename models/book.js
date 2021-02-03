const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const bookSchema = new mongoose.Schema({
    title:{
        type:String,
        required : true
    },
    short_form:{
        type:String,
        required : true
    },
    amount:{
        type:Number,
        required : true
    },
    city:{
        type:String,
        required : true
    },
    college:{
        type:String,
        required : true
    },
    postedBy:{
        type:ObjectId,
        ref:"User"
    },
    pic:{
        type:String,
        required:true
    }
},{timestamps:true})

mongoose.model("Book",bookSchema)