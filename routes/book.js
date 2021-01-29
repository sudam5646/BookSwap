const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requireLogin = require('../middleware/requireLogin')
const Book = mongoose.model('Book')

router.get('/allbooks',(req,res)=>{
    Book.find()
    .populate('postedBy',"_id name")
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
    const {title,short_form,amount,city,college,pic} = req.body
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
    .then(mybooks =>{
        res.json({mybooks})
    })
    .catch(err=>{
        console.log(err)
    })
})


module.exports = router