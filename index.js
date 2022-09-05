import { ethers } from "./ethers-5.6.esm.min.js"
import { abi, contractAddress} from "./constants.js"

const connectButton = document.getElementById("connectButton")
const dicsonnectButton = document.getElementById("dicsonnectButton")
const fundButton = document.getElementById("fundButton")
var viewAmount = document.getElementById("viewAmount")

connectButton.onclick = connect
dicsonnectButton.onclick = disconnect
fundButton.onclick = fund


async function connect() {
  if (typeof window.ethereum !== "undefined") {
    try {
      await ethereum.request({ method: "eth_requestAccounts" })
connectButton.innerHTML = "Connected"
    const accounts = await ethereum.request({ method: "eth_accounts" })
    console.log(accounts)
    } catch (error) {
      console.log(error)
    }
    
  } else {
    connectButton.innerHTML = "Please install MetaMask"
  }
}

async function disconnect() {

  console.log("Killing the wallet connection", provider);

  // TODO: Which providers have close method?
  if(provider.close) {
    await provider.close();

    // If the cached provider is not cleared,
    // WalletConnect will default to the existing session
    // and does not allow to re-scan the QR code with a new wallet.
    // Depending on your use case you may want or want not his behavir.
    await web3Modal.clearCachedProvider();
    provider = null;
  }

  selectedAccount = null;

  // Set the UI back to the initial state
  document.querySelector("#prepare").style.display = "block";
  document.querySelector("#connected").style.display = "none";
}


async function fund() {
  const ethAmount = document.getElementById("ethAmount").value
  //const viewAmount = document.getElementById("viewAmount")
  //viewAmount.innerText = ethAmount
  console.log(`Funding with ${ethAmount}...`)
  
 
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(contractAddress, abi, signer)
    try {
	  
      const transactionResponse = await contract.fund({
        value: ethers.utils.parseEther(ethAmount),
		
      })
	  document.getElementById("viewAmount").innerText += ethAmount
      await listenForTransactionMine(transactionResponse, provider)
	  
    } catch (error) {
      console.log(error)
    }
  } else {
    fundButton.innerHTML = "Please install MetaMask"
  }
}


function listenForTransactionMine(transactionResponse, provider) {
  console.log(`Mining ${transactionResponse.hash}`)
  return new Promise((resolve, reject) => {
    provider.once(transactionResponse.hash, (transactionReceipt) => {
      console.log(
        `Completed with ${transactionReceipt.confirmations} confirmations. `
      )
      resolve()
    })
  })
}
