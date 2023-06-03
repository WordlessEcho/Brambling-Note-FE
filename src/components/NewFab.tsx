import React from 'react';
import { Fab } from '@mui/material';
import Edit from '@mui/icons-material/Edit';

type Props = { showNoteForm: () => void };

const NewFab = ({ showNoteForm }: Props) => {

  return (
    <Fab
      sx={{ position: 'absolute', bottom: 16, right: 16 }}
      color="secondary"
      aria-label="新建便签"
      onClick={showNoteForm}
    >
      <Edit />
    </Fab>
  );
};

export default NewFab;
