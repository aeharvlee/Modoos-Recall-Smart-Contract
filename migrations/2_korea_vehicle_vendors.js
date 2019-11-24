const fs = require('fs');
const KoreaVehicleVendors = artifacts.require("KoreaVehicleVendors");

module.exports = function(deployer) {
  deployer
    .deploy(KoreaVehicleVendors)
    .then(() => {
      let contractName = undefined;

      if (KoreaVehicleVendors._json) {
        fs.writeFile(
          'metadataOfKoreaVehicleVendors',
          JSON.stringify(KoreaVehicleVendors._json, 2),
          (err) => {
            if (err) throw err;
            contractName = KoreaVehicleVendors._json.contractName;
            console.log(`The metadata of ${contractName} is recorded on ${contractName} file`);
          }
        )
      }
      fs.writeFile(
        'addressOfKoreaVehicleVendors',
        KoreaVehicleVendors.address,
        (err) => {
          if (err) throw err;
          console.log(`The deployed address of ${contractName} is ${KoreaVehicleVendors.address}`);
        }
      );
    });
};
