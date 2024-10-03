const { ethers } = require("hardhat");

// Helper function to convert to Wei
const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether');
}

async function main() {
  // Setup accounts & variables
  const [deployer] = await ethers.getSigners();
  const NAME = "ETH Daddy";
  const SYMBOL = "ETHD";

  // Deploy contract
  const ETHDaddy = await ethers.getContractFactory("ETHDaddy");
  const ethDaddy = await ETHDaddy.deploy(NAME, SYMBOL);
  await ethDaddy.deployed();

  console.log(`Deployed Domain Contract at: ${ethDaddy.address}\n`);

  // List 6 domains
  const names = ["jack.eth", "john.eth", "henry.eth", "cobalt.eth", "oxygen.eth", "carbon.eth"];
  const costs = [tokens(10), tokens(25), tokens(15), tokens(2.5), tokens(3), tokens(1)];

  for (let i = 0; i < names.length; i++) {
    const transaction = await ethDaddy.connect(deployer).listDomain(names[i], costs[i]);
    await transaction.wait();
    console.log(`Listed Domain ${i + 1}: ${names[i]}`);
  }
}

// Run the main function and catch any errors
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
