import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import ContextProvider from './context/UserContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ContextProvider>
        <ChakraProvider>
          <App />
        </ChakraProvider>
      </ContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);