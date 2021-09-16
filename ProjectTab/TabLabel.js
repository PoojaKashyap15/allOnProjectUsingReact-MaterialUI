import { Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';

const TabLabel = props => {
  const { name } = props;
  return <Typography variant="h6">{name}</Typography>;
};

TabLabel.propTypes = {
  name: PropTypes.string.isRequired
};

export default TabLabel;
