import { Box, Button, Grid, Link, TextField, Typography } from '@material-ui/core';
import { makeStyles, styled } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

import { CircularSpinner, Logo, SocialLoginButton } from '../../components';
import { useAuth } from '../../hooks';
import fetchApi from '../../services/fetchapi';
import SignUp from '../signup';

const useStyles = makeStyles(theme => ({
  form: {
    width: '100%'
  },
  logoLink: {
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'none',
      color: theme.palette.primary.dark
    }
  },
  logo: {
    flexGrow: 1,
    justifyContent: 'center',
    fontWeight: 'bold',
    textDecoration: 'none',
    display: 'flex'
  },
  newuser: {
    cursor: 'pointer'
  },
  socialbutton: {
    textAlign: 'center',
    paddingLeft: theme.spacing(1) + 2
  }
}));

const GridStyled = styled(Grid)(({ theme }) => ({
  marginTop: theme.spacing(2.5),
  marginBottom: theme.spacing(2.5)
}));

const FormFields = { email: '', password: '' };

const SignIn = props => {
  const classes = useStyles();

  const [loading, setLoading] = useState(false);
  const [openSignup, setOpenSignup] = useState(true);
  const [formvalues, setFormvalues] = useState(FormFields);
  const [formvalidation, setFormvalidation] = useState(FormFields);
  const auth = useAuth();

  // handle input fields
  const handleChange = e => {
    const form = { ...formvalues };
    const formerr = { ...formvalidation };
    form[e.target.name] = e.target.value;
    formerr[e.target.name] = '';
    setFormvalues(form);
    setFormvalidation(FormFields);
  };
  // handle form validation
  const handlevalidation = () => {
    let error = false;
    const formerr = { ...formvalidation };
    if (!formvalues.email) {
      error = true;
      formerr.email = 'Email is required!';
      setFormvalidation(formerr);
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(formvalues.email)) {
      error = true;
      formerr.email = 'Invalid email address';
      setFormvalidation(formerr);
    }

    if (!formvalues.password) {
      error = true;
      formerr.password = 'Password is required!';
      setFormvalidation(formerr);
    }
    return error;
  };

  const signIn = e => {
    e.preventDefault();
    if (handlevalidation()) return false;
    setLoading(true);
    return auth
      .login(formvalues.email, formvalues.password)
      .then(res => {
        const dataTosend = {
          email: formvalues.email,
          password: formvalues.password,
          social_type: 'firebase_id',
          social_id: res.uid
        };
        const formerr = { ...formvalidation };
        fetchApi('/auth/login', dataTosend, 'POST')
          .then(record => {
            // handle success
            localStorage.setItem('uid', res.uid);
            const { profile: userProfile, ...restOfData } = record;
            const { role = '', display_pic: displayPic = '' } = userProfile || {};
            const userData = { ...restOfData, role, displayPic };
            localStorage.setItem('userData', JSON.stringify(userData));

            props.handleClose();
          })
          .catch(error => {
            // handle error
            const { message } = error;
            formerr.password = message;
            setFormvalidation(formerr);
          });
      })
      .catch(reason => {
        const { code } = reason;
        const { message } = reason;
        const formerr = { ...formvalidation };
        switch (code) {
          case 'auth/invalid-email':
            formerr.email = message;
            setFormvalidation(formerr);
            break;
          case 'auth/user-disabled':
          case 'auth/user-not-found':
            formerr.email = 'This Email does not exist!';
            setFormvalidation(formerr);
            break;
          case 'auth/wrong-password':
            formerr.password = message;
            setFormvalidation(formerr);
            break;
          default:
            formerr.password = message;
            setFormvalidation(formerr);
        }
      })
      .finally(() => setLoading(false));
  };
  const { handleClose } = props;
  const openSignIn = () => {
    setOpenSignup(true);
  };
  return openSignup ? (
    <div>
      <Logo color="primary" textAlign="center" />

      <Typography variant="h6">
        <Box mt={2} textAlign="center">
          Sign in
        </Box>
      </Typography>
      <form className={classes.form} onSubmit={signIn} validate="true">
        <TextField
          error={formvalidation.email !== ''}
          validators={['required', 'isEmail']}
          errormessages={['this field is required', 'email is not valid']}
          margin="normal"
          fullWidth
          id="email"
          label="Email"
          name="email"
          autoComplete="email"
          onChange={handleChange}
          helperText={formvalidation.email}
        />
        <TextField
          margin="normal"
          fullWidth
          error={formvalidation.password !== ''}
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          helperText={formvalidation.password}
          onChange={handleChange}
        />

        <Grid container>
          <Grid item xs>
            <Link href="true" variant="body2">
              <Box textAlign="left">Forgot password?</Box>
            </Link>
          </Grid>
        </Grid>

        <GridStyled container alignItems="center">
          <Grid item xs style={{ textAlign: 'left' }}>
            <Typography className={classes.newuser} onClick={() => setOpenSignup(!openSignup)} color="primary">
              New User?
            </Typography>
          </Grid>
          <Grid item xs style={{ textAlign: 'right' }}>
            <Button type="submit" size="large" variant="contained" disabled={loading} color="primary">
              {loading && <CircularSpinner />}
              Sign In
            </Button>
          </Grid>
        </GridStyled>

        <Typography variant="caption" gutterBottom>
          <Box textAlign="center" mb={2}>
            Or Sign In With
          </Box>
        </Typography>
      </form>
      <SocialLoginButton closePopup={handleClose} />
    </div>
  ) : (
    <SignUp closeSignUp={handleClose} openSignIn={openSignIn} />
  );
};
SignIn.propTypes = { handleClose: PropTypes.func.isRequired };
export default SignIn;
