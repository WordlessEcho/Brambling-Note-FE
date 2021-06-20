import React, { useEffect, useState } from 'react';
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
  handleNoteError: (error: Error, operation: string) => void,
};

const useStyles = makeStyles(({ spacing }: Theme) => createStyles({
  buttons: {
    marginTop: spacing(1),
  },
}));

const NoteDetails = ({
  display, hideDetails, note, updateNote, deleteNote, handleNoteError,
}: Props) => {
  const { id, content } = note;
  const classes = useStyles();

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

  const share = () => {
    navigator.share({
      // TODO: should not hard code app name
      title: '便签',
      text: content,
      // TODO: Heroku will meet router problem
      // Details: https://stackoverflow.com/questions/41772411/react-routing-works-in-local-machine-but-not-heroku
      // url: `/${id}`,
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
                onClick={share}
                endIcon={<Share />}
              >
                分享
              </Button>
              <Button
                onClick={() => deleteNote(id).catch((error) => handleNoteError(error, '删除'))}
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
