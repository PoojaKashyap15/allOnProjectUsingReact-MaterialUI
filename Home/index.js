import './scroll.css';

import { Container, Grid, Paper, Typography } from '@material-ui/core';
import { styled } from '@material-ui/core/styles';
import { withSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import * as Scroll from 'react-scroll';

import { About, Concerns, Ourmission } from '../../components/homeSection';
import { useAuth } from '../../hooks';

const { Link, Element, Events } = Scroll;

const Divstyled = styled('div')(({ theme }) => ({
  position: 'absolute',
  zIndex: 2,
  top: '50%',
  width: '100%',
  marginTop: -theme.spacing(8) + 2
}));

const Paperstyled = styled(Paper)({
  position: 'relative',
  height: '100%',
  width: '100%'
});

const SlidePoints = styled(Container)(({ theme }) => ({
  position: 'absolute',
  bottom: theme.spacing(10),
  zIndex: 3,
  backgroundColor: 'transparent',
  '& .slidePointGrid': {
    textAlign: 'left'
  },
  '& img': {
    height: '60px',
    width: '60px',
    marginTop: theme.spacing(1) - 2
  },
  [theme.breakpoints.down('sm')]: {
    display: 'none'
  }
}));

const ShadowCont = styled(Paper)(({ theme }) => ({
  overflow: 'hidden',
  marginTop: theme.spacing(8),
  height: 'auto',
  maxHeight: '62vh',
  '& img': { maxHeight: 'inherit' },
  [theme.breakpoints.down('sm')]: {
    maxHeight: 'initial',
    maxWidth: '90%',
    margin: 'auto',
    marginTop: theme.spacing(2.5),
    '& img': { maxWidth: '100%' }
  }
}));

const ElementStyled = styled(Element)({
  height: '100vh',
  overflow: 'hidden',
  justifyContent: 'center',
  alignItems: 'center',
  display: 'flex'
});

const ElementStyledBanner = styled(ElementStyled)(({ theme }) => ({
  marginTop: theme.spacing(-8)
}));

const ElementStyledMission = styled(ElementStyled)(({ theme }) => ({
  marginTop: theme.spacing(5),
  [theme.breakpoints.down('sm')]: {
    height: 'auto'
  }
}));

const TabStyled = styled('ul')(({ theme }) => ({
  position: 'fixed',
  top: '50%',
  left: theme.spacing(3) + 1,
  listStyle: 'none',
  margin: 0,
  padding: 0,
  marginTop: -theme.spacing(15),
  zIndex: 9,
  '& li': {
    marginBottom: theme.spacing(1) + 2,
    '& a': {
      fontSize: 0,
      height: '35px',
      width: '3px',
      background: theme.palette.text.primary,
      overflow: 'hidden',
      display: 'inline-block',
      cursor: 'pointer',
      transition: 'all .3s linear'
    }
  },
  '& .active': {
    background: theme.palette.primary.main,
    width: '5px'
  },
  [theme.breakpoints.down('xs')]: {
    display: 'none'
  }
}));

const Scrollviews = props => {
  const auth = useAuth();

  useEffect(() => {
    const { enqueueSnackbar, location, history } = props;
    const { search } = location;

    if (queryString.parse(search).mode === 'verifyEmail') {
      // Try to apply the email verification code.
      const actionCode = queryString.parse(search).oobCode;
      auth
        .verifyEmailAddressLink(actionCode)
        .then(() => {
          enqueueSnackbar('Email verification successful.', { variant: 'success' });
          history.push('/');
        })
        .catch(reasion => {
          const { message } = reasion;
          enqueueSnackbar(message, { variant: 'error' });
        });
    }
    Events.scrollEvent.register('begin', () => {});
    Events.scrollEvent.register('end', () => {});
    return () => {
      Events.scrollEvent.register('begin', () => {});
      Events.scrollEvent.register('end', () => {});
    };
  });

  return (
    <>
      <TabStyled className="tablink">
        <li>
          <Link activeClass="active" to="Homebanner" spy smooth duration={1000}>
            Home
          </Link>
        </li>
        <li>
          <Link activeClass="active" to="workprocess" spy smooth duration={1000}>
            Work Process
          </Link>
        </li>
        <li>
          <Link activeClass="active" to="whoweare" spy smooth duration={1000}>
            Who We Are
          </Link>
        </li>
        <li>
          <Link activeClass="active" to="ourmission" spy smooth duration={1000}>
            Our Mission
          </Link>
        </li>
        <li>
          <Link activeClass="active" to="concerns" spy smooth duration={1000}>
            Concerns
          </Link>
        </li>
      </TabStyled>

      <ElementStyledBanner name="Homebanner">
        <Paperstyled elevation={0}>
          <img
            src="/assets/images/image_hero_banner.png"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            alt=""
          />
          <Divstyled>
            <Typography variant="h4" gutterBottom>
              ALLOn
            </Typography>
            <Typography variant="h3" gutterBottom>
              Solar Panels
            </Typography>
          </Divstyled>
        </Paperstyled>

        <SlidePoints fixed elevation={0}>
          <Grid container wrap="nowrap" direction="row" justify="center" alignItems="center" spacing={1}>
            <Grid container item xs={12} spacing={3}>
              <Grid container wrap="nowrap" spacing={2} className="slidePointGrid">
                <Grid item>
                  <img src="/assets/icons/icon_project.svg" alt="" />
                </Grid>
                <Grid item xs zeroMinWidth>
                  <Typography variant="h4" color="secondary">
                    8
                  </Typography>
                  <Typography variant="h5" color="secondary">
                    Projects
                  </Typography>
                </Grid>
              </Grid>
            </Grid>

            <Grid container item xs={12} spacing={3}>
              <Grid container wrap="nowrap" spacing={2} className="slidePointGrid">
                <Grid item>
                  <img src="/assets/icons/icons_happy_clients.svg" alt="" />
                </Grid>
                <Grid item xs zeroMinWidth>
                  <Typography variant="h4" color="secondary">
                    14
                  </Typography>
                  <Typography variant="h5" color="secondary">
                    Happy Clients
                  </Typography>
                </Grid>
              </Grid>
            </Grid>

            <Grid container item xs={12} spacing={3}>
              <Grid container wrap="nowrap" spacing={2} className="slidePointGrid">
                <Grid item>
                  <img src="/assets/icons/icon_investor.svg" alt="" />
                </Grid>
                <Grid item xs zeroMinWidth>
                  <Typography variant="h4" color="secondary">
                    4
                  </Typography>
                  <Typography variant="h5" color="secondary">
                    Investors
                  </Typography>
                </Grid>
              </Grid>
            </Grid>

            <Grid container item xs={12} spacing={3}>
              <Grid container wrap="nowrap" spacing={2} className="slidePointGrid">
                <Grid item>
                  <img src="/assets/icons/icon_qualified_staff.svg" alt="" />
                </Grid>
                <Grid item xs zeroMinWidth>
                  <Typography variant="h4" color="secondary">
                    2
                  </Typography>
                  <Typography variant="h5" color="secondary">
                    Qualified Staff
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </SlidePoints>
      </ElementStyledBanner>

      <ElementStyled name="workprocess">
        <Paper elevation={0}>
          <Typography variant="h3">How Process Work</Typography>
          <ShadowCont>
            <img src="/assets/how_process_works.png" alt="" />
          </ShadowCont>
        </Paper>
      </ElementStyled>
      <ElementStyled name="whoweare">
        <About />
      </ElementStyled>

      <ElementStyledMission name="ourmission">
        <Ourmission />
      </ElementStyledMission>

      <ElementStyled name="concerns">
        <Concerns />
      </ElementStyled>
    </>
  );
};

Scrollviews.propTypes = {
  enqueueSnackbar: PropTypes.func.isRequired,
  location: PropTypes.objectOf(Object).isRequired,
  history: PropTypes.objectOf(Object).isRequired
};

export default withRouter(withSnackbar(Scrollviews));
