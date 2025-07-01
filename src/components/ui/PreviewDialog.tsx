import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

interface PreviewDialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  content?: React.ReactNode;
  actions?: React.ReactNode;
}

export const PreviewDialog: React.FC<PreviewDialogProps> = ({
  open,
  onClose,
  title = "Dialog Title",
  content,
  actions,
}) => (
  <Dialog
    open={open}
    onClose={onClose}
    aria-labelledby="preview-dialog-title"
    aria-describedby="preview-dialog-description"
    maxWidth="md"
    fullWidth
  >
    <DialogTitle id="preview-dialog-title">{title}</DialogTitle>
    <DialogContent>
      <DialogContentText id="preview-dialog-description" component="div">
        {content}
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      {actions ? actions : (
        <Button onClick={onClose} autoFocus>
          Close
        </Button>
      )}
    </DialogActions>
  </Dialog>
);

export default PreviewDialog;