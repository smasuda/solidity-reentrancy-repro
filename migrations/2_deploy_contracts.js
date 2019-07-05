const EtherStore = artifacts.require("EtherStore");
const AttackerStore = artifacts.require("AttackerStore");

module.exports = function(deployer) {
  // deployer.deploy(ConvertLib);
  // deployer.link(ConvertLib, MetaCoin);
  // deployer.deploy(MetaCoin);
  deployer.deploy(EtherStore).then(function(){
    return deployer.deploy(AttackerStore, EtherStore.address );
  });
};
