import { Box, Card, CardContent } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';

const PhaseCard = ({ children }) => {
  return (
    <Box flexDirection="row" component={Card} width={1}>
      <CardContent>{children}</CardContent>
    </Box>
  );
};
PhaseCard.propTypes = {
  children: PropTypes.node.isRequired
};

export default PhaseCard;
