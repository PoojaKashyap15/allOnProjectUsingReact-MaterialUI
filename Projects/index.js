import {
  Box,
  Container,
  Divider,
  Grid,
  List,
  ListItem,
  MenuItem,
  Paper,
  Radio,
  Select,
  TextField,
  Typography
} from '@material-ui/core';
import { styled } from '@material-ui/core/styles';
import React, { useEffect, useMemo, useState } from 'react';

import { Card, FullScreenSpinner, Slideshow, UserProfileUpdate } from '../../components';
import fetchApi from '../../services/fetchapi';

const GridStyled = styled(Grid)(({ theme }) => ({
  marginTop: theme.spacing(2.5),
  marginBottom: theme.spacing(2)
}));

const GridContainer = styled(Grid)(({ theme }) => ({
  marginTop: theme.spacing(-8)
}));

const TypographyStyled = styled(Typography)({
  position: 'absolute',
  top: 250,
  left: 0,
  right: 0
});

const ProjectListGridStyled = styled(Grid)(() => ({
  display: 'flex'
}));

const EMPTY_FILTER = { country: null, state: null, city: null };

const ProjectList = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState();
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [projects, setProjects] = useState([]);
  const [locationFilter, setLocationFilter] = useState(EMPTY_FILTER);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [locations, setLocations] = useState([]);

  const [sortby, setSortby] = useState('a-z');

  const handleChanges = async event => {
    await setSortby(event.target.value);
    const filter = await filteredProjects.sort((a, b) => {
      const nameA = a.name.toUpperCase();
      const nameB = b.name.toUpperCase();
      if (sortby === 'a-z' || nameA > nameB) {
        return -1;
      }

      if (sortby === 'z-a' || nameA < nameB) {
        return 1;
      }
      return 0;
    });
    setFilteredProjects(filter);
  };

  useEffect(() => {
    const { country, state, city } = locationFilter;
    const filteredSuggestions = projects.filter(({ location }) => {
      let shouldSelect = true;
      if (country) {
        shouldSelect = shouldSelect && location.country.toLowerCase() === country.toLowerCase();
      }
      if (state) {
        shouldSelect = shouldSelect && location.state.toLowerCase() === state.toLowerCase();
      }
      if (city) {
        shouldSelect = shouldSelect && location.city.toLowerCase() === city.toLowerCase();
      }
      return shouldSelect;
    });
    setFilteredProjects(filteredSuggestions);
  }, [locationFilter]);

  useEffect(() => {
    setIsLoading(true);
    setRole(!!localStorage.getItem('userData') && JSON.parse(localStorage.getItem('userData')).role === '');
    fetchApi('/projects', null, 'GET')
      .then(record => {
        setFilteredProjects(record);
        setProjects(record);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [role]);

  const getCountryStateList = async () => {
    try {
      setIsLoading(true);
      const getRecord = await fetchApi('/projects/locations', null, 'GET');
      setLocations(getRecord);
    } finally {
      setIsLoading(false);
    }
  };

  useMemo(() => getCountryStateList(), []);

  const handleCountryChange = e => {
    const { value, name } = e.target;
    const filterValue = { ...locationFilter };
    filterValue[name] = value;
    const { states: filteredStates } = locations.find(({ country }) => country === value);
    setStates(filteredStates);
    filterValue.state = null;
    filterValue.city = null;
    setLocationFilter(filterValue);
  };

  const handleStateChange = e => {
    const { value, name } = e.target;
    const filterValue = { ...locationFilter };
    filterValue[name] = value;

    const { cities: filteredcCities } = states.find(({ n }) => n === value);
    setCities(filteredcCities);
    filterValue[name] = value;
    filterValue.city = null;

    setLocationFilter(filterValue);
  };

  const handleCityChange = e => {
    const { value, name } = e.target;
    const filterValue = { ...locationFilter };
    filterValue[name] = value;
    filterValue[name] = value;
    setLocationFilter(filterValue);
  };

  const handleSearch = e => {
    setLocationFilter(EMPTY_FILTER);
    const filteredSuggestions = projects.filter(
      suggestion => suggestion.name.toLowerCase().indexOf(e.target.value.toLowerCase()) > -1
    );
    setFilteredProjects(filteredSuggestions);
  };

  return (
    <GridContainer container>
      <FullScreenSpinner showLoading={!!isLoading} />
      <UserProfileUpdate isModalOpen={role} />
      <Grid item xs={12}>
        <Slideshow />
        <TypographyStyled variant="h3" color="secondary">
          <Box fontWeight={600} component="span" css={{ textTransform: 'uppercase' }}>
            Our Projects
          </Box>
        </TypographyStyled>
      </Grid>

      <Container fixed>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Paper elevation={1} square>
              <List>
                <ListItem>
                  <TextField
                    id="search"
                    label="Search"
                    size="small"
                    fullWidth
                    type="search"
                    variant="outlined"
                    onChange={handleSearch}
                  />
                </ListItem>
              </List>

              <Divider variant="middle" light />
              <List>
                <ListItem>
                  <Typography variant="h6">
                    <Box fontWeight={600} component="span" css={{ textTransform: 'uppercase' }}>
                      Country
                    </Box>
                  </Typography>
                </ListItem>
                <ListItem>
                  <Select
                    name="country"
                    value={locationFilter.country ? locationFilter.country : ''}
                    onChange={handleCountryChange}
                    renderValue={selected => selected}
                    variant="outlined"
                    size="small"
                    fullWidth
                  >
                    {locations &&
                      locations.map(item => (
                        <MenuItem value={item.country} key={item.country}>
                          <Radio color="primary" checked={locationFilter.country === item.country} />
                          {item.country}
                        </MenuItem>
                      ))}
                  </Select>
                </ListItem>
              </List>
              <Divider variant="middle" light />
              <List>
                <ListItem>
                  <Typography variant="h6">
                    <Box fontWeight={600} component="span" css={{ textTransform: 'uppercase' }}>
                      State
                    </Box>
                  </Typography>
                </ListItem>
                <ListItem>
                  <Select
                    name="state"
                    value={locationFilter.state ? locationFilter.state : ''}
                    onChange={handleStateChange}
                    renderValue={selected => selected}
                    variant="outlined"
                    size="small"
                    fullWidth
                  >
                    {states &&
                      states.map(val => (
                        <MenuItem value={val.name} key={val.name}>
                          <Radio color="primary" checked={locationFilter.state === val.name} />
                          {val.name}
                        </MenuItem>
                      ))}
                  </Select>
                </ListItem>
              </List>
              <Divider variant="middle" light />
              <List>
                <ListItem>
                  <Typography variant="h6">
                    <Box fontWeight={600} component="span" css={{ textTransform: 'uppercase' }}>
                      City
                    </Box>
                  </Typography>
                </ListItem>
                <ListItem>
                  <Select
                    name="city"
                    value={locationFilter.city ? locationFilter.city : ''}
                    onChange={handleCityChange}
                    renderValue={selected => selected}
                    variant="outlined"
                    size="small"
                    fullWidth
                  >
                    {cities &&
                      cities.map(item => (
                        <MenuItem value={item} key={item}>
                          <Radio color="primary" checked={locationFilter.city === item} />
                          {item}
                        </MenuItem>
                      ))}
                  </Select>
                </ListItem>
              </List>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={8} container>
            <GridStyled item container spacing={4} alignItems="center">
              <Grid item xs={12} sm={9}>
                <Typography variant="h5" align="justify">
                  <Box fontWeight={600}>
                    {`${filteredProjects.length} `}
                    Projects
                  </Box>
                </Typography>
              </Grid>
              <Grid item xs={12} sm={3} align="justify">
                <TextField
                  id="select"
                  select
                  label="Sort By"
                  onChange={handleChanges}
                  value={sortby}
                  fullWidth
                  variant="outlined"
                  size="medium"
                >
                  <MenuItem value="a-z"> name (A-Z)</MenuItem>
                  <MenuItem value="z-a"> name (Z-A)</MenuItem>
                </TextField>
              </Grid>
            </GridStyled>

            <Grid container spacing={4} alignItems="stretch">
              {filteredProjects.map((item, i) => {
                return (
                  <ProjectListGridStyled item xs={12} sm={6} key={Number(i)}>
                    <Card
                      imageurl={item.display_pic}
                      title={item.name.toUpperCase()}
                      description={item.short_desc}
                      projectId={item._id}
                    />
                  </ProjectListGridStyled>
                );
              })}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </GridContainer>
  );
};

export default ProjectList;
