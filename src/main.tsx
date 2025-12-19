import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "./index.css";
import App from "./App";
import { Toaster } from "react-hot-toast";

// Create Query Client
const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        containerClassName="mt-3"
        containerStyle={{}}
        toasterId="default"
      />
      <App />
    </BrowserRouter>
  </QueryClientProvider>
);
