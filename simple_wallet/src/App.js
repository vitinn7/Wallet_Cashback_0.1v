import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Wallet from './Wallet';
import PaginaContrato from './ContractPage';
import HomePage from './HomePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/wallet' element={<Wallet />} />
        <Route path='/contract' element={<PaginaContrato />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
