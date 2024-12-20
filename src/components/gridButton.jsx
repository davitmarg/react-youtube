import styled from 'styled-components';

const ButtonWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    padding: 10px;
    box-sizing: border-box;
  
`;

const Button = styled.button`
  background-color: #6d95bd;
  color: white;
  font-size: 120px;
  width: 100%;
  height: 100%;
  border-radius: 30%;
  border: none;
  cursor: pointer;
  box-shadow: 1px 5px 6px rgba(0, 0, 0, 0.6);
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {
    background-color: #84bcf5;
    transform: scale(1.1);
  }

  &:focus {
    outline: none;
  }
`;

export default function GridButton({ onClick, children }) {
  return (
    <ButtonWrapper>
      <Button onClick={onClick}>{children}</Button>
    </ButtonWrapper>
  );
}
