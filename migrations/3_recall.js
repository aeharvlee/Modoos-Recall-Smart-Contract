const fs = require('fs')
const Recall = artifacts.require("Recall")

const addressOfKoreaVehicleVendors = fs.readFileSync('../addressOfKoreaVehicleVendors', 'utf-8')

module.exports = function(deployer) {
  deployer
    .deploy(Recall, addressOfKoreaVehicleVendors)
    .then(() => {
      let contractName = undefined

      if (Recall._json) {
        fs.writeFile(
          'metadataOfRecall',
          JSON.stringify(Recall._json, 2),
          (err) => {
            if (err) throw err
            contractName = Recall._json.contractName
            console.log(`The metadata of ${contractName} is recorded on ${contractName} file`)
          }
        )
      }
      fs.writeFile(
        'addressOfRecall',
        Recall.address,
        (err) => {
          if (err) throw err
          console.log(`The deployed address of ${contractName} is ${Recall.address}`)
        }
      )
    })
}
