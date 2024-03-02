import {React, useState, useEffect} from 'react'
import Wallet, {contractInstance, contractExport} from './Wallet';

function PaginaContrato() {

    const [cashbackBalance, setCashbackBalance] = useState(null);

    useEffect (()=>{
        if(contractInstance){
            updateCashbackAcumulado();
        }
    }, [contractInstance])

    const updateCashbackAcumulado = async () => {
        try{
            const number = await contractInstance.getCashbackBalance(contractExport);
            setCashbackBalance(Number(number));

        } catch (error){
            console.error('Erro ao atualizar o cashback acumulado do Contrato:', error);
        }
    }

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>Address Contract: {contractExport}</h2>
      <h2>Contract CashBackBalance: {cashbackBalance}</h2>
    </div>
  );
}

export default PaginaContrato;