const AWS = require("aws-sdk");

AWS.config.update({ region: "us-east-1" });
const ssm = new AWS.SSM();

module.exports.getParameter = (stage, key) => {
  return getSSMParams(stage, key)
    .then(res => {
      return res;
    })
    .catch(err => {
      return err;
    });
}

function getSSMParams(stage, key) {
  return new Promise(function(resolve, reject) {
    var result = "";

    const param = {
      Name: `/${stage || "dev"}/${key}`,
      WithDecryption: true
    };

    ssm.getParameter(param, (err, data) => {
      if (err) {
        reject(err);
      }

      try {
        result = data.Parameter.Value;
      } catch (error) {
        result = error;
      }
      resolve(result);
    });
  });
}