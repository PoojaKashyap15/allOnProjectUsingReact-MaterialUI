import { Container, Grid, Paper } from '@material-ui/core';
import { styled } from '@material-ui/core/styles';
import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { AddProject, DashboardTabs, ProjectTabs, SideNavbar } from '../../components/DashboardPages';

const PaperStyled = styled(Paper)({
  minHeight: '100vh'
});

const Dashboard = () => {
  return (
    <Container container>
      <Grid container alignItems="stretch" spacing={1}>
        <Grid item sm={3} component={PaperStyled}>
          <SideNavbar />
        </Grid>
        <Grid item sm={9}>
          <Switch>
            <Route exact path="/dashboard" component={DashboardTabs} />
            <Route exact path="/dashboard/project" component={ProjectTabs} />
            <Route exact path="/dashboard/addproject" component={AddProject} />
          </Switch>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
