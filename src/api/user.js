export function getUserId(){
    let loggedInUser = localStorage.getItem("token") != null ? JSON.parse(localStorage.getItem("token")) : null
    console.log(loggedInUser)
    if(loggedInUser != null){
        return loggedInUser?.userId;
    }
    return null;
}


export function getUser(){
    return  localStorage.getItem("user") != null ? JSON.parse(localStorage.getItem("user")) : null
}

export function getUserAccessToken(){
    let loggedInUser = localStorage.getItem("token") != null ? JSON.parse(localStorage.getItem("token")) : null
    if(loggedInUser != null){
        return loggedInUser?.accessToken;
    }
    return null
}


export function getRefreshToken(){
    let loggedInUser = localStorage.getItem("token") != null ? JSON.parse(localStorage.getItem("token")) : null
    if(loggedInUser != null){
        return loggedInUser?.refreshToken;
    }
    return null
}



