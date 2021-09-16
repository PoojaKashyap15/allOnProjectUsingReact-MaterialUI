import { Box, Divider, Tab, Tabs, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React, { useState } from 'react';



import NewWorkRequest from './NewWorkRequest';
import TabLabel from './TabLabel';


const TabPanel = props => {
  const { children, value, isSelected, ...other } = props;

  return (
    <Typography component="div" role="tabpanel" hidden={!isSelected} {...other}>
      {value && <Box p={4}>{children}</Box>}
    </Typography>
  );
};

TabPanel.propTypes = {
  children: PropTypes.node.isRequired,
  isSelected: PropTypes.bool.isRequired,
  value: PropTypes.string.isRequired
};

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    marginTop: theme.spacing(1)
  }
}));

const ProjectTab = () => {
  const classes = useStyles();
  const [value, setValue] = useState('NewWorkRequest');
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <Tabs
        value={value}
        onChange={handleChange}
        variant="fullWidth"
        indicatorColor="primary"
        textColor="inherit"
        className={classes.wrapper}
      >
        <Tab
          value="NewWorkRequest"
          label={<TabLabel name="NEW WORK REQUEST" isShow={value === 'NewWorkRequest'} />}
        />
        
      </Tabs>
      <Divider />
      <TabPanel value={value} isSelected={value === 'NewWorkRequest'}>
        <NewWorkRequest />
      </TabPanel>
      
      
      
    </div>
  );
};

export default ProjectTab;