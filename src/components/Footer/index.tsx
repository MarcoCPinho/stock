import React from 'react';

import { Container } from './styles';

interface FooterProps {
  isFeedKilled: boolean;
  setIsFeedKilled: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Footer: React.FC<FooterProps> = ({
  isFeedKilled,
  setIsFeedKilled,
}) => {
  const handleOnClick = (): void => setIsFeedKilled(prev => !prev);

  return (
    <Container>
      <button type="button" onClick={handleOnClick}>
        {isFeedKilled ? 'Connect' : 'Disconnect'}
      </button>
    </Container>
  );
};
