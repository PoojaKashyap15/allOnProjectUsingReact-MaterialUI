import { Box, Container, Divider, Grid, Paper, Typography } from '@material-ui/core';
import { styled } from '@material-ui/core/styles';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import Rating from '@material-ui/lab/Rating';
import React, { useEffect, useMemo, useState } from 'react';
import { useParams, withRouter } from 'react-router-dom';

import { Card, FullScreenSpinner } from '../../components';
import fetchApi from '../../services/fetchapi';
import seeddata from './data.json';
import ProjectDetailsTable from './ProjectDetailTable';
import PhaseCard from './ProjectPhaseCard';

const ImgStyled = styled('img')({
  width: '100%',
  maxHeight: 600,
  objectFit: 'fill'
});

const ContainerStyled = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(10)
}));

const ContainerWithBackgroudStyled = styled(ContainerStyled)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(10)
  }
}));

const PaperStyled = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(5)
}));

const DividerStyled = styled(Divider)(({ theme }) => ({
  margin: theme.spacing(5, 0)
}));

const TypographyStyled = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(8)
}));

const BoxStyled = styled(Box)(({ theme }) => ({
  display: 'flex',
  marginLeft: theme.spacing(-1)
}));

const GridStyled = styled(Grid)(() => ({
  display: 'flex'
}));

const ProjectDetails = () => {
  const [isLoading, setisLoading] = useState(true);
  const [projectPhase, setProjectPhase] = useState([]);
  const [projectData, setProjectData] = useState(null);
  const [projectList, setProjectList] = useState([]);
  const { projectId: projectIdFromParam } = useParams();
  const [projectId, setProjectId] = useState(projectIdFromParam);
  const [filterProjectList, setFilterProjectList] = useState([]);

  const fetchUsers = async () => {
    try {
      const [getProjectData, projectPhases, projectLists] = await Promise.all([
        fetchApi(`/projects/${projectId}`, null, 'GET'),
        fetchApi('/projects/project-phases', null, 'GET'),
        fetchApi('/projects', null, 'GET')
      ]);
      // remove detailed project
      const filterProjectListData = projectLists.filter(list => list._id !== projectId);
      setFilterProjectList(filterProjectListData);
      setProjectPhase(projectPhases);
      setProjectData(getProjectData);
      setProjectList(projectLists);
      setisLoading(false);
    } catch (e) {
      setisLoading(false);
    }
  };
  const viewProjects = id => {
    setisLoading(true);
    setProjectId(id);
  };
  // memo call ProjectId changed
  useMemo(async () => {
    const getProjectData = await fetchApi(`/projects/${projectId}`, null, 'GET');
    setProjectData(getProjectData);
    // remove detailed project
    const filterProjectListData = projectList.filter(list => list._id !== projectId);
    setFilterProjectList(filterProjectListData);
    setisLoading(false);
  }, [projectId]);

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <>
      <FullScreenSpinner showLoading={isLoading} />
      {projectData && (
        <div>
          <ImgStyled src={projectData.display_pic} />
          <ContainerStyled fixed>
            <Typography variant="h3" component="h3" gutterBottom>
              <Box fontWeight="fontWeightMedium" textAlign="left">
                {projectData.name}
                &nbsp;
                <Rating name="project-rating" value={4} readOnly />
              </Box>
            </Typography>
            <Grid container>
              <Grid item sm={6} xs={12}>
                <Typography variant="h5" component="h5" align="left" gutterBottom>
                  <BoxStyled fontWeight="fontWeightMedium" color="grey.600">
                    <LocationOnIcon color="primary" fontSize="large" />
                    &nbsp;
                    {projectData.location.city}
                  </BoxStyled>
                </Typography>
              </Grid>
              <Grid item sm={6} xs={12}>
                <Typography variant="h5" component="h5" gutterBottom align="right">
                  Status : Pending
                </Typography>
              </Grid>
            </Grid>
            <PaperStyled elevation={0}>
              <Typography variant="inherit" gutterBottom>
                <Box
                  fontWeight="fontWeightMedium"
                  lineHeight={1.8}
                  component="div"
                  textAlign="left"
                  fontFamily="fontFamily"
                >
                  {projectData.detail_desc}
                </Box>
              </Typography>
            </PaperStyled>

            <PaperStyled elevation={0}>
              <ProjectDetailsTable data={seeddata.tabledata} />
            </PaperStyled>
          </ContainerStyled>

          <ContainerWithBackgroudStyled maxWidth="xl">
            <Container fixed>
              <TypographyStyled variant="h4">Work Flow of the Project</TypographyStyled>
              <Grid container spacing={4} alignItems="stretch">
                {projectPhase.map(({ name, icon, summaries }) => {
                  return (
                    <Grid item xs={12} sm={6} md={4} key={name} style={{ display: 'flex' }}>
                      <PhaseCard title={name}>
                        <Typography color="textSecondary" variant="h3" gutterBottom>
                          <img src={icon} alt={name} />
                        </Typography>
                        <Typography variant="h4" gutterBottom>
                          {name}
                        </Typography>

                        <Typography variant="inherit">
                          <Box
                            fontWeight="fontWeightMedium"
                            color="grey.600"
                            lineHeight={1.8}
                            component="div"
                            fontFamily="fontFamily"
                          >
                            {summaries.join(', ')}
                          </Box>
                        </Typography>
                      </PhaseCard>
                    </Grid>
                  );
                })}
              </Grid>
              <DividerStyled />
              <Grid container spacing={2} alignItems="stretch">
                {seeddata.phasesdata.map(({ title }) => {
                  return (
                    <GridStyled item xs={12} sm={6} md={2} key={title}>
                      <PhaseCard>
                        <Typography color="textSecondary" gutterBottom align="right">
                          <CheckCircleOutlineIcon fontSize="large" color="primary" />
                        </Typography>
                        <Typography variant="h5" component="h5" gutterBottom>
                          {title}
                        </Typography>
                      </PhaseCard>
                    </GridStyled>
                  );
                })}
              </Grid>
            </Container>
          </ContainerWithBackgroudStyled>

          <ContainerStyled fixed>
            <TypographyStyled variant="h4">Other Projects</TypographyStyled>
            <Grid container spacing={4} alignItems="stretch">
              {filterProjectList.map((item, i) => {
                return (
                  <GridStyled item xs={12} sm={6} key={Number(i)} onClick={() => viewProjects(item._id)}>
                    <Card
                      imageurl={item.display_pic}
                      title={item.name.toUpperCase()}
                      description={item.short_desc}
                      projectId={item._id}
                    />
                  </GridStyled>
                );
              })}
            </Grid>
          </ContainerStyled>
        </div>
      )}
    </>
  );
};

export default withRouter(ProjectDetails);
