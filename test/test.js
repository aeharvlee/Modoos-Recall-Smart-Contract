const assert = require('assert').strict
const KoreaVehicleVendors = artifacts.require("KoreaVehicleVendors")
const Recall = artifacts.require("Recall")

contract("Modoo's Recall Test", async accounts => {
  let koreaVehicleVendors = undefined
  let recall = undefined
  let owner = undefined

  before("setup contract", async () => {
    console.log("setup contract")
    koreaVehicleVendors = await KoreaVehicleVendors.deployed()
    recall = await Recall.deployed()
  })

  contract("Contract KoreaVehicleVendors Test", async () => {
    it("owner must be accounts[0]", async () => {
      console.log("owner must be accounts[0]")
      owner = await koreaVehicleVendors.owner.call()
      assert(owner, accounts[0])
    }) 
  })

  contract("Contract Recall Test", async () => {
    it("owner must be accounts[0]", async () => {
      console.log("owner must be accounts[0]")
      owner = await recall.owner.call()
      assert(owner, accounts[0])
    })
  })
})