import axios from 'axios'
import createAuthRefreshInterceptor from 'axios-auth-refresh'
// import { returnErrors } from './messages'


// CHECK TOKEN & LOAD USER
export const loadUser = (dispatch, state) => {

    refreshToken(dispatch, state)

    // User Loading
    dispatch({ type: "USER_LOADING" });
    // console.log(tokenConfig(state, dispatch));

    return axios
    .post('/api/me', null, tokenConfig(state, dispatch))
    .then((res) => {

        // console.log(res)

        // let token = res.headers.Authorization.slice(7);
        let payload = res.data.data;
        // console.log(token)


        dispatch({
            type: "USER_LOADED",
            payload: payload,
        });
    })
    .catch((err) => {
        // dispatch(returnErrors(err.response.data, err.response.status));
        // dispatch({
        //     type: "AUTH_ERROR",
        // });
        throw err
    });
};

// LOGIN USER
export const login = (email, password) => (dispatch, state) => {
    // Headers
    dispatch({ type: "USER_LOADING" });
    const config = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    // Request Body
    const body = JSON.stringify({ email, password });

    return axios
    .post('/api/login', body, config)
    .then((res) => {
        dispatch({
            type: "LOGIN_SUCCESS",
            payload: res.data,
        });
    })
    .catch((err) => {

        // dispatch(returnErrors(err.response.data, err.response.status));
        dispatch({
            type: "LOGIN_FAIL",
        });
        throw err;
    })
};

// LOGOUT USER
export const logout = (dispatch, state) => {
    refreshToken(dispatch, state)
    dispatch({ type: "USER_LOADING" });

    return axios
    .post('/api/logout/', null, tokenConfig(state, dispatch))
    .then((res) => {
        // dispatch({ type: 'CLEAR_LEADS' });
        dispatch({
            type: "LOGOUT_SUCCESS",
        });
    })
    // .catch((err) => {
    //     // dispatch(returnErrors(err.response.data, err.response.status));
    // });
};

// LOGIN USER
export const registration = (dispatch, name, email, password, password_confirmation, sex) => {
    // Headers
    const config = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    // Request Body
    const body = JSON.stringify({ name, email, password, password_confirmation, sex });

    return axios
    .post('/api/registration', body, config)
    .then((res) => {
        dispatch({
            type: "REGISTER_SUCCESS",
            payload: res.data,
        });
    })
    .catch((err) => {

        // dispatch(returnErrors(err.response.data, err.response.status));
        dispatch({
            type: "REGISTER_FAIL",
        });
        throw err;
    })
};

// Setup config with token - helper function
const tokenConfig = (state, dispatch) => {
    // Get token from state
    const token = state.access_token;

    // Headers
    const config = {
        headers: {
            'Content-Type': 'application/json',
            // 'Access-Control-Expose-Headers': ['*', 'Authorization'],
            // 'Access-Control-Request-Headers': 'Authorization',
            'Accept': 'application/json',
        },
    };

    // If token, add to headers config
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
};

function refreshToken(dispatch, state) {
    const refreshAuthLogic = failedRequest => axios.post('/api/refresh', null, tokenConfig(state, dispatch)).then(tokenRefreshResponse => {
        // localStorage.setItem('token', tokenRefreshResponse.data.token);
        failedRequest.response.config.headers['Authorization'] = 'Bearer ' + tokenRefreshResponse.data.access_token;

        dispatch({
            type: "LOGIN_SUCCESS",
            payload: tokenRefreshResponse.data,
        });

        return Promise.resolve();
    });

    createAuthRefreshInterceptor(axios, refreshAuthLogic);
}
