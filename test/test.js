const { BN, constants, expectEvent, shouldFail } = require('openzeppelin-test-helpers');
const { expect } = require('chai');
const { ZERO_ADDRESS } = constants;

const ColendiToken = artifacts.require("ColendiToken");

contract("ColendiToken", (accounts) => {
const tokenAmount = new BN(2e9)
const powData = new BN(10)
const decimals = new BN(18)
const initialSupply = tokenAmount.mul(powData.pow(decimals))

owner = accounts[0]
anotherAccount = accounts[1]
receiver = accounts[2]

beforeEach(async function () {
        this.token = await ColendiToken.new();
   
    });
    describe('total supply', () => {
        it('returns the total amount of tokens', async function () {
            expect(await this.token.totalSupply()).to.be.bignumber.equal(initialSupply)
        });
    })

    describe('balanceOf', function () {
        describe('when the requested account has no tokens', function () {
          it('returns zero', async function () {
            expect(await this.token.balanceOf(anotherAccount)).to.be.bignumber.equal('0');
          });
        });
    
        describe('when the requested account has some tokens', function () {
          it('returns the total amount of tokens', async function () {
            expect(await this.token.balanceOf(owner)).to.be.bignumber.equal(initialSupply);
          });
        });
      });

      describe('transfer', function () {
        describe('when the recipient is not the zero address', function () {
          const to = receiver;
    
          describe('when the sender does not have enough balance', function () {
            const amount = initialSupply.addn(1);
    
            it('reverts', async function () {
              await shouldFail.reverting(this.token.transfer(to, amount, { from: owner }));
            });
          });
    
          describe('when the sender has enough balance', function () {
            const amount = initialSupply;
    
            it('transfers the requested amount', async function () {
              await this.token.transfer(to, amount, { from: owner });
    
              expect(await this.token.balanceOf(owner)).to.be.bignumber.equal('0');
    
              expect(await this.token.balanceOf(to)).to.be.bignumber.equal(amount);
            });
    
            it('emits a transfer event', async function () {
              const { logs } = await this.token.transfer(to, amount, { from: owner });
    
              expectEvent.inLogs(logs, 'Transfer', {
                from: owner,
                to: to,
                value: amount,
              });
            });
          });
        });
    
        describe('when the recipient is the zero address', function () {
          const to = ZERO_ADDRESS;
    
          it('reverts', async function () {
            await shouldFail.reverting(this.token.transfer(to, initialSupply, { from: owner }));
          });
        });
      });
      

});

