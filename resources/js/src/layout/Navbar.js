import React, { Fragment, useContext, useEffect } from 'react'
import {Redirect, useHistory} from 'react-router-dom'

import Divider from '@material-ui/core/Divider';
import Icon from '@material-ui/core/Icon';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import {route} from '../common/Routes'
import { useSnackbar } from 'notistack';
import {loadUser, logout} from '../actions/auth'
import {GlobalContext} from '../context/GlobalContext'
import AdminBar from './AdminBar'

export default function Navbar() {

    const {state, dispatch} = useContext(GlobalContext);
    // const {enqueueSnackbar} = useSnackbar()

    useEffect(() => {
        // console.log(state.access_token)
        if((!state.isLoading) && state.access_token!== null && state.user == null){
            // to do implement load user
            loadUser(dispatch, state)
        }
    })

    return (
        <Fragment>
            {state.isAuthenticated ? <AuthLinks /> :<GuestLinks />}
            <Divider />
            {/* <List>
                {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
                    <ListItem button key={text}>
                    <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                    <ListItemText primary={text} />
                    </ListItem>
                ))}
            </List>
            <Divider />
            <List>
                {['All mail', 'Trash', 'Spam'].map((text, index) => (
                    <ListItem button key={text}>
                    <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                    <ListItemText primary={text} />
                    </ListItem>
                ))}
            </List> */}
        </Fragment>
    )
}

function GuestLinks()
{
    const history = useHistory();
    const handleClick = (uri) => {

        history.push(route('welcome'));
    }

    return (
    <List>
        <ListItem button onClick={() => handleClick(route('welcome'))}>
            <ListItemIcon>
                <Icon>login</Icon>
            </ListItemIcon>
            <ListItemText primary="Login" />
        </ListItem>
    </List>
    )
}

function AuthLinks()
{
    const history = useHistory();

    const {dispatch, state} = useContext(GlobalContext)
    const {enqueueSnackbar} = useSnackbar()

    const signOut = () => {
        logout(dispatch, state)
        .catch(err => {
            console.log(err)
            enqueueSnackbar(err.response, {
                variant : 'error',
                persist: true
            })
        })
        .then((value) => {
            enqueueSnackbar("Log Out Successful", {
                variant : 'success',
                persist: false
            })
            // console.log("it came here")
            return <Redirect to={route('welcome')} />
        })
    }

    const onClick = () => {
        history.push(route('home'));
    }

    return (
        <List>
            <ListItem button onClick={onClick}>
                <ListItemIcon>
                    <Icon>account_circle</Icon>
                </ListItemIcon>
                <ListItemText primary={state.user} />
            </ListItem>
            { state.roles.indexOf('superadministrator') !== -1 ? <AdminBar/> : null }
            <ListItem button onClick={signOut}>
                <ListItemIcon>
                    <Icon>lock</Icon>
                </ListItemIcon>
                <ListItemText primary="Log out" />
            </ListItem>
        </List>
    )
}
