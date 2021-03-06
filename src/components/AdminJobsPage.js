import _ from 'lodash';
import React, { useState } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import StorageAvatar from './StorageAvatar';
import Fab from '@material-ui/core/Fab';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import AddIcon from '@material-ui/icons/Add';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';

import { db } from '../firebase';
import { useAdminContainer } from './AdminPageContainer';

const sortKeys = {
  Updated: 'TSUpdated',
  Created: 'TSCreated'
};

const useStyles = makeStyles(theme => ({
  fab: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2)
  },
  container: {
    marginTop: '20px'
  },
  progress: {
    display: 'block',
    margin: 'auto'
  },
  listActions: {
    display: 'flex'
  },
  search: {
    flex: '2',
    marginRight: '20px'
  },
  sort: {
    flex: '1'
  }
}));

function ListItemLink(props) {
  return <ListItem button component="a" {...props} />;
}

export const AdminJobsPage = ({ match: { isExact } }) => {
  const classes = useStyles();
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState({ by: 'Updated', asc: false });
  const [jobs = [], loadingJobs, errorJobs] = useCollectionData(
    db.collection('jobs'),
    {
      idField: 'id'
    }
  );
  const [companies = [], loadingCompanies, errorCompanies] = useCollectionData(
    db.collection('companies'),
    {
      idField: 'id'
    }
  );

  useAdminContainer({ loading: loadingJobs || loadingCompanies });

  const companiesByID = _.keyBy(companies, company => company.id);

  const onSortChange = ({ target: { value } }) => {
    if (value === sort.by) {
      setSort({
        ...sort,
        asc: !sort.asc
      });
      return;
    }
    setSort({
      by: value,
      asc: false
    });
  };

  const sortIcon = sort.asc ? (
    <ArrowUpwardIcon fontSize="inherit" />
  ) : (
    <ArrowDownwardIcon fontSize="inherit" />
  );

  return (
    <>
      <Container className={classes.container} maxWidth="lg">
        <div className={classes.listActions}>
          <TextField
            className={classes.search}
            type="search"
            label="Search Jobs"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <FormControl className={classes.sort}>
            <InputLabel htmlFor="age-simple">Sort By</InputLabel>
            <Select
              value={sort.by}
              renderValue={value => (
                <>
                  {sortIcon} {value}
                </>
              )}
              onChange={onSortChange}
            >
              <MenuItem value="Updated">Updated</MenuItem>
              <MenuItem value="Created">Created</MenuItem>
            </Select>
          </FormControl>
        </div>
        <List>
          {jobs
            .filter(({ title, companyID, featured }) => {
              let match;
              const normalizedSearch = search.toLowerCase();
              const companyName = companiesByID[companyID]
                ? companiesByID[companyID].name
                : '';
              const isFeatured = featured ? 'featured' : '';
              match =
                title.toLowerCase().includes(normalizedSearch) ||
                companyName.toLowerCase().includes(normalizedSearch) ||
                isFeatured.includes(normalizedSearch);
              return match;
            })
            .sort((a, b) => {
              const sortAttr = sortKeys[sort.by];
              const aVal = a[sortAttr] || 0;
              const bVal = b[sortAttr] || 0;
              if (sort.asc) {
                return aVal - bVal;
              } else {
                return bVal - aVal;
              }
            })
            .map(job => {
              const company = companiesByID[job.companyID] || {};
              return (
                <ListItemLink href={`/admin/jobs/${job.id}`} key={job.id}>
                  <ListItemAvatar>
                    <StorageAvatar
                      path={company.logoPath}
                      avatarProps={{ style: { width: '40px' } }}
                    />
                  </ListItemAvatar>
                  <ListItemText primary={job.title} secondary={company.name} />
                </ListItemLink>
              );
            })}
        </List>
        {(errorJobs || errorCompanies) && (
          <CircularProgress
            value="75"
            variant="determinate"
            color="secondary"
          />
        )}
      </Container>

      <Fab
        className={classes.fab}
        color="primary"
        component={Link}
        to="/admin/jobs/new"
      >
        <AddIcon />
      </Fab>
    </>
  );
};

export default AdminJobsPage;
