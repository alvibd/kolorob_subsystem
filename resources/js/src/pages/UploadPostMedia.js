import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom'

import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { DropzoneArea } from 'material-ui-dropzone';

import { useSnackbar } from 'notistack';
import { GlobalContext } from '../context/GlobalContext'
import { uploadPostMedia } from '../actions/upload';
import { route } from '../common/Routes';

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
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
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

export default function UploadPostMedia(props) {

    const classes = useStyles();

    const history = useHistory()

    const initialState = {
        post: props.match.params.id,
        file_types: ['.pdf', 'video/*', 'image/*'],
        file_type: '.pdf',
        files: [],
    }

    const [data, setdata] = useState(initialState)
    
    const {dispatch, state} = useContext(GlobalContext)
    const {enqueueSnackbar} = useSnackbar()

    const onSelect = (e) => {
        setdata({
            ...data,
            file_type: e.target.value
        })
    }

    const onSubmit = (e) => {
        e.preventDefault()

        enqueueSnackbar('Uploading file(s), please wait for redirection....', {
            variant : 'info',
            persist: true
        })

        uploadPostMedia(state, dispatch, formData(), data.post).then((res) => {
            enqueueSnackbar(res.data.message, {
                variant : 'success',
                persist: false
            })

            history.push(route('home'))

        }).catch((err) => {
            showError(err)
        })
    }

    const formData = () => {
        const formData = new FormData();

        formData.append('file_type', data.file_type);
        data.files.forEach((file) => {
            formData.append('files[]', file, file.name)
        })

        return formData
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
                    Upload file(s)
                </Typography>
            </div>
            <form className={classes.form} 
            onSubmit={onSubmit}
            >
                <FormControl variant="outlined" required className={classes.formControl} 
                // error={data.sexError}
                >
                    <InputLabel id="demo-simple-select-outlined-label">File Type</InputLabel>
                    <Select
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    name="file_type"
                    value={data.file_type}
                    onChange={onSelect}
                    label="fileType"
                    >
                        {data.file_types.map((element, index) => (
                            <MenuItem value={element} key={index} selected={index === 0 ? true : false}>{element}</MenuItem>
                        ))}
                        {/* <MenuItem value={'.pdf'}>pdf</MenuItem>
                        <MenuItem value={'video/*'}>video</MenuItem>
                        <MenuItem value={'image/*'}>image</MenuItem> */}
                    </Select>
                    {/* <FormHelperText>{data.sexHelperText}</FormHelperText> */}
                </FormControl>
                <DropzoneArea
                acceptedFiles={[data.file_type]}
                dropzoneText={"Drag and drop an file here or click"}
                onChange={(files) => setdata({...data, files: files})}
                maxFileSize={30000000}
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
