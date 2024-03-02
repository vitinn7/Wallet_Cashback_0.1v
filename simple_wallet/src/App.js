import logo from './logo.svg';
import './App.css';
import Wallet from './Wallet.js'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PaginaContrato from './ContractPage.js';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Wallet/>} />
        <Route path='/Contract' element={<PaginaContrato/>}/>
        
      </Routes>
    </BrowserRouter>

  );
}


export default App;
