const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requireLogin = require('../middleware/requireLogin')
const { route } = require('./auth')
const cloudinary = require('./cloudinary')
const Book = mongoose.model('Book')

router.get('/allbooks',(req,res)=>{
    Book.find()
    .populate('postedBy',"_id name")
    .sort('-createdAt')
    .then(books=>{
        res.json(books)
    }).catch(err=>{
        console.log(err)
    })
})
router.get('/item/:itemid',(req,res)=>{
    Book.findOne({_id:req.params.itemid})
    .populate('postedBy',"_id name")
    .then(book=>{
        res.json(book)
    }).catch(err=>{
        console.log(err)
    })
})

router.post('/addbook',requireLogin, (req,res) =>{
    const {title,short_form,amount,city,college,pic,cloudinary_id} = req.body
    if(!title ||!short_form ||!amount ||!city ||!college ||!pic){
        if(!pic){
            return res.status(400).json({error:"please upload photoof book"})
        }
        return res.status(400).json({error:"please add all the fields"})
    }
    req.user.password = undefined
    const book = new Book({
        title,
        short_form,
        amount,
        city,
        college,
        pic,
        cloudinary_id,
        postedBy:req.user
    })
    book.save().then(result =>{
        res.json({post:result})
    }).catch(err =>{
        console.log(err)
    })
})

router.get('/mybooks',requireLogin,(req,res)=>{
    Book.find({postedBy:req.user._id})
    .populate("PostedBy","_id name")
    .sort('-createdAt')
    .then(mybooks =>{
        res.json({mybooks})
    })
    .catch(err=>{
        console.log(err)
    })
})

router.delete('/deletemybook',requireLogin,(req,res)=>{
    try{
           
        const {id} = req.body
        Book.findByIdAndDelete(id, async(err,mybook)=>{
            if(err){
                return res.statusCode(400).json({error:err})
            }else{
                if(mybook){
                    await cloudinary.uploader.destroy(mybook.cloudinary_id)
                    console.log(`You deleted book of ${mybook.short_form} from your profile`)
                    res.json({message:`You deleted book of ${mybook.short_form} from your profile`})
                }else{
                    res.json({message:'Book is already deleted just refresh your page'})
                }
                
            }
        })
    }catch(err){
        console.log(err)
    }
})


module.exports = router