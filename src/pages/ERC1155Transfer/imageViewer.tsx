import { Backdrop } from '@mui/material';
import { FC } from 'react';

interface Props {
  open: boolean;
  close: () => void;
  src: string;
}
const ImageViewer: FC<Props> = ({ open, close, src }) => {
  return (
    <Backdrop open={open} onClick={close} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1  }}>
      <img src={src} alt="image" />
    </Backdrop>
  )
}

export default ImageViewer;
