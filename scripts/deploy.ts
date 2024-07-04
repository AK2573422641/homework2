//import { ethers } from "hardhat";
//import { ethers } from "ethers";
//import hre from 'hardhat';
//import {Contract} from 'ethers';
//import '@nomiclabs/hardhat-ethers';
const { ethers, upgrades } = require("hardhat");

//import env from "hardhat";

//使用console
//import "hardhat/console.sol"

//require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-ethers");


async function main() {
  console.log('开始了');

   
   const account = "0x65ad33836e14ab5eaa9b7cf46f9566a6d358e245"
   const tokenId = "0"
   // 等效于Solidity中的keccak256(abi.encodePacked(account, tokenId))
   const msgHash = ethers.solidityPackedKeccak256(
      ['address', 'uint256'],
      [account, tokenId])
   console.log(`msgHash：${msgHash}`)
   // msgHash：0x1bf2c0ce4546651a1a2feb457b39d891a6b83931cc2454434f39961345ac378c

  
   const ALCHEMY_SEPOLIA_URL = 'https://eth-sepolia.g.alchemy.com/v2/GQVRSSb4GLv3Em4uAXkizhuhl3KLmwOM';
   const provider = new ethers.JsonRpcProvider(ALCHEMY_SEPOLIA_URL);
   const privateKey = 'f77ee982d3bfada217696030bdee9d1f0f4e3c6743b98da790e55ad5130d2600'
   const wallet = new ethers.Wallet(privateKey, provider)
   const messageHashBytes = ethers.getBytes(msgHash)
   const signature = await wallet.signMessage(messageHashBytes);
   console.log(`签名：${signature}`)
   // 签名：0x390d704d7ab732ce034203599ee93dd5d3cb0d4d1d7c600ac11726659489773d559b12d220f99f41d17651b0c1c6a669d346a397f8541760d6b32a5725378b241c
   
   // 人类可读abi
const abiNFT = [
   "constructor(string memory _name, string memory _symbol, address _signer)",
   "function name() view returns (string)",
   "function symbol() view returns (string)",
   "function mint(address _account, uint256 _tokenId, bytes memory _signature) external",
   "function ownerOf(uint256) view returns (address)",
   "function balanceOf(address) view returns (uint256)",
];
// 合约字节码，在remix中，你可以在两个地方找到Bytecode
// i. 部署面板的Bytecode按钮
// ii. 文件面板artifact文件夹下与合约同名的json文件中
// 里面"object"字段对应的数据就是Bytecode，挺长的，608060起始
// "object": "608060405260646000553480156100...
//const bytecodeNFT = contractJson.default.object;
//const factoryNFT = new ethers.ContractFactory(abiNFT, bytecodeNFT, wallet);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
   //console.error(error);
   process.exitCode = 1;
});
