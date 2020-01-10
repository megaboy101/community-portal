import React from 'react';
import styled from 'styled-components/macro';
import { NavLink } from 'react-router-dom';
import Logo from './Logo';

const HeaderContainer = styled.div`
  height: ${({ theme }) => theme.headerHeight};
  top: 0;
  left: 0;
  right: 0;
  background-color: ${({ theme }) => theme.deepNavy};

  .navigation {
    flex: 1;
    margin: 0;
    padding: 0;
    text-align: right;

    li {
      display: inline-block;
    }

    .nav-link {
      display: block;
      height: 30px;
      padding: 0 20px;
      color: white;
      text-decoration: none;
      line-height: 30px;
      font-weight: 600;

      &.active {
        color: ${({ theme }) => theme.teal};
      }
    }
  }
`;

const HeaderContent = styled.div`
  display: flex;
  width: 100%;
  height: 70px;
  align-items: center;
  align-content: space-between;
  max-width: 960px;
  margin: 0 auto;
  padding: 0 20px;
  text-align: center;
`;

export const Header = ({ className }) => (
  <HeaderContainer className={className}>
    <HeaderContent>
      <Logo />
      <ul className="navigation">
        <li>
          <NavLink className="nav-link" to="/" activeClassName="active" exact>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            className="nav-link"
            to="/companies"
            activeClassName="active"
          >
            Companies
          </NavLink>
        </li>
        <li>
          <NavLink
            className="nav-link"
            to="/jobs"
            activeClassName="active"
            exact
          >
            Jobs
          </NavLink>
        </li>
        <li>
          <NavLink
            className="nav-link"
            to="/new-to-gainesville"
            activeClassName="active"
          >
            New To Gainesville
          </NavLink>
        </li>
      </ul>
    </HeaderContent>
  </HeaderContainer>
);

export default Header;
