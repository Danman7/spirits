import styled from 'styled-components'

export const CardBrowserModal = styled.div`
  position: relative;
  overflow: auto;
  height: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  width: 820px;
  padding-bottom: 2em;

  h1 {
    padding-bottom: 1em;
  }
`

export const CardBrowserModalFooter = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: ${({ theme }) => theme.padding};
  backdrop-filter: blur(10px);
`

export const CardList = styled.div`
  display: flex;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  flex-grow: 2;
  align-content: center;
`
