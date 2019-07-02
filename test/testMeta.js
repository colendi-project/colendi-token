const {
    BN,
    constants,
    expectEvent,
    shouldFail
} = require('openzeppelin-test-helpers');
const {
    expect
} = require('chai');
const {
    ZERO_ADDRESS
} = constants;

const ColendiToken = artifacts.require("ColendiToken");

contract("ColendiToken", (accounts) => {

    owner = accounts[0]
    relayer = accounts[1]
    receiver = accounts[2]
    etherlessAccount = web3.eth.accounts.create();
    etherlessAddress = etherlessAccount.address;

    beforeEach(async function () {
        this.token = await ColendiToken.new();
    });

    describe('metaTransfer', async () => {

        it('initially nonce should be 0', async function () {
            const nonce = await this.token.currentNonce(etherlessAddress);
            expect(nonce).to.be.bignumber.equal('0')
        })

        it('transfer', async function () {
            const nonce = await this.token.currentNonce(etherlessAddress);
            const baseAmount = new BN(1e8);
            await this.token.transfer(etherlessAddress, baseAmount, {
                from: owner
            });
            const transferAmount = new BN(9e7)
            const rewardAmount = new BN(1e7)
            const method = "metaTransfer"
            const args = [
                receiver,
                web3.utils.toTwosComplement(transferAmount),
                web3.utils.toTwosComplement(nonce),
                web3.utils.toTwosComplement(rewardAmount)
            ]

            const messageHash = web3.utils.soliditySha3(this.token.address, method , ...args);
            const signature = etherlessAccount.sign(messageHash).signature;

            await this.token.metaTransfer(signature, ...args, {
                from: relayer,
            })
            expect(await this.token.balanceOf(etherlessAddress)).to.be.bignumber.equal('0')
            expect(await this.token.balanceOf(relayer)).to.be.bignumber.equal(rewardAmount)
            expect(await this.token.balanceOf(receiver)).to.be.bignumber.equal(transferAmount)
        })

    });

})