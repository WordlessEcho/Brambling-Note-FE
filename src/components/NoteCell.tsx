import React, { useState } from 'react';
import {
  IconButton, TableCell, TableRow, makeStyles,
} from '@material-ui/core';
import Flag from '@material-ui/icons/Flag';
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';

import { NewNote, Note } from '../types';
import NoteDetails from './NoteDetails';

type Props = {
  note: Note,
  updateNote: (id: string, newNote: NewNote) => Promise<void>,
  deleteNote: (id: string) => Promise<void>,
};

const useStyles = makeStyles(() => ({
  // See: https://material-ui.com/components/tables/#collapsible-table
  hideBoraderLine: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
}));

const NoteCell = ({ note, updateNote, deleteNote }: Props) => {
  const {
    id, content, important, date,
  } = note;
  const classes = useStyles();

  const [display, setDisplay] = useState(false);

  return (
    <>
      <TableRow className={classes.hideBoraderLine}>
        <TableCell>
          {content}
        </TableCell>
        <TableCell align="right">
          {new Date(date).toLocaleString()}
        </TableCell>
        <TableCell align="right">
          <IconButton
            size="small"
            aria-label="重要标记"
            aria-checked={important}
            onClick={() => updateNote(id, { ...note, important: !important })}
          >
            {important
              ? <Flag color="secondary" />
              : <Flag />}
          </IconButton>
        </TableCell>
        <TableCell align="right">
          <IconButton
            aria-label="展开此行"
            aria-checked={display}
            size="small"
            onClick={() => setDisplay(!display)}
          >
            {display ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <NoteDetails
          display={display}
          hideDetails={() => setDisplay(false)}
          note={note}
          updateNote={updateNote}
          deleteNote={deleteNote}
        />
      </TableRow>
    </>
  );
};

export default NoteCell;
