import React from 'react';
import { Route, Redirect } from 'react-router-dom';

// import Skeleton from '@material-ui/lab/Skeleton';

import { GlobalContext } from '../context/GlobalContext'

import { WindMillLoading } from 'react-loadingg'
import { route } from './Routes';



function PrivateRoute ({ component: Component, ...rest }) {
    // const {state} = useContext(GlobalContext)
    return <GlobalContext.Consumer>{({state}) =>
    <Route
    {...rest}
    render={(props) => {
      if (state.isLoading) {
        return <WindMillLoading />;
      } else if (!state.isAuthenticated) {
        return <Redirect to={route('welcome')} state={state}/>;
      } else {
        return <Component {...props} />;
      }
    }}
  />
  }</GlobalContext.Consumer>

    // return <Route
    //   {...rest}
    //   render={(props) => {
    //     if (state.isLoading) {
    //       return <WindMillLoading />;
    //     } else if (!state.isAuthenticated) {
    //       return <Redirect to={route('welcome')} />;
    //     } else {
    //       return <Component {...props} />;
    //     }
    //   }}
    // />
}

export default PrivateRoute