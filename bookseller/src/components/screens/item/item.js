import React, {useState,useEffect, useContext} from 'react'
import {UserContext} from '../../../App'
import {useParams,useHistory} from 'react-router-dom'
import M from 'materialize-css'

const Item=()=> {
    const {bookid} = useParams()
    const [data,setData] = useState(null)
    const {state,dispatch} = useContext(UserContext)
    const history = useHistory()
    useEffect(()=>{
        fetch(`/item/${bookid}`,{
            headers:{
                "Authorization" : "Bearer " + localStorage.getItem("bookswapjwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            setData(result)
        })
    },[])
    const DecideComponent = () =>{
        if(state){
            history.push('/chatwindow')
        }
        else{
            M.toast({html: "You must be logged in",classes:"#f44336 red"})
            history.push('/signin')
        }
    }
    return (
        <>
            {data?
                <div>
                    <div>
                        <div className="col-sm-1"></div>
                        <div className="col-sm-6">
                            <div style={{height:"400px"}} className="card home-card">
                                <img style={{height:"400px"}} src={data.pic} alt={data.short_form}></img>
                            </div>
                        </div>
                        <div className="col-sm-4">
                            <div className="card home-card">
                                <h1 style={{margin:10}}>₹ {data.amount}</h1>
                                <h5 style={{margin:20}}>{data.title}</h5>
                                <h5 style={{margin:20}}>{data.college} {data.city}</h5>
                            </div>
                            <div className="card home-card">
                                <h4 style={{margin:10}}>Seller description</h4>
                                <h5 style={{margin:20}}>{data.postedBy.name}</h5>
                                <p style={{margin:10}}>
                                    <button 
                                    type="button" 
                                    className="btn btn-info btn-block"
                                    onClick={DecideComponent}>
                                        Chat with seller</button>
                                </p>
                                
                            </div>
                        </div>
                        <div className="col-sm-1"></div>
                        
                    </div>
                </div>
                :""
            }
        </>
    )
}

export default Item
