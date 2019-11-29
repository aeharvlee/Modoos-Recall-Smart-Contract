const assert = require('assert').strict
const Caver = require('caver-js')
const caver = new Caver('https://api.baobab.klaytn.net:8651')
const KoreaVehicleVendors = artifacts.require("KoreaVehicleVendors")
const Recall = artifacts.require("Recall")

contract("Modoo's Recall Test", async accounts => {
  let koreaVehicleVendors = undefined
  let recall = undefined
  let owner = undefined
  let alice = undefined
  let bob = undefined
  let hyundai = undefined
  const recallStatus = {
    'Created': 0,
    'RejectedByConsumer': 1,
    'RejectedByVendor': 2,
    'Proceeding': 3,
    'CompleteByVendor': 4,
    'ConfirmedByConsumer': 5
  }

  before("setup contract", async () => {
    koreaVehicleVendors = await KoreaVehicleVendors.deployed()
    recall = await Recall.deployed()
    alice = accounts[9] // customer
    bob = accounts[8]
    hyundai = accounts[1]
  })

  contract("Contract KoreaVehicleVendors Test", async () => {
    it("Auth: owner must be accounts[0]", async () => {
      owner = await koreaVehicleVendors.owner.call()
      assert.strictEqual(owner, accounts[0])
    })

    it("1-1: addVehicleVendor", async () => {
      try {
        const receipt =
          await koreaVehicleVendors.addVehicleVendor(
            caver.utils.asciiToHex('Hyundai'), 
            hyundai, 
            {from: owner}
          )
        assert.ok(receipt)
      } catch (error) {
        assert.fail(error)
      }
    })

    it("1-2: check vehicleVendor added by 1-1", async () => {
      let vehicleVendor = await koreaVehicleVendors.getVehicleVendorName(accounts[1])
      vehicleVendor = caver.utils.hexToAscii(vehicleVendor)
      vehicleVendor = vehicleVendor.replace(/\0/g, '')
      assert.strictEqual(vehicleVendor, 'Hyundai')
    })

    it("1-3: addVehicleVendor must add unique address only", async () => {
      try {
        const receipt = 
          await koreaVehicleVendors.addVehicleVendor(
            caver.utils.stringToHex('Kia'), 
            hyundai, 
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
      assert.strictEqual(owner, accounts[0])
    })

    it("1-1: alice call createRecall", async () => {
      try {
        // accounts[2] create recall for vehicle which has car registration number "KMHEM42APXA123456"
        await recall.createRecall(
          caver.utils.asciiToHex('RCLL_000000000017098'),
          hyundai,
          caver.utils.asciiToHex('KMHEM42APXA123456'),
          {from: alice}
        )
        assert.ok(true)
      } catch (error) {
        assert.fail(error)
      }
    })

    it("1-2: getRecallState added by 1-1", async () => {
      const recallState = await recall.getRecallState(
        caver.utils.asciiToHex('RCLL_000000000017098')
      )

      let primaryKey = recallState.primaryKey
      primaryKey = caver.utils.hexToAscii(primaryKey)
      primaryKey = primaryKey.replace(/\0/g, '')
      
      const customer = recallState.applicant

      let vehicleRegistrationNumber = recallState.vehicleRegistrationNumber
      vehicleRegistrationNumber = caver.utils.hexToAscii(recallState.vehicleRegistrationNumber)
      vehicleRegistrationNumber = vehicleRegistrationNumber.replace(/\0/g, '')

      let state = recallState.state
      state = state.toNumber()

      assert.strictEqual(primaryKey, 'RCLL_000000000017098')
      assert.strictEqual(customer, alice)
      assert.strictEqual(vehicleRegistrationNumber, 'KMHEM42APXA123456')
      assert.strictEqual(state, recallStatus['Created'])
    })

    it("1-3: alice rejectRecall", async () => {
      try {
        const receipt = await recall.rejectRecallByCustomer(
          caver.utils.asciiToHex('RCLL_000000000017098'),
          hyundai,
          caver.utils.asciiToHex('Engine Fault'),
          {from: alice}
        )
        const recallState = await recall.getRecallState(
          caver.utils.asciiToHex('RCLL_000000000017098')
        )
        let primaryKey = recallState.primaryKey
        primaryKey = caver.utils.hexToAscii(primaryKey)
        primaryKey = primaryKey.replace(/\0/g, '')
        
        const customer = recallState.applicant

        let vehicleRegistrationNumber = caver.utils.hexToAscii(recallState.vehicleRegistrationNumber)
        vehicleRegistrationNumber = vehicleRegistrationNumber.replace(/\0/g, '')

        let state = recallState.state
        state = state.toNumber()

        assert.strictEqual(alice, customer)
        assert.strictEqual(primaryKey, 'RCLL_000000000017098')
        assert.strictEqual(vehicleRegistrationNumber, 'KMHEM42APXA123456')
        assert.strictEqual(state, recallStatus['RejectedByConsumer'])

      } catch (error) {
        assert.fail(error) 
      }
    })

    it("2-1: Hyundai call proceedRecall by alice", async () => {
      try {
        await recall.proceedRecall(
          caver.utils.asciiToHex('RCLL_000000000017098'),
          {from: hyundai}
        )
        const recallState = await recall.getRecallState(
          caver.utils.asciiToHex('RCLL_000000000017098')
        )
        let state = recallState.state
        state = state.toNumber()
        
        assert.strictEqual(state, recallStatus['Proceeding']) // recallState.Proceeding

      } catch (error) {
        assert.fail(error) 
      }
    })

    it("2-2: Hyundai call proceedRecall engine recall by alice", async () => {
      try {
        const receipt = await recall.proceedRecall(
          caver.utils.asciiToHex('RCLL_000000000017098'),
          {from: hyundai}
        )
        const recallState = await recall.getRecallState(
          caver.utils.asciiToHex('RCLL_000000000017098')
        )
        let state = recallState.state
        state = state.toNumber()
        
        assert.strictEqual(state, recallStatus['Proceeding']) // recallState.Proceeding

      } catch (error) {
        assert.fail(error) 
      }
    })
  })

  it("2-3: Hyundai call createRepairSheet 3times about recall by alice", async () => {
    try {
      await recall.createRepairSheet(
          caver.utils.asciiToHex('RCLL_000000000017098'),
          caver.utils.asciiToHex('Engine'),
          caver.utils.asciiToHex('Engine Complete'),
          {from: hyundai}
      )
      await recall.createRepairSheet(
        caver.utils.asciiToHex('RCLL_000000000017098'),
        caver.utils.asciiToHex('Wheel'),
        caver.utils.asciiToHex('Wheel Complete'),
        {from: hyundai}
    )
      await recall.createRepairSheet(
        caver.utils.asciiToHex('RCLL_000000000017098'),
        caver.utils.asciiToHex('Window'),
        caver.utils.asciiToHex('Window Complete'),
        {from: hyundai}
      )

      const length = await recall.getLengthOfRepairSheetList(
        caver.utils.asciiToHex('RCLL_000000000017098'),
        {from: hyundai}
      )

      for (let i = 0; i < length; i++) {
        let repairSheet = await recall.getRepairSheet(
          caver.utils.asciiToHex('RCLL_000000000017098'),
          i
        )
        repairSheet.parts = caver.utils.hexToAscii(repairSheet.parts);
        repairSheet.parts = repairSheet.parts.replace(/\0/g, '')
        repairSheet.repairDescription = caver.utils.hexToAscii(repairSheet.repairDescription);
        repairSheet.repairDescription = repairSheet.repairDescription.replace(/\0/g, '') 
        console.log(repairSheet);
      }
      
    } catch (error) {
      assert.fail(error) 
    }
  })
  
})