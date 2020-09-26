import React, { useState, useContext } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import Copyright from '../layout/Copyright'
import { GlobalContext } from '../context/GlobalContext'
import { Redirect } from 'react-router-dom'
import { login } from '../actions/auth'
import {route} from '../common/Routes'

import { useSnackbar } from 'notistack';

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
        // background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        // border: 0,
        // borderRadius: 3,
        // boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
        // color: 'white',
        // height: 48,
        // padding: '0 30px',
    },
}));

export default function Login() {
    const classes = useStyles();
    
    const {dispatch, state} = useContext(GlobalContext)
    const {enqueueSnackbar} = useSnackbar()
    
    const initialState = {
        email: "",
        password: "",
        error: false,
        emailHelperText: '',
    }
    
    const [data, setdata] = useState(initialState)
    
    const onChange = e => {
        setdata({
            ...data,
            [e.target.name]: e.target.value,
            error: false,
            emailHelperText: ''
        });
    }
    
    const validate = () => {
        let re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        if(!re.test(data.email)){
            setdata({
                ...data,
                emailHelperText: 'Given email is not a valid email address.',
                error: true,
            })
            return false;
        }
        return true;
    }
    
    const onSubmit = (e) => {
        e.preventDefault();
        if(!validate()) return

        enqueueSnackbar("Logging in, please wait", {
            variant : 'info',
            persist: true
        })
        
        login(data.email, data.password)(dispatch, state)
        .then(() => {
            enqueueSnackbar("Login Successful", {
                variant : 'success',
                persist: false
            })
        })
        .catch((err) => {
            
            if(err.response.status === 422)
            {
                let message = null
                for (message of err.response.data.errors.email)
                {
                    setdata({
                        ...data,
                        error: true
                    })
                    enqueueSnackbar(message, {
                        variant : 'error',
                        persist: false
                    })
                }
            }else
            {
                setdata({
                    ...data,
                    error: true
                })
                enqueueSnackbar(err.response.data.error, {
                    variant : 'error',
                    persist: false
                })
            }
        })
    }
    
    // const context = useContext(AuthContext)
    if (state.isAuthenticated) {
        return <Redirect to={route('home')} />;
    }
    
    return (
        <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
        <Avatar className={classes.avatar}>
        <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
        Sign in
        </Typography>
        <form className={classes.form} onSubmit={onSubmit}>
        <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email Address"
        name="email"
        autoComplete="email"
        autoFocus
        onChange={onChange}
        error={data.error}
        helperText={data.emailHelperText}
        />
        <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type="password"
        id="password"
        autoComplete="current-password"
        onChange={onChange}
        error={data.error}
        />
        <FormControlLabel
        control={<Checkbox value="remember" color="primary" />}
        label="Remember me"
        />
        <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        className={classes.submit}
        >
        Sign In
        </Button>
        <Grid container>
        <Grid item xs>
        <Link href="#" variant="body2">
        Forgot password?
        </Link>
        </Grid>
        <Grid item>
        <Link href="#" variant="body2">
        {"Don't have an account? Sign Up"}
        </Link>
        </Grid>
        </Grid>
        </form>
        </div>
        <Box mt={8}>
        <Copyright />
        </Box>
        </Container>
        );
    }