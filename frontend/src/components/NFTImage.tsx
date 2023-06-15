import { Box } from '@mui/material';
import React from 'react';

interface NFTImageProps {
  src: string;
  label?: React.ReactNode;
  onImageClick?: () => void;
}

const NFTImage = ({ src, label }: NFTImageProps) => {
  return (
    <Box display="flex" flexDirection="column">
      <img alt="nft" src={src} style={{ maxWidth: '300px', maxHeight: '300px', margin: 'auto' }} />
      {label}
    </Box>
  );
};

export default NFTImage;
