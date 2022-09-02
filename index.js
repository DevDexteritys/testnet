import { ethers } from "./ethers-5.6.esm.min.js"
import { abi, contractAddress} from "./constants.js"

const connectButton = document.getElementById("connectButton")

const fundButton = document.getElementById("fundButton")

var viewAmount = document.getElementById("viewAmount")

connectButton.onclick = connect

fundButton.onclick = fund


async function connect() {
  if (typeof window.ethereum !== "undefined") {
    try {
      await ethereum.request({ method: "eth_requestAccounts" })
    } catch (error) {
      console.log(error)
    }
    connectButton.innerHTML = "Connected"
    const accounts = await ethereum.request({ method: "eth_accounts" })
    console.log(accounts)
  } else {
    connectButton.innerHTML = "Please install MetaMask"
  }
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

/*async function transferBUSD() {
	  //const ethAmount = document.getElementById("ethAmount").value
      console.log(`Funding with ${ethAmount}...`)
	  
      if (typeof window.ethereum !== "undefined") {
		const provider = new ethers.providers.Web3Provider(window.ethereum)
		const signer = provider.getSigner()
		//const busdContract = new ethers.Contract(busdAddress, busdABI, signer);
        try {
		  busdContract = new ethers.Contract(busdAddress, busdABI, signer);
          const ethAmount = document.getElementById("ethAmount").value
		  busdContract.approve(contractAddress, ethAmount);
		  contract = new ethers.Contract(contractAddress, abi, signer);
          //const transactionResponse = await contract.fund({
          //value: ethers.utils.parseEther(ethAmount),

          
        } catch (error) {
          console.error(error.message, error.data.message);
        } 
      }
      else {
        document.getElementById("transferButton").innerHTML = "Please install MetaMask";
      }
    };*/


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
