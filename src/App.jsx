import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';
import wp from "./utils/WavePortal.json";
import ContractController from './controllers/ContractController';

const App = () => {
    const [currentAccount, setCurrentAccount] = useState("");
    const [voter, setVoter] = useState("");
    const [totalVotes, setTotalVotes] = useState("");
    const [etherTxn,setEtherTxn] = useState("");
    const [allVotes,setAllVotes] = useState([]);
    const [comment,setComment] = useState("");

const contractAddress = "0x8643148ea7B8B6bAC0A3a3254097496246F7cBa5";
const contractABI = wp.abi;

  const checkIfWalletIsConnected = async () => {
    try {
      /*
    * First make sure we have access to window.ethereum
    */
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have metamask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }
    /*
      * Check if we're authorized to access the user's wallet
      */
      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
        ContractController.Initialize(ethereum,contractAddress,contractABI);
        let voter = await ContractController.getVoter();
        console.log(voter);
        setVoter(voter);

      } else {
        console.log("No authorized account found");
      }
    } catch (error) {
      console.log(error);
    }
  }
  /**
  * Implement your connectWallet method here
  */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error)
    }
  }
const wave = async (candidateId) => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        ContractController.Initialize(ethereum,contractAddress,contractABI);

        let totalVotes = await ContractController.getTotalVotes();
        console.log("Retrieved total wave count...", totalVotes.count);

        /*
        * Execute the actual wave from your smart contract
        */
        const waveTxn = await ContractController.vote(candidateId,comment);
        setEtherTxn(waveTxn);
        console.log("Mining...", waveTxn.hash);
        await waveTxn.wait();
        setEtherTxn(null);
        console.log("Mined -- ", waveTxn.hash);
        let voter = await ContractController.getVoter();
        console.log(voter);
        setVoter(voter);
        totalVotes = await ContractController.getTotalVotes();
        console.log("Retrieved total wave count...", totalVotes.count);
        setTotalVotes(totalVotes);
        let allVotes = await ContractController.getAllVotes();
        setAllVotes(allVotes);

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
}
const getVotes = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        ContractController.Initialize(ethereum,contractAddress,contractABI);
        let totalVotes = await ContractController.getTotalVotes();
        console.log("Retrieved total wave count...", totalVotes.count);
        setTotalVotes(totalVotes);
        let allVotes = await ContractController.getAllVotes();
        setAllVotes(allVotes);
        console.log('All votes: %s' ,allVotes.length);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
}

   /*
  * This runs our function when the page loads.
  */
  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);
  const showHash =  (etherTxn) => {
    return 'Mining ' + etherTxn.hash + '. Please wait...';
  }
  const handleChange = (event) => {
    setComment(event.target.value);
  }
  const getBeerType = (candidateId) => {
    switch(candidateId){
      case 1:
        return 'Lager';
        break;
      case 2:
        return 'Pilsner';
        break;
      case 3:
        return 'Ale';
        break;
      case 4:
        return 'Weißbier';
        break;
    }
  }

  /**
 * Listen in for emitter events!
 */
useEffect(() => {
  let wavePortalContract;

  const onNewWave = (from, timestamp, message, candidateId) => {
    console.log("NewWave", from, timestamp, message);
    setAllVotes(prevState => [
      ...prevState,
      {
        voterAddress: from,
        castOn: new Date(timestamp * 1000),
        message: message,
        candidateId: candidateId,
      },
    ]);
  };
  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
    wavePortalContract.on("NewVote", onNewWave);
  }

  return () => {
    if (wavePortalContract) {
      wavePortalContract.off("NewVote", onNewWave);
    }
  };
}, []);

  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
        🍻 Cheers!
        </div>

        <div className="bio">
        I am sofalazboy and I love beer! I've built this web3site thanks to the great people at buildspace! Connect your Ethereum wallet and vote for your favourite type of beer!
        </div>

       <div className="bio">Nice to meet you, {currentAccount}.  
       {voter.totalVotes>1 &&
       <div>
       I see you voted {voter.totalVotes} times (last time on {voter.latestVote.toLocaleString()})
       </div>
       }
       {voter.totalVotes==1 &&
       <div>
        I see you already voted, but feel free to cast more votes, to get your favourite beer type to the top!
       </div>
       }
       {voter.totalVotes==0 &&
       <div>
        Time to cast your first vote!
       </div>
       }
       
       </div>
       <div className="form">
        <form>
        <label>
          Comments:
          <input type="text" onChange={handleChange} />
        </label>
      </form>
      </div>
              <button className="waveButton" onClick={() => wave(1)}>
          I love lager!
        </button>
        <button className="waveButton" onClick={() => wave(2)}>
          I love pilsner!
        </button>
        <button className="waveButton" onClick={() => wave(3)}>
          I love ale!
        </button>
        <button className="waveButton" onClick={() => wave(4)}>
          I love Weißbier (wheat beer)!
        </button>
         {/*
        * If there is no currentAccount render this button
        */}
        {!currentAccount && (
          <button className="connectButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
        {etherTxn && etherTxn.hash ? showHash(etherTxn) : '' }
        {currentAccount && voter.totalVotes>0 && (
          <button className="connectButton" onClick={getVotes}>
            View results so far!
          </button>
        )}
        {currentAccount && voter.totalVotes>0 && totalVotes && (
        <div className="display-linebreak">
            Results: {totalVotes.count} total votes  {"\n"}
            Lager => {totalVotes.votes[0]} {"\n"}
            Pilsner => {totalVotes.votes[1]} {"\n"}
            Ale => {totalVotes.votes[2]} {"\n"}
            Weißbier => {totalVotes.votes[3]} {"\n\n\n"}
        </div>
        )}
        <div className="display-linebreak">All votes:
        {allVotes.map( (value, index) => { return <li><div>
        Voter address: {value.voterAddress} {"\n"} 
        Cast on: {value.castOn.toLocaleString()} {"\n"}
        Message: {value.message} {"\n"} 
        Beer type: {getBeerType(value.candidateId)} {"\n"} 
        
        
        </div></li> })}
      </div>
        
      </div>
    </div>
  );
}

export default App;

