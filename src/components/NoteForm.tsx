import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, TextField, FormControlLabel, DialogActions, Button, useTheme,
  useMediaQuery, Switch, Stack,
} from '@mui/material';

import { ErrorMessage, NewNote } from '../types';
import { toErrorMessage } from '../utils';

type Props = {
  display: boolean,
  createNote: (newNote: NewNote) => Promise<void>,
  hideDialog: () => void,
  setErrorMessage: (errorMessage: ErrorMessage) => void,
};

const defaultNewNote = { content: '', important: false };

const NoteForm = ({
  display, createNote, hideDialog, setErrorMessage,
}: Props) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [newNote, setNewNote] = useState<NewNote>(defaultNewNote);

  const onSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();

    createNote(newNote).catch((error) => setErrorMessage(toErrorMessage(error)));

    hideDialog();
    setNewNote(defaultNewNote);
  };

  return (
    <Dialog
      fullScreen={fullScreen}
      fullWidth
      maxWidth="md"
      open={display}
      aria-labelledby="create-note-dialog-title"
    >
      <DialogTitle id="create-note-dialog-title">新建一条便签</DialogTitle>
      <form onSubmit={onSubmit}>
        <DialogContent>
          <Stack spacing={2}>
            <TextField
              color="primary"
              variant="standard"
              margin="dense"
              fullWidth
              multiline
              rows={6}
              label="内容"
              value={newNote.content}
              onChange={({ target }) => setNewNote({ ...newNote, content: target.value })}
            />
            <FormControlLabel
              control={(
                <Switch
                  checked={newNote.important}
                  onChange={() => setNewNote({ ...newNote, important: !newNote.important })}
                />
              )}
              label="重要"
              aria-checked={newNote.important}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            color='inherit'
            onClick={hideDialog}
          >
            取消
          </Button>
          <Button
            color="secondary"
            type="submit"
          >
            新建
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default NoteForm;
