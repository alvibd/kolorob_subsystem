import React from 'react';
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import clsx from 'clsx';
import { makeStyles, createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Button from '@material-ui/core/Button';
import Navbar from './layout/Navbar';
import { GlobalProvider } from './context/GlobalContext';

import { SnackbarProvider } from 'notistack';

import { route } from './common/Routes';

import Login from './components/Login'
import PrivateRoutes from './common/PrivateRoutes'
import Home from './pages/Home'
import CreatePost from './pages/CreatePost'
import UploadPostMedia from './pages/UploadPostMedia'
import Content from './pages/Content';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    // background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

export default function App() {
  const classes = useStyles();
  const theme = createMuiTheme({
    palette: {
      type: 'dark',
      primary: {
        light: '#ffcb5d',
        main: '#f79a2b',
        dark: '#bf6b00',
        contrastText: '#333333',
      },
      secondary: {
        light: '#f18b3a',
        main: '#b95d02',
        dark: '#833100',
        contrastText: '#333333',
      },
    }
  });
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const notistackRef = React.createRef();
  const onClickDismiss = key => () => {
      notistackRef.current.closeSnackbar(key);
  }

  return (
    <GlobalProvider>
    <ThemeProvider theme={theme}>
    <SnackbarProvider
    maxSnack={3}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    autoHideDuration={6000}
    ref={notistackRef}
    action={(key) => (
      <Button color="inherit" onClick={onClickDismiss(key)}>
      {'Dismiss'}
      </Button>
      )}
      >
      <Router>
      <div className={classes.root}>
      <CssBaseline />
      <AppBar
      position="fixed"
      className={clsx(classes.appBar, {
        [classes.appBarShift]: open,
      })}
      >
      <Toolbar>
      <IconButton
      color="inherit"
      aria-label="open drawer"
      onClick={handleDrawerOpen}
      edge="start"
      className={clsx(classes.menuButton, {
        [classes.hide]: open,
      })}
      >
      <MenuIcon />
      </IconButton>
      <Typography variant="h6" noWrap>
      Kolorob
      </Typography>
      </Toolbar>
      </AppBar>
      <Drawer
      variant="permanent"
      className={clsx(classes.drawer, {
        [classes.drawerOpen]: open,
        [classes.drawerClose]: !open,
      })}
      classes={{
        paper: clsx({
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        }),
      }}
      >
      <div className={classes.toolbar}>
      <IconButton onClick={handleDrawerClose}>
      {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
      </IconButton>
      </div>
      <Divider />
      <Navbar />
      </Drawer>
      <main className={classes.content}>
      <div className={classes.toolbar} />
      <Switch>
      <Route exact path={route('welcome')} component={Login} />
      <PrivateRoutes exact path={route('home')} component={Home} />
      <PrivateRoutes exact path={route('create_post')} component={CreatePost} />
      <PrivateRoutes path={route('upload_post_media')} component={UploadPostMedia} />
      <PrivateRoutes path={route('view_content')} component={Content} />
      </Switch>
      </main>
      </div>
      </Router>
      </SnackbarProvider>
      </ThemeProvider>
      </GlobalProvider>
      );
    }

    // export default App;
    ReactDOM.render(<App/>, document.getElementById('app'))
