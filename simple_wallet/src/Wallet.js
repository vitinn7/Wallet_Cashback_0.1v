import {React, useState, useEffect} from 'react'
import { ethers } from "ethers"
import styles from './Wallet.module.css'
import simple_token_abi from './Contracts/Hardhat/artifacts/contracts/Lock.sol/Simple_Token.json'
import Interactions from './Interactions';
import { useNavigate } from 'react-router-dom';
import HomePage, {contractHomePage} from './HomePage'


let contractInstance;
let contractExport;

const Wallet = () => {

    // Recuperar o endereço do contrato do armazenamento local ao iniciar
    const initialContractAddress = localStorage.getItem('contractAddress') || "";
    const [contractAddress, setContractAddress] = useState(initialContractAddress);

    useEffect(() => {
        // Atualizar o endereço do contrato quando o valor de contractHomePage for definido
        if (contractHomePage) {
            setContractAddress(contractHomePage.toString());
            // Salvar o endereço do contrato no armazenamento local
            localStorage.setItem('contractAddress', contractHomePage.toString());
        }
    }, [contractHomePage]);

    console.log(contractAddress);

    contractExport = contractAddress;
    console.log(simple_token_abi);


  
  



    const [tokenName,setTokenName]= useState("Token");
    const [connButtonText,setConnButtonText] = useState("Connect Wallet");
    const [errorMessage, setErrorMessage] = useState(null);

    const [defaultAccount, setDefaultAccount] = useState(null);
    const [balance, setBalance] = useState(null);

    const [provider,setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [contract,setContract]= useState(null);

    const [amountP, setAmountP]= useState(null);

    const [quantTransfer, setQuantTransfer]= useState(null);
    const [cashbackBalance, setCashbackBalance] = useState(null);

    const [totalSupply, setTotalSupply] = useState(null);





    const connectWalletHandler = () => {
        
        if(window.ethereum && window.ethereum.isMetaMask){

            
            window.ethereum.request({method: 'eth_requestAccounts'})
            .then(result =>{
                accountChangedHandler(result[0]);
                setConnButtonText('Wallet Connected');
            })
            .catch(error =>{
                setErrorMessage(error.message);
            })
        }
        else{
            console.log("need to install metamask");
            setErrorMessage("Please install MetaMask");
        }

    };
    const accountChangedHandler =(newAddress) => {
        setDefaultAccount(newAddress);
        updateEthers();
        
    };

    const navigate = useNavigate();

    const goToContractPage = () =>{
        navigate('/Contract')

    }
    const updateEthers = async () => {
        if (window.ethereum) {
            try {
                // Solicitar permissão para acessar a conta do usuário usando eth_requestAccounts
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    
                let tempProvider;
                let tempSigner;
    
                if (window.ethereum) {
                    // Conectar ao objeto EIP-1193 do MetaMask
                    tempProvider = new ethers.BrowserProvider(window.ethereum);
    
                    // Solicitar acesso para operações de gravação
                    tempSigner = await tempProvider.getSigner();
                } else {
                    // Se o MetaMask não estiver instalado, usar o provedor padrão (somente leitura)
                    console.log("MetaMask não instalado; usando padrões somente leitura");
                    tempProvider = ethers.getDefaultProvider();
                    tempSigner = null;
                }
                // Certifique-se de que contractAddress e simple_token_abi estão definidos antes de criar o contrato
                if (contractAddress && simple_token_abi) {
        
                    const tempContract = new ethers.Contract(contractAddress, simple_token_abi.abi, tempSigner);
                    // Define os estados com os novos valores
                    setProvider(tempProvider);
                    setSigner(tempSigner);
                    contractInstance=tempContract;
                    setContract(tempContract);
                    
                } else {
                    console.error('contractAddress e simple_token_abi devem ser definidos.');
                }
            } catch (error) {
                console.error('Erro ao interagir com o MetaMask:', error);
            }
        } else {
            console.error('MetaMask ou outra extensão Web3 não está instalada.');
        }
    };


    useEffect(() => {
        if (contract) {
          updateBalance();
          updateTokenName();
          updatequantTransfer();
          updateCashbackAcumulado();
          updateTotalSupply();
          updateProduct();
        }
    }, [contract]);
    
    const updateBalance = async () => {
        try {
          const balanceBigN = await contract.balanceOf(defaultAccount);
          setBalance(Number(balanceBigN));
        } catch (error) {
          console.error('Erro ao atualizar o saldo:', error);
        }
    };

    const updateProduct = async () => {
        try {
          const number = await contract.QuantProduto(defaultAccount);
          setAmountP(Number(number));
        } catch (error) {
          console.error('Erro ao atualizar o Amountproduto:', error);
        }
    };

    const updatequantTransfer = async () => {
        try {
            const number = await contract.getTransactionCount(defaultAccount);
            setQuantTransfer(Number(number));

        } catch (error){
            console.error('Erro ao atualizar a quantidade de transferencias do token:', error);

        }
        
    }

    const updateCashbackAcumulado = async () => {
        try{
            const number = await contract.getCashbackBalance(defaultAccount);
            setCashbackBalance(Number(number));

        } catch (error){
            console.error('Erro ao atualizar o cashback acumulado da conta:', error);
        }
    }

    const updateTotalSupply = async () =>{
        try{
            const supply = await contract.totalSupply();
            setTotalSupply(Number(supply));
        }catch(error){
            console.error('Erro ao atualizar a Quantidade de Tokens em circulacao:', error);

        }
    }
      
      
      
    const updateTokenName = async () => {
        try {
            const name = await contract.name();
            setTokenName(name);
        } catch (error) {
            console.error('Erro ao atualizar o nome do token:', error);
        }
    };
    return(
        <div>
            <div style={{ textAlign: 'center' }}>
                <h2>
                    {tokenName + " ERC-20 Wallet"}
                    

                </h2>
                <button className={styles.button6} onClick={connectWalletHandler}>
                    {connButtonText}
                
                </button>
            </div>
            <div className = {styles.walletCard}>
                <div>
                    <h3>
                        Address :{defaultAccount}
                    </h3>
                </div>
                <div>
                    <h3>
                        {tokenName} Balance da Conta: {balance}
                    </h3>
                </div>
                <div>
                    <h3>
                         Amount Produto: {amountP}
                    </h3>
                </div>
                <div>
                    <h3>
                        Quantidade de Transferencias: {quantTransfer}
                    </h3>
                </div>
                <div>
                    <h3>
                        CashBack Acumulado: {cashbackBalance}
                    </h3>
                </div>
                {errorMessage}
            </div>

            <Interactions contract={contract}/>



            <div style={{ textAlign: 'center' }}>
                <h3>
                    TotalSupply : {totalSupply}
                </h3>
            </div>

            <div style={{ textAlign: 'center' }}>
                <button type='button' className={styles.button6} onClick={goToContractPage}>
                    
                    Contrato

                </button>
            </div>

            
        </div>

        
    );

};

export{contractInstance, contractExport};








export default Wallet;
