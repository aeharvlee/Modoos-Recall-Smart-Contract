const Caver = require('caver-js')
const caver = new Caver('https://api.baobab.klaytn.net:8651')
const contract = require(`${__dirname}/../config/contract`)
const keystore = require(`${__dirname}/../config/keystore`)
const helper = require(`${__dirname}/../helper`)

const koreaVehicleVendors = contract.koreaVehicleVendors
const recall = contract.recall
const keyChain = keystore.keyChain

const setup = async () => {
  // government add account info in klaytn wallet
  const feePayer = await caver.klay.accounts.wallet.add(
    keyChain['government']['privateKey'],
    keyChain['government']['address'],
  )

  // add hyundai to vendor
  const abiAddVehicleVendor = koreaVehicleVendors.methods.addVehicleVendor(
    helper.stringToBytes32('Hyundai'),
    keyChain['hyundai']['address']
  ).encodeABI()

  const receipt = await caver.klay.sendTransaction({
    type: 'SMART_CONTRACT_EXECUTION',
    from: keyChain['government']['address'],
    to: koreaVehicleVendors._address,
    data: abiAddVehicleVendor,
    gas: '300000',
  })
  console.log(receipt)

  // add kia to vendor
  const abiAddVehicleVendor = koreaVehicleVendors.methods.addVehicleVendor(
    helper.stringToBytes32('Kia'),
    keyChain['kia']['address']
  ).encodeABI()

  const receipt = await caver.klay.sendTransaction({
    type: 'SMART_CONTRACT_EXECUTION',
    from: keyChain['government']['address'],
    to: koreaVehicleVendors._address,
    data: abiAddVehicleVendor,
    gas: '300000',
  })
  console.log(receipt) 

  let vendorName = await koreaVehicleVendors.methods.getVehicleVendorName(keyChain['hyundai']['address']).call()
  vendorName = helper.bytes32ToString(vendorName)
  console.log(vendorName)

  vendorName = await koreaVehicleVendors.methods.getVehicleVendorName(keyChain['kia']['address']).call()
  vendorName = helper.bytes32ToString(vendorName)
  console.log(vendorName)
}
setup()