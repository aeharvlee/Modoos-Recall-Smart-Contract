const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const Caver = require('caver-js')
const caver = new Caver('https://api.baobab.klaytn.net:8651')
const contract = require(`${__dirname}/../config/contract`)

const koreaVehicleVendors = contract.koreaVehicleVendors
const recall = contract.recall

const app = express()

app.use(helmet())
app.use(bodyParser.json())
app.use(cors())
app.use(morgan('combined'))

const result = [
  {message: 'Hello, world (again)!'}
]

app.get('/', async (req, res) => {
  res.send(result)
})

app.listen(3001, () => {
  console.log('listening on port 3001')
})