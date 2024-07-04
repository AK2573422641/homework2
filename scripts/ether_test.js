import { ethers } from "ethers";

//const {  upgrades } = require("hardhat");

const provider = ethers.getDefaultProvider();





const main = async () => {
    const provider = ethers.getDefaultProvider();
    const balance = await provider.getBalance(`vitalik.eth`);
    console.log(`ETH Balance of vitalik: ${ethers.formatEther(balance)} ETH`);
}





const testEther = async()=>{
    // 利用公共rpc节点连接以太坊网络
    // 可以在 https://chainlist.org 上找到
    //const ALCHEMY_SEPOLIA_URL = 'https://rpc.sepolia.org';
    
    const ALCHEMY_SEPOLIA_URL = 'https://rpc.sepolia.org';
    // 连接Sepolia测试网
    const providerSepolia = new ethers.JsonRpcProvider(ALCHEMY_SEPOLIA_URL)
    console.log("1. 查询vitalik在主网和Sepolia测试网的ETH余额");
    //const balance = await providerETH.getBalance(`vitalik.eth`);
    const balanceSepolia = await providerSepolia.getBalance(`0x65Ad33836e14aB5EaA9B7cF46F9566A6d358E245`);
   
    // 输出Sepolia测试网ETH余额
    console.log(`Sepolia ETH Balance of jackson: ${ethers.formatEther(balanceSepolia)} ETH`);
    
    // 2. 查询provider连接到了哪条链
    console.log("\n2. 查询provider连接到了哪条链")
    const network = await providerSepolia.getNetwork();
    console.log(network.toJSON());

    // 3. 查询区块高度
    console.log("\n3. 查询区块高度")
    const blockNumber = await providerSepolia.getBlockNumber();
    console.log(blockNumber);

    // 4. 查询 vitalik 钱包历史交易次数
    console.log("\n4. 查询 jackson 钱包历史交易次数")
    const txCount = await providerSepolia.getTransactionCount('0x65Ad33836e14aB5EaA9B7cF46F9566A6d358E245');
    console.log(txCount);

    // 5. 查询当前建议的gas设置
    console.log("\n5. 查询当前建议的gas设置")
    const feeData = await providerSepolia.getFeeData();
    console.log(feeData);

    // 6. 查询区块信息
    console.log("\n6. 查询区块信息")
    const block = await providerSepolia.getBlock(0);
    console.log(block);

    // 7. 给定合约地址查询合约bytecode，例子用的WETH地址
    console.log("\n7. 给定合约地址查询合约bytecode，例子用的WETH地址")
    const code = await providerSepolia.getCode("0xD9146966C6F934aB89b6675e98cD866e3428B578");
    console.log(code);



}

