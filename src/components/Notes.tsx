import React, { useState } from 'react';
import axios from 'axios';
import {
  TableContainer, Paper, Table,
  TableHead, TableRow, TableCell,
  TableSortLabel, TableBody,
  SortDirection,
} from '@material-ui/core';

import { ErrorMessage, NewNote, Note } from '../types';

import NoteCell from './NoteCell';
import { toErrorMessage } from '../utils';

type Props = {
  notes: Note[],
  setNotes: (arg: Note[]) => void,
  updateNote: (id: string, newNote: NewNote) => Promise<void>,
  deleteNote: (id: string) => Promise<void>,
  setErrorMessage: (message: ErrorMessage) => void,
};
type HeadCell = { id: string, name: string, direction: SortDirection | null };

const defaultHeads: HeadCell[] = [
  { id: 'date', name: '时间', direction: 'desc' },
  { id: 'important', name: '重要', direction: null },
];

const Notes = ({
  notes, setNotes, updateNote, deleteNote, setErrorMessage,
}: Props) => {
  const [headsCanBeSorted, setHeadsCanBeSorted] = useState<HeadCell[]>(defaultHeads);

  const handleNoteError = (error: Error, operation: string) => {
    if (axios.isAxiosError(error)) {
      if (error.response && error.response.status === 404) {
        return setErrorMessage({ title: `您要${operation}的便签已不存在`, content: null });
      }
    }

    const friendlyLog = toErrorMessage(error);
    return setErrorMessage(friendlyLog);
  };

  const sortNotes = (id: string) => () => {
    setHeadsCanBeSorted(headsCanBeSorted.map((head) => (
      head.id === id
        ? { ...head, direction: head.direction === 'desc' ? 'asc' : 'desc' }
        : { ...head, direction: null }
    )));
    // TODO
    setNotes(notes);
  };

  return (
    <TableContainer component={Paper}>
      <Table aria-label="包含所有便签的表格">
        <TableHead>
          <TableRow>
            <TableCell>内容</TableCell>
            {headsCanBeSorted.map(({ id, name, direction }) => (
              <TableCell
                key={id}
                align="right"
                sortDirection={direction !== null ? direction : false}
              >
                <TableSortLabel
                  active={!!direction}
                  direction={direction || 'desc'}
                  onClick={sortNotes(id)}
                >
                  {name}
                </TableSortLabel>
              </TableCell>
            ))}
            { /* leave an empty TableCell for expand button in TableBody */ }
            <TableCell align="right" />
          </TableRow>
        </TableHead>
        <TableBody>
          {notes.map((note) => (
            <NoteCell
              key={note.id}
              note={note}
              updateNote={updateNote}
              deleteNote={deleteNote}
              handleNoteError={handleNoteError}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Notes;
