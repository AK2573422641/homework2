// SPDX-License-Identifier: MIT
pragma solidity  ^0.8.20;
//构建一个去中心化的众筹平台，用户可以创建众筹项目，其他用户可以对项目进行捐款。
//在项目截止日期后，根据筹款目标是否达到，项目会被标记为成功或失败。项目成功时，创建者可以提取资金；项目失败时，捐款者可以撤回他们的资金。

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

//分析：这种任务式的功能，具有重复的场景，如果任务重复申请会怎么样？
//如何描述一个对象不等于空
//涉及到众筹，那么采用ETH实现
contract CrowdFunding {

    // 截止日期 

    //  creater address

    // funder address
    
     //aim  sypply

    //collector supply


     enum status{
        FUNDING,
        SUCCESS,
        FAIL
    }

    struct TaskInfo{
        uint256 _currentAmount;
        uint256 _goalAmount;
        uint256  _deadline;
        string _description;
        status _taskStatus;

    }

    address private _owner;
   
    //描述，项目地址，捐钱者，以及对应金额，
    mapping(address => mapping(address => uint256)) private _fundingList;
    //项目地址=》条件
    mapping(address  => TaskInfo) private _fundingTask;
    //任务归属，为什么要和fundingTask拆开，
    //因为原来 mapping(address mapping(address => taskInfo) ) private fundingTask;
    //要找到直接给某个项目捐款，找不到对应的地址，因为需要做到是谁创建的，不符合最小化接口原则
    mapping(address => address) _belongTo;

    event Donate(address spender,address to, uint256 value);
    event Withdraw(address create, uint256 value);
    event Revoke(address spender,address to, uint256 value);
    event ChangeStates(address task,status state);
    event Initialize(address task,uint256 goalAmount,uint256 deadline,string  description,status state,uint timestamp);

    //达到条件了，才可以提取资金，那么这些资金是否需要做隔离？

    constructor(address owner) payable {
        _owner = owner;
    }
 
    fallback() external payable{}


  

    //function initialize(address _creator, string memory _description, uint256 _goalAmount, uint256 _duration) public
    //暂时没有找到对应的地址的方案，先用msg.sender
    function initialize(uint256 goalAmount,uint256 deadline,string calldata description)  public {
        require(deadline > block.timestamp,"bad deadline param");
        TaskInfo storage taskInfo = _fundingTask[msg.sender];
        taskInfo._goalAmount = goalAmount;
        taskInfo._deadline = deadline;
        //设否要设置？gas优化
        taskInfo._currentAmount = 0;
        emit  Initialize(msg.sender, goalAmount, deadline,  description,status.FUNDING,block.timestamp);

    }

    //function donate() external payable

    function donate(address taskAddress) public payable {
        //if(taskAddress == address(0))
        //   revert error name(type name );;

        //require(taskAddress == address(0));

        //记录总共捐了多少钱，以及对应的人
        TaskInfo storage taskInfo  = _fundingTask[taskAddress];
        require(taskInfo._taskStatus == status.FUNDING, "status error");
        _fundingTask[taskAddress]._currentAmount  +=  msg.value; 
        _fundingList[taskAddress][msg.sender] = msg.value;

        emit Donate(msg.sender,taskAddress,  msg.value);


    }

    modifier ownerable(){
        require(msg.sender == _owner,"not owner");
        _;
    }

     function changeStatePublic (address fundingAddress)public {
        changeState(fundingAddress);
    }

    //不管是成功，还是失败，都不应该由人来决定，如果由人来决定，就不去中心化了
    //function changeState(address fundingAddress,status state,unit256 deadline) internal  ownerable{  ,应该去掉state,deadline
    function changeState(address fundingAddress) internal  ownerable{
        TaskInfo storage taskInfo  = _fundingTask[fundingAddress];
        //作为状态机，都是需要用来做校验的
        require(taskInfo._taskStatus == status.FUNDING, "state error");
        //如果时间到期了才行，不管是成功还是失败，不管是成功，还是失败，都是需要校验的
        require(taskInfo._deadline > block.timestamp,"expired");
        if(taskInfo._currentAmount >= taskInfo._goalAmount){
            taskInfo._taskStatus = status.SUCCESS;
        }else{
            taskInfo._taskStatus = status.FAIL;
        }
        emit ChangeStates(fundingAddress,taskInfo._taskStatus);
        
    }

    //如果向外转钱ETH，是否需要payable?
    function withdraw()public payable{
        //是否要判断，当前合约的ETH?
        TaskInfo  storage taskInfo = _fundingTask[msg.sender];

        require(taskInfo._taskStatus == status.SUCCESS,"status error");
        //注意充入攻击
        uint256 tmp  = taskInfo._currentAmount;
        taskInfo._currentAmount = 0;
        //调用外面的转账的代码
        //如果出现了异常回滚，是否是只是transfer回滚，可能就是合约没有足够的钱了，就是报错了，会出现什么样的情况？
        payable(msg.sender).transfer(tmp);
        emit Withdraw(msg.sender, tmp);
    }
   

    function revoke(address taskAddress)public payable{
        require(_fundingTask[taskAddress]._taskStatus == status.FAIL,"status error");
        uint256  value = _fundingList[taskAddress][msg.sender];
        require(value > 0,"no donate");
        _fundingList[taskAddress][msg.sender] = 0;
        payable(address(msg.sender)).transfer(value);
        emit  Revoke(msg.sender,taskAddress,  value);
        

    }


    function balanceOf (address taskAddress) public view returns(uint256){
        return _fundingTask[taskAddress]._currentAmount;
    }
    

    

     function donateRecord (address from_,address to_) public view returns(uint256){
        return _fundingList[to_][from_];
    }
   

}

