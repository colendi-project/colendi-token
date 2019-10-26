module.exports = {
    port: 8545,
    copyPackages: ['openzeppelin-solidity'],
    skipFiles: ['Migrations.sol', 'Dummy.sol'],
    norpc: false,
    testrpcOptions: `-m "${process.env.MNEMONIC}"`,
    testCommand: 'export ETHEREUM_RPC_PORT=8545&& truffle test --network coverage --timeout 10000',

}