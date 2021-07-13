import React from 'react';
import {
  Fab, createStyles, Theme, makeStyles,
} from '@material-ui/core';
import Edit from '@material-ui/icons/Edit';

type Props = { message: string | null, showNoteForm: () => void };
const useStyles = makeStyles<Theme, { message: string | null }>((t: Theme) => createStyles({
  fab: {
    position: 'fixed',
    bottom: t.spacing(2),
    right: t.spacing(2),

    // TODO: handle multi-line snackbar
    [t.breakpoints.down('xs')]: {
      bottom: ({ message }) => (message === null ? t.spacing(2) : t.spacing(8)),
    },
  },
}));

const NewFab = ({ message, showNoteForm }: Props) => {
  const classes = useStyles({ message });

  return (
    <Fab
      color="secondary"
      aria-label="新建便签"
      className={classes.fab}
      onClick={showNoteForm}
    >
      <Edit />
    </Fab>
  );
};

export default NewFab;
