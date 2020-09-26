import React, { Fragment } from 'react'
import { useHistory } from 'react-router-dom'

import Icon from '@material-ui/core/Icon';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import {route} from '../common/Routes'

export default function AdminBar() {

    const history = useHistory();

    const handleClick = (uri) => {
        // e.preventDefault()
        // let history = useHistory();
        history.push(uri);

        // return <Redirect to={uri} />
    }

    return (
        <Fragment>
            <ListItem button onClick={() => handleClick(route('create_post'))}>
                <ListItemIcon>
                    <Icon>description</Icon>
                </ListItemIcon>
                <ListItemText primary="Create Content" />
            </ListItem>
        </Fragment>
    )
}
