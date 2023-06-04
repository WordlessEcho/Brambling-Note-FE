import React, { useEffect, useState } from 'react';
import {
  Button, Slide, Snackbar, SlideProps, SnackbarContent,
} from '@mui/material';

type Props = {
  message: string | null,
  timeout: number,
  actionUndo: (() => void) | null,
  hideSnackbar: (() => any),
};
type TransitionProps = Omit<SlideProps, 'direction'>;

// https://material-ui.com/components/snackbars/#control-slide-direction
// eslint-disable-next-line react/jsx-props-no-spreading
const getTransistion = (props: TransitionProps) => <Slide {...props} direction="up" />;

const NotificationSnackbar = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  message, timeout, actionUndo, hideSnackbar,
}: Props) => {
  // keep message in exit animation
  const [cachedMessage, setCacheMessage] = useState(message);
  const [cachedUndo, setCacheUndo] = useState<(() => void) | null>(null);

  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    hideSnackbar();
  };

  useEffect(() => {
    if (message !== null) {
      setCacheMessage(message);
    } else {
      // keep message in exit animation
      setTimeout(() => setCacheMessage(null), 1000);
    }
  }, [message]);

  useEffect(() => {
    if (actionUndo) {
      const withUndo = () => {
        try {
          actionUndo();
        } finally {
          hideSnackbar();
        }
      };

      // idk why I have to make it as arrow function, but it works
      // see handleNoteDelete() in index.tsx
      setCacheUndo(() => withUndo);
    } else {
      // keep undo button in exit animation
      setTimeout(() => setCacheUndo(null), 1000);
    }
  }, [actionUndo]);

  return (
    <Snackbar
      key={cachedMessage}
      sx={[
        { bottom: 0 },
        (theme) => ({
          [theme.breakpoints.down('xs')]: {
            borderRadius: 0,
          },
        }),
      ]}
      open={message !== null}
      onClose={handleClose}
      autoHideDuration={timeout}
      TransitionComponent={getTransistion}
    >
      <SnackbarContent
        sx={[
          { borderRadius: 2 },
          (theme) => ({
            [theme.breakpoints.down('xs')]: {
              left: 0,
              right: 0,
            },
          }),
        ]}
        message={cachedMessage}
        action={cachedUndo ? (
          <Button
            color="secondary"
            size="small"
            onClick={cachedUndo}
          >
            撤销
          </Button>
        ) : null}
      />
    </Snackbar>
  );
};

export default NotificationSnackbar;
