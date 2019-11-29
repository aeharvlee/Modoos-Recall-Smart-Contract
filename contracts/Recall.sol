pragma solidity >=0.4.21 <0.6.0;

import "../node_modules/@openzeppelin/contracts/ownership/Ownable.sol";
import "./KoreaVehicleVendors.sol";

contract Recall is Ownable{

  enum recallState { Created, RejectedByConsumer, RejectedByVendor, Proceeding, CompleteByVendor, ConfirmedByConsumer }

  struct RepairSheet {
    bytes32 parts;
    bytes32 repairDescription;
  }

  struct RecallState {
    bytes32 primaryKey;
    address vendor;
    address applicant;
    bytes32 vehicleRegistrationNumber;
    recallState state;
    uint32 score;
    RepairSheet[] repairSheetList;
    bool isExist;
  }

  /** @dev
   * mapping (primary key) with (recall state)
   */
  mapping (bytes32 => RecallState) recallStates;

  modifier onlyVendorAllowed(address _addr) {
    require(
      koreaVehicleVendors.isVehicleVendor(_addr),
      "Only vendor allowed"
    );
    _;
  }

  event AddRecallSheet();

  event CreateRecall(bytes32 primaryKey, address indexed vendor, address indexed applicant, bytes32 vehicleRegistrationNumber);
  event UpdateRecall(bytes32 primaryKey, address indexed vendor, address indexed applicant, recallState state);
  event RejectRecallByVendor(bytes32 primaryKey, address indexed vendor, address indexed applicant, bytes32 reason);
  event RejectRecallByCustomer(bytes32 primaryKey, address indexed vendor, address indexed applicant, bytes32 reason);

  KoreaVehicleVendors public koreaVehicleVendors;

  /** @dev Recall contract is tied with KoreaVehicleVendors.
   *
   */
  constructor(address addressOfKoreaVehicleVendors) public {
    koreaVehicleVendors = KoreaVehicleVendors(addressOfKoreaVehicleVendors);
  }

  /** @dev applicant who knows vehicleRegistrationNumber can create recall
   * @param _primaryKey index of database of Modoo's Recall
   * @param _vendor address of vehicle vendor like "Hyundai", "Kia"
   * @param _vehicleRegistrationNumber vehicle registration number
   */ 
  function createRecall (
    bytes32 _primaryKey,
    address _vendor,
    bytes32 _vehicleRegistrationNumber
  )
  public 
  {
    recallStates[_primaryKey].primaryKey = _primaryKey;
    recallStates[_primaryKey].applicant = msg.sender;
    recallStates[_primaryKey].vehicleRegistrationNumber = _vehicleRegistrationNumber;
    recallStates[_primaryKey].state = recallState.Created;
    recallStates[_primaryKey].score = 0;
    recallStates[_primaryKey].isExist = true;

    emit CreateRecall(_primaryKey, _vendor, msg.sender, _vehicleRegistrationNumber);
  }

  /** @dev applicant who knows vehicleRegistrationNumber can create recall
   * @param _primaryKey index of database of Modoo's Recall
   */
  function proceedRecall (
    bytes32 _primaryKey
  )
  public
  //onlyVendorAllowed(msg.sender)
  {
    recallStates[_primaryKey].state = recallState.Proceeding;
    emit UpdateRecall(_primaryKey, msg.sender, recallStates[_primaryKey].applicant, recallStates[_primaryKey].state);
  }

  /** @dev create repair sheet
   * @param _primaryKey index of database of Modoo's Recall
   * @param _parts parts to be repaired
   */
  function createRepairSheet (
    bytes32 _primaryKey,
    bytes32 _parts,
    bytes32 _repairDescription
  )
  public
  //onlyVendorAllowed(msg.sender)
  {
    recallStates[_primaryKey].repairSheetList.push(
      RepairSheet(_parts, _repairDescription)
    );
  }

  function getLengthOfRepairSheetList (
    bytes32 _primaryKey
  )
  public
  view
  returns (uint length)
  {
    return recallStates[_primaryKey].repairSheetList.length;
  }

  function getRepairSheet (
    bytes32 _primaryKey,
    uint256 _index
  )
  public
  view
  returns (
    bytes32 parts,
    bytes32 repairDescription
  )
  {
    return ((
      recallStates[_primaryKey].repairSheetList[_index].parts,
      recallStates[_primaryKey].repairSheetList[_index].repairDescription
    ));
  }

  /** @dev for some reason, vendor can reject recall
   * @param _primaryKey index of database of Modoo's Recall
   * @param _applicant address of customer who request recall
   * @param _reason why recall is rejected
   */
  function rejectRecallByVendor (
    bytes32 _primaryKey,
    address _applicant,
    bytes32 _reason
  )
  public
  onlyVendorAllowed(msg.sender)
  {
    recallStates[_primaryKey].state = recallState.RejectedByVendor;
    emit RejectRecallByVendor(_primaryKey, msg.sender, _applicant, _reason);
  }

  /** @dev for some reason, customer can reject recall
   * @param _primaryKey index of database of Modoo's Recall
   * @param _vendor address of vehicle vendor like "Hyundai", "Kia"
   * @param _reason why recall is rejected
   */
  function rejectRecallByCustomer (
    bytes32 _primaryKey,
    address _vendor,
    bytes32 _reason
  )
  public
  {
    if (recallStates[_primaryKey].isExist == true) {
      recallStates[_primaryKey].state = recallState.RejectedByConsumer;
      emit RejectRecallByCustomer(_primaryKey, _vendor, msg.sender, _reason);
    }
  }

  /** @dev get state of recall
   * @param _primaryKey index of database of Modoo's Recall
   */
  function getRecallState (
    bytes32 _primaryKey
  ) 
  public 
  view
  returns (
    bytes32 primaryKey,
    address vendor,
    address applicant,
    bytes32 vehicleRegistrationNumber,
    recallState state,
    uint256 score
  )
  {
    if (recallStates[_primaryKey].isExist == true) {
      return ((
        recallStates[_primaryKey].primaryKey,
        recallStates[_primaryKey].vendor,
        recallStates[_primaryKey].applicant,
        recallStates[_primaryKey].vehicleRegistrationNumber,
        recallStates[_primaryKey].state,
        recallStates[_primaryKey].score
      ));
    }
  }
}
