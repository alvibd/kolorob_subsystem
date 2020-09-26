import axios from 'axios'
import createAuthRefreshInterceptor from 'axios-auth-refresh'

export const createPost = (state, dispatch, caption, description) => {

    refreshToken(dispatch, state)

    dispatch({ type: "USER_LOADING" })

    const body = JSON.stringify({ caption, description });

    return axios
        .post('/api/create_post', body, tokenConfig(state))
        .then((res) => {

            // console.log(res)

            // let token = res.headers.Authorization.slice(7);
            // let payload = res.data.data;
            // console.log(token)


            dispatch({
                type: "LOADED",
            });

            return res;
        })
        .catch((err) => {
            // dispatch(returnErrors(err.response.data, err.response.status));

            throw err
        })


}

const tokenConfig = (state) => {
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
    const refreshAuthLogic = failedRequest => axios.post('/api/refresh', null, tokenConfig(state)).then(tokenRefreshResponse => {
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
