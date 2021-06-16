import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Button, Grid, TextField, Box, Collapse, TableCell, createStyles, Theme, makeStyles,
} from '@material-ui/core';
import Share from '@material-ui/icons/Share';
import Delete from '@material-ui/icons/Delete';
import Done from '@material-ui/icons/Done';

import { NewNote, Note } from '../types';

type Props = {
  display: boolean,
  hideDetails: () => void,
  note: Note,
  updateNote: (id: string, newNote: NewNote) => Promise<void>,
  deleteNote: (id: string) => Promise<void>,
};

const useStyles = makeStyles(({ spacing }: Theme) => createStyles({
  buttons: {
    marginTop: spacing(1),
  },
}));

const NoteDetails = ({
  display, hideDetails, note, updateNote, deleteNote,
}: Props) => {
  const { id, content } = note;
  const classes = useStyles();
  const [newContent, setNewContent] = useState(content);

  const onSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();

    // TODO: check they were same or not
    // TODO: catch 404 error
    updateNote(id, { ...note, content: newContent })
      .then(() => hideDetails())
      .catch((error) => {
        if (axios.isAxiosError(error)) {
          if (error.response && error.response.status === 404) {
            // TODO: show a dialog to user
            console.warn('note not found.');
          }
        }

        // TODO: ask user to report a bug
        console.error(`Unexpected error: ${error.message}`);
        console.error(error);
      });
  };

  const handleNoteDelete = () => {
    // TODO: catch 404 error
    deleteNote(id)
      .then(() => hideDetails())
      .catch((error) => {
        if (axios.isAxiosError(error)) {
          if (error.response && error.response.status === 404) {
            // TODO: show a dialog to user
            console.warn('note not found.');
          }
        }

        // TODO: ask user to report a bug
        console.error(`Unexpected error: ${error.message}`);
        console.error(error);
      });
  };

  useEffect(() => {
    if (display === false) {
      setNewContent(content);
    }
  }, [display]);

  return (
    <TableCell aria-label="编辑便签" style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
      { /* `style` and `colSpan` is from: */ }
      { /* https://material-ui.com/components/tables/#collapsible-table */ }
      <Collapse in={display} timeout="auto" unmountOnExit>
        <Box margin={1}>
          <form onSubmit={onSubmit}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="内容"
              value={newContent}
              onChange={({ target }) => setNewContent(target.value)}
            />
            <Grid container direction="row" justify="flex-end" className={classes.buttons}>
              <Button
                onClick={() => navigator.share({
                  // TODO: should not hard code app name
                  title: '便签',
                  text: content,
                  // TODO: Heroku will meet router problem
                  // Details: https://stackoverflow.com/questions/41772411/react-routing-works-in-local-machine-but-not-heroku
                  // url: `/${id}`,
                })}
                endIcon={<Share />}
              >
                分享
              </Button>
              <Button
                onClick={handleNoteDelete}
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
            </Grid>
          </form>
        </Box>
      </Collapse>
    </TableCell>
  );
};

export default NoteDetails;
