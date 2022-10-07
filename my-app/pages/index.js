import { Contract, providers, utils } from "ethers";
import Head from "next/head";
import React, { useEffect, useRef, useState } from "react";
import Web3Modal from "web3modal";
import { abi, NFT_CONTRACT_ADDRESS } from "../constants/index";
import styles from "../styles/Home.module.css";

export default function Home() {
  // walletConnected keep track of whether the user's wallet is connected or not
  const [walletConnected, setWalletConnected] = useState(false);
  // loading is set to true when we are waiting for a transaction to get mined
  const [loading, setLoading] = useState(false);
  // tokenIdsMinted keeps track of the number of tokenIds that have been minted
  const [tokenIdsMinted, setTokenIdsMinted] = useState("0");
  // Create a reference to the Web3 Modal (used for connecting to Metamask) which persists as long as the page is open
  const web3modalRef = useRef();

  /**
   * publicMint: Mint an NFT
   */
  const publicMint = async () => {
    try {
      console.log("Public mint");
      // We need a Signer here since this is a 'write' transaction.
      const signer = await getPrividerOrSigner(true);
      // Create a new instance of the Contract with a Signer, which allows
      // update methods
      const nftContract = new Contract(NFT_CONTRACT_ADDRESS, abi, signer);
      // call the mint from the contract to mint the LW3Punks
      const tx = await nftContract.mint({
        // value signifies the cost of one LW3Punks which is "0.001" eth.
        // We are parsing `0.001` string to ether using the utils library from ethers.js
        value: utils.parseEther("0.001")
      });
      setLoading(true);
      //wait for the transaction to get minted
      await tx.wait();
      setLoading(false);
      window.alert("You have successfully minted a LW3Punk");
    } catch (error) {
      console.error(error);
    }
  };
  /*
        connectWallet: Connects the MetaMask wallet
      */
  const connectWallet = async () => {
    try {
      // Get the provider from web3Modal, which in our case is MetaMask
      // When used for the first time, it prompts the user to connect their wallet
      await getPrividerOrSigner();
      getWalletConnected(true);
    } catch (error) {
      console.log(erro);
    }
  };
  const getPrividerOrSigner = async (needsigner = false) => {
    // Connect to Metamask
    //Since we store `web3Modal` as a reference, we need to access the `current` value to get access to the underlying object
    const provider = await web3modalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);
    // If user is not connected to the Goerli network, let them know and throw an error
    const { chainId } = await Web3Provider.getNetwork();
    if (chainId !== 5) {
      window.alert("Please change the network to goerli");
      throw new Error("Change the network to goerli");
    }
    if (needsigner) {
      const signer = Web3Provider.getSigner();
      return signer;
    }
    return web3Provider;
  };
  return (
    <div>
      <Head>
        <title>LW3Punks</title>
        <meta name="description" content="LW3Punks-Dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>Welcome to LW3Punks!</h1>
          <div className={styles.description}>
            Its an NFT collection for LearnWeb3 students.
          </div>
          <div className={styles.description}>
            {tokenIdsMinted}/10 have been minted
          </div>
          {}
        </div>
        <div>
          <img className={styles.image} src="./LW3Punks/1.png" />
        </div>
      </div>

      <footer className={styles.footer}>Made with &#10084; by Hillary</footer>
    </div>
  );
}
