const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Simple_Token contract", function () {
  let SimpleToken;
  let simpleToken;
  let owner;
  let recipientAddress = "0x26E947119Da3fA4BF74dD01020F9f1f9C2650043"; // Substitua pelo endereço do destinatário
  const initialSupply = 1000000;
  const cashbackPercentage = 10;
  const cashbackThreshold = 5;
  const initialProductValue = 500;
  const transferAmount = 100; // Quantidade de tokens a ser transferida
  const numTransfers = 100; // Número de transferências a serem realizadas

  before(async function () {
    // Configura o contrato e o proprietário
    SimpleToken = await ethers.getContractFactory("Simple_Token");
    [owner] = await ethers.getSigners();

    // Faz o deploy do contrato na rede Holesky
    simpleToken = await SimpleToken.deploy(
      initialSupply, 
      cashbackPercentage, 
      cashbackThreshold, 
      initialProductValue
    );

    // Aguarda a confirmação do deploy
    await simpleToken.waitForDeployment();
  });

  it("should deploy the contract and have the correct address", async function () {
    // Obtém o endereço do contrato
    const contractAddress = await simpleToken.getAddress();
    
    // Verifica se o contrato foi implantado corretamente
    expect(contractAddress).to.be.properAddress;

    // Imprime o endereço do contrato e da conta que fez o deploy
    console.log("Simple_Token deployed to:", contractAddress);
    console.log("Contract deployed by:", owner.address);
  });

  it("should perform 100 transfers to a specific address and print gas used", async function () {
    this.timeout(12000000); // Tempo limite de 120 segundos (120.000 ms) para o teste

    // Verifica o saldo inicial do destinatário
    const initialRecipientBalance = await simpleToken.balanceOf(recipientAddress);
    console.log(`Initial Balance of Recipient: ${initialRecipientBalance.toString()}`);
    
    // Verifica o saldo inicial do proprietário
    const initialOwnerBalance = await simpleToken.balanceOf(owner.address);
    console.log(`Initial Balance of Owner: ${initialOwnerBalance.toString()}`);

    const transferData = [];
    console.time("Total transfer time");

    for (let i = 0; i < numTransfers; i++) {
      console.time(`Transfer #${i + 1} time`); // Inicia o temporizador para cada transação

      // Transfere uma quantidade específica de tokens para o endereço do destinatário
      const tx = await simpleToken.transfer(recipientAddress, transferAmount);
      
      // Aguarda a confirmação da transação e obtém o recibo da transação
      const txReceipt = await tx.wait();

      // Captura o custo da transação (gás utilizado)
      const gasUsed = txReceipt.gasUsed;
      transferData.push({ transferNumber: i + 1, gasUsed: gasUsed.toString() });

      console.timeEnd(`Transfer #${i + 1} time`); // Encerra o temporizador para cada transação
      console.log(`Transfer #${i + 1} of ${transferAmount} tokens to ${recipientAddress} completed.`);
      console.log("Gas used for this transfer:", gasUsed.toString());
    }

    console.timeEnd("Total transfer time"); // Encerra o temporizador total

    // Verifica o saldo final do destinatário
    const recipientBalance = await simpleToken.balanceOf(recipientAddress);
    console.log(`Final Balance of Recipient: ${recipientBalance.toString()}`);

    // Verifica o saldo final do proprietário
    const finalOwnerBalance = await simpleToken.balanceOf(owner.address);
    console.log(`Final Balance of Owner: ${finalOwnerBalance.toString()}`);

    // Imprime todos os dados de gás
    console.log("Gas used for each transfer:", transferData);
  });
});
