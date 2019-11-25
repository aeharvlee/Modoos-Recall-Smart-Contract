const assert = require('assert').strict
const KoreaVehicleVendors = artifacts.require("KoreaVehicleVendors")
const Recall = artifacts.require("Recall")

contract("Modoo's Recall Test", async accounts => {
  let koreaVehicleVendors = undefined
  let recall = undefined
  before("setup contract", async accounts => {
    koreaVehicleVendors = await KoreaVehicleVendors.deployed()
    recall = await Recall.deployed()
  })

  it("owner must be accounts[0]", async accounts => {
    const owner = await koreaVehicleVendors.owner.call()
    assert(owner, accounts[0])
  }) 

  it("owner must be accounts[0]", async accounts => {
    const owner = await recall.owner.call()
    assert(owner, accounts[0])
  })
})