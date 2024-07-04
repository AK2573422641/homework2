// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract IDOToken is ERC20("RCC","RCCToken"){

//ERC20购买IDOToken
//有兑换IDOToken
//IDOToken余额
//是否是要挂单
//如果这个IDOToken用的是ERC20，那么兑换的比例是多少呢？是稳定的还是变化的呢？
//其实本质上就是一个交易所，上次是NFT交易所，这个是ERC20这种代币交易所，其实如果是直接继承，那么就容易出现很多问题
//比如:别人合约是继承ERC20的，你写的代码是继承ERC20的合约，那么你的代码就相当于订制式的，这个其实不是一种多态的做法；

    uint256 private _price = 1000000;

    //这里不用采用_maxNum，因为后期可能有乘法，大小可能会溢出，出现安全漏洞
    //uint256 private _maxNum  = 100000;
    uint256 private _maxAmount  = 100000;

    mapping(address =>bool) private _perchaseFlag;

    //mapping(address => uint256) private _perchaseRecord;

    address private _owner;   

    address private _ERC20Address = 0x606D35e5962EC494EAaf8FE3028ce722523486D2;

    event Perchase(address owner,uint256 amount);

    event Withdraw(address owner,uint256 amount);

    constructor(address erc20address,uint256 price,uint256 max){
        _price  = price;
        _ERC20Address = erc20address;
        _maxAmount = max;
        _owner = msg.sender;
    }

    modifier ownerable(){
        require(msg.sender  == _owner,"not owenr");
        _;
    }
    
    //不是转入ETH，所以不用payable
    function perchase(uint256 amount) public {
        require(_perchaseFlag[msg.sender] == false,"already perchase");
        require(amount >_maxAmount,"too bigger");
        //错误想法：这里用IERC20，而不是ERC20，，万一别人用的代币就是直接继承IERC20，又不是ERC20代币，这样就没有办法用了呀，
        //错误：所以这里要指定，如果任意的代币都可以使用的话
        //因为这个合约一定是固定的地址，如果不是某些固定可以信任的地址，那么任意一个没有共识价值的合约token就用来替换IDOToken，那么这个IDOToken会被瞬间洗劫
        //应该校验这个账户在这个代币是否有那么多钱,通过转钱来确定,这个如何取整呢？
        uint256 num = amount/_price * 10^18;
        // 用transfer 是错误的，只能用transferFrom ,因为transfer只能owner调用
        // bool success  = IERC20(msg.sender).transfer(address(this),amount);方法前面只能是合约地址，不能是个人地址，并且如果真的要传以太网，payable(address).transfer
        bool success  = IERC20(_ERC20Address).transferFrom(msg.sender,address(this),amount);
        require(success,"transfer error");

        //既然使用了ERC20的合约了，那就直接调用的铸币方法
        //_perchaseRecord[msg.sender] = num;
        _mint(msg.sender,num);
        emit Perchase(msg.sender,amount);
        
    }

    //如果是owner将所有的金额提现是可以的，如果是其他的账户，那么只能提现自己本分，自己部分用变量记录下来，
    //因为可能出现合约selfdestruct，那么这个变量
    //部署的时候转入对应的ETH，也会有多余的_maxAmount
    function withdraw(uint256 maxAmount) private ownerable  returns(bool){
        require(maxAmount <= IERC20(_ERC20Address).balanceOf(msg.sender),"infussiont fanances");
        IERC20(_ERC20Address).transferFrom(address(this),msg.sender,maxAmount);
        return true;
        
    }


}
