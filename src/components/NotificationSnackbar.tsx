import React, { useEffect, useState } from 'react';
import {
  Button, Slide, Snackbar, SlideProps,
} from '@material-ui/core';

type Props = {
  message: string | null,
  timeout: number,
  action: ((e?: React.SyntheticEvent, reason?: string) => any) | null,
  actionUndo: (undo: boolean) => void,
};
type TransitionProps = Omit<SlideProps, 'direction'>;

// https://material-ui.com/components/snackbars/#control-slide-direction
// eslint-disable-next-line react/jsx-props-no-spreading
const getTransistion = (props: TransitionProps) => <Slide {...props} direction="up" />;

const NotificationSnackbar = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  message, timeout, action, actionUndo,
}: Props) => {
  // keep message in exit animation
  const [cachedMessage, setCacheMessage] = useState(message);

  useEffect(() => {
    if (message !== null) {
      setCacheMessage(message);
    } else {
      // protect user privacy
      setTimeout(() => setCacheMessage(null), 1000);
    }
  }, [message]);

  return (
    <Snackbar
      open={message !== null}
      onClose={action === null ? undefined : action}
      autoHideDuration={timeout}
      TransitionComponent={getTransistion}
      message={cachedMessage}
      action={(
        <Button color="secondary" size="small" onClick={() => actionUndo(true)}>
          撤销
        </Button>
      )}
    />
  );
};

export default NotificationSnackbar;
