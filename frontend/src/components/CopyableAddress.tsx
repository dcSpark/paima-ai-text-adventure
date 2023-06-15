import React, { useState } from 'react';
import { truncateAddress } from '@src/services/utils';
import { ButtonBase, Tooltip, Typography } from '@mui/material';
import { ContentCopy } from '@mui/icons-material';

interface Props {
  address: string;
}

const CopyableAddress = ({ address }: Props) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
  };

  return (
    <Tooltip title="Copied!" open={copied} onClose={() => setCopied(false)}>
      <ButtonBase onClick={copyToClipboard}>
        <Typography variant="caption">{truncateAddress(address)} </Typography>
        <ContentCopy sx={{ fontSize: '1.5em', verticalAlign: 'text-bottom' }} />
      </ButtonBase>
    </Tooltip>
  );
};

export default CopyableAddress;
