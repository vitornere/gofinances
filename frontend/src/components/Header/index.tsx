import React from 'react';

import { Link, useLocation } from 'react-router-dom';

import { Container } from './styles';

import Logo from '../../assets/logo.svg';

interface HeaderProps {
  size?: 'small' | 'large';
}

const Header: React.FC<HeaderProps> = ({ size = 'large' }: HeaderProps) => {
  const currentPath = useLocation().pathname;

  return (
    <Container size={size}>
      <header>
        <img src={Logo} alt="GoFinances" />
        <nav>
          <Link
            className={currentPath === '/' ? 'active': ''} 
            to="/"
          >Listagem</Link>
          <Link
            className={currentPath === '/import' ? 'active': ''}
            to="/import"
          >Importar</Link>
        </nav>
      </header>
    </Container>
  );
};

export default Header;
