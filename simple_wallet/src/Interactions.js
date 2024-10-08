import { React, useState } from 'react';
import styles from './Wallet.module.css';

const Interactions = (props) => {
  const [transferHash, setTransferHash] = useState(null);
  const [isTransferring, setIsTransferring] = useState(false);
  const [transferHashP, setTransferHashP] = useState(null);
  const [isTransferringP, setIsTransferringP] = useState(false);

  const transferHandler = async (e) => {
    e.preventDefault();

    if (isTransferring) {
      // Se já estiver em processo de transferência, não faça nada
      return;
    }

    setIsTransferring(true);

    try {
      let transferAmount = e.target.sendAmount.value;
      let recieverAddress = e.target.recieverAddress.value;

      console.log(props.contract);

      let txt = await props.contract.transfer(recieverAddress, transferAmount);
      console.log(txt);
      setTransferHash(txt.hash);
    } catch (error) {
      console.error(error);
      // Lide com o erro, se necessário
    } finally {
      // Independentemente de ter sido bem-sucedido ou não, redefina o estado de transferência
      setIsTransferring(false);
    }
  };

  const transferHandlerP = async (e) => {
    e.preventDefault();

    if (isTransferringP) {
      // Se já estiver em processo de transferência, não faça nada
      return;
    }

    setIsTransferringP(true);

    try {
      let transferAmount = e.target.sendAmountP.value;
      let recieverAddress = e.target.recieverAddressP.value;

      console.log(props.contract);

      // Chame a função transferirP em vez de transfer
      let txt = await props.contract.transferirP(recieverAddress, transferAmount);
      console.log(txt);
      setTransferHashP(txt.hash);
    } catch (error) {
      console.error(error);
      // Lide com o erro, se necessário
    } finally {
      // Independentemente de ter sido bem-sucedido ou não, redefina o estado de transferência
      setIsTransferringP(false);
    }
  };



  return (
    <div className={styles.interactionsCard} style={{ textAlign: 'center' }}>
      <form onSubmit={transferHandler}>
        <h3> Transfer Coins </h3>
        <p> Reciever Address </p>
        <input type='text' id='recieverAddress' className={styles.addressInput} />

        <p>Send Amount</p>
        <input type='number' id='sendAmount' min='0' />

        <button type='submit' className={styles.button6} disabled={isTransferring}>
          {isTransferring ? 'Transferência em andamento...' : 'Send'}
        </button>
        <div>{transferHash}</div>
      </form>
      <form onSubmit={transferHandlerP}>
        <h3> Transfer P </h3>
        <p> Reciever Address </p>
        <input type="text" id="recieverAddressP" className={styles.addressInput} />

        <p>Send Amount</p>
        <input type="number" id="sendAmountP" min="0" />

        <button type="submit" className={styles.button6} disabled={isTransferringP}>
          {isTransferringP ? 'Transferência em andamento...' : 'Send P'}
        </button>
        <div>{transferHashP}</div>
      </form>
    </div>
  );
};

export default Interactions;
