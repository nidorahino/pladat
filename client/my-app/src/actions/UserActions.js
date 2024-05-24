import { UserConstants } from '../constants';

import axios from 'axios';
import jwt from 'jsonwebtoken';
import { REDUX_PERSIST_KEY } from '../staticData/config';





export const registerUser = (SignUpFormData) => dispatch => {
    const configs = {
        headers: {
          'Content-Type': 'application/json'
        },
        proxy: {
            host: '127.0.0.1',
            port: 5000
        },
        // validateStatus: function(status) { return status >= 200 && status < 300}
    };

    const requestBody = JSON.stringify({...SignUpFormData});

    axios.post('/api/users/register', requestBody, {...configs, validateStatus: function(status) {return status >= 200 && status < 300}})
    .then(res => {
        dispatch({
            type: UserConstants.USER_AWAITING_EMAIL_VERIFICATION,
            userInfo: {
                user: res.data.userInfo,
                linkExpiration: res.data.linkExprDate,
                dateLinkSent: res.data.dateSent
            },
            msg: res.data.msg,
        })
    })
    .catch(error => {
        // console.log(error, error.response, error.response.data);
        dispatch(returnAuthErros(error.response.data.msg, error.response.data.errors, error.response.status, 'USER_SIGNUP_FALIURE'));
        dispatch({
            type: UserConstants.USER_SIGNUP_FALIURE,
            msg: error.response.data.msg,
            authErrors: error.response.data.errors
        });
    })
}   

export const verifyUserEmail = (id) => dispatch => {
    const configs = {
        headers: {
            'Content-Type': 'application/json'
          },
          proxy: {
              host: '127.0.0.1',
              port: 5000
          },
          params: {
              token: id
            }, 
          validateStatus: function(status) { return status >= 200 && status < 300}
    };
    axios.post('/api/users/register/verifyEmail/'+id, {params: {token: id}}, {...configs})
    .then(res => {
        dispatch({
            type: UserConstants.USER_EMAIL_VERIFIED,
            msg: res.data.msg,
            validatedUser: res.data.user
        })
    })
    .catch(error => {
        console.log(error.response);
        dispatch(returnAuthErros(error.response.data.msg, error.response.data.msg, error.response.status, 'USER_EMAIL_VERIFICATION_FALIURE'));
        dispatch({
            type: UserConstants.USER_EMAIL_VERIFICATION_FALIURE,
            msg: error.response.data.msg
        });
    })
}

export const logInUser = (loginFormData) => dispatch => {
    dispatch(userLoggingIn());

    const configs = {
        headers: {
          'Content-Type': 'application/json',
        },
        proxy: {
            host: '127.0.0.1',
            port: 5000
        },
        validateStatus: function(status) { return status >= 200 && status < 300}
    };

    const requestBody = JSON.stringify({...loginFormData});

    axios.post('/api/users/login', requestBody, {...configs, validateStatus: function(status) {return status >= 200 && status < 300}})
    .then(res => {
        dispatch(hashToLocalStroage(res.data.userInfo));
        dispatch({
            type: UserConstants.USER_LOGGED_IN,
            msg: res.data.msg,
            userInfo: res.data.userInfo
        })
    })
    .catch(error => {
        // console.log(error.response.data);
        dispatch(returnAuthErros(error.response.data.msg, error.response.data.msg, error.response.status, 'USER_LOGIN_FAILURE'));
        dispatch({
            type: UserConstants.USER_LOGIN_FAILURE,
            msg: error.response.data.msg,
            userInfo: null
        });
    })
}

export const verifyUserLogin = (userId) => dispatch => {
    // console.log("verifyLogin UserId: ", userId);
    dispatch({type: UserConstants.VERIFYING_USER_LOGIN});

    const configs = {
        headers: {
          'Content-Type': 'application/json',
        },
        proxy: {
            host: '127.0.0.1',
            port: 5000
        },
        validateStatus: function(status) { return status >= 200 && status < 300}
    };

    axios.get('/api/users/verifyAuth/'+userId, {...configs})
    .then(res => {
        dispatch({
            type: UserConstants.VERIFYING_USER_LOGIN_SUCCESS,
            msg: 'User is authenticated',
            isAuth: res.data.userAuthenticated,
            userInfo: res.data.userInfo
        })
    })
    .catch(error => {
        console.log(error);
        dispatch({
            type: UserConstants.VERIFYING_USER_LOGIN_FAILURE,
            msg: 'User is not authenticated',
            isAuth: error.response.data.userAuthenticated,
            userInfo: error.response.data.userInfo
        })
    })
}

export const hashToLocalStroage = (data) => dispatch => {
    dispatch({type: UserConstants.HASHING_TO_STORAGE});
    jwt.sign({data}, REDUX_PERSIST_KEY, {}, (err, token) => {
        if(err) {
            dispatch(returnAuthErros("Something went wrong, couldn't log you in.", "Something went wrong on our end; couldn't log you in just yet.", 500, UserConstants.USER_LOGIN_FAILURE));
            dispatch({type: UserConstants.HASHING_TO_STORAGE_FAIL});
        }
        else {
            // localStorage.setItem('utoken', token);
            sessionStorage.setItem('utoken', token);
            dispatch({
                type: UserConstants.HASHED_TO_STORAGE,
                msg: "User data has been hashed to local storage"
            });
        }
    })
}

export const getUser = () => dispatch => {
    dispatch({type: UserConstants.LOADING_USER});
    // let userToken = localStorage.getItem('utoken');
    let userToken = sessionStorage.getItem('utoken');
    if(userToken) {
        jwt.verify(userToken, REDUX_PERSIST_KEY, {}, (err, data) => {
            if(err) {
                dispatch({type: UserConstants.LOADING_USER_FAILURE});
            }
            else {
                dispatch({
                    type: UserConstants.LOADING_USER_SUCCESS,
                    msg: 'User data aquired',
                    userInfo: data
                })
            }
        })
    }
    else {
        dispatch({type: UserConstants.LOADING_USER_FAILURE})
    }
}

export const removeFromLoalStorage = () => dispatch => {
    sessionStorage.removeItem('utoken');
    dispatch({ type: UserConstants.REMOVED_FROM_STORAGE});
}

export const logOutUser = () => dispatch => {
    dispatch(userLoggingOut());
    axios.put('/api/users/logout')
    .then(res => {
        dispatch({type: UserConstants.REMOVING_FROM_STORAGE});
        dispatch(removeFromLoalStorage());
        dispatch({
            type: UserConstants.USER_LOGGED_OUT,
            msg: res.data.msg,
            userInfo: null
        })
    })
    .catch(error => {
        dispatch(returnAuthErros(error.response.data.msg, error.response.status, 'USER_LOGOUT_FAILURE'));        
        dispatch({
            type: UserConstants.USER_LOGOUT_FAILURE,
            msg: "Something went wrong; couldn't log you out."
        });
    })
}

export const forgotPassword = (FormData) => dispatch => { 
    const configs = {
        headers: {
          'Content-Type': 'application/json'
        }
    };

    const requestBody = JSON.stringify({...FormData});

    axios.put('/api/users/forgotPassword', requestBody, configs)
    .then(res => {
        dispatch({
            type: UserConstants.USER_AWAITING_PASSWORD_RESET_VERIFICATION,
            msg: res.data.msg,
            userInfo: {
                name: res.data.curUser.fullname, 
                email: res.data.curUser.email
            }
        })
    })
    .catch(error => {
        dispatch(returnAuthErros(error.response.data.msg, error.response.status, 'USER_PASSWORD_RESET_FAILURE'));        
        dispatch({
            type: UserConstants.USER_PASSWORD_RESET_FAILURE,
            msg: error.response.data.msg,
        })
    })
}

export const forgotPasswordVerification = (resetToken) => dispatch => {
    axios.get('/api/forgotPassword/requestVerification', {params: {resetToken}})
    .then(res => {
       dispatch({
            type: UserConstants.USER_PASSWORD_RESET_SUCCESS,
            msg: res.data.msg,
            userInfo: res.data.newPassUser
       })
    })  
    .catch(error => {
        dispatch(returnAuthErros(error.response.data.msg, error.response.status, 'USER_PASSWORD_RESET_FAILURE'));        
        dispatch({
            type: UserConstants.USER_PASSWORD_RESET_FAILURE,
            msg: error.response.data.msg,
            userInfo: null
        })
    }) 
}

export const terminateAccount = () => dispatch => {
    axios.put('/api/users/terminateAccount')
    .then(res => {
        dispatch({
            type: UserConstants.USER_AWAITING_TERMINATION,
            msg: res.data.msg,
            userInfo: res.data.user
        })
    })
    .catch(error => {
        dispatch(returnAuthErros(error.response.data.msg, error.response.status, 'USER_TERMINATION_FAILURE'));
        dispatch({
            type: UserConstants.USER_TERMINATION_FAILURE,
            msg: error.response.data.msg
        })
    })
}

