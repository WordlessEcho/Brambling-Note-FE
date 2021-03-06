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
  deleteNote: (id: string) => void,
  handleNoteError: (error: Error, operation: string) => void,
};

const useStyles = makeStyles(() => ({
  // See: https://material-ui.com/components/tables/#collapsible-table
  hideBoraderLine: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
}));

const NoteCell = ({
  note, updateNote, deleteNote, handleNoteError,
}: Props) => {
  const {
    id, content, important, date,
  } = note;
  const classes = useStyles();

  const [showDetails, setShowDetails] = useState(false);

  const changeImportant = () => {
    updateNote(id, { ...note, important: !important })
      .catch((error) => handleNoteError(error, '编辑'));
  };

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
            onClick={changeImportant}
          >
            {important
              ? <Flag color="secondary" />
              : <Flag />}
          </IconButton>
        </TableCell>
        <TableCell align="right">
          <IconButton
            aria-label="展开此行"
            aria-checked={showDetails}
            size="small"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <NoteDetails
          display={showDetails}
          hideDetails={() => setShowDetails(false)}
          note={note}
          updateNote={updateNote}
          deleteNote={deleteNote}
          handleNoteError={handleNoteError}
        />
      </TableRow>
    </>
  );
};

export default NoteCell;
