const checkCookie = (cookieName) => {
    let cookiesArr = document.cookie.split(";").map(item => ({name: item.trim().split("=")[0], value: item.trim().split("=")[1]}));
    const result = cookiesArr.filter(item => {
        return item.name === cookieName
    })
    if(result.length > 0) return true; else return false;
}

const initialState = {
    adminLoggedIn: checkCookie('adminToken'),
    adminType: '',
    electionType: '',
    adminState: '',
}

const store = (state = initialState, action) => {
    if(action.type === "SET_LOGIN"){
        return {
            adminLoggedIn: true,
            adminType: action.payload.adminType,
            electionType: action.payload.electionType,
            adminState: action.payload.state,
        }
    }else if(action.type === "SET_LOGOUT"){
        return {
            adminLoggedIn: false,
            adminType: '',
            electionType: '',
            adminState: '',
        }
    }else{
        return state;
    }
}

export default store;