//const sepolia_wallet1 = new ethers.Wallet('f77ee982d3bfaee9d1f0fdgyddgdfa790e55ad5130d2600',sepolia_provider);
    const testSendETH = async()=>{

        //const ALCHEMY_SEPOLIA_URL = 'https://sepolia.infura.io/v3/fa2e07a080064f7c90d274456fbe3ab3';
        const ALCHEMY_SEPOLIA_URL = 'https://eth-sepolia.g.alchemy.com/v2/GQVRSSb4GLv3Em4uAXkizhuhl3KLmwOM';
   
        //const ALCHEMY_SEPOLIA_URL = 'https://eth-goerli.alchemyapi.io/v2/GlaeWuylnNM3uuOo-SAwJxuwTdqHaY5l';


        console.log("测试开始")
        ///private key1
        const sepolia_provider = new ethers.JsonRpcProvider(ALCHEMY_SEPOLIA_URL);
       // const sepolia_provider = new ethers.AlchemyProvider( "sepolia", "GQVRSSb4GLv3Em4uAXkizhuhl3KLmwOM");
       // const sepolia_provider =new  ethers.JsonRpcApiProvider(ALCHEMY_SEPOLIA_URL)
        //const sepolia_provider =new  ethers.JsonRpcApiProvider(ALCHEMY_SEPOLIA_URL)
        //const PRIVATE_KEY = process.env.PRIVATE_KEY || '';
        //const sepolia_wallet1 = new ethers.Wallet('0x227dbb8586117d55284e26620bc76534dfbd2394be34cf4a09cb775d593b6f2b',sepolia_provider);
        //const sepolia_wallet1 = new ethers.Wallet(PRIVATE_KEY,sepolia_provider);

        //const privateKey = 'f77ee982d3bfada217696030bdee9d1f0f4e3c6743b98da790e55ad5130d2600'
        //const sepolia_wallet1 = new ethers.Wallet(privateKey,sepolia_provider);
        //console.log("PRIVATE_KEY：${PRIVATE_KEY},address:${sepolia_wallet1.getAddress()}")


        // 利用私钥和provider创建wallet对象
        const privateKey = 'f77ee982d3bfada217696030bdee9d1f0f4e3c6743b98da790e55ad5130d2600';
        const sepolia_wallet1 = new ethers.Wallet(privateKey, sepolia_provider);
       // console.log(`PRIVATE_KEY：${privateKey},address:${sepolia_wallet1.getAddress()}`)

         ///private key2
        //const sepolia_provider2 =new  ethers.JsonRpcApiProvider(ALCHEMY_SEPOLIA_URL)
        const PRIVATE_KEY2 = '4cadbf46b66b29071cd51419babf85d4177b12310e565849a5d29be6dfdc4e23';
        const sepolia_wallet2 = new ethers.Wallet(PRIVATE_KEY2,sepolia_provider);

         ///随机
        const wallet3 = ethers.Wallet.createRandom()
        const wallet1WithProvider = wallet3.connect(sepolia_provider)
        const mnemonic = wallet3.mnemonic // 获取助记词
        
        const sepolia_address1 = await sepolia_wallet1.getAddress();
        const sepolia_address2 = await sepolia_wallet2.getAddress();
        const address3 = await wallet3.getAddress() 
        console.log(`1. 获取钱包地址`);
        console.log(`钱包1地址: ${sepolia_address1}`);
        console.log(`钱包2地址: ${sepolia_address2}`);
        console.log(`钱包3地址: ${address3}`);

        console.log('开始测试发送ETH');

        const tx = {
            to: sepolia_address2,
            value: ethers.parseEther("0.000001")
        }
        // iii. 发送交易，获得收据
        console.log(`\nii. 等待交易在区块链确认（需要几分钟）`)
        const receipt = await sepolia_wallet1.sendTransaction(tx)
        await receipt.wait() // 等待链上确认交易
        console.log(receipt) // 打印交易详情
        // iv. 打印交易后余额
        console.log(`\niii. 发送后余额`)
        console.log(`钱包1: ${ethers.formatEther(await sepolia_provider.getBalance(sepolia_address1))} ETH`)
        console.log(`钱包2: ${ethers.formatEther(await sepolia_provider.getBalance(sepolia_address2))} ETH`)




    }


    const testWriteContract = async()=>{

            // 利用Alchemy的rpc节点连接以太坊网络
            // 准备 alchemy API 可以参考https://github.com/AmazingAng/WTFSolidity/blob/main/Topics/Tools/TOOL04_Alchemy/readme.md
            const ALCHEMY_SEPOLIA_URL = 'https://eth-sepolia.g.alchemy.com/v2/GQVRSSb4GLv3Em4uAXkizhuhl3KLmwOM';
            const provider = new ethers.JsonRpcProvider(ALCHEMY_SEPOLIA_URL);

            // 利用私钥和provider创建wallet对象
            const privateKey = 'f77ee982d3bfada217696030bdee9d1f0f4e3c6743b98da790e55ad5130d2600';
            const wallet = new ethers.Wallet(privateKey, provider)

            // WETH的ABI
            const abiWETH = [{"inputs":[{"internalType":"address","name":"_logic","type":"address"},{"internalType":"bytes","name":"_data","type":"bytes"}],"stateMutability":"payable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"previousAdmin","type":"address"},{"indexed":false,"internalType":"address","name":"newAdmin","type":"address"}],"name":"AdminChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"beacon","type":"address"}],"name":"BeaconUpgraded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"implementation","type":"address"}],"name":"Upgraded","type":"event"},{"stateMutability":"payable","type":"fallback"},{"stateMutability":"payable","type":"receive"}];
            // WETH合约地址（Goerli测试网）
            //const addressWETH = '0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6'
            //sepolia 
            //对应https://sepolia.infura.io/v3/fa2e07a080064f7c90d274456fbe3ab3
            //const addressWETH = '0xfB26d203aE9910c16aeCDEc8D8085E6E666511C7'   

            //对应https://eth-sepolia.g.alchemy.com/v2/GQVRSSb4GLv3Em4uAXkizhuhl3KLmwOM
            const addressWETH = '0xfC2173C064eE80406277FC24ED347540859a1CEc'


            // WETH Contract

            // 声明可写合约
            const contractWETH = new ethers.Contract(addressWETH, abiWETH, wallet)
            // 也可以声明一个只读合约，再用connect(wallet)函数转换成可写合约。
            // const contractWETH = new ethers.Contract(addressWETH, abiWETH, provider)
            // contractWETH.connect(wallet)

            const WETHadress =await contractWETH.getAddress();
            console.log(`\n1. 合同地址为：${WETHadress}`)

            const address = await wallet.getAddress()
            console.log(`\n1. 钱包地址为：${address}`)
            // 1. 读取WETH合约的链上信息（WETH abi）
            console.log("\n1. 读取WETH余额")
            //const tmp  = await contractWETH.balanceOf(address)



            //const balanceWETH = await contractWETH.balanceOf(address)
           // console.log(`存款前WETH持仓: ${balanceWETH}\n`)
            //读取钱包内ETH余额
            const balanceETH = await provider.getBalance(wallet)
            console.log(`balanceETH: ${balanceETH}`)
        
            // 如果钱包ETH足够
            if(ethers.formatEther(balanceETH) > 0.000015){
                
            
                // 2. 调用deposit()函数，将0.001 ETH转为WETH
                console.log("\n2. 调用deposit()函数，存入0.001 ETH")
                // 发起交易
                const tx = await contractWETH.deposit({value: ethers.parseEther("0.000001")})
                // 等待交易上链
                await tx.wait()
                console.log(`交易详情：`)
                console.log(tx)
                const balanceWETH_deposit = await contractWETH.balanceOf(address)
                console.log(`存款后WETH持仓: ${ethers.formatEther(balanceWETH_deposit)}\n`)
            
                // 3. 调用transfer()函数，将0.001 WETH转账给 vitalik
                console.log("\n3. 调用transfer()函数，给vitalik转账0.001 WETH")
                // 发起交易
                const tx2 = await contractWETH.transfer('0x79d506dFf6b9BD643276a31Cad993b8Af88b2888', ethers.parseEther("0.000001"))
                // 等待交易上链
                await tx2.wait()
                const balanceWETH_transfer = contractWETH.Contract.getBalance(address)
                //const balanceWETH_transfer = await contractWETH.balanceOf(address)
                console.log(`转账后WETH持仓: ${ethers.formatEther(balanceWETH_transfer)}\n`)
        
            }else{
                // 如果ETH不足
                console.log("ETH不足，去水龙头领一些Goerli ETH")
                console.log("1. chainlink水龙头: https://faucets.chain.link/goerli")
                console.log("2. paradigm水龙头: https://faucet.paradigm.xyz/")
            }

    }

    const testWriteContract2 = async()=>{


        // 利用Alchemy的rpc节点连接以太坊网络
        // 准备 alchemy API 可以参考https://github.com/AmazingAng/WTFSolidity/blob/main/Topics/Tools/TOOL04_Alchemy/readme.md
        const ALCHEMY_SEPOLIA_URL = 'https://eth-sepolia.g.alchemy.com/v2/GQVRSSb4GLv3Em4uAXkizhuhl3KLmwOM';
        const provider = new ethers.JsonRpcProvider(ALCHEMY_SEPOLIA_URL);

        // 利用私钥和provider创建wallet对象
        const privateKey = 'f77ee982d3bfada217696030bdee9d1f0f4e3c6743b98da790e55ad5130d2600';
        const wallet = new ethers.Wallet(privateKey, provider)

        // WETH的ABI
        //const abiWETH = [{"inputs":[{"internalType":"address","name":"_logic","type":"address"},{"internalType":"bytes","name":"_data","type":"bytes"}],"stateMutability":"payable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"previousAdmin","type":"address"},{"indexed":false,"internalType":"address","name":"newAdmin","type":"address"}],"name":"AdminChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"beacon","type":"address"}],"name":"BeaconUpgraded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"implementation","type":"address"}],"name":"Upgraded","type":"event"},{"stateMutability":"payable","type":"fallback"},{"stateMutability":"payable","type":"receive"}];
        //const abiWETH = [{"inputs":[{"internalType":"string","name":"name_","type":"string"},{"internalType":"string","name":"symbol_","type":"string"},{"internalType":"uint256","name":"totalSupply_","type":"uint256"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"allowance","type":"uint256"},{"internalType":"uint256","name":"needed","type":"uint256"}],"name":"ERC20InsufficientAllowance","type":"error"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"uint256","name":"balance","type":"uint256"},{"internalType":"uint256","name":"needed","type":"uint256"}],"name":"ERC20InsufficientBalance","type":"error"},{"inputs":[{"internalType":"address","name":"approver","type":"address"}],"name":"ERC20InvalidApprover","type":"error"},{"inputs":[{"internalType":"address","name":"receiver","type":"address"}],"name":"ERC20InvalidReceiver","type":"error"},{"inputs":[{"internalType":"address","name":"sender","type":"address"}],"name":"ERC20InvalidSender","type":"error"},{"inputs":[{"internalType":"address","name":"spender","type":"address"}],"name":"ERC20InvalidSpender","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}];
       /* function balanceOf(address account) public view virtual returns (uint256)
        "function deposit() public payable",
        "function transfer(address, uint) public returns (bool)",
        "function withdraw(uint) public",
         function transfer(address to, uint256 value) public virtual returns (bool)*/
        const abiWETH = [
            "function balanceOf(address) public view returns(uint256)",
            "function transfer(address,uint256) public  returns(bool)",
            "function transferFrom(address,address,uint256) public  returns(bool)",
            "function name() public view  returns(string)"      
        ];
        
        
        
        
        
        
        
        // WETH合约地址（Goerli测试网）
        //const addressWETH = '0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6'
        //sepolia 测试网地址
        //const addressWETH = '0xfB26d203aE9910c16aeCDEc8D8085E6E666511C7'

        //对应https://sepolia.infura.io/v3/fa2e07a080064f7c90d274456fbe3ab3
            //const addressWETH = '0xfB26d203aE9910c16aeCDEc8D8085E6E666511C7'   

            //对应https://eth-sepolia.g.alchemy.com/v2/GQVRSSb4GLv3Em4uAXkizhuhl3KLmwOM
            const addressWETH = '0x407345b06155A00362d644729e3C77494b125961'
        // WETH Contract

        // 声明可写合约
        const contractWETH = new ethers.Contract(addressWETH, abiWETH, wallet)
        // 也可以声明一个只读合约，再用connect(wallet)函数转换成可写合约。
        // const contractWETH = new ethers.Contract(addressWETH, abiWETH, provider)
        // contractWETH.connect(wallet)

        const address = await wallet.getAddress()
        console.log(`\n1. 钱包地址为：${address}`)
        
        const WETHadress =await contractWETH.getAddress();
        console.log(`\n1. 合同地址为：${WETHadress}`)
        
        //const tmp  = await contractWETH.balanceOf(address)


        //读取钱包内ETH余额
        const balanceETH = await provider.getBalance(wallet)
        console.log(`balanceETH: ${balanceETH}`)

        // 1. 读取WETH合约的链上信息（WETH abi）
        const name =contractWETH.name()
        console.log(`合约名称是: ${name}\n`)

        
        


        console.log("\n1. 读取WETH余额")
        const balanceWETH = await contractWETH.balanceOf(address)
        console.log(`${address}存款前WETH持仓: ${balanceWETH}\n`)
        const address2 = '0x79d506dFf6b9BD643276a31Cad993b8Af88b2888'
    
        // 如果钱包ETH足够
        if(ethers.formatEther(balanceETH) > 0.000015){
            /*
        
            // 2. 调用deposit()函数，将0.001 ETH转为WETH
            
            console.log("\n2. 调用deposit()函数，存入0.001 ETH")
            
            // 发起交易
            const tx = await contractWETH.deposit({value: ethers.parseEther("0.000002")})
            // 等待交易上链
            await tx.wait()
            console.log(`交易详情：`)
            console.log(tx)
            const balanceWETH_deposit = await contractWETH.balanceOf(address)
            console.log(`存款后WETH持仓: ${ethers.formatEther(balanceWETH_deposit)}\n`)
            */
            // 3. 调用transfer()函数，将0.001 WETH转账给 vitalik
            //console.log("\n3. 调用transfer()函数，给账户2转账0.001 WETH")
            //const account2Balance =contractWETH.balanceOf(address2);
            //console.log(`当前账户2余额为：${account2Balance}`)

            // 发起交易
            //const tx2 = await contractWETH.transferFrom('0x65Ad33836e14aB5EaA9B7cF46F9566A6d358E245','0x79d506dFf6b9BD643276a31Cad993b8Af88b2888', ethers.parseEther("0.001"))
            const tx2 = await contractWETH.transfer(address2, ethers.parseEther("0.001"))
            // 等待交易上链
            await tx2.wait()
            const balanceWETH_transfer = contractWETH.balanceOf(address)
            //const balanceWETH_transfer = await contractWETH.balanceOf(address)
            // account2Balance =contractWETH.balanceOf('0x79d506dFf6b9BD643276a31Cad993b8Af88b2888');
            console.log(`转账后WETH持仓: ${ethers.formatEther(balanceWETH_transfer)}\n`)
            
    
        }else{
            // 如果ETH不足
            console.log("ETH不足，去水龙头领一些Goerli ETH")
            console.log("1. chainlink水龙头: https://faucets.chain.link/goerli")
            console.log("2. paradigm水龙头: https://faucet.paradigm.xyz/")
        }

}


