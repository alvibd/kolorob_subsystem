import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'

import { Divider, Grid, GridList, GridListTile, makeStyles, Typography } from '@material-ui/core';
import { GlobalContext } from '../context/GlobalContext';
import { BatteryLoading } from 'react-loadingg';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    content: {
        margin: theme.spacing(1),
    },
    gallery: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
    },
    gridList: {
        width: 700,
        height: 500,
    },
}))

const Media = (props) => {
    const classes = useStyles()
    const {state} = useContext(GlobalContext)

    if(props.type === 'image')
    {
        const items = props.contents.map((content) => (
            <GridListTile key={content.id} cols={1}>
                <img src={state.api_url+'/media/medium/'+content.file_name} alt={content.file_type} />
            </GridListTile>
        ))

        return (
            <div className={classes.gallery}>
                <GridList cellHeight={160} className={classes.gridList} cols={3}>
                    {items}
                </GridList>
            </div>
            )
    }
    else if(props.type === 'document')
    {
        const items = props.contents.map((content) =>(
            <iframe src={"/storage/documents/"+content.file_name} className={classes.gridList}></iframe>
        ))

        return items
    }
    else
    {
        const items = props.contents.map((content) =>(
            <video constrols className={classes.gridList}>
                <source src={state.api_url+"/storage/videos/"+content.file_name} type="video/mp4" />
                Your browser does not support the video tag
            </video>
        ))

        return items
    }
}

function Content(props) {

    const classes = useStyles()

    const initialState = {
        id: props.match.params.id,
        caption: null,
        description: null,
        thumbnail: null,
        post_contents: [],
        view_count: 0,
        isLoading : true,
    }

    const [data, setData] = useState(initialState)

    const {state} = useContext(GlobalContext)

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

        const getContent = () => {
            return axios.get('/api/content/'+data.id, {cancelToken: source.token}, config)
            .then((res) => {
                console.log(res)
                setData({
                    ...data,
                    caption : res.data.data.caption,
                    description: res.data.data.description,
                    thumbnail: res.data.data.thumbnail,
                    post_contents: res.data.data.post_contents,
                    view_count: res.data.data.view_count,
                    isLoading: false,
                })
            })
        }

        getContent()

        return () => {
            source.cancel('Operation canceled by the user.');
        }
    }, [data.id, state.api_url])

    if(data.isLoading) return <BatteryLoading />

    return (
        <div className={classes.root}>
            <Grid container>
                <Grid item xs={12}>
                    <Typography variant="h3">
                        {data.caption}
                    </Typography>
                </Grid>

            </Grid>
            <Divider variant="middle" />
            {/* <Media contents={data.post_contents} type={data.thumbnail.file_type} /> */}
            <Grid container spacing={2} className={classes.content} direction="row" justify="center" alignItems="center">
                {/* {data.isLoading === true ? <BatteryLoading /> : ContentList} */}
                <Media contents={data.post_contents} type={data.thumbnail.file_type} />
            </Grid>
        </div>
    )
}

export default Content
