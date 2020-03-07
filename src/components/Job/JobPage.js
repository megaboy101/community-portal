import _ from 'lodash';
import React, { useContext } from 'react';
import { baseContentStyling } from '../mixins';
import BusinessIcon from '@material-ui/icons/Business';
import styled from 'styled-components/macro';
import AppContext from '../AppContext';
import Header from './Header';
import { Link, Redirect } from 'react-router-dom';
import JobCategories from './JobCategories';
import ApplyBtn from './ApplyBtn';
import { LinearProgress } from '@material-ui/core';
import { Parser } from 'html-to-react';
import { Helmet } from 'react-helmet';
import CompanyCard from './CompanyCard';
import { device } from '../device';

const htmlParser = new Parser();

const Container = styled.div`
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

const Main = styled.div`
  display: flex;
  max-width: ${({ theme }) => theme.contentMaxWidth};
  margin: 0 auto;
  padding: 30px 0 0 0;

  @media ${device.tabletPort}, ${device.mobile} {
    flex-flow: column nowrap;
  }
`;

const ContentContainer = styled.div`
  flex: 5;
  padding: 0 30px 20px;
`;

const Sidebar = styled.div`
  flex: 2;

  @media ${device.tabletPort}, ${device.mobile} {
    padding-left: 30px;
    padding-right: 30px;
  }
`;

const Description = styled.div`
  ${baseContentStyling()}
`;

const CategoriesContainer = styled.div`
  display: inline-block;
`;

export const JobPage = ({
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
    slug: companySlug,
    employeeCount: companyEmployeeCount,
    shortDescription: companyShortDescription
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

      <Container>
        <Header
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
        </Header>

        <Main>
          <ContentContainer>
            <Description>{htmlParser.parse(jobDescription)}</Description>
          </ContentContainer>

          <Sidebar>
            <ApplyBtn job={job} companyName={companyName} />
            <CompanyCard
              name={companyName}
              logo={companyLogoPath}
              employeeCount={companyEmployeeCount}
              summary={companyShortDescription}
              slug={companySlug}
            />
          </Sidebar>
        </Main>
      </Container>
    </>
  );
};

export default JobPage;
