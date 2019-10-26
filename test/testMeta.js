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
const faker = require('faker');

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
        describe('When sender has enough balance', async function () {

            it('should revert if signature is not valid', async function () {
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
                    web3.utils.toTwosComplement(rewardAmount),
                ]

                const messageHash = web3.utils.soliditySha3(this.token.address, method, ...args);
                let signature = etherlessAccount.sign(messageHash);
                signature = manipulateSignature(signature);

                await shouldFail.reverting(this.token.metaTransfer(signature.signature, ...args, {
                    from: relayer,
                }))
            })

            it('should revert if nonce does not match', async function () {
                const nonce = await this.token.currentNonce(etherlessAddress);
                const manipulatedNonce = nonce.addn(faker.random.number({min:5, max:1000}));
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
                    web3.utils.toTwosComplement(manipulatedNonce),
                    web3.utils.toTwosComplement(rewardAmount),
                ]

                const messageHash = web3.utils.soliditySha3(this.token.address, method, ...args);
                let signature = etherlessAccount.sign(messageHash);
                signature = getSignatureInLowerRange(signature);

                await shouldFail.reverting(this.token.metaTransfer(signature.signature, ...args, {
                    from: relayer,
                }))
            })

            
            it('transfers the requested amount', async function () {
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
                    web3.utils.toTwosComplement(rewardAmount),
                ]

                const messageHash = web3.utils.soliditySha3(this.token.address, method, ...args);
                let signature = etherlessAccount.sign(messageHash);
                signature = getSignatureInLowerRange(signature);

                await this.token.metaTransfer(signature.signature, ...args, {
                    from: relayer,
                })
                expect(await this.token.balanceOf(etherlessAddress)).to.be.bignumber.equal('0')
                expect(await this.token.balanceOf(relayer)).to.be.bignumber.equal(rewardAmount)
                expect(await this.token.balanceOf(receiver)).to.be.bignumber.equal(transferAmount)
            })

            it('transfers the requested amount even relayer accepts transactions without reward', async function () {
                const nonce = await this.token.currentNonce(etherlessAddress);
                const baseAmount = new BN(1e8);
                await this.token.transfer(etherlessAddress, baseAmount, {
                    from: owner
                });
                const transferAmount = new BN(9e7)
                const method = "metaTransfer"
                const args = [
                    receiver,
                    web3.utils.toTwosComplement(transferAmount),
                    web3.utils.toTwosComplement(nonce),
                    web3.utils.toTwosComplement(0),
                ]

                const messageHash = web3.utils.soliditySha3(this.token.address, method, ...args);
                let signature = etherlessAccount.sign(messageHash);
                signature = getSignatureInLowerRange(signature);

                await this.token.metaTransfer(signature.signature, ...args, {
                    from: relayer,
                })
                expect(await this.token.balanceOf(receiver)).to.be.bignumber.equal(transferAmount)
            })


        });
        describe('When sender does not have enough balance', async function () {
            it('transfer fails', async function () {
                const nonce = await this.token.currentNonce(etherlessAddress);
                const baseAmount = new BN(200).mul(new BN(10).pow(new BN(18)));
                await this.token.transfer(etherlessAddress, baseAmount, {
                    from: owner
                });
                const transferAmount = baseAmount;
                const rewardAmount = baseAmount.divn(10);
                const method = "metaTransfer"
                const args = [
                    receiver,
                    web3.utils.toTwosComplement(transferAmount),
                    web3.utils.toTwosComplement(nonce),
                    web3.utils.toTwosComplement(rewardAmount),
                ]

                const messageHash = web3.utils.soliditySha3(this.token.address, method, ...args);
                let signature = etherlessAccount.sign(messageHash);
                signature = getSignatureInLowerRange(signature);

                it('reverts', async function () {
                    await shouldFail.reverting(this.token.metaTransfer(signature.signature, ...args, {
                        from: relayer
                    }));
                });
            })

        });

    });

    describe('metaApprove', async () => {
        describe('When the spender has enough balance', async function () {
            it('approves the requested amount', async function () {
                const nonce = await this.token.currentNonce(etherlessAddress);
                const allowanceAmount = new BN(9e7)
                const rewardAmount = new BN(1e7)

                // etherless account should have tokens gte rewardAmount
                await this.token.transfer(etherlessAddress, rewardAmount, {
                    from: owner
                });

                const method = "metaApprove"
                const args = [
                    receiver,
                    web3.utils.toTwosComplement(allowanceAmount),
                    web3.utils.toTwosComplement(nonce),
                    web3.utils.toTwosComplement(rewardAmount),
                ]

                const messageHash = web3.utils.soliditySha3(this.token.address, method, ...args);
                let signature = etherlessAccount.sign(messageHash);
                signature = getSignatureInLowerRange(signature);

                await this.token.metaApprove(signature.signature, ...args, {
                    from: relayer,
                })

                expect(await this.token.allowance(etherlessAddress, receiver)).to.be.bignumber.equal(allowanceAmount)

            })

        });

    });

    describe('metaTransferFrom', async () => {
        describe('When the spender has enough approved balance', async function () {
            it('transfers the requested amount', async function () {
                const nonce = await this.token.currentNonce(etherlessAddress);
                const transferAmount = new BN(9e7)
                const rewardAmount = new BN(1e7)

                // etherless account should have allowance
                await this.token.approve(etherlessAddress, transferAmount, {
                    from: owner
                });

                // etherless account should have tokens gte rewardAmount
                await this.token.transfer(etherlessAddress, rewardAmount, {
                    from: owner
                });

                const method = "metaTransferFrom"
                const args = [
                    owner,
                    receiver,
                    web3.utils.toTwosComplement(transferAmount),
                    web3.utils.toTwosComplement(nonce),
                    web3.utils.toTwosComplement(rewardAmount),

                ]

                const messageHash = web3.utils.soliditySha3(this.token.address, method, ...args);
                let signature = etherlessAccount.sign(messageHash);
                signature = getSignatureInLowerRange(signature);

                await this.token.metaTransferFrom(signature.signature, ...args, {
                    from: relayer,
                })
                expect(await this.token.balanceOf(receiver)).to.be.bignumber.equal(transferAmount)

            })

        });

    });

    describe('recoverSigner', async () => {
        it('recovers the signer address', async function () {
            const messageHash = web3.utils.soliditySha3(faker.random.number());
            let signature = etherlessAccount.sign(messageHash);
            signature = getSignatureInLowerRange(signature);
            const recoveredAddress = await this.token.recoverSigner(signature.messageHash, signature.signature);
            expect(recoveredAddress).to.be.a('string').equal(etherlessAddress);
        });

    })

    describe('approveAndCall', async () => {

        it('should revert if dummy transaction fails', async function () {
            const data = this.dummy.contract.methods.setValue(accounts[3], 200).encodeABI();
            await this.token.transfer(accounts[3], web3.utils.toWei('2', 'ether'), {
                from: owner
            });
            await shouldFail.reverting(this.token.approveAndCall(this.dummy.address, web3.utils.toWei('1', 'ether'), data, {
                from: accounts[3]
            }));

        });

        it('succesfully calls the contract after allowing to spend', async function () {
            const data = this.dummy.contract.methods.setValue(accounts[3], 200).encodeABI();
            await this.token.transfer(accounts[3], web3.utils.toWei('2', 'ether'), {
                from: owner
            });
            await this.token.approveAndCall(this.dummy.address, web3.utils.toWei('2', 'ether'), data, {
                from: accounts[3]
            });
            expect(await this.dummy.random()).to.be.bignumber.equal('200')

        });

    })



    describe('metaApproveAndCall', async () => {

        it('should revert if relayer tries to cheat using less gas than to user paid for', async function () {
            const nonce = await this.token.currentNonce(etherlessAddress);
            const baseAmount = new BN(4).mul(new BN(10).pow(new BN(18)));
            await this.token.transfer(etherlessAddress, baseAmount, {
                from: owner
            });
            const data = this.dummy.contract.methods.setValue(etherlessAddress, 200).encodeABI();

            const rewardAmount = baseAmount.divn(2);
            const method = "metaApproveAndCall"
            const gasLimit = new BN(2e5);

            const args = [
                this.dummy.address,
                web3.utils.toTwosComplement(rewardAmount),
                data,
                web3.utils.toTwosComplement(nonce),
                web3.utils.toTwosComplement(rewardAmount),
                web3.utils.toTwosComplement(gasLimit),
            ]

            const messageHash = web3.utils.soliditySha3(this.token.address, method, ...args);
            let signature = etherlessAccount.sign(messageHash);
            signature = getSignatureInLowerRange(signature);

            await shouldFail.reverting(this.token.metaApproveAndCall(signature.signature, ...args, {
                from: relayer,
                gas: gasLimit.divn(2),
            }))

        })

        it('should revert if nonce does not match', async function () {
            const nonce = await this.token.currentNonce(etherlessAddress);
            const manipulatedNonce = nonce.addn(5);
            console.log({
                manipulatedNonce
            });
            const baseAmount = new BN(4).mul(new BN(10).pow(new BN(18)));
            await this.token.transfer(etherlessAddress, baseAmount, {
                from: owner
            });
            const data = this.dummy.contract.methods.setValue(etherlessAddress, 200).encodeABI();

            const rewardAmount = baseAmount.divn(2);
            const method = "metaApproveAndCall"
            const gasLimit = new BN(2e5);

            const args = [
                this.dummy.address,
                web3.utils.toTwosComplement(rewardAmount),
                data,
                web3.utils.toTwosComplement(manipulatedNonce),
                web3.utils.toTwosComplement(rewardAmount),
                web3.utils.toTwosComplement(gasLimit),
            ]

            const messageHash = web3.utils.soliditySha3(this.token.address, method, ...args);
            let signature = etherlessAccount.sign(messageHash);
            signature = getSignatureInLowerRange(signature);

            await shouldFail.reverting(this.token.metaApproveAndCall(signature.signature, ...args, {
                from: relayer,
            }))

        })


        it('should revert if the signature is not valid', async function () {
            const nonce = await this.token.currentNonce(etherlessAddress);
            const baseAmount = new BN(4).mul(new BN(10).pow(new BN(18)));
            await this.token.transfer(etherlessAddress, baseAmount, {
                from: owner
            });
            const data = this.dummy.contract.methods.setValue(etherlessAddress, 200).encodeABI();

            const rewardAmount = baseAmount.divn(2);
            const method = "metaApproveAndCall"
            const gasLimit = new BN(2e5);

            const args = [
                this.dummy.address,
                web3.utils.toTwosComplement(rewardAmount),
                data,
                web3.utils.toTwosComplement(nonce),
                web3.utils.toTwosComplement(rewardAmount),
                web3.utils.toTwosComplement(gasLimit),
            ]


            const messageHash = web3.utils.soliditySha3(this.token.address, method, ...args);
            let signature = etherlessAccount.sign(messageHash);
            signature = manipulateSignature(signature);
            await shouldFail.reverting(this.token.metaApproveAndCall(signature.signature, ...args, {
                from: relayer,
            }))


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
            const gasLimit = new BN(2e5);

            const args = [
                this.dummy.address,
                web3.utils.toTwosComplement(rewardAmount),
                data,
                web3.utils.toTwosComplement(nonce),
                web3.utils.toTwosComplement(rewardAmount),
                web3.utils.toTwosComplement(gasLimit),
            ]

            const messageHash = web3.utils.soliditySha3(this.token.address, method, ...args);
            let signature = etherlessAccount.sign(messageHash);
            signature = getSignatureInLowerRange(signature);

            await this.token.metaApproveAndCall(signature.signature, ...args, {
                from: relayer,
            })

            expect(await this.dummy.random()).to.be.bignumber.equal('200')

        })

        it('successfuly approve and call without reward if relayer accepts', async function () {
            const nonce = await this.token.currentNonce(etherlessAddress);
            const baseAmount = new BN(4).mul(new BN(10).pow(new BN(18)));
            await this.token.transfer(etherlessAddress, baseAmount, {
                from: owner
            });
            const data = this.dummy.contract.methods.setValue(etherlessAddress, 200).encodeABI();

            const rewardAmount = baseAmount.divn(2);
            const method = "metaApproveAndCall"
            const gasLimit = new BN(2e5);

            const args = [
                this.dummy.address,
                web3.utils.toTwosComplement(rewardAmount),
                data,
                web3.utils.toTwosComplement(nonce),
                web3.utils.toTwosComplement(0),
                web3.utils.toTwosComplement(gasLimit),
            ]

            const messageHash = web3.utils.soliditySha3(this.token.address, method, ...args);
            let signature = etherlessAccount.sign(messageHash);
            signature = getSignatureInLowerRange(signature);

            await this.token.metaApproveAndCall(signature.signature, ...args, {
                from: relayer,
            })

            expect(await this.dummy.random()).to.be.bignumber.equal('200')

        })

    });

})


function getSignatureInLowerRange(signature) {
    const upperRange = 0x7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF5D576E7357A4501DDFE92F46681B20A0
    const bound = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141
    if (signature.s > upperRange) {
        console.log("...updating signature")
        console.log("signature Before : ", signature);
        signature.s = bound - signature.s;
        signature.v = signature.v == 0x1b ? "0x1c" : "0x1b"
        console.log("signature After : ", signature);
        signature.signature = signature.r + (signature.s.startsWith('0x') ? signature.s.substring(2) : signature.s) + (signature.v.startsWith('0x') ? signature.v.substring(2) : signature.v)
    }
    return signature;
}

function manipulateSignature(signature) {
    signature.v = "0x7b"
    signature.signature = signature.r + (signature.s.startsWith('0x') ? signature.s.substring(2) : signature.s) + (signature.v.startsWith('0x') ? signature.v.substring(2) : signature.v)

    return signature;
}