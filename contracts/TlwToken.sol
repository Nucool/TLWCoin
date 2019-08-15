pragma solidity >0.4.24;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract TlwToken is ERC20, Ownable {
    string public name = "TlwToken";
    string public symbol = "TLW";
    uint8 public decimals;
    uint public INITIAL_SUPPLY = 12000;
    uint256 internalPrice = 1 ether;
    uint256 private _reservePay;
    address payable private _ownerPay;

    struct TransactionBuy {
        uint id;
        uint date;
        address buyer;
        uint256 price;
        uint256 amount;
        uint256 totalPrice;
        address toAddress;
    }

    struct TransactionWithdraw {
        uint id;
        uint date;
        address seller;
        uint256 price;
        uint256 amount;
        uint256 totalPrice;
    }

    mapping (uint => TransactionBuy) transactionBuyId;
    mapping (uint => TransactionWithdraw) transactionWithdrawId;

    TransactionBuy[] private _transactionBuy;
    TransactionWithdraw[] private _transactionWithdraw;

    constructor() public {
        _mint(msg.sender, INITIAL_SUPPLY);
        _ownerPay = msg.sender;
    }

    function getOwner() public view returns (address, uint) {
        return (owner(), 3);
    }

    function getPrice() public view returns (uint256) {
        return internalPrice;
    }

    function buyToken(uint256 amount, address toAddress) public payable {
        //require(msg.value == (amount * internalPrice));
        address _toAddress = msg.sender;
        if(toAddress != address(0)) {
            _toAddress = toAddress;
        }

        _transfer(owner(), _toAddress, amount);
        _reservePay = _reservePay.add(msg.value);
        _addTransactionBuy(msg.sender, internalPrice, amount, msg.value, _toAddress);

        //_deposits[msg.sender] = _deposits[msg.sender].add(msg.value);
        //_ownerPay.transfer(msg.value);
    }

    function withdraw(address payable payee, uint256 amount) public {
        uint256 payment = amount * internalPrice;
        require(_reservePay >= payment, "have no reserve");
        _reservePay = _reservePay.sub(payment);

        _transfer(payee, owner(), amount);
        payee.transfer(payment);
    }

    function sellToken(address payable receiver, uint256 amount) public payable {
        _transfer(receiver, owner(), amount);
        receiver.transfer(msg.value);
    }

    function getReservePay() public view returns(uint256) {
        return _reservePay;
    }

    function getTransactionBuyByToAddress(address toAddress) public view returns(uint[] memory){
        require(_transactionBuy.length > 0, "No data");
        uint counter = 0;
        uint index = 0;
        for (uint i = 0; i < _transactionBuy.length; i++){
            if (toAddress == _transactionBuy[i].toAddress) {
                counter++;
            }
        }
        uint[] memory listId = new uint[](counter);
        for (uint j = 0; j < _transactionBuy.length; j++) {
            if (toAddress == _transactionBuy[j].toAddress) {
                listId[index] = _transactionBuy[j].id;
                index++;
            }
        }
        return (listId);
    }

    function getTransactionBuyByBuyerAddress(address buyer) public view returns(uint[] memory){
        require(_transactionBuy.length > 0, "No data");
        uint counter = 0;
        uint index = 0;
        for (uint i = 0; i < _transactionBuy.length; i++){
            if (buyer == _transactionBuy[i].buyer) {
                counter++;
            }
        }
        uint[] memory listId = new uint[](counter);
        for (uint j = 0; j < _transactionBuy.length; j++) {
            if (buyer == _transactionBuy[j].buyer) {
                listId[index] = _transactionBuy[j].id;
                index++;
            }
        }
        return (listId);
    }

    function getTransactionBuyById(uint _id) public view returns(uint,
        uint,
        address,
        uint256,
        uint256,
        uint256,
        address) {
        TransactionBuy memory result = transactionBuyId[_id];
        return (result.id,
                result.date,
                result.buyer,
                result.price,
                result.amount,
                result.totalPrice,
                result.toAddress
                );
    }

    function _addTransactionBuy(address buyer, uint256 price, uint256 amount, uint256 totalPrice, address toAddress) internal {
        uint id = _transactionBuy.length;
        _transactionBuy.push(TransactionBuy(id, now, buyer, price, amount, totalPrice, toAddress));
        transactionBuyId[id] = _transactionBuy[id];
    }
}