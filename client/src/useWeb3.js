import { useState, useEffect } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import Web3 from "web3";

const useWeb3 = () => {
  const [state, setState] = useState({
    web3: null,
    accounts: null,
    contract: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (window.ethereum) {
      handleEthereum();
    } else {
      window.addEventListener("ethereum#initialized", handleEthereum, {
        once: true,
      });

      // If the event is not dispatched by the end of the timeout,
      // the user probably doesn't have MetaMask installed.
      setTimeout(handleEthereum, 3000); // 3 seconds
    }

    async function handleEthereum() {
      const { ethereum } = window;

      // Check if MetaMask is available
      // Throw error if it is not
      if (ethereum && ethereum.isMetaMask) {
        console.log("Ethereum successfully detected!");
        try {
          await window.ethereum.enable();
        } catch (err) {
          setError(err);
          setLoading(false);
        }

        // Get network provider and web3 instance
        const web3 = new Web3(window.ethereum);

        // Use web3 to get the user's accounts
        const accounts = await web3.eth.getAccounts();

        // Get contract instance
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = SimpleStorageContract.networks[networkId];
        const instance = new web3.eth.Contract(
          SimpleStorageContract.abi,
          deployedNetwork && deployedNetwork.address
        );

        // Set web3, accounts and contract to the state
        setState({
          web3,
          accounts,
          contract: instance,
        });
        setLoading(false);
        // Access the decentralized web!
      } else {
        // Log MetaMask missing
        setError({ message: "Please Install MetaMask" });
        setLoading(false);
        console.log("Please install MetaMask!");
      }
    }
  }, []);

  return { data: state, loading, error };
};

export default useWeb3;
