const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const Caver = require('caver-js')
const caver = new Caver('https://api.baobab.klaytn.net:8651')
const contract = require(`${__dirname}/../config/contract`)
const keystore = require(`${__dirname}/../config/keystore`)

const koreaVehicleVendors = contract.koreaVehicleVendors
const recall = contract.recall
const keyChain = keystore.keyChain

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(helmet())
app.use(bodyParser.json())
app.use(cors())
app.use(morgan('combined'))

const result = [
  {message: 'Hello, world (again)!'}
]

app.post('/', async (req, res) => {
  const feePayer = await caver.klay.accounts.wallet.add(
    keyChain['government']['privateKey'],
    keyChain['government']['address'],
  )

  const data = req.body
  console.log(data)
  const abiCreateRecall = recall.methods.createRecall(
    helper.stringToBytes32(data.primaryKey),
    keyChain[data.vendorName]['address'], 
    helper.stringToBytes32(data.vehicleRegistrationNumber)
  ).encodeABI()

  let receipt = undefined
  try {
    receipt = await helper.feeDelegatedSmartContractExecute(
      keyChain[data.vendorName]['address'],
      keyChain[data.vendorName]['privateKey'],
      recall._address,
      feePayer,
      abiCreateRecall
    )
  } catch (error) {
    console.log(error)
  }

  console.log(receipt)

})

app.listen(3001, () => {
  console.log('listening on port 3001')
})