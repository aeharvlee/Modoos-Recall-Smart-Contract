pragma solidity >=0.4.21 <0.6.0;

import "../node_modules/@openzeppelin/contracts/ownership/Ownable.sol";
import "./KoreaVehicleVendors.sol";

contract Recall is Ownable{

  enum recallState { Created, Rejected, Proceeding, Complete }

  struct RepairSheet {
    bytes32 parts;
    bytes32 repairDescription;
  }

  struct RecallState {
    address applicant;
    bytes32 vehicleRegistrationNumber;
    recallState state;
    RepairSheet[] repairSheetList;
  }

  mapping (address => RecallState) recallStates;

  modifier onlyVendorAllowed(address _addr) {
    require(
      koreaVehicleVendors.isVehicleVendor(_addr),
      "Only vendor allowed"
    );
    _;
  }

  event AddRecallSheet();

  event CreateRecall(address indexed applicant, bytes32 vehicleRegistrationNumber);
  event RejectRecall(address indexed vendor, address applicant, bytes32 reason);

  KoreaVehicleVendors public koreaVehicleVendors;

  constructor(address addressOfKoreaVehicleVendors) public {
    koreaVehicleVendors = KoreaVehicleVendors(addressOfKoreaVehicleVendors);
  }

  /** @dev applicant who knows vehicleRegistrationNumber can create recall
   * @param _vehicleRegistrationNumber vehicle registration number
   */ 
  function createRecall (
    bytes32 _vehicleRegistrationNumber
  )
  public 
  {
    recallStates[msg.sender].applicant = msg.sender;
    recallStates[msg.sender].vehicleRegistrationNumber = _vehicleRegistrationNumber;
    recallStates[msg.sender].state = recallState.Created;

    emit CreateRecall(msg.sender, _vehicleRegistrationNumber);
  }

  /** @dev for some reason, vendor can reject recall
   * @param _applicant address of customer who request recall
   * @param _reason why recall is rejected
   */
  function rejectRecall (
    address _applicant,
    bytes32 _reason
  )
  public 
  onlyVendorAllowed(msg.sender)
  {
    recallStates[_applicant].state = recallState.Rejected;
    emit RejectRecall(msg.sender, _applicant, _reason); 
  }

  /** @dev 
   */
  function getRecallState (
    address _addr
  ) 
  public 
  view 
  returns (
    address applicant,
    bytes32 vehicleRegistrationNumber,
    recallState state
  )
  {
    return (
      recallStates[_addr].applicant, 
      recallStates[_addr].vehicleRegistrationNumber, 
      recallStates[_addr].state
    );
  }
}
