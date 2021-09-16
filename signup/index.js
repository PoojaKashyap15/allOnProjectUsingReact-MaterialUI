import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormHelperText,
  Grid,
  Link,
  TextField,
  Typography
} from '@material-ui/core';
import { makeStyles, styled } from '@material-ui/core/styles';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

import { CircularSpinner, Logo, SocialLoginButton } from '../../components';
import { useAuth } from '../../hooks';
import fetchApi from '../../services/fetchapi';

const TextFieldstyled = styled(TextField)({
  marginTop: 0,
  marginBottom: 0
});

const FormStyled = styled('form')(({ theme }) => ({
  width: '100%', // Fix IE 11 issue.
  marginTop: theme.spacing(1)
}));

const GridStyled = styled(Grid)({
  textAlign: 'right'
});

const TypographyTermStyled = styled(Typography)({
  display: 'flex'
});

const useStyles = makeStyles(() => ({
  head: { textAlign: 'center' },
  newuser: {
    cursor: 'pointer'
  }
}));

const formFields = {
  email: '',
  password: '',
  fname: '',
  lname: '',
  phone: '',
  cpassword: '',
  terms: ''
};

const SignUp = ({ closeSignUp, openSignIn }) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [checkboxvalue, setCheckbox] = useState({
    terms: false
  });
  const [loading, setLoading] = React.useState(false);
  const [formvalidation, setFormvalidation] = useState(formFields);
  const [signupform, setSignupform] = useState(formFields);
  const auth = useAuth();

  // handle form validation
  const handlevalidation = () => {
    let error = false;
    const formerr = { ...formvalidation };
    if (!signupform.email) {
      error = true;
      formerr.email = 'Email is required!';
      setFormvalidation(formerr);
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(signupform.email)) {
      formerr.email = 'Invalid email address';
      setFormvalidation(formerr);
    }

    if (!signupform.password) {
      error = true;
      formerr.password = 'Password is required!';
      setFormvalidation(formerr);
    }
    if (!signupform.fname) {
      error = true;
      formerr.fname = 'First name is required!';
      setFormvalidation(formerr);
    }
    if (!signupform.phone) {
      error = true;
      formerr.phone = 'Phone no. is required!';
      setFormvalidation(formerr);
    } else if (!signupform.phone.includes('+', 0) || !(signupform.phone.length >= 8 && signupform.phone.length <= 13)) {
      error = true;
      formerr.phone = 'Phone no. is Invalid!';
      setFormvalidation(formerr);
    }
    if (!signupform.cpassword) {
      error = true;
      formerr.cpassword = 'Confirm password is required!';
      setFormvalidation(formerr);
    } else if (signupform.cpassword !== signupform.password) {
      error = true;
      formerr.cpassword = 'Password and Confirm password should be same!';
      setFormvalidation(formerr);
    }
    if (!checkboxvalue.terms) {
      error = true;
      formerr.terms = 'Please check terms & conditions!';
      setFormvalidation(formerr);
    }

    return error;
  };
  // handle input fields
  const handleChange = e => {
    const form = { ...signupform };
    const formerr = { ...formvalidation };
    form[e.target.name] = e.target.value;
    formerr[e.target.name] = '';
    setFormvalidation(formerr);
    setSignupform(form);
  };

  const signupOnfirebase = dataTosend => {
    auth
      .registerWithEmailAndPassword(dataTosend.email, dataTosend.password)
      .then(value => {
        // hit register api
        const userData = {
          auth: {
            first_name: dataTosend.fname,
            last_name: dataTosend.lname,
            email: dataTosend.email,
            phone_number: dataTosend.phone,
            password: dataTosend.password,
            social_type: 'firebase_id',
            social_id: value.uid,
            firebase_uid: value.uid
          }
        };
        // user register api
        fetchApi('/auth/register', userData, 'POST')
          .then(() => {
            // Send verification email using firebase
            auth.verifyEmailAddress().then(() => {
              enqueueSnackbar('Verification email sent, verify your email.', { variant: 'success' });
            });
            // close signup Modal
            closeSignUp();
          })
          .catch(error => {
            const { message } = error;
            enqueueSnackbar(message, { variant: 'error' });
            // remove acuout from firbase
            auth.deleteAccount();
          });
      })
      .catch(reason => {
        const { code } = reason;
        const { message } = reason;

        switch (code) {
          case 'auth/email-already-in-use':
          case 'auth/invalid-email':
          case 'auth/operation-not-allowed':
          case 'auth/weak-password':
            enqueueSnackbar(message, { variant: 'error' });
            return;

          default:
            enqueueSnackbar(message, { variant: 'error' });
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };
  // submit signup form
  const register = e => {
    e.preventDefault();
    const dataTosend = signupform;
    if (handlevalidation()) return false;
    setLoading(true);
    return signupOnfirebase(dataTosend);
  };

  const handleCheckbox = name => event => {
    setFormvalidation({ ...formvalidation, [name]: '' });
    setCheckbox({ ...checkboxvalue, [name]: event.target.checked });
  };

  return (
    <div>
      <Typography component="h1" variant="h4" className={[classes.head]}>
        <Logo color="primary" textAlign="center" />
      </Typography>
      <Typography component="h1" variant="h6">
        <Box my={2} mb={3} textAlign="center">
          Create a New Account
        </Box>
      </Typography>
      <FormStyled onSubmit={register} validate="true">
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextFieldstyled
              error={formvalidation.fname !== ''}
              required
              margin="normal"
              fullWidth
              value={signupform.fname}
              id="fname"
              label="First Name"
              name="fname"
              autoComplete="fname"
              onChange={handleChange}
              helperText={formvalidation.fname}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextFieldstyled
              margin="normal"
              fullWidth
              id="lname"
              value={signupform.lname}
              label="Last Name"
              name="lname"
              autoComplete="lname"
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextFieldstyled
              margin="normal"
              required
              error={formvalidation.email !== ''}
              fullWidth
              name="email"
              value={signupform.email}
              label="Email ID"
              type="email"
              id="email"
              autoComplete="email"
              onChange={handleChange}
              helperText={formvalidation.email}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextFieldstyled
              margin="normal"
              required
              error={formvalidation.phone !== ''}
              pattern="^\+[0-9]{8,13}$"
              title="+ followed by 8 - 13 Digits. Eg. +91123456789"
              fullWidth
              name="phone"
              value={signupform.phone}
              label="Phone No"
              type="tel"
              id="phone"
              autoComplete="phone"
              onChange={handleChange}
              helperText={formvalidation.phone}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextFieldstyled
              margin="normal"
              error={formvalidation.password !== ''}
              type="password"
              fullWidth
              required
              id="password"
              value={signupform.password}
              label="Password"
              name="password"
              autoComplete="password"
              onChange={handleChange}
              helperText={formvalidation.password}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextFieldstyled
              margin="normal"
              error={formvalidation.cpassword !== ''}
              type="password"
              value={signupform.cpassword}
              fullWidth
              required
              id="cpassword"
              label="Confirm Password"
              name="cpassword"
              autoComplete="cpassword"
              onChange={handleChange}
              helperText={formvalidation.cpassword}
            />
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={8} variant="contained">
            <Box variant="span" ml={-3 / 2} component="div" display="flex">
              <Checkbox
                checked={checkboxvalue.terms}
                name="terms"
                onChange={handleCheckbox('terms')}
                value="terms"
                color="primary"
                label=""
              />
              <TypographyTermStyled variant="inherit">
                <Box fontFamily="fontFamily" pr={1} pt={2 - 1 / 2} fontWeight={600} variant="inherit">
                  I Agree &nbsp;
                  <Link color="primary" href="/" className={classes.newuser}>
                    Terms & Conditions
                  </Link>
                </Box>
              </TypographyTermStyled>
            </Box>
            <FormControl error={!!formvalidation.terms}>
              <FormHelperText color="error">{formvalidation.terms}</FormHelperText>
            </FormControl>
          </Grid>

          <GridStyled item xs={12} sm={4}>
            <Button size="large" type="submit" variant="contained" disabled={loading} color="primary">
              {loading && <CircularSpinner />}
              Sign Up
            </Button>
          </GridStyled>
        </Grid>
        <Grid item xs={12}>
          <Typography className={classes.newuser} color="primary" variant="button">
            <Box color="primary" textAlign="center" onClick={openSignIn} mt={4} mb={3}>
              Existing User?
            </Box>
          </Typography>
        </Grid>
        <Grid variant="contained" item xs={12}>
          <Typography variant="caption" gutterBottom>
            <Box color="primary" textAlign="center" mb={2}>
              Or Sign In With
            </Box>
          </Typography>
          <SocialLoginButton closePopup={closeSignUp} />
        </Grid>
      </FormStyled>
    </div>
  );
};
SignUp.propTypes = {
  closeSignUp: PropTypes.func.isRequired,
  openSignIn: PropTypes.func.isRequired
};

export default SignUp;
