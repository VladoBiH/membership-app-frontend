import React, { useState, useEffect } from 'react';
import { Edit, Person } from '@material-ui/icons';
import {
  makeStyles,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Avatar,
  IconButton,
  Typography,
  Divider,
} from '@material-ui/core';
import DeleteUser from './DeleteUser';
import auth from './../auth/auth-helper';
import { read } from './api-user.js';
import { Navigate, Link, useParams } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 600,
    margin: 'auto',
    padding: theme.spacing(3),
    marginTop: theme.spacing(5),
  },
  title: {
    marginTop: theme.spacing(3),
    color: theme.palette.protectedTitle,
  },
}));
const Profile = () => {
  const classes = useStyles();
  const [user, setUser] = useState({});
  const [redirectToSignin, setRedirectSignin] = useState(false);
  const jwt = auth.isAuthenticated();
  const params = useParams();

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    read({ userId: params.userId }, { t: jwt.token }, signal).then((data) => {
      if (data && data.error) {
        setRedirectSignin(true);
      } else {
        setUser(data);
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, [params.userId]);

  if (redirectToSignin) return <Navigate to="/signin" />;

  return (
    <Paper className={classes.root} elevation={4}>
      <Typography variant="h6" className={classes.title}>
        Profile
      </Typography>
      <List dense>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <Person />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={user.name} secondary={user.email} />
          {auth.isAuthenticated().user && auth.isAuthenticated().user._id == user._id && (
            <ListItemSecondaryAction>
              <Link to={'/user/edit/' + user._id}>
                <IconButton aria-label="Edit" color="primary">
                  <Edit />
                </IconButton>
              </Link>
              <DeleteUser userId={user._id} />
            </ListItemSecondaryAction>
          )}
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText primary={'Joined: ' + new Date(user.created).toDateString()} />
        </ListItem>
      </List>
    </Paper>
  );
};

export default Profile;
