import React, { useState } from 'react';
import { IconButton, TableCell, TableRow } from '@material-ui/core';
import Flag from '@material-ui/icons/Flag';
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';

import { NewNote, Note } from '../types';

type Props = {
  note: Note,
  updateNote: (id: string, newNote: NewNote) => Promise<void>,
};

const NoteCell = ({ note, updateNote }: Props) => {
  const {
    id, content, important, date,
  } = note;

  const [display, setDisplay] = useState(false);

  const handleExpander = () => {
    setDisplay(!display);
  };

  return (
    <>
      <TableRow>
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
            onClick={handleExpander}
          >
            {display ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        { /* TODO */ }
      </TableRow>
    </>
  );
};

export default NoteCell;
