import { Box, Button, Grid, TextField, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { useState } from 'react';
import { FullScreenSpinner } from '../../components';
import {MuiPickersUtilsProvider,KeyboardDatePicker} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
//import KeyboardDatePicker  from '@material-ui/pickers';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(3)
  }
}));

const formFields = {
  typeOfWork: null,
  typeOfResources: null,
  noOfPeople: null,
  startDate: null,
  endDate: null,
  workDescription: null
};

const NewWorkRequest = () => {
  const [isLoading] = useState(false);
  const [formValue] = useState(formFields);

  // eslint-disable-next-line consistent-return
  const submitForm = async () => { };

  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Grid container spacing={4}>
        <FullScreenSpinner showLoading={!!isLoading} />
        <Grid item xs={14} sm={12}>
          <Typography variant="h5" align="center">
            <Box fontWeight={500}>CREATE NEW WORK ORDER</Box>
          </Typography>
        </Grid>

        <Grid item xs={9} sm={4}>
          <Typography fontSize={20} align="left">
            <Box fontWeight={600}>Type of Work</Box>
          </Typography>
        </Grid>

        <Grid item xs={16} sm={8} align="start">
          <TextField
            margin="dense"
            id="typeOfWork"
            name="typeOfWork"
            value={formValue.typeOfWork || ''}
            type="text"
            variant="outlined"
            fullWidth
          />
        </Grid>

        <Grid item xs={9} sm={4}>
          <Typography fontSize={20} align="left">
            <Box fontWeight={600}>Type of Resources Required</Box>
          </Typography>
        </Grid>

        <Grid item xs={16} sm={8} align="start">
          <TextField
            margin="dense"
            id="typeOfResources"
            name="typeOfResources"
            value={formValue.typeOfResources || ''}
            type="text"
            variant="outlined"
            fullWidth
          />
        </Grid>

        <Grid item xs={9} sm={4}>
          <Typography fontSize={20} align="left">
            <Box fontWeight={600}>No. of People Required</Box>
          </Typography>
        </Grid>

        <Grid item xs={14} sm={8} align="start">
          <TextField
            margin="dense"
            id="noOfPeople"
            name="noOfPeople"
            value={formValue.noOfPeople || ''}
            type="number"
            variant="outlined"
            fullWidth
          />
        </Grid>

        <Grid item xs={9} sm={4}>
          <Typography fontSize={20} align="left">
            <Box fontWeight={600}>Start Date</Box>
          </Typography>
        </Grid>

        <Grid item xs={14} sm={8}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardDatePicker
          disableToolbar
          variant="inline"
          format="dd/MM/yyyy"
          margin="normal"
          fullWidth
          id="startDate"
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
         </MuiPickersUtilsProvider>
        </Grid>

        <Grid item xs={9} sm={4}>
          <Typography fontSize={20} align="left">
            <Box fontWeight={600}>End Date</Box>
          </Typography>
        </Grid>

        <Grid item xs={14} sm={8}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardDatePicker
          disableToolbar
          variant="inline"
          format="dd/MM/yyyy"
          margin="normal"
          fullWidth
          id="endDate"
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
         </MuiPickersUtilsProvider>
        </Grid>

        <Grid item xs={9} sm={4}>
          <Typography fontSize={20} align="left">
            <Box fontWeight={600}>Work Description</Box>
          </Typography>
        </Grid>

        <Grid item xs={14} sm={8} align="start">
          <TextField
            id="workDescription"
            value={formValue.workDescription || ''}
            name="workDescription"
            variant="outlined"
            fullWidth
          />
        </Grid>

        <Grid item xs={10} sm={5} align="start" />

        <Grid item xs={14} sm={7} align="right">
          <Button color="primary" size="large" onClick={submitForm} variant="contained" disabled={!!isLoading}>
            SUBMIT
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default NewWorkRequest;
