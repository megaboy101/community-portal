import React from 'react';
import styled from 'styled-components/macro';
import { Link } from 'react-router-dom';

const LogoContainer = styled.div`
  display: block;
  padding: 10px 30px;
  text-decoration: none;
  background-color: ${({ theme }) => theme.lightBlue};

  .logo-link {
    display: block;
    text-decoration: none;
  }
`;

const LogoText = styled.span`
  flex: 0;
  font-family: 'Montserrat', sans-serif;
  font-size: 22px;
  font-weight: 700;
  color: ${({ theme }) => theme.textDark};
`;

const Logo = () => (
  <LogoContainer>
    <Link className="logo-link" to="/">
      <LogoText>startGNV</LogoText>
    </Link>
  </LogoContainer>
);

export default Logo;
