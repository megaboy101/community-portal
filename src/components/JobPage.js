import _ from 'lodash';
import React, { useContext } from 'react';
import { baseContentStyling } from './mixins';
import BusinessIcon from '@material-ui/icons/Business';
import styled from 'styled-components/macro';
import AppContext from './AppContext';
import SidebarHeader from './SidebarHeader';
import { Link, Redirect } from 'react-router-dom';
import JobCategories from './JobCategories';

import JobApply from './JobApply';

import { LinearProgress } from '@material-ui/core';
import { Parser } from 'html-to-react';
import { Helmet } from 'react-helmet';

const htmlParser = new Parser();

const MapPageJobContainer = styled.div`
  background: ${({ theme }) => theme.uiBackground};

  .company-name {
    margin: 0 0 10px;
  }

  .company-link {
    display: inline-block;
    margin-right: 20px;
    height: 26px;
    line-height: 26px;
    vertical-align: top;
    font-size: 16px;
    font-weight: 400;
    text-decoration: none;
    color: ${({ theme }) => theme.textDark};
  }

  .company-icon {
    line-height: 26px;
    vertical-align: top;
  }
`;

const JobMainContent = styled.div`
  display: flex;
  max-width: ${({ theme }) => theme.contentMaxWidth};
  margin: 0 auto;
  padding: 30px 0 0 0;
`;

const JobContent = styled.div`
  flex: 5;
  padding: 0 30px 20px;
`;

const JobSidebar = styled.div`
  flex: 2;
`;

const JobDescription = styled.div`
  ${baseContentStyling()}
`;

const CategoriesContainer = styled.div`
  display: inline-block;
`;

export const MapPageJob = ({
  history: { goBack },
  match: {
    params: { jobID }
  }
}) => {
  const { jobs, companies, jobsLoading, companiesLoading } = useContext(
    AppContext
  );

  if (jobsLoading || companiesLoading) {
    return <LinearProgress />;
  }

  const job = _.find(jobs, { id: jobID });
  const {
    title: jobTitle,
    description: jobDescription,
    categories,
    companyID
  } = job;
  const {
    name: companyName,
    logoPath: companyLogoPath = '',
    coverPath: companyCoverPath = '',
    slug: companySlug
  } = _.find(companies, { id: companyID });

  if (!jobTitle) {
    return <Redirect to="/" />;
  }

  return (
    <>
      <Helmet>
        <title>{`${companyName} - ${jobTitle}`}</title>
        <meta name="description" content={`${companyName} - ${jobTitle}`} />
        <meta name="og:title" property="og:title" content={companyName} />
        <meta
          name="og:description"
          property="og:description"
          content={jobTitle}
        />
        <meta property="og:type" content="website" />
      </Helmet>
      <MapPageJobContainer>
        <SidebarHeader
          coverPath={companyCoverPath}
          logoPath={companyLogoPath}
          coverHeight={160}
          mainImgSize={80}
          title={jobTitle}
        >
          <Link className="company-link" to={'/companies/' + companySlug}>
            <BusinessIcon className="company-icon" />
            {companyName}
          </Link>
          {categories && categories.length > 0 && (
            <CategoriesContainer>
              <JobCategories categories={categories} />
            </CategoriesContainer>
          )}
        </SidebarHeader>
        <JobMainContent>
          <JobContent>
            <JobDescription>{htmlParser.parse(jobDescription)}</JobDescription>
          </JobContent>
          <JobSidebar>
            <JobApply job={job} companyName={companyName} />
          </JobSidebar>
        </JobMainContent>
      </MapPageJobContainer>
    </>
  );
};

export default MapPageJob;