const testcrowdFunction = async()=>{

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
   

// NFT的人类可读abi
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
const bytecodeNFT = contractJson.default.object;
const factoryNFT = new ethers.ContractFactory(abiNFT, bytecodeNFT, wallet);



// 部署合约，填入constructor的参数
const contractNFT = await factoryNFT.deploy("WTF Signature", "WTF", wallet.address)
console.log(`合约地址: ${contractNFT.target}`);
console.log("等待合约部署上链")
await contractNFT.waitForDeployment()
// 也可以用 contractNFT.deployTransaction.wait()
console.log("合约已上链")


}


const testMultiSignFunction = async()=>{

    console.log('开始了');

   
  // const to = "0x334838bE689303B448d1F1e80010F246169484D7"
  // const value = "2"
  // const data = "9c22ff5f21f0b81b113e63f7db6da94fedef11b2119b4088b89664fb9a3cb658"
  // const _nonce = "0"
  // const chainid = "6230726"

   
  




   //keccak256("test") = 9c22ff5f21f0b81b113e63f7db6da94fedef11b2119b4088b89664fb9a3cb658
   // 等效于Solidity中的keccak256(abi.encodePacked(account, tokenId))
  // const msgHash = ethers.solidityPackedKeccak256(
  //    ['address', 'uint256','bytes','uint256','uint256'],
  //    [to, value,data,_nonce,chainid])
  // console.log(`msgHash：${msgHash}`)
   // msgHash：0x1bf2c0ce4546651a1a2feb457b39d891a6b83931cc2454434f39961345ac378c
   const msgHash = '0xa23eccc9682b795ca5a8645484bd07bbc4940e2172854b2f1b6f8a300498dcc0';
  
   const ALCHEMY_SEPOLIA_URL = 'https://eth-sepolia.g.alchemy.com/v2/GQVRSSb4GLv3Em4uAXkizhuhl3KLmwOM';
   const provider = new ethers.JsonRpcProvider(ALCHEMY_SEPOLIA_URL);
   const privateKey = 'f77ee982d3bfada217696030bdee9d1f0f4e3c6743b98da790e55ad5130d2600'
   //const privateKey = '4cadbf46b66b29071cd51419babf85d4177b12310e565849a5d29be6dfdc4e23'
   const wallet = new ethers.Wallet(privateKey, provider)
   const messageHashBytes = ethers.getBytes(msgHash)
   const signature = await wallet.signMessage(messageHashBytes);
   console.log(`签名：${signature}`)
   // 签名：0x390d704d7ab732ce034203599ee93dd5d3cb0d4d1d7c600ac11726659489773d559b12d220f99f41d17651b0c1c6a669d346a397f8541760d6b32a5725378b241c
   
//账户1
//msgHash：0xddfd1cd9decc5ef5f6064f74618dbd168bffd23b0cb241d9c9565bf4f60d95c6
//签名：0x9372175487d1f0a2f0c345d2a90cf1ad69ae7529482955f744220e371cf4915b245e1b81a8b6ac6a521ee4001b5921f47f23bc56826716d45a94019c5e22cc151c


//账户2：
//msgHash：0xddfd1cd9decc5ef5f6064f74618dbd168bffd23b0cb241d9c9565bf4f60d95c6
//签名：0x6c81ea2f71f215d71c80ae7d071bc0596d51553e5549dab99dabd5df9de3f4d723880d62f84bae9b2a1955b9e0407062c4af15e2dcd5a6f7bef16287a84e26a31b




//remix

//0x334838bE689303B448d1F1e80010F246169484D7     2   0x   0   6230726     得到msgHash：0xbf1353b40b7d8cf6d38d41571c55d181ef1b1fd9570aecb068b3706d2c6345e7


//账户2
//签名：0xab4385c2ae444ec2592da4770dd538e19c36044b4f5dcbd2eb12ab8f1f65d5385d435aec0ce4986333b82d85b4d933841f3ea92e662d51b3dc6c61be214e82fa1c

//账户1：
//签名：0x188f3b42fe5221529f47bf2f2596c8a3ec42552ff21cff0bc72fce9c3bce5d184524d18f89d555038a0fc16c4a66c2588f316af12b81ff57cd1f17182d6ab1011c

//两个签名合起来
//0x188f3b42fe5221529f47bf2f2596c8a3ec42552ff21cff0bc72fce9c3bce5d184524d18f89d555038a0fc16c4a66c2588f316af12b81ff57cd1f17182d6ab1011cab4385c2ae444ec2592da4770dd538e19c36044b4f5dcbd2eb12ab8f1f65d5385d435aec0ce4986333b82d85b4d933841f3ea92e662d51b3dc6c61be214e82fa1c


//remix（新）

//0x334838bE689303B448d1F1e80010F246169484D7     2   0x   0   6230726     得到msgHash：0xa23eccc9682b795ca5a8645484bd07bbc4940e2172854b2f1b6f8a300498dcc0


//账户2
//签名：0xe5c869b96dc9e00b77427edefca5c0e20360ad61f20062d2355151b260862d380c46024facfa09aa75fb8e63b64fe2ab50a50c38ff0185102ef116fb9b38e9de1b

//账户1
//签名：0x188f3b42fe5221529f47bf2f2596c8a3ec42552ff21cff0bc72fce9c3bce5d184524d18f89d555038a0fc16c4a66c2588f316af12b81ff57cd1f17182d6ab1011c
//0x222781faf162e60fe2765548e366655d6ace678617a2e4e2ea5d2062a0e9ab662be1883d211d2b7f53759d54e9c979ec24e30ab648bcf2d0c7b5a6bed7ac910a1b
//两个签名合起来
//0x188f3b42fe5221529f47bf2f2596c8a3ec42552ff21cff0bc72fce9c3bce5d184524d18f89d555038a0fc16c4a66c2588f316af12b81ff57cd1f17182d6ab1011ce5c869b96dc9e00b77427edefca5c0e20360ad61f20062d2355151b260862d380c46024facfa09aa75fb8e63b64fe2ab50a50c38ff0185102ef116fb9b38e9de1b

//0x222781faf162e60fe2765548e366655d6ace678617a2e4e2ea5d2062a0e9ab662be1883d211d2b7f53759d54e9c979ec24e30ab648bcf2d0c7b5a6bed7ac910a1be5c869b96dc9e00b77427edefca5c0e20360ad61f20062d2355151b260862d380c46024facfa09aa75fb8e63b64fe2ab50a50c38ff0185102ef116fb9b38e9de1b

}

const testCrowdFunding = async()=>{

    console.log('开始了');

   

   const CrowdfundingPlatform = await  ethers.getContractFactory("CrowdfundingPlatform");
   console.log('CrowdfundingPlatform:${signature}');

   const platform = await upgrades.deployProxy(CrowdfundingPlatform, [], { initializer: "initialize" });
 
   console.log(`合约地址: ${platform.target}`);
    console.log("等待合约部署上链")
   await platform.waitForDeployment();
  console.log("CrowdfundingPlatform deployed to:", platform.target);
   
}





//
 //main()

 //   testEther()
  // testSendETH()
 //testWriteContract2()
 //testcrowdFunction()
 //testMultiSignFunction()
 testCrowdFunding()
//testEther()

