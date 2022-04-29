import { keyframes, styled } from '@mui/material';

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`
const RotatingBox = styled("div")({
  animation: `${spin} 2s infinite linear`
})

export default RotatingBox