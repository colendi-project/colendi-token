const parameterUtil = require("./parameterUtil");

async function getEnvironmentVariables(currentStage) {
    const INFURA_URL_KOVAN = await parameterUtil.getParameter(
        currentStage,
        "INFURA_URL_KOVAN"
    );
    const INFURA_KEY_KOVAN = await parameterUtil.getParameter(
        currentStage,
        "INFURA_KEY_KOVAN"
    );
    const CONTRACTS_TABLE = await parameterUtil.getParameter(
        currentStage,
        "CONTRACTS_TABLE"
    );

    process.env["INFURA_URL_KOVAN"] = INFURA_URL_KOVAN;
    process.env["INFURA_KEY_KOVAN"] = INFURA_KEY_KOVAN;
    process.env["CONTRACTS_TABLE"] = CONTRACTS_TABLE;
    
}
module.exports = {
    getEnvironmentVariables
}

