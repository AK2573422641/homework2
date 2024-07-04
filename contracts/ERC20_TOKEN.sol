// SPDX-License-Identifier: MIT
pragma solidity  ^0.8.20;

contract ERC20_TOKEN {
  

    //supply
    uint256 private _supply;

    //owner
    address private _owner;


    //decimal   where to use
    //uint8 private decimal = 18;

    //name
    string private _name;

    //symbol
    string private _symbol;

    //who have money

    mapping(address => uint256) private _balance;

    //approval
    mapping(address => mapping(address => uint256)) _approve;

    //transfer event
    event Transfer(address owner_,address to_,uint256 value_);

    //approve event
    event Approve(address owner_,address to_,uint256 value_);

    //transfer from owner  to target,is not must
    event TransferFrom (address owner_,address _spender,address to_,uint256 value_);

    event Mint (address owner_,uint256 value_);

    event Burn (address owner_,uint256 value_);



    constructor(string memory name_,string  memory symbol_) payable {
        _name = name_;
        _symbol = symbol_;
        _owner = msg.sender;
        

    }


    //get balance
    function balanceOf()  public view returns(uint256){
        //require(_owner = 0,"invalid address");   这里直接获取地址，不需要 //TODO  有一个省去gas费用的地方
        return _balance[msg.sender];  //msg.sender不需要校验地址的在区块链范围是否合法，只需要校验在这个合约中是否符合逻辑即可

    }


    modifier ownerable(){
        require(msg.sender == _owner,"not owner");
        _;
    }
    //_mint token
    function mint(uint256 _token)internal ownerable{
        //计算是否会出现supply溢出
        _balance[msg.sender] += _token;
        _supply += _token;
        emit Mint(msg.sender,_token);
        
    }

    //应该是任何人可以做销毁token
    function burn(uint256 _token)internal ownerable {
        //不用校验了
       // require(supply >= _token,"Insufficient balance");
        require(_balance[msg.sender]>=_token,"Insufficient balance");
        _balance[msg.sender] -=_token;
        _supply -= _token;
        emit Burn(msg.sender,_token);

    }


    //_burn token


    //feedback()
    fallback() external  payable {}


    //transfer    ,it is ok there is not return data?
    function transfer(address to_,uint256 value_) internal {
        //require(_to = address(0)  ,"invalid address"); //
       // if(to_ == address(0))
       //     revert  ERC20InvalidSender(address(0));
        require(_balance[msg.sender] >= value_,"Insufficient balance");//拆分
        unchecked{
            _balance[msg.sender] -= value_;
            //不用考虑溢出，因为不会超过supply
            _balance[to_] +=value_;
        }
        
       
        emit  Transfer( msg.sender,to_, value_);

    }

    //数据结构，A==>B  A授权给B，如果同时拿到A,B的值，approve[A][B]  还是approve[B][A]都可以，因为都是针对单个的方法，除非有针对多个的方法
    function approve(address spender_,uint256 value_)public virtual {
        //require(_spender >0,"invalid address");
        require(_balance[msg.sender] >= value_,"Insufficient balance");
        _approve[msg.sender][spender_] += value_;
        //授权的情况下，这里不会有token减少
        //balance[msg.sender] -=value;
        emit Approve(msg.sender,spender_, value_);
    }


    function transferFrom(address owner_,address to_, uint256 value_)public virtual {
        // require(_spender >0，"invalid address");
        //if(_spender == address(0))
         //   revert  ERC20InvalidSender(address(0));
        // require(to_ >0，"invalid address");
        //if(to_ == address(0))
        //    revert  ERC20InvalidSender(address(0));
        
         require(_approve[owner_][msg.sender] >=value_,"Insufficient balance");
         _approve[owner_][msg.sender] -= value_;
         _balance[to_] += value_;
         //授权的时候，对应的token才会减小
         _balance[owner_] -= value_;
         emit  TransferFrom ( owner_,msg.sender, to_, value_);
    }

    // virtual  很重要
    function name() public view  virtual returns (string memory){
         return _name;
    }

    function symbol() public view  returns (string memory){
         return _symbol;
    }


    function supply() public view  returns(uint256){
        return _supply;
    }

    function  decimals() public view  returns(uint8){
        return 18;
    }

    function allowance(address owner_,address spender_)public view virtual returns(uint256){
        return _approve[owner_][spender_];
    }

}