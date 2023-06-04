import React, { useState } from 'react';
import { IconButton, TableCell, TableRow } from '@mui/material';
import Flag from '@mui/icons-material/Flag';
import KeyboardArrowUp from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';

import { NewNote, Note } from '../types';

import NoteDetails from './NoteDetails';

type Props = {
  note: Note,
  updateNote: (id: string, newNote: NewNote) => Promise<void>,
  deleteNote: (id: string) => void,
  handleNoteError: (error: Error, operation: string) => void,
};

const NoteCell = ({
  note, updateNote, deleteNote, handleNoteError,
}: Props) => {
  const {
    id, content, important, date,
  } = note;

  const [showDetails, setShowDetails] = useState(false);

  const changeImportant = () => {
    updateNote(id, { ...note, important: !important })
      .catch((error) => handleNoteError(error, '编辑'));
  };

  return (
    <React.Fragment>
      {/* See: https://material-ui.com/components/tables/#collapsible-table */}
      {/* TODO: find out why it does not apply */}
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell sx={{ borderBottom: 'unset' }}>
          {content}
        </TableCell>
        <TableCell align="right" sx={{ borderBottom: 'unset' }}>
          {new Date(date).toLocaleString()}
        </TableCell>
        <TableCell align="right" sx={{ borderBottom: 'unset' }}>
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
        <TableCell align="right" sx={{ borderBottom: 'unset' }}>
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
    </React.Fragment>
  );
};

export default NoteCell;
