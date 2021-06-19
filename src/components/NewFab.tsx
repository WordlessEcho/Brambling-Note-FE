import React from 'react';
import {
  Fab, createStyles, Theme, makeStyles,
} from '@material-ui/core';
import Edit from '@material-ui/icons/Edit';

const useStyles = makeStyles((t: Theme) => createStyles({
  fab: {
    position: 'fixed',
    bottom: t.spacing(2),
    right: t.spacing(2),
  },
}));

const NewFab = ({ showNoteForm }: { showNoteForm: () => void }) => {
  const classes = useStyles();

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
