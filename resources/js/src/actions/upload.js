import axios from 'axios'
import createAuthRefreshInterceptor from 'axios-auth-refresh'

export const uploadPostMedia = (state, dispatch, formData, post) =>
{
    // const formData = new FormData();
    // formData.append('file_type', file_type);
    // // formData.append('files', [files]);

    // const arr = []

    // Array.from(files).forEach((f, index) => {
    //     arr[index] = f
    // })

    // formData.append('files', arr)

    refreshToken(dispatch, state)

    return axios.post('/api/create_post/'+post+'/upload', formData, tokenConfig(state))
        .then((res) => {

            // console.log(res)

            // let token = res.headers.Authorization.slice(7);
            // let payload = res.data.data;
            // console.log(token)


            // dispatch({
            //     type: "LOADED",
            // });

            return res;
        })
        .catch((err) => {
            // dispatch(returnErrors(err.response.data, err.response.status));
            console.log(err)

            throw err
        })
}

const tokenConfig = (state) => {
    // Get token from state
    const token = state.access_token;

    // Headers
    const config = {
        headers: {
            'Content-Type': 'multipart/form-data',
            // 'Access-Control-Expose-Headers': ['*', 'Authorization'],
            // 'Access-Control-Request-Headers': 'Authorization',
            'Accept': 'application/json',
        }
    };

    // If token, add to headers config
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
};

function refreshToken(dispatch, state) {
    const refreshAuthLogic = failedRequest => axios.post('/api/refresh').then(tokenRefreshResponse => {
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
