import React, { useState } from 'react';
import {
  Button, DialogActions, DialogContentText, DialogContent, DialogTitle, Divider, Dialog,
} from '@mui/material';

import { ErrorMessage } from '../types';

type Props = {
  message: ErrorMessage | null,
  hideDialog: () => void,
};

const ErrorDialog = ({ message, hideDialog }: Props) => {

  const [topDivider, setTopDivider] = useState(false);
  const [bottomDivider, setBottomDivider] = useState(false);

  const initializeDividers = () => {
    setTopDivider(false);
    setBottomDivider(false);

    const dialogContent = document.getElementById('error-dialog-content');

    if (dialogContent !== null) {
      if (dialogContent.scrollHeight > dialogContent.clientHeight) {
        setBottomDivider(true);
      }
    }
  };

  const handleScrolling = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;

    setTopDivider(target.scrollTop !== 0);
    setBottomDivider(target.scrollTop !== target.scrollHeight - target.offsetHeight);
  };

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={message !== null}
      TransitionProps={{
        onEnter: initializeDividers,
      }}
      aria-labelledby="error-dialog-title"
      scroll="paper"
    >
      {message === null ? null
        : (
          <>
            <DialogTitle id="error-dialog-title">{message.title === null ? '您遇到了一个未知的问题' : message.title}</DialogTitle>
            {topDivider ? <Divider /> : null}
            {message.content !== null
              ? (
                <DialogContent id="error-dialog-content" onScroll={handleScrolling}>
                  <DialogContentText>
                    单击下面的日志即可自动全选。请复制并反馈给开发者，或者刷新页面重试：
                  </DialogContentText>
                  <DialogContentText
                    sx={{
                      /* Select all when user click */
                      /* https://css-tricks.com/click-once-select-all-click-again-select-normally/ */
                      userSelect: 'all',
                      /* This property is about line break */
                      /* https://github.com/mui-org/material-ui/issues/9189#issuecomment-466814903 */
                      whiteSpace: 'pre-line',
                    }}
                  >
                    {message.content}
                  </DialogContentText>
                </DialogContent>
              )
              : null}
            {bottomDivider ? <Divider /> : null}
            <DialogActions>
              {message.content !== null
                ? (
                  <>
                    <Button color='inherit' onClick={hideDialog} autoFocus>
                      忽略
                    </Button>
                    { /* TODO: replace link to feedback page */ }
                    <a target="_blank" href="https://example.com" rel="noreferrer">
                      <Button color="secondary" autoFocus>
                        反馈
                      </Button>
                    </a>
                  </>
                )
                : (
                  <Button color="secondary" onClick={hideDialog} autoFocus>
                    知道了
                  </Button>
                )}
            </DialogActions>
          </>
        )}
    </Dialog>
  );
};

export default ErrorDialog;
