pragma solidity >=0.4.21 <0.6.0;

import "../node_modules/@openzeppelin/contracts/ownership/Ownable.sol";

contract KoreaVehicleVendors is Ownable {

  struct VehicleVendor {
    bytes32 vendorName;
    mapping (address => bool) adminAccounts;
    bool isExist;
  }

  mapping (address => VehicleVendor) public vehicleVendors;
  mapping (address => bool) public isVehicleVendor;

  event AddVehicleVendor(bytes32 vendorName, address vendorAdmin);

  modifier onlyUniqueAddressAllowed (address _addr) {
    require(
      isVehicleVendor[_addr] == false,
      "_addr already exists in vehicleVendors"
    );
    _;
  }

  constructor () public {
    
  }

  /**
   * @param _vendorName vehicle vendor like "Hyundai", "Kia", "
   * @param _vendorAdmin address of vendor's admin
   */
  function addVehicleVendor (
    bytes32 _vendorName, 
    address _vendorAdmin
  )
  public 
  onlyOwner
  onlyUniqueAddressAllowed (_vendorAdmin)
  returns (bool success)
  {
    if (vehicleVendors[_vendorAdmin].isExist == true) {
      return false;
    }

    vehicleVendors[_vendorAdmin].vendorName = _vendorName;
    vehicleVendors[_vendorAdmin].adminAccounts[_vendorAdmin] = true;
    vehicleVendors[_vendorAdmin].isExist = true;

    emit AddVehicleVendor(_vendorName, _vendorAdmin);
    isVehicleVendor[_vendorAdmin] = true;
    return true; 
  }

  function getVehicleVendor (
    address _vendorAdmin
  )
  public
  view
  returns (bytes32 vendorName)
  {
    return vehicleVendors[_vendorAdmin].vendorName;
  }
}
