import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

// ABI and config
import TokenMaster from '../abis/TokenMaster.json';
import config from '../config.json';

const Navigation = ({ account, setAccount }) => {
  const [owner, setOwner] = useState(null);
  const [tokenMaster, setTokenMaster] = useState(null);

  const connectHandler = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const account = ethers.utils.getAddress(accounts[0]);
    setAccount(account);

    // Initialize provider and contract instance
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const network = await provider.getNetwork();
    const tokenMasterAddress = config[network.chainId].TokenMaster.address;
    const contract = new ethers.Contract(tokenMasterAddress, TokenMaster.abi, provider.getSigner());
    setTokenMaster(contract);

    // Fetch the owner address from the contract
    const contractOwner = await contract.owner();
    setOwner(contractOwner);
  };

  const withdrawHandler = async () => {
    if (tokenMaster) {
      try {
        const tx = await tokenMaster.withdraw();
        await tx.wait();
        alert("Withdrawal successful!");
      } catch (error) {
        console.error("Withdrawal failed:", error);
        alert("Withdrawal failed. Check the console for details.");
      }
    }
  };

  return (
    <nav>
      <div className='nav__brand'>
        <h1>tokenmaster</h1>

        <input className='nav__search' type="text" placeholder='Find millions of experiences' />

        <ul className='nav__links'>
          <li><a href="/">Concerts</a></li>
          <li><a href="/">Sports</a></li>
          <li><a href="/">Arts & Theater</a></li>
          <li><a href="/">More</a></li>
        </ul>
      </div>

      <div className="nav__actions">
        {account ? (
          <>
            <button type="button" className='nav__connect'>
              {account.slice(0, 6) + '...' + account.slice(38, 42)}
            </button>
            {owner && (
              <button
                type="button"
                className='nav__withdraw'
                onClick={withdrawHandler}
              >
                Withdraw
              </button>
            )}
          </>
        ) : (
          <button
            type="button"
            className='nav__connect'
            onClick={connectHandler}
          >
            Connect
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
