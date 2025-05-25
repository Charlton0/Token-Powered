// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title NFT Platform with Creator Rewards
/// @dev Combines ERC721 for NFTs and a custom ERC20-like reward system in one contract
contract NFTPlatform is ERC721URIStorage, Ownable {
    uint256 public tokenIdCounter; // Tracks NFT token IDs

    string public constant REWARD_TOKEN_NAME = "CreatorToken";
    string public constant REWARD_TOKEN_SYMBOL = "CRT";
    uint8 public constant DECIMALS = 18;
    uint256 public totalSupply;
    uint256 public constant REWARD_AMOUNT = 10 * 10 ** uint256(DECIMALS); // Fixed reward (10 CRT)

    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;

    mapping(uint256 => address) public creators;

    /// @notice Constructor initializes the NFT name/symbol and mints fixed supply of reward tokens
    constructor() ERC721("ArtNFT", "ART") Ownable(msg.sender) {
        totalSupply = 1000000 * 10 ** uint256(DECIMALS); // Fixed supply of 1 million CRT
        _balances[address(this)] = totalSupply; // Mint all tokens to contract itself
    }

    /// @notice Mint a new NFT with metadata URI
    /// @dev Also rewards the minter with CRT tokens
    /// @param _tokenURI URI pointing to the NFT metadata
    function mintNFT(string memory _tokenURI) external {
        uint256 newId = tokenIdCounter;
        _safeMint(msg.sender, newId);
        _setTokenURI(newId, _tokenURI);
        creators[newId] = msg.sender;
        tokenIdCounter++;

        _rewardCreator(msg.sender, REWARD_AMOUNT);
        emit ArtMinted(msg.sender, newId, _tokenURI);
    }

    /// @dev Internal reward transfer to creator from the contract's CRT token balance
    function _rewardCreator(address to, uint256 amount) internal {
        require(_balances[address(this)] >= amount, "Insufficient CRT in contract");
        _transferCRT(address(this), to, amount);
        emit CreatorRewarded(to, amount);
    }

    /// @notice Allows contract owner to manually reward a creator
    function rewardCreator(address to, uint256 amount) external onlyOwner {
        _rewardCreator(to, amount);
    }

    /// @dev Internal transfer function for CRT token
    function _transferCRT(address from, address to, uint256 amount) internal {
        require(to != address(0), "Transfer to zero address");
        require(_balances[from] >= amount, "Insufficient balance");
        _balances[from] -= amount;
        _balances[to] += amount;
        emit TransferCRT(from, to, amount);
    }

    // --- ERC20-Like Functions for CreatorToken (renamed to avoid ERC721 conflicts) ---

    function decimals() public pure returns (uint8) {
        return DECIMALS;
    }

    function balanceOfCRT(address account) public view returns (uint256) {
        return _balances[account];
    }

    function transferCRT(address recipient, uint256 amount) public returns (bool) {
        _transferCRT(msg.sender, recipient, amount);
        return true;
    }

    function approveCRT(address spender, uint256 amount) public returns (bool) {
        _allowances[msg.sender][spender] = amount;
        emit ApprovalCRT(msg.sender, spender, amount);
        return true;
    }

    function allowanceCRT(address owner, address spender) public view returns (uint256) {
        return _allowances[owner][spender];
    }

    function transferFromCRT(address sender, address recipient, uint256 amount) public returns (bool) {
        uint256 currentAllowance = _allowances[sender][msg.sender];
        require(currentAllowance >= amount, "Allowance exceeded");
        _allowances[sender][msg.sender] -= amount;
        _transferCRT(sender, recipient, amount);
        return true;
    }

    // Events goes here

    /// @notice Emitted when an NFT is minted
    event ArtMinted(address indexed creator, uint256 tokenId, string tokenURI);

    /// @notice Emitted when CRT tokens are rewarded to a creator
    event CreatorRewarded(address indexed to, uint256 amount);

    /// @notice Emitted for ERC20-style CRT token transfers
    event TransferCRT(address indexed from, address indexed to, uint256 value);

    /// @notice Emitted for ERC20-style CRT token approvals
    event ApprovalCRT(address indexed owner, address indexed spender, uint256 value);

   //contract address as deployed on Lisk sepolia testnet
  // 0x76e4c33e38405a1dd74111141ae4fd942c55bb49 
}