export const terminateAccountVerification = (PreData, resetToken) => dispatch => {
    const configs = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const requestBody = JSON.stringify({...PreData});

    axios.get('/api/users/terminateAccount/accountTerminationValidation', {params: {resetToken}}, requestBody, configs)
    .then(res => {
        dispatch({
            type: UserConstants.USER_TERMINATION_SUCCESS,
            msg: res.data.msg,
            userInfo: null
        })
    })
    .catch(error => {
        dispatch(returnAuthErros(error.response.data.msg, error.response.status, 'USER_TERMINATION_FAILURE'));
        dispatch({
            type: UserConstants.USER_TERMINATION_FAILURE,
            msg: error.response.data.msg
        })
    })
}

export const userLoggingIn = () => {
    return {
        type: UserConstants.USER_LOGGING_IN,
        msg: "Logging in..."
    }
}

export const userLoggingOut = () => {
    return {
        type: UserConstants.USER_LOGGING_OUT,
        msg: "Logging out..."
    }
}

export const clearAuthErrors = () => {
    return {
        type: UserConstants.CLEAR_AUTH_ERRORS
    }
}

export const clearAuthState = () => {
    return {
        type: UserConstants.CLEAR_AUTH_STATE
    }
}

export const returnAuthErros = (errorMsg, authErrors, serverStatus, authState = null) => {
    return {
        type: UserConstants.GET_AUTH_ERRORS,
        msg: errorMsg,
        status: serverStatus,
        authState: authState,
        errors: authErrors
    }
}

//Image actions
export const addImage = (imgData) => dispatch => {
    dispatch({type: UserConstants.EDITING_PROFILE});

    const configs = {
        headers: {
          'Content-Type': 'application/json'
        },
        proxy: {
            host: '127.0.0.1',
            port: 5000
        }
    };

    const requestBody = JSON.stringify({...imgData});

    axios.put('/api/users/addImage', requestBody, {...configs})
    .then(res => {
        dispatch({
            type: UserConstants.EDITING_PROFILE_SUCCESS,
            msg: res.data.msg,
            user: res.data.user,
            imgData: res.data.imgData
        });
        dispatch(hashToLocalStroage(res.data.user));
    })
    .catch(error => {
        dispatch({
            type: UserConstants.EDITING_PROFILE_FAIL,
            msg: error.response.data.msg
        })
    })
}

export const deleteImage = (idx, pubId) => dispatch => {
    dispatch({type: UserConstants.EDITING_PROFILE});

    const configs = {
        headers: {
          'Content-Type': 'application/json'
        },
        proxy: {
            host: '127.0.0.1',
            port: 5000
        }
    };

    axios.put(`/api/users/deleteImage/${idx}/${pubId}`, {...configs})
    .then(res => {
        dispatch({
            type: UserConstants.EDITING_PROFILE_SUCCESS,
            msg: res.data.msg,
            user: res.data.user
        });
        dispatch(hashToLocalStroage(res.data.user));
    })
    .catch(error => {
        dispatch({
            type: UserConstants.EDITING_PROFILE_FAIL,
            msg: error.response.data.msg
        })
    })
}


export const upLoadImage = (fileData) => dispatch => {
    dispatch({type: UserConstants.UPLOADING_IMG});
    const configs = {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        proxy: {
            host: '127.0.0.1',
            port: 5000
        }
    };

    const requestBody = JSON.stringify({...fileData});
    // console.log(fileData);

    axios.post('/api/users/cloudUploadImg', fileData, {...configs})
    .then(res => {
        dispatch({
            type: UserConstants.IMG_UPLOAD_SUCCESS,
            imgData: res.data.result,
            msg: res.data.msg
        });
        dispatch(addImage(res.data.imgData));
    })
    .catch(error => {
        dispatch({
            type: UserConstants.IMG_UPLOAD_FAIL,
            msg: error.response.data.msg
        })
    })
}


//Get candidates
export const getCandidates = () => dispatch => {
    dispatch({type: UserConstants.GETTING_CANDIDATES});

    const configs = {
        headers: {
          'Content-Type': 'application/json'
        },
        proxy: {
            host: '127.0.0.1',
            port: 5000
        },
    };
    axios.get('/api/users/getCandidates', {...configs})
    .then(res => {
        dispatch({
            type: UserConstants.GETTING_CANDIDATES_SUCCESS,
            msg: res.data.msg,
            candidates: res.data.candidates
        });
    })
    .catch(error => {
        dispatch({
            type: UserConstants.GETTING_CANDIDATES_FAIL,
            msg: error.response.data.msg,
        })
    })
}