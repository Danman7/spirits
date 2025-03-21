import { transitionMixin } from 'src/shared/styles/mixins'
import styled from 'styled-components'

export const StyledLink = styled.button`
  ${transitionMixin}
  border: none;
  background: none;
  display: inline-block;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 700;
  transition-property: all;
  margin: 0;
  padding: 0;
  z-index: 2;

  &:hover {
    scale: 1.1;
    text-decoration: underline;
  }

  &:active {
    scale: 0.9;
  }
`
