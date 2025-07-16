const { ethers } = require("hardhat");

async function main() {
  console.log("Starting deployment of Lottery System...");
  
  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  
  // Check deployer balance
  const balance = await deployer.getBalance();
  console.log("Account balance:", ethers.utils.formatEther(balance), "ETH");
  
  // Contract constructor parameters
  const ticketPrice = ethers.utils.parseEther("0.01"); // 0.01 ETH per ticket
  
  console.log("Deploying LotterySystem contract...");
  console.log("Ticket price:", ethers.utils.formatEther(ticketPrice), "ETH");
  
  // Deploy the contract
  const LotterySystem = await ethers.getContractFactory("LotterySystem");
  const lotterySystem = await LotterySystem.deploy(ticketPrice);
  
  // Wait for deployment to complete
  await lotterySystem.deployed();
  
  console.log("✅ LotterySystem deployed successfully!");
  console.log("Contract address:", lotterySystem.address);
  console.log("Transaction hash:", lotterySystem.deployTransaction.hash);
  
  // Wait for a few block confirmations
  console.log("Waiting for block confirmations...");
  await lotterySystem.deployTransaction.wait(2);
  
  // Verify contract details
  const owner = await lotterySystem.owner();
  const contractTicketPrice = await lotterySystem.ticketPrice();
  const lotteryState = await lotterySystem.lotteryState();
  
  console.log("\n📋 Contract Details:");
  console.log("Owner:", owner);
  console.log("Ticket Price:", ethers.utils.formatEther(contractTicketPrice), "ETH");
  console.log("Lottery State:", lotteryState); // 0 = OPEN, 1 = CLOSED, 2 = CALCULATING_WINNER
  
  // Save deployment info
  const deploymentInfo = {
    network: hre.network.name,
    contractAddress: lotterySystem.address,
    deployerAddress: deployer.address,
    ticketPrice: ethers.utils.formatEther(contractTicketPrice),
    deploymentTime: new Date().toISOString(),
    transactionHash: lotterySystem.deployTransaction.hash,
    blockNumber: lotterySystem.deployTransaction.blockNumber,
  };
  
  console.log("\n📄 Deployment Summary:");
  console.log(JSON.stringify(deploymentInfo, null, 2));
  
  // Instructions for interaction
  console.log("\n🎯 Next Steps:");
  console.log("1. Create a lottery: await lotterySystem.createLottery(duration_in_seconds)");
  console.log("2. Buy tickets: await lotterySystem.buyTickets(ticket_count, { value: ticketPrice * ticket_count })");
  console.log("3. Select winner (after lottery ends): await lotterySystem.selectWinner()");
  
  console.log("\n🔗 Network Information:");
  console.log("Network:", hre.network.name);
  console.log("Chain ID:", hre.network.config.chainId);
  console.log("RPC URL:", hre.network.config.url);
  
  if (hre.network.name === "coreTestnet2") {
    console.log("🌐 View on Core Testnet 2 Explorer:");
    console.log(`https://scan.test2.btcs.network/address/${lotterySystem.address}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });
