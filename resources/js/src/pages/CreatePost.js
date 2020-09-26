import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom'

import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { useSnackbar } from 'notistack';

import { GlobalContext } from '../context/GlobalContext'
import {createPost} from '../actions/posts'

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

export default function CreatePost() {
    
    const classes = useStyles()
    const history = useHistory()

    const {enqueueSnackbar} = useSnackbar()
    const {state, dispatch} = useContext(GlobalContext)

    const initialState = {
        caption: "",
        description: "",
        error: false,
        captionHelperText: '',
        descriptionHelperText: '',
    }

    const [data, setdata] = useState(initialState)

    const onChange = (e) => {
        setdata({
            ...data,
            [e.target.name]: e.target.value,
            error: false,
            captionHelperText: '',
            descriptionHelperText: ''
        });
    }

    const onSubmit = (event) => {
        event.preventDefault();

        enqueueSnackbar("Creating post, please wait ...", {
            variant : 'info',
            persist: true
        })

        createPost(state, dispatch, data.caption, data.description).then((res) => {
            console.log(res.data)

            enqueueSnackbar(res.data.message, {
                variant : 'success',
                persist: false
            })

            history.push('/upload_post_media/'+res.data.id)

        })
        .catch((err) => {
            
            setdata({
                ...data,
                error: true
            })
            showError(err)
        })
    }

    const showError = (err) => {
        let errors = []
        if(err.response.status === 422){
            let field = null
            for(field in err.response.data.errors){
                errors[field] = err.response.data.errors[field]
            }
        }
    
        let field = null
        for(field in errors)
        {
            let error= null
            for(error of errors[field]){
                enqueueSnackbar(error.replace('_', ' '), {
                  variant : 'error',
                  persist: true
                })
            }
        }
    }

    return (
        <Container component="main" maxWidth="xs">
        <CssBaseline />
            <div className={classes.paper}>
                <Typography component="h1" variant="h5">
                    Create Post
                </Typography>
            </div>
            <form className={classes.form} onSubmit={onSubmit}>
                <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="caption"
                label="Caption"
                name="caption"
                autoComplete="caption"
                autoFocus
                onChange={onChange}
                error={data.error}
                helperText={data.captionHelperText}
                />
                <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                multiline={true}
                rows={5}
                id="description"
                label="Description"
                name="description"
                autoComplete="description"
                autoFocus
                onChange={onChange}
                error={data.error}
                helperText={data.descriptionHelperText}
                />
                <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                >Save</Button>
            </form>
        </Container>
    )
}
