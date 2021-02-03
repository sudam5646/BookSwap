import React, {useState,useEffect,useContext} from 'react'
import {useHistory,Link} from 'react-router-dom'
import {UserContext} from '../../../App'
import M from 'materialize-css'

const Profile=()=> {
    const {state,dispatch} = useContext(UserContext)
    const [data,setData] = useState([])
    const [data2,setData2] = useState([])
    useEffect(()=>{
                fetch('/mybooks',{
                    headers:{
                        "Authorization" : "Bearer " + localStorage.getItem("bookswapjwt")
                    }
                }).then(res=>res.json())
                .then(result=>{
                    console.log("result",result)
                    setData(result.mybooks)
                })
    },[data2])
    const DeleteThisBook = (id) =>{
        console.log("id",id)
        var confirmed = window.confirm("Do you want to delete this book from your profile")==true
        console.log(confirmed)
        if(confirmed){
            fetch('deletemybook',{
                method:'delete',
                headers:{
                    "Authorization" : "Bearer " + localStorage.getItem("bookswapjwt"),
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    id
                })
            }).then(res=>res.json())
            .then(result=>{
                setData2(result)
                M.toast({html: `${result.message}`,classes:"#f44336 red"})
            })
        }else{

        }
    }
    return (
        <>
        {data.length?
        <div className="home">
            {    
                data.map(item=>{
                    return(
                        <div className="card home-card" key={item._id}>
                            <h5 style = {{padding:"10px"}}>
                                <span style={{paddingLeft:"20px"}}>{item.short_form}</span>
                                <Link><i 
                                onClick={()=>{
                                    DeleteThisBook(item._id)
                                }}
                                style={{float:'right'}} 
                                className="material-icons"
                                >delete</i></Link>
                                </h5>
                            <div className="card-image">
                                <img src={item.pic} />                                
                            </div>
                            <div className="card-content">
                                <h5>{item.amount} ₹</h5>
                                <p>{item.title}</p>
                                <p>{item.city}</p>

                            </div>
                        </div>
                    )
                })
                
            }
            
        </div>
    :
    <h2>May be you have not added any book for sale........</h2>
        }
        </>
    )
}

export default Profile
