import React, { useState } from 'react';
import {
  TableContainer, Paper, Table,
  TableHead, TableRow, TableCell,
  TableSortLabel, TableBody,
  SortDirection,
} from '@material-ui/core';
import { Note } from '../types';

type Props = { notes: Note[], setNotes: (arg: Note[]) => void };
type HeadCell = { id: string, name: string, direction: SortDirection | null };

const defaultHeads: HeadCell[] = [
  { id: 'date', name: '时间', direction: 'desc' },
  { id: 'important', name: '重要', direction: null },
];

const Notes = ({ notes, setNotes }: Props) => {
  const [headsCanBeSorted, setHeadsCanBeSorted] = useState<HeadCell[]>(defaultHeads);

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
          { /* TODO */ }
          {notes.map((note) => console.log(note))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Notes;
