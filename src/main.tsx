import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import './index.css'
import App from './App';
import { FuelProvider } from "@fuels/react";
import { defaultConnectors } from "@fuels/connectors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
          <FuelProvider
            fuelConfig={{
              connectors: defaultConnectors({
                devMode: true,
              }),
            }}
          >
            <BrowserRouter>
              <App />
            </BrowserRouter>
           
          </FuelProvider>
        </QueryClientProvider>
    </React.StrictMode>
  

)
