const { ethers } = require("hardhat");
require("dotenv").config({ path: ".env" });

async function main() {
  // URL from where we can extract the metadata for a LW3Punks
  const metadataURL = "ipfs://QmYc15Cg9mv5UMnmC31oR4usXJs35n7Bn3DDWtfy9fyYV3";
  /*
  A ContractFactory in ethers.js is an abstraction used to deploy new smart contracts,
  so lw3PunksContract here is a factory for instances of our LW3Punks contract.
  */
  const lw3PunkContract = await ethers.getContractFactory("LW3Punks");
  //deploy the contract
  const deployedLW3PunkContract = await lw3PunkContract.deploy(metadataURL);
  await deployedLW3PunkContract.deployed();

  //Print the sddress in the deployed contract
  console.log(
    "===LW3Punk contract address is:==",
    deployedLW3PunkContract.address
  );
}
// Call the main function and catch if there is an error
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
