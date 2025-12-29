import { SnackbarProvider } from "notistack";

const AppSnackbar = ({ children }) => {
  return (
    <SnackbarProvider
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      maxSnack={3}
    >
      {children}
    </SnackbarProvider>
  );
};

export { AppSnackbar };
