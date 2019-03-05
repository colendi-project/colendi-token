const parameterUtil = require("./parameterUtil");
const shell = require("shelljs")

async function setEnvironmentVariables() {
    const currentStage = process.env.NODE_ENV;
    const MNEMONIC = await parameterUtil.getParameter(
        currentStage,
        "MNEMONIC"
    );
    const INFURA_URL_KOVAN = await parameterUtil.getParameter(
        currentStage,
        "INFURA_URL_KOVAN"
    );
    const INFURA_KEY_KOVAN = await parameterUtil.getParameter(
        currentStage,
        "INFURA_KEY_KOVAN"
    );
    const gasPrice = parseInt(await parameterUtil.getParameter(
        currentStage,
        "GAS_PRICE"
    ));
    const gasAmount = parseInt(await parameterUtil.getParameter(
        currentStage,
        "GAS_AMOUNT"
    ));
    const CONTRACTS_TABLE = await parameterUtil.getParameter(
        currentStage,
        "CONTRACTS_TABLE"
    );

    process.env["MNEMONIC"] = MNEMONIC;
    process.env["INFURA_URL_KOVAN"] = INFURA_URL_KOVAN;
    process.env["INFURA_KEY_KOVAN"] = INFURA_KEY_KOVAN;
    process.env["gasPrice"] = gasPrice;
    process.env["gasAmount"] = gasAmount;
    process.env["CONTRACTS_TABLE"] = CONTRACTS_TABLE;

}
(async () => {
    await setEnvironmentVariables();
    shell.exec(`truffle migrate --network kovan --reset --env ${process.env.NODE_ENV}`)
})();

