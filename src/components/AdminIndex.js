import React from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { firestore } from 'firebase/app';
import { NewCompanyForm } from './NewCompanyForm';
import { NewJobForm } from './NewJobForm';
import { useCollection } from 'react-firebase-hooks/firestore';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';

export const AdminIndex = () => {
  const {
    loading: companiesLoading,
    error: companiesError,
    value: companies
  } = useCollection(db.collection('companies'));
  const { loading: jobsLoading, error: jobsError, value: jobs } = useCollection(
    db.collection('jobs')
  );
  let companiesList;
  if (companiesLoading) {
    companiesList = <span>Loading Companies...</span>;
  } else if (companiesError) {
    companiesList = <span>ERROR Loading Companies</span>;
  } else {
    companiesList = (
      <List>
        {companies.docs.map(doc => {
          const {
            name,
            coordinates: { latitude, longitude } = {}
          } = doc.data();
          return (
            <ListItem key={doc.id} divider button>
              <ListItemText>
                {name}
                <Link to={`/admin/companies/${doc.id}/edit`}>
                  <IconButton>
                    <EditIcon />
                  </IconButton>
                </Link>
              </ListItemText>
            </ListItem>
          );
        })}
      </List>
    );
  }
  let jobsList;
  if (jobsLoading || companiesLoading) {
    jobsList = <span>Loading Jobs...</span>;
  } else if (jobsError) {
    jobsList = <span>ERROR Loading Jobs</span>;
  } else {
    jobsList = (
      <List>
        {jobs.docs.map(doc => {
          const { title, companyID } = doc.data();
          return (
            <ListItem key={doc.id} divider button>
              <ListItemText>
                {title}
                <Link to={`/admin/jobs/${doc.id}/edit`}>
                  <IconButton>
                    <EditIcon />
                  </IconButton>
                </Link>
              </ListItemText>
            </ListItem>
          );
        })}
      </List>
    );
  }
  const onNewCompanySubmit = ({ name, latitude, longitude }) => {
    db.collection('companies').add({
      name,
      coordinates: new firestore.GeoPoint(latitude, longitude)
    });
  };
  const onNewJobSubmit = ({ title, description, companyID, applyUrl }) => {
    db.collection('jobs').add({
      title,
      description,
      companyID,
      applyUrl
    });
  };
  return (
    <div>
      <h3>Create Company</h3>
      <NewCompanyForm onSubmit={onNewCompanySubmit} />

      <h3>Create Job</h3>
      {companies && companies.docs && (
        <NewJobForm onSubmit={onNewJobSubmit} companies={companies.docs} />
      )}

      <Grid container>
        <Grid item>
          <h3>Companies</h3>
          <Button variant="contained" color="primary">
            <AddIcon />
            Add Company
          </Button>
          {companiesList}
        </Grid>
        <Grid item>
          <h3>Jobs</h3>
          <Button variant="contained" color="primary">
            <AddIcon />
            Add Job
          </Button>
          {jobsList}
        </Grid>
      </Grid>
    </div>
  );
};
