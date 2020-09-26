import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { useHistory } from 'react-router-dom'

import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import ButtonBase from '@material-ui/core/ButtonBase';
import { makeStyles } from '@material-ui/core';
import { GlobalContext } from '../context/GlobalContext';
import { CoffeeLoading } from 'react-loadingg';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    contentList: {
        margin: theme.spacing(0),
    },
    paper: {
        padding: theme.spacing(2),
        margin: 'auto',
        minWidth: 230,
    },
    image: {
        width: 128,
        height: 128,
    },
    img: {
        margin: 'auto',
        display: 'block',
        maxWidth: '100%',
        maxHeight: '100%',
    },
}))

export default function Home() {
    const classes = useStyles();

    const history = useHistory()

    const initialState = {
        contents: [],
        pagination: [],
        isLoading : true,
    }

    const {state} = useContext(GlobalContext)

    const [data, setData] = useState(initialState)

    useEffect(() => {

        const CancelToken = axios.CancelToken;
        const source = CancelToken.source();

        const config = {
            headers: {
                'Content-Type': 'application/json',
                // 'Access-Control-Expose-Headers': ['*', 'Authorization'],
                // 'Access-Control-Request-Headers': 'Authorization',
                'Accept': 'application/json',
            },
        };

        const getContents = () => {
            return axios.get('/api/contents', {cancelToken: source.token}, config)
            .then((res) => {
                console.log(res)
                setData({
                    ...data,
                    contents: res.data.data,
                    isLoading: false,
                    pagination: res.data.meta
                })
            })
        }

        getContents()

        return (() => {
            source.cancel('Operation canceled by the user.');
        })

    },[])

    const handleView = (e) => {
        // console.log(e.target.dataset.id)
        history.push('/content/'+e.target.dataset.id)
    }

    const ContentList = data.contents.map((content) =>
        <Grid item xs={12} md={4} key={content.id}>
            <Paper className={classes.paper}>
                <Grid container spacing={3} justify="space-evenly">
                    <Grid item xs={12} md={4}>
                        <ButtonBase className={classes.image}>
                        <img
                        className={classes.img}
                        alt="complex"
                        src={content.thumbnail.file_type === 'image'? '/media/small/'+content.thumbnail.file_name: '/file.png'}
                        />
                        </ButtonBase>
                    </Grid>
                    <Grid item xs={12} md={6} container>
                        <Grid item xs container direction="column" spacing={2}>
                            <Grid item xs>
                                <Typography gutterBottom variant="subtitle1">
                                {content.caption}
                                </Typography>
                                <Typography variant="body2" gutterBottom>
                                Description: {content.description}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                view count: {content.view_count}
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="body2" style={{ cursor: 'pointer' }} data-id={content.id}>
                                Edit
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="subtitle1" style={{ cursor: 'pointer' }} onClick={handleView} data-id={content.id}>View</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>
        </Grid>
    )

    return (
        <div className={classes.root}>
            <Grid container>
                <Grid item xs={12}>
                    <Typography paragraph>
                        Welcome to Kolorob Dashboard
                    </Typography>
                </Grid>
            </Grid>
            <Divider variant="middle" />
            <Grid container spacing={2} className={classes.contentList}>
                {data.isLoading === true ? <CoffeeLoading /> : ContentList}
            </Grid>
        </div>
    )
}
