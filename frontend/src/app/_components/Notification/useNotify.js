import { useSnackbar } from 'notistack';

const useNotify = () => {
  const { enqueueSnackbar } = useSnackbar();

  const notify = (message, variant = 'success', autoHideDuration = 3000, position = { vertical: 'top', horizontal: 'left' }) => {
    enqueueSnackbar(message, {
      variant,
      autoHideDuration,
      anchorOrigin: position,  // Set the position of the snackbar
    });
  };

  return notify;
};

export default useNotify;