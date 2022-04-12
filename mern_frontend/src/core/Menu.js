import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@material-ui/core';
import { IconButton } from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
import auth from './../auth/auth-helper';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Menu = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isActive = (pathname, path) => {
    return pathname == path ? { color: '#FF4081' } : { color: '#FFFFFF' };
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" color="inherit">
          MERN Skeleton
        </Typography>
        <Link to="/">
          <IconButton aria-label="Home" style={isActive(pathname, '/')}>
            <HomeIcon />
          </IconButton>
        </Link>
        <Link to="/users">
          <Button style={isActive(pathname, '/users')}>Users</Button>
        </Link>
        {!auth.isAuthenticated() && (
          <span>
            <Link to="/signup">
              <Button style={isActive(pathname, '/signup')}>Sign Up</Button>
            </Link>
            <Link to="/signin">
              <Button style={isActive(pathname, '/signin')}>Sign In</Button>
            </Link>
          </span>
        )}
        {auth.isAuthenticated() && (
          <span>
            <Link to={'/user/' + auth.isAuthenticated().user._id}>
              <Button style={isActive(pathname, '/user/' + auth.isAuthenticated().user._id)}>My Profile</Button>
            </Link>
            <Button
              color="inherit"
              onClick={() => {
                auth.clearToken(() => navigate('/'));
              }}
            >
              Sign Out
            </Button>
          </span>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Menu;
