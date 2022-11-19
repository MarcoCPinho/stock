import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  justify-content: center;
  padding: 10px;

  button {
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 15px;
    background: transparent;
    padding: 10px;
    color: #fff;
    width: 150px;
    :hover {
      border-color: grey;
      background-color: grey;
    }
    :active {
      box-shadow: inset 1px 1px rgba(255, 255, 255, 0.2);
      background-color: rgba(155, 155, 155, 0.2);
    }
  }
`;
