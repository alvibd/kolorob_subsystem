import React, { createContext, useReducer } from 'react'
const token = window.localStorage.getItem('token');

const GlobalState = {
    isAuthenticated : token != null ? true : false,
    user: null,
    access_token : token != null ? token : null,
    isLoading: false,
    roles: []
}

 //Create Context
 export const GlobalContext = createContext(GlobalState)

 //Provider component
 export const GlobalProvider = ({ children }) => {
    const [state, dispatch] = useReducer(GlobalReducer, GlobalState)

    return (
        <GlobalContext.Provider value={{state, dispatch}}>
            { children }
        </GlobalContext.Provider>
    )
}

function GlobalReducer(state,action){
    switch (action.type) {
        case "REFRESH_TOKEN":
        window.localStorage.setItem('token', action.token);
        return {
            ...state,
            access_token: action.token,
        };
        case "USER_LOADING":
        return {
            ...state,
            isLoading: true,
        };
        case "LOADED":
            return {
                ...state,
                isLoading: false
            }
        case "USER_LOADED":
        // window.localStorage.setItem('token', action.token);
        return {
            ...state,
            user: action.payload.name,
            isAuthenticated: true,
            isLoading: false,
            roles : action.payload.roles
        };
        case "LOGIN_SUCCESS":
        case "REGISTER_SUCCESS":
        window.localStorage.setItem('token', action.payload.access_token);
        // console.log(window.localStorage.getItem('token'))
        return {
            ...state,
            // ...action.payload,
            access_token: action.payload.access_token,
            isAuthenticated: true,
            isLoading: false,
            user: action.payload.name,
        };
        case "AUTH_ERROR":
        case "LOGIN_FAIL":
        case "LOGOUT_SUCCESS":
        case "REGISTER_FAIL":
        // console.log('deleting token')
        window.localStorage.removeItem('token');
        return {
            ...state,
            access_token: null,
            user: null,
            isAuthenticated: false,
            isLoading: false,
        };
        default:
            break;
    }
}
