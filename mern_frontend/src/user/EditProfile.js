import React, { useState, useEffect } from 'react';
import { makeStyles, Card, CardActions, CardContent, Button, TextField, Typography, Icon } from '@material-ui/core';
import auth from './../auth/auth-helper';
import { read, update } from './api-user.js';
import { Navigate, useParams } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: 600,
    margin: 'auto',
    textAlign: 'center',
    marginTop: theme.spacing(5),
    paddingBottom: theme.spacing(2),
  },
  title: {
    margin: theme.spacing(2),
    color: theme.palette.protectedTitle,
  },
  error: {
    verticalAlign: 'middle',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 300,
  },
  sumbit: {
    margin: 'auto',
    marginBottom: theme.spacing(2),
  },
}));

const EditProfile = () => {
  const classes = useStyles();
  const [values, setValues] = useState({
    name: '',
    password: '',
    email: '',
    open: false,
    error: '',
    redirectToProfile: false,
  });
  const jwt = auth.isAuthenticated();
  const params = useParams();
  console.log(params);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    read({ userId: params.userId }, { t: jwt.token }, signal).then((data) => {
      if (data && data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({ ...values, name: data.name, email: data.email });
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, [params.userId]);

  const clickSubmit = () => {
    const user = {
      name: values.name || undefined,
      email: values.email || undefined,
      password: values.password || undefined,
    };

    update({ userId: params.userId }, { t: jwt.token }, user).then((data) => {
      if (data && data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({ ...values, userId: data?._id, redirectToProfile: true });
      }
    });
  };

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };
  if (values.redirectToProfile) return <Navigate to={'/user/' + values.userId} />;

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography variant="h6" className={classes.title}>
          Edit Profile
        </Typography>
        <TextField id="name" label="Name" className={classes.textField} value={values.name} onChange={handleChange('name')} /> <br />
        <TextField id="email" type="email" label="Email" className={classes.textField} value={values.email} onChange={handleChange('email')} />
        <br />
        <TextField
          id="password"
          type="password"
          label="Password"
          className={classes.textField}
          value={values.password}
          onChange={handleChange('password')}
        />
        <br />
        {values.error && (
          <Typography component="p" color="error">
            <Icon color="error" className={classes.error}>
              error
            </Icon>
            {values.error}
          </Typography>
        )}
      </CardContent>
      <CardActions>
        <Button color="primary" variant="contained" onClick={clickSubmit} className={classes.submit}>
          Submit
        </Button>
      </CardActions>
    </Card>
  );
};
export default EditProfile;
