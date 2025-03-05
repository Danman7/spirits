import styled from 'styled-components'

export const StyledLink = styled.button`
  border: none;
  background: none;
  display: inline-block;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 700;
  transition: ${({ theme }) => `all ${theme.transitionTime}`};
  margin: 0;
  padding: 0;

  &:hover {
    scale: 1.1;
    text-decoration: underline;
  }

  &:active {
    scale: 0.9;
  }
`
