var express = require('express');
var router = express.Router();

const Caver = require('caver-js')
const caver = new Caver('https://api.baobab.klaytn.net:8651')
const contract = require(`${__dirname}/../config/contract`)
const keystore = require(`${__dirname}/../config/keystore`)
const helper = require(`${__dirname}/../helper`)

const recall = contract.recall
const keyChain = keystore.keyChain

feePayer = caver.klay.accounts.wallet.add(
  keyChain['government']['privateKey'],
  keyChain['government']['address']
)

hyundai = caver.klay.accounts.wallet.add(
  keyChain['hyundai']['privateKey'],
  keyChain['hyundai']['address']
)

kia = caver.klay.accounts.wallet.add(
  keyChain['kia']['privateKey'],
  keyChain['kia']['address']
)

router.get('/create', async function(req, res, next) {
	docno = req.query.infoId
	address = req.query.user_id
	user_privatekey = req.query.user_privatekey
	vendorName = req.query.vendor_name
  registrationNumber = req.query.serialno


	const abiCreateRecall = recall.methods.createRecall(
		helper.stringToBytes32(docno),
		keyChain[vendorName]['address'], 
		helper.stringToBytes32(registrationNumber)
  ).encodeABI()

  let feeDelegatedSmartContractObject = {
    type: 'FEE_DELEGATED_SMART_CONTRACT_EXECUTION',
    from: keyChain[vendorName]['address'],
    to: recall._address,
    data: abiCreateRecall,
    gas: '300000',
  };

  let rlpEncodedTransaction = null;
  try {
      rlpEncodedTransaction = await caver.klay.accounts.signTransaction(
          feeDelegatedSmartContractObject,
		      keyChain[vendorName]['privateKey'], 
      );
  } catch (error) {
      console.log(error);
      throw Error(error);
  }

  let receipt = null;
  try {
      receipt = await caver.klay.sendTransaction({
          senderRawTransaction: rlpEncodedTransaction.rawTransaction,
          feePayer: feePayer.address
      });
  } catch (error) {
      throw Error(error);
  }

  console.log(receipt)
  res.send(receipt);
});

module.exports = router;