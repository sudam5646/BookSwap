import React, {useState,useContext,useEffect} from 'react'
import {Link, useHistory} from 'react-router-dom'
import M from 'materialize-css'

const Sell = () =>{
    const [title,setTitle] = useState("")
    const [short_form,setShort_form] = useState("")
    const [amount,setAmount] = useState("")
    const [city,setCity] = useState("")
    const [college,setCollege] = useState("")
    const [image,setImage] = useState("")
    const [url,setUrl] = useState("")
    const history = useHistory()

    useEffect(()=>{
        if(url){
            fetch("/addbook",{
                method:"post",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":"Bearer " + localStorage.getItem("bookswapjwt")
                },
                body:JSON.stringify({
                    title,
                    short_form,
                    amount,
                    city,
                    college,
                    pic:url
                })
                }).then(res =>res.json())
                .then(data =>{
                    if(data.error){
                        M.toast({html: data.error,classes:"#f44336 red"})
                    }
                    else{
                        M.toast({html:"Book uploaded Successfully",classes:"#8bc34a light-green"})
                        console.log(data)
                        history.push('/')
                    }
            }).catch(err=>{
                console.log(err)
            })
        }
    },[url])

    const PostDetails = () =>{
        if(!image){
            M.toast({html: "Please upload image of a book",classes:"#f44336 red"})
        }
        const data = new FormData()
        data.append("file",image)
        data.append("upload_preset","Book-Swapping")
        data.append("cloud_name","dqgxupnas")
        fetch("https://api.cloudinary.com/v1_1/dqgxupnas/image/upload",{
            method:"post",
            body:data
        }).then(res=>res.json())
        .then(data=>{
            setUrl(data.url)
        }).catch(err=>{
            console.log(err)
        })
        
    }
    
    return (
        <div className="mycard">
            <div className="card auth-card input-field">
                <h5>Book Details</h5>   
                <input
                type = "text"
                placeholder = "Title of book"
                value={title}
                onChange={(e) =>setTitle(e.target.value)}
                />
                <input
                type = "text"
                placeholder = "short form of book"
                value={short_form}
                onChange={(e) =>setShort_form(e.target.value.toUpperCase().trim())}
                />
                
                <input
                type = "number"
                placeholder = "Amount in Rs"
                value={amount}
                onChange={(e) =>setAmount(e.target.value)}
                />
                <input
                type = "text"
                placeholder = "City"
                value={city}
                onChange={(e) =>setCity(e.target.value)}
                />
                <h5>Your College</h5>   
                <input
                type = "text"
                placeholder = "College name"
                value={college}
                onChange={(e) =>setCollege(e.target.value)}
                />
                <div className="file-field input-field">
                    
                    <div style={{margin: "0px 50px 50px 94px"}} className="btn #9e9e9e grey">
                        
                        <span>Upload Image</span>
                        <input 
                        type="file" 
                        onChange={(e=>{
                            setImage(e.target.files[0])
                            console.log("image",image)
                        })}/>
                        
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" />
                    </div>
                </div> 
            
                <button style={{margin:"0px 50px 50px 50px"}} className="btn waves-effect waves-light #64b5f6 blue darken-1"
                onClick={PostDetails}>
                    Upload Book
                </button>      
            </div>
        </div>
        
    )
}

export default Sell

