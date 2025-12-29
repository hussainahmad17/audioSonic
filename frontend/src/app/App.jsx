import { RouterProvider } from "react-router-dom";
import { router } from "./_routes";
import {
  JumboDialog,
  JumboDialogProvider,
  JumboTheme,
} from "@jumbo/components";
import { CONFIG } from "./_config";
import { AuthProvider } from "./_components/_core/AuthProvider";
import JumboRTL from "@jumbo/components/JumboRTL/JumboRTL";
import { Suspense } from "react";
import { CssBaseline } from "@mui/material";
import { AppSnackbar } from "./_components/_core";
import { Spinner } from "./_shared";
import { AppProvider } from "./_components/AppProvider";
import { SWRConfig } from 'swr';
import { apiClient } from '@app/backendServices/ApiCalls';

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <JumboTheme init={CONFIG.THEME}>
          <CssBaseline />
          <Suspense fallback={<Spinner />}>
            <JumboRTL>
              <JumboDialogProvider>
                <JumboDialog />
                <SWRConfig value={{
                  fetcher: async (url) => (await apiClient.get(url)).data,
                  revalidateOnFocus: false,
                  revalidateOnReconnect: false,
                  revalidateIfStale: false,
                  dedupingInterval: 30000,
                }}>
                  <AppSnackbar>
                    <RouterProvider router={router} />
                  </AppSnackbar>
                </SWRConfig>
              </JumboDialogProvider>
            </JumboRTL>
          </Suspense>
        </JumboTheme>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
