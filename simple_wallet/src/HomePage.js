import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useNavigate } from 'react-router-dom';
import ERC20Token from './Contracts/Hardhat/artifacts/contracts/Lock.sol/Simple_Token.json';

let contractHomePage; // Variável para armazenar o endereço do contrato

function PaginaInicial() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [initialSupply, setInitialSupply] = useState('');
  const [cashbackPercentage, setCashbackPercentage] = useState('10');
  const [cashbackThreshold, setCashbackThreshold] = useState('5');
  const [AmountProduct, setAmountProduct] = useState('');
  const [contractAddress, setContractAddress] = useState(''); // Estado para armazenar o endereço do contrato existente
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function connectToMetaMask() {
      if (window.ethereum && window.ethereum.isMetaMask) {
        try {
          const tempProvider = new ethers.BrowserProvider(window.ethereum);

          const tempSigner = await tempProvider.getSigner();

          setProvider(tempProvider);
          setSigner(tempSigner);
        } catch (error) {
          setErrorMessage(error.message);
        }
      } else {
        setErrorMessage('Please install MetaMask');
      }
    }
    connectToMetaMask();
  }, []);

  async function deployContract() {
    if (!provider || !signer) return;
    if (!initialSupply || !AmountProduct || !cashbackPercentage || !cashbackThreshold) {
      setErrorMessage('Please provide all required parameters');
      return;
    }
    try {
      const factory = new ethers.ContractFactory(ERC20Token.abi, ERC20Token.bytecode, signer);
      const contractInstance = await factory.deploy(initialSupply, cashbackPercentage, cashbackThreshold, AmountProduct);
      
      // Obter o endereço do contrato gerado pelo deploy e armazená-lo na variável
      contractHomePage = await contractInstance.getAddress();
      navigate('/wallet'); // Redirecionar para a página de contrato após o deploy bem-sucedido
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  async function retrieveContract() {
    if (!provider) return;
    if (!contractAddress) {
      setErrorMessage('Please provide the contract address');
      return;
    }
    if (!ethers.isAddress(contractAddress)) {
      setErrorMessage('Invalid contract address. Please provide a valid address.');
      return;
    }
    try {
      contractHomePage = contractAddress; // Atualiza a variável contractHomePage com o endereço do contrato recuperado
      navigate('/wallet'); // Redireciona para a página de contrato após recuperar o contrato
    } catch (error) {
      setErrorMessage('Failed to retrieve contract. Make sure the address is correct and the contract is deployed.');
    }
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>Contrato ERC-20</h2>
      {errorMessage && <p>{errorMessage}</p>}
      <label htmlFor="initialSupply">Initial Supply:</label>
      <input
        type="number"
        id="initialSupply"
        name="initialSupply"
        value={initialSupply}
        onChange={(e) => setInitialSupply(e.target.value)}
      /><br /><br />
      <label htmlFor="AmountProduct">AmountProduct:</label>
      <input
        type="number"
        id="AmountProduct"
        name="AmountProduct"
        value={AmountProduct}
        onChange={(e) => setAmountProduct(e.target.value)}
      /><br /><br />
      <label htmlFor="cashbackPercentage">Cashback Percentage:</label>
      <input
        type="number"
        id="cashbackPercentage"
        name="cashbackPercentage"
        value={cashbackPercentage}
        onChange={(e) => setCashbackPercentage(e.target.value)}
      /><br /><br />
      <label htmlFor="cashbackThreshold">Cashback Threshold:</label>
      <input
        type="number"
        id="cashbackThreshold"
        name="cashbackThreshold"
        value={cashbackThreshold}
        onChange={(e) => setCashbackThreshold(e.target.value)}
      /><br /><br />
      <button onClick={deployContract}>Deploy Token</button><br /><br />
      <label htmlFor="contractAddress">Contract Address:</label>
      <input
        type="text"
        id="contractAddress"
        name="contractAddress"
        value={contractAddress}
        onChange={(e) => setContractAddress(e.target.value)}
      /><br /><br />
      <button onClick={retrieveContract}>Retrieve Contract</button>
    </div>
  );
}

export default PaginaInicial;
export { contractHomePage };
