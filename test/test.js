const assert = require('assert').strict
const Caver = require('caver-js')
const caver = new Caver('https://api.baobab.klaytn.net:8651')
const KoreaVehicleVendors = artifacts.require("KoreaVehicleVendors")
const Recall = artifacts.require("Recall")

contract("Modoo's Recall Test", async accounts => {
  let koreaVehicleVendors = undefined
  let recall = undefined
  let owner = undefined

  before("setup contract", async () => {
    koreaVehicleVendors = await KoreaVehicleVendors.deployed()
    recall = await Recall.deployed()
  })

  contract("Contract KoreaVehicleVendors Test", async () => {
    it("owner must be accounts[0]", async () => {
      owner = await koreaVehicleVendors.owner.call()
      assert(owner, accounts[0])
    })

    it("1-1: addVehicleVendor must be executed by owner", async () => {
      try {
        const receipt =
          await koreaVehicleVendors.addVehicleVendor(
            caver.utils.asciiToHex('Hyundai'), 
            accounts[1], 
            {from: owner}
          )
        assert.ok(receipt)
      } catch (error) {
        assert.fail(error)
      }
    })

    it("1-2: check vehicleVendor added by 1-1", async () => {
      const vehicleVendor = await koreaVehicleVendors.getVehicleVendor(accounts[1])
      assert(caver.utils.hexToAscii(vehicleVendor), 'Hyundai')
    })

    it("1-3: addVehicleVendor must add unique address only", async () => {
      try {
        const receipt = 
          await koreaVehicleVendors.addVehicleVendor(
            caver.utils.stringToHex('Kia'), 
            accounts[1], 
            {from: owner}
          )
        assert.fail('must be fail but succeeded')
      } catch (error) {
        assert.ok(true)
      }
    })
  })

  contract("Contract Recall Test", async () => {
    it("owner must be accounts[0]", async () => {
      owner = await recall.owner.call()
      assert(owner, accounts[0])
    })

    it("1-1: createRecall", async () => {
      try {
        await recall.createRecall(
          caver.utils.asciiToHex('KMHEM42APXA123456'),
          {from: accounts[2]}
        )
        assert.ok(true)
      } catch (error) {
        assert.fail(error)
      }
    })

    it("1-2: getRecallState added by 1-1", async () => {
      const recallState = await recall.getRecallState(accounts[2])
      assert(accounts[2], recallState.applicant)
      assert('KMHEM42APXA123456', caver.utils.hexToAscii(recallState.vehicleRegistrationNumber))
      assert('0', recallState.state.toString())
    })
  })
})