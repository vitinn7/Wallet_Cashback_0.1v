import { React, useState } from 'react';
import styles from './Wallet.module.css';

const Interactions = (props) => {
  const [transferHash, setTransferHash] = useState(null);
  const [isTransferring, setIsTransferring] = useState(false);

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

  return (
    <div className={styles.interactionsCard}>
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
    </div>
  );
};

export default Interactions;
