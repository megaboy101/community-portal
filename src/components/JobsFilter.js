import _ from 'lodash';
import React, { useState } from 'react';
import styled from 'styled-components/macro';
import { useCollection } from 'react-firebase-hooks/firestore';
import { db } from '../firebase';
import { clearFix } from 'polished';
import Checkbox from './Checkbox';
import SearchInput from './SearchInput';
import Dropdown from './Dropdown';

const JobsFilterContainer = styled.div`
  margin-bottom: 30px;
  text-align: left;
  clear: both;

  .filter-label {
    display: inline-block;
    height: 30px;
    margin-right: 10px;
    line-height: 30px;
  }
`;

const FilterTitle = styled.h3`
  margin-bottom: 10px;
  line-height: 20px;
  font-size: 0.6rem;
  text-transform: uppercase;
  font-family: benton-sans-wide;
  font-weight: 500;
  border-bottom: solid 1px ${({ theme }) => theme.uiBorder};
`;

const FilterItem = styled.div`
  display: inline-block;
  margin-right: 10px;
`;

const CategoriesContainer = styled.div`
  width: 260px;
  max-height: 260px;
  padding: 20px 10px 10px;
  text-align: left;
  background: white;
  overflow: auto;
  box-shadow: 3px 0 13px 0 rgba(0, 0, 0, 0.15);
  border-radius: 3px;
  ${clearFix()}
`;

const DropdownTitle = styled.h6`
  margin: 0 0 5px 5px;
  font-size: 0.7rem;
  font-family: benton-sans-wide;
  font-weight: 500;
  text-transform: uppercase;
`;

const CategoriesDivider = styled.div`
  height: 1px;
  background-color: ${({ theme }) => theme.uiBorder};
  margin: 5px 0;
`;

const FilterControls = styled.div``;

const CheckContainer = styled.div``;

const noop = () => {};

const JobsFilter = ({ onChange = noop, filter }) => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [categoriesValue, categoriesLoading, categoriesError] = useCollection(
    db.collection('jobCategories')
  );

  if (categoriesLoading || categoriesError) {
    return false;
  }
  const categoriesSrc = categoriesValue.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
  const renderCategories = _.filter(
    categoriesSrc,
    category => !category.parentID
  );
  const renderSelectedCategories = _.filter(
    categoriesSrc,
    category =>
      !category.parentID && selectedCategories.indexOf(category.id) > -1
  );

  const onCategoryChange = ({ target: { checked, value } }) => {
    let newCategories;
    if (checked) {
      newCategories = _.concat(selectedCategories, value);
    } else {
      newCategories = _.without(selectedCategories, value);
    }
    setSelectedCategories(newCategories);
    onChange({
      categories: newCategories
    });
  };

  const onTypeChange = ({ target: { checked, value } }) => {
    let newTypes;
    if (checked) {
      newTypes = _.concat(selectedTypes, value);
    } else {
      newTypes = _.without(selectedTypes, value);
    }
    setSelectedTypes(newTypes);
    onChange({
      types: newTypes
    });
  };

  let categoriesBtnLabel = 'Categories';
  if (selectedCategories.length) {
    categoriesBtnLabel += ` (${selectedCategories.length})`;
  }

  return (
    <JobsFilterContainer>
      <FilterTitle>Filter By</FilterTitle>
      <FilterControls>
        <FilterItem>
          <Dropdown btnLabel={categoriesBtnLabel}>
            <CategoriesContainer>
              <DropdownTitle>Job Categories</DropdownTitle>
              {renderSelectedCategories.map(({ name, id }) => (
                <CheckContainer>
                  <Checkbox
                    label={name}
                    value={id}
                    onChange={onCategoryChange}
                    checked={selectedCategories.indexOf(id) > -1}
                    key={id}
                  />
                </CheckContainer>
              ))}
              {renderSelectedCategories &&
                renderSelectedCategories.length > 0 && <CategoriesDivider />}
              {renderCategories.map(({ name, id }) => (
                <CheckContainer>
                  <Checkbox
                    label={name}
                    value={id}
                    onChange={onCategoryChange}
                    checked={selectedCategories.indexOf(id) > -1}
                    key={id}
                  />
                </CheckContainer>
              ))}
            </CategoriesContainer>
          </Dropdown>
        </FilterItem>
        <FilterItem>
          <Dropdown btnLabel="Type">
            <CategoriesContainer>
              <DropdownTitle>Job Type</DropdownTitle>
              <CheckContainer>
                <Checkbox
                  label="Full Time"
                  value="fullTime"
                  onChange={onTypeChange}
                  checked={selectedTypes.indexOf('fullTime') > -1}
                />
              </CheckContainer>
              <CheckContainer>
                <Checkbox
                  label="Part Time"
                  value="partTime"
                  onChange={onTypeChange}
                  checked={selectedTypes.indexOf('partTime') > -1}
                />
              </CheckContainer>
            </CategoriesContainer>
          </Dropdown>
        </FilterItem>
        <FilterItem>
          <SearchInput
            placeholder="Search Jobs"
            name="filter"
            onChange={value => onChange({ search: value })}
          />
        </FilterItem>
      </FilterControls>
    </JobsFilterContainer>
  );
};

export default JobsFilter;
