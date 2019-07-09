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
const Dummy = artifacts.require("Dummy");


contract("ColendiToken", (accounts) => {

    owner = accounts[0]
    relayer = accounts[1]
    receiver = accounts[2]
    etherlessAccount = web3.eth.accounts.create();
    etherlessAddress = etherlessAccount.address;

    beforeEach(async function () {
        this.token = await ColendiToken.new();
        this.dummy = await Dummy.new(this.token.address);
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

            const messageHash = web3.utils.soliditySha3(this.token.address, method, ...args);
            const signature = etherlessAccount.sign(messageHash).signature;

            await this.token.metaTransfer(signature, ...args, {
                from: relayer,
            })
            expect(await this.token.balanceOf(etherlessAddress)).to.be.bignumber.equal('0')
            expect(await this.token.balanceOf(relayer)).to.be.bignumber.equal(rewardAmount)
            expect(await this.token.balanceOf(receiver)).to.be.bignumber.equal(transferAmount)
        })

    });

    describe('metaApproveAndCall', async () => {

        it('initially nonce should be 0', async function () {
            const nonce = await this.token.currentNonce(etherlessAddress);
            expect(nonce).to.be.bignumber.equal('0')
        })

        it('successfuly approve and call', async function () {
            const nonce = await this.token.currentNonce(etherlessAddress);
            const baseAmount = new BN(4).mul(new BN(10).pow(new BN(18)));
            await this.token.transfer(etherlessAddress, baseAmount, {
                from: owner
            });
            const data = this.dummy.contract.methods.setValue(etherlessAddress, 200).encodeABI();

            const rewardAmount = baseAmount.divn(2);
            const method = "metaApproveAndCall"

            const args = [
                this.dummy.address,
                web3.utils.toTwosComplement(rewardAmount),
                data,
                web3.utils.toTwosComplement(nonce),
                web3.utils.toTwosComplement(rewardAmount)
            ]

            const messageHash = web3.utils.soliditySha3(this.token.address, method, ...args);
            const signature = etherlessAccount.sign(messageHash).signature;


            await this.token.metaApproveAndCall(signature, ...args, {
                from: relayer,
            })

            expect(await this.dummy.random()).to.be.bignumber.equal('200')

        })

    });

    describe('When sender does not have enough balance', async () => {


        it('transfer fails', async function () {
            const nonce = await this.token.currentNonce(etherlessAddress);
            const baseAmount = new BN(0);
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

            const messageHash = web3.utils.soliditySha3(this.token.address, method, ...args);
            const signature = etherlessAccount.sign(messageHash).signature;

            await this.token.metaTransfer(signature, ...args, {
                from: relayer,
            })
            // expect(await this.token.balanceOf(etherlessAddress)).to.be.bignumber.equal('0')
            // expect(await this.token.balanceOf(relayer)).to.be.bignumber.equal(rewardAmount)
            // expect(await this.token.balanceOf(receiver)).to.be.bignumber.equal(transferAmount)
            const amount = transferAmount.addn(1);
            it('reverts', async function () {
                await shouldFail.reverting(this.token.metaTransfer(to, amount, {
                    from: owner
                }));
            });
        })

    });


})