export const initialState = null

export const reducer = (state,action) =>{
    if(action.state = "USER"){
        return action.payload
    }
    if(action.state == "CLEAR"){
        return null
    }
    return state
}