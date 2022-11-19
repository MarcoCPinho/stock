import React from 'react';
import { Container, CustomButtom } from './styles';

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
      <CustomButtom
        label={isFeedKilled ? 'Connect' : 'Disconnect'}
        onClick={handleOnClick}
        className="p-button-primary p-button-raised p-button-rounded"
      />
    </Container>
  );
};
