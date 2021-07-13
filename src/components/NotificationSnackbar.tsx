import React, { useEffect, useState } from 'react';
import {
  Button, Slide, Snackbar, SlideProps, SnackbarContent, createStyles, Theme, makeStyles,
} from '@material-ui/core';

type Props = {
  message: string | null,
  timeout: number,
  action: ((e?: React.SyntheticEvent, reason?: string) => any) | null,
  actionUndo: (undo: boolean) => void,
};
type TransitionProps = Omit<SlideProps, 'direction'>;
const useStyles = makeStyles((t: Theme) => createStyles({
  snackbar: {
    bottom: 0,
    [t.breakpoints.down('xs')]: {
      left: 0,
      right: 0,
    },
  },
  snackbarContent: {
    borderRadius: 2,
    [t.breakpoints.down('xs')]: {
      borderRadius: 0,
    },
  },
}));

// https://material-ui.com/components/snackbars/#control-slide-direction
// eslint-disable-next-line react/jsx-props-no-spreading
const getTransistion = (props: TransitionProps) => <Slide {...props} direction="up" />;

const NotificationSnackbar = ({
  message, timeout, action, actionUndo,
}: Props) => {
  // keep message in exit animation
  const [cachedMessage, setCacheMessage] = useState(message);
  const classes = useStyles();

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
      key={cachedMessage}
      className={classes.snackbar}
      open={message !== null}
      onClose={action === null ? undefined : action}
      autoHideDuration={timeout}
      TransitionComponent={getTransistion}
    >
      <SnackbarContent
        className={classes.snackbarContent}
        message={cachedMessage}
        action={(
          <Button color="secondary" size="small" onClick={() => actionUndo(true)}>
            撤销
          </Button>
        )}
      />
    </Snackbar>
  );
};

export default NotificationSnackbar;
