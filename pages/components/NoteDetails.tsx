import React, { useEffect, useState } from 'react';
import {
  Button, TextField, Box, Collapse, TableCell, Stack,
} from '@mui/material';
import Share from '@mui/icons-material/Share';
import Delete from '@mui/icons-material/Delete';
import Done from '@mui/icons-material/Done';

import { NewNote, Note } from '../types';

type Props = {
  display: boolean,
  hideDetails: () => void,
  note: Note,
  updateNote: (id: string, newNote: NewNote) => Promise<void>,
  deleteNote: (id: string) => void,
  handleNoteError: (error: Error, operation: string) => void,
};

export default function NoteDetails({
  display, hideDetails, note, updateNote, deleteNote, handleNoteError,
}: Props) {
  const { id, content } = note;

  const [newContent, setNewContent] = useState(content);

  const onSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (newContent === content) {
      hideDetails();
    } else {
      updateNote(id, { ...note, content: newContent })
        .then(() => hideDetails())
        .catch((error: Error) => handleNoteError(error, '修改'));
    }
  };

  const share = () => navigator.share({
    // TODO: should not hard code app name
    title: '便签',
    text: content,
    // TODO: Heroku will meet router problem
    // Details: https://stackoverflow.com/questions/41772411/react-routing-works-in-local-machine-but-not-heroku
    // url: `/${id}`,
  });

  useEffect(() => {
    if (!display) {
      setNewContent(content);
    }
  }, [content, display]);

  return (
    <TableCell aria-label="编辑便签" style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
      { /* `style` and `colSpan` is from: */ }
      { /* https://material-ui.com/components/tables/#collapsible-table */ }
      <Collapse in={display} timeout="auto" unmountOnExit>
        <Box margin={1}>
          <form onSubmit={onSubmit}>
            <TextField
              color="primary"
              variant="standard"
              margin="dense"
              fullWidth
              multiline
              rows={3}
              label="内容"
              value={newContent}
              onChange={({ target }) => setNewContent(target.value)}
            />
            <Stack direction="row" spacing={2} sx={{ justifyContent: 'flex-end' }}>
              <Button
                color="inherit"
                onClick={share}
                endIcon={<Share />}
              >
                分享
              </Button>
              <Button
                color="inherit"
                onClick={() => deleteNote(id)}
                endIcon={<Delete />}
              >
                删除
              </Button>
              <Button
                type="submit"
                color="secondary"
                endIcon={<Done />}
              >
                保存
              </Button>
            </Stack>
          </form>
        </Box>
      </Collapse>
    </TableCell>
  );
}
