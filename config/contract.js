const fs = require('fs')
const Caver = require('caver-js')
const caver = new Caver('https://api.baobab.klaytn.net:8651')

const metadataOfKoreaVehicleVendors = fs.readFileSync(`${__dirname}/../metadataOfKoreaVehicleVendors`, 'utf-8')
const addressOfKoreaVehicleVendors = fs.readFileSync(`${__dirname}/../addressOfKoreaVehicleVendors`, 'utf-8')
const abiOfKoreaVehicleVendors = JSON.parse(metadataOfKoreaVehicleVendors).abi

const metadataOfRecall = fs.readFileSync(`${__dirname}/../metadataOfRecall`, 'utf-8')
const addressOfRecall = fs.readFileSync(`${__dirname}/../addressOfRecall`, 'utf-8')
const abiOfRecall = JSON.parse(metadataOfRecall.abi)

const koreaVehicleVendors = new caver.klay.Contract(abiOfKoreaVehicleVendors, addressOfKoreaVehicleVendors)
const recall = new caver.klay.Contract(abiOfRecall, addressOfRecall)

module.exports = {
  koreaVehicleVendors: koreaVehicleVendors,
  recall: recall
}