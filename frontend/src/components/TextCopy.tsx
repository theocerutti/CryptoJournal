import React, { useCallback, useState } from 'react';
import { Link, Tooltip } from '@chakra-ui/react';
import { copyToClipboard } from '../utils/clipboard';
import { PlacementWithLogical } from '@chakra-ui/popper';

const TextCopy = ({
  children,
  tooltipMessage,
  tooltipPlacement,
  className = '',
  animation = true,
  ...props
}: {
  children: string;
  tooltipMessage?: string;
  tooltipPlacement?: PlacementWithLogical;
  className?: string;
  animation?: boolean;
}) => {
  const [bouncing, setBouncing] = useState(false);

  const handleCopy = () => {
    copyToClipboard(children).then(() => {
      setBouncing(true);
      setTimeout(() => setBouncing(false), 500);
    });
  };

  const buildClass = useCallback(() => {
    let containerClass = '';
    if (animation) {
      containerClass += `hvr-fade ${
        bouncing ? 'animate__animated animate__pulse animate__repeat-1 animate__faster' : ''
      }`;
    }
    return `${containerClass} ${className}`;
  }, [animation, bouncing, className]);

  return (
    <div className={buildClass()} onClick={handleCopy}>
      <Link {...props}>
        <Tooltip label={tooltipMessage || 'Copy'} placement={tooltipPlacement || 'top'}>
          <span>{children}</span>
        </Tooltip>
      </Link>
    </div>
  );
};

export default TextCopy;
