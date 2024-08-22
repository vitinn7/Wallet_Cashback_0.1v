const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Simple_Token contract", function () {
  let SimpleToken;
  let simpleToken;
  let owner;
  let pseudoAccounts;
  const initialSupply = 1000000;
  const cashbackPercentage = 10;
  const cashbackThreshold = 5;
  const initialProductValue = 500;

  beforeEach(async function () {
    SimpleToken = await ethers.getContractFactory("Simple_Token");
    [owner] = await ethers.getSigners();

    simpleToken = await SimpleToken.deploy(initialSupply, cashbackPercentage, cashbackThreshold, initialProductValue);
  });

  it("should have the correct name", async function () {
    const tokenName = await simpleToken.name();
    expect(tokenName).to.equal("CARCARA");
  });

  it("should have the correct initial supply", async function () {
    const initialSupply = 1000000;
    const ownerBalance = await simpleToken.balanceOf(owner.address);
    expect(ownerBalance).to.equal(initialSupply);
  });

  it("should have registered 100 pseudoaccounts", async function () {
    const ownerBalanceBefore = await simpleToken.balanceOf(owner.address);
    // Criar e registrar 100 pseudocontas localmente
    pseudoAccounts = Array.from({ length: 100 }, (_, i) => ethers.Wallet.createRandom());
  
    // Array para armazenar as Promessas de transação e os dados de gás
    const transferData = [];

    console.time("Total transaction time");
  
    for (const account of pseudoAccounts) {
      console.time(`Transaction to ${account.address}`);
      // Realizar a transferência e capturar o objeto de transação
      const tx = await simpleToken.transfer(account.address, 100);
      // Capturar o custo da transação (gás utilizado)
      const txReceipt = await tx.wait();
      const gasUsed = txReceipt.gasUsed;
      // Adicionar os dados da transferência ao array
      transferData.push({ account: account.address, gasUsed });
      //console.log("Conta:", account.address, "Gas Used:", gasUsed.toString());
      console.timeEnd(`Transaction to ${account.address}`);
    }

    console.timeEnd("Total transaction time");
  
    // Agora, verifique o saldo atualizado do proprietário
    const ownerBalanceAfter = await simpleToken.balanceOf(owner.address);
    console.log("Balance Before:", ownerBalanceBefore);
    console.log("Balance After:", ownerBalanceAfter);
    console.log("Primeira Conta:",pseudoAccounts[0].address);

    // Imprimir os dados de gás para cada transferência
    console.log("Dados de gás para cada transferência:", transferData);
  });

  




});
