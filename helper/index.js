const Caver = require('caver-js')
const caver = new Caver('https://api.baobab.klaytn.net:8651')

/**
 * create Solidity data type bytes32 from Javascript String data type. 
 * @method stringToBytes32
 * @param {String} stringData
 * @return {String} bytes32
 */
const stringToBytes32 = (stringData) => {
  /**
   * E.g. input: '210511986' 
   * output: '0x3231303531313938360000000000000000000000000000000000000000000000'
   */
  if (!caver.utils._.isString(stringData)) {
      throw new Error(`The parameter ${stringData} must be a valid string.`);
  }
  hexConverted = caver.utils.asciiToHex(stringData);
  bytes32 = caver.utils.padRight(hexConverted, 64);
  return bytes32;
}

/**
 * convert bytes32 to Javascript String data type.
 * @param {Stirng} bytes32
 * @return {String} ascii 
 */
const bytes32ToString = (bytes32) => {
  /**
   * E.g. input: '0x3231303531313938360000000000000000000000000000000000000000000000'
   * output: '210511986'
   */
  if (!caver.utils._.isString(bytes32)) {
      throw new Error(`The parameter ${stringData} must be a valid HEX string.`);
  }
  ascii = caver.utils.hexToAscii(bytes32);
  return ascii;
}

module.exports = {
  stringToBytes32: stringToBytes32,
  bytes32ToString: bytes32ToString
}