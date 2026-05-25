pragma solidity ^0.8.24;

contract MonadTimeCapsule {
    struct Capsule {
        address author;
        string message;
        uint256 createdAt;
        uint256 unlockAt;
        uint256 amountPaid;
    }

    address public owner;
    uint256 public creationFee = 0 ether;
    uint256 public constant maxMessageLength = 500;
    Capsule[] private capsules;

    event CapsuleCreated(uint256 indexed id, address indexed author, uint256 unlockAt, uint256 amountPaid);

    modifier onlyOwner() {
        require(msg.sender == owner, 'Not owner');
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function createCapsule(string calldata message, uint256 unlockAt) external payable {
        require(bytes(message).length > 0, 'Empty message');
        require(bytes(message).length <= maxMessageLength, 'Message too long');
        require(unlockAt > block.timestamp, 'Unlock in future');
        require(msg.value >= creationFee, 'Insufficient fee');

        capsules.push(Capsule({
            author: msg.sender,
            message: message,
            createdAt: block.timestamp,
            unlockAt: unlockAt,
            amountPaid: msg.value
        }));

        emit CapsuleCreated(capsules.length - 1, msg.sender, unlockAt, msg.value);
    }

    function getCapsule(uint256 id) external view returns (address author, string memory message, uint256 createdAt, uint256 unlockAt, uint256 amountPaid, bool isUnlocked) {
        require(id < capsules.length, 'Invalid id');
        Capsule storage capsule = capsules[id];
        bool unlocked = block.timestamp >= capsule.unlockAt;

        return (
            capsule.author,
            unlocked ? capsule.message : '',
            capsule.createdAt,
            capsule.unlockAt,
            capsule.amountPaid,
            unlocked
        );
    }

    function getCapsuleCount() external view returns (uint256) {
        return capsules.length;
    }

    function withdraw() external onlyOwner {
        (bool success, ) = payable(owner).call{value: address(this).balance}('');
        require(success, 'Withdraw failed');
    }

    function setCreationFee(uint256 newFee) external onlyOwner {
        creationFee = newFee;
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), 'Zero address');
        owner = newOwner;
    }
}
