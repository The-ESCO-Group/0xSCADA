// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IndustrialRegistry
 * @dev Identity, Registry, and Audit Log for 0x_SCADA.
 *      No real-time control logic. Only anchors and claims.
 */
contract IndustrialRegistry {
    // --- Events ---
    event SiteRegistered(string indexed siteId, string name, address indexed owner);
    event AssetRegistered(string indexed assetId, string indexed siteId, string assetType);
    event EventAnchored(string indexed eventId, string indexed assetId, string eventType, string payloadHash);
    event MaintenanceRecorded(string indexed workOrderId, string indexed assetId, string maintenanceType, string attachmentHash);

    // --- State ---
    
    struct Site {
        string name;
        string location;
        address owner;
        uint256 createdAt;
        bool active;
    }

    struct Asset {
        string siteId;
        string assetType; // e.g., "TRANSFORMER", "BREAKER"
        string nameOrTag;
        bool critical;
        string metadata; // JSON string or IPFS hash
        uint256 createdAt;
        bool active;
    }

    // Mappings
    mapping(string => Site) public sites;
    mapping(string => Asset) public assets;
    
    // Access Control (Simple for MVP)
    address public admin;
    mapping(address => bool) public authorizedGateways;

    constructor() {
        admin = msg.sender;
        authorizedGateways[msg.sender] = true;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Admin only");
        _;
    }

    modifier onlyGateway() {
        require(authorizedGateways[msg.sender], "Gateway only");
        _;
    }

    // --- Registry Functions ---

    function registerSite(string calldata _siteId, string calldata _name, string calldata _location) external {
        // In a real system, you might restrict who can register sites
        require(sites[_siteId].createdAt == 0, "Site already exists");

        sites[_siteId] = Site({
            name: _name,
            location: _location,
            owner: msg.sender,
            createdAt: block.timestamp,
            active: true
        });

        emit SiteRegistered(_siteId, _name, msg.sender);
    }

    function registerAsset(
        string calldata _assetId, 
        string calldata _siteId, 
        string calldata _assetType, 
        string calldata _nameOrTag,
        bool _critical,
        string calldata _metadata
    ) external {
        require(sites[_siteId].active, "Site not active");
        require(assets[_assetId].createdAt == 0, "Asset already exists");
        // Check site ownership or permissions here

        assets[_assetId] = Asset({
            siteId: _siteId,
            assetType: _assetType,
            nameOrTag: _nameOrTag,
            critical: _critical,
            metadata: _metadata,
            createdAt: block.timestamp,
            active: true
        });

        emit AssetRegistered(_assetId, _siteId, _assetType);
    }

    // --- Audit Functions ---

    /**
     * @notice Anchors an industrial event to the blockchain.
     * @param _eventId Unique ID for this event
     * @param _assetId The asset involved
     * @param _eventType e.g., "BREAKER_TRIP"
     * @param _payloadHash SHA256/Keccak256 of the full off-chain JSON payload
     */
    function recordEventAnchor(
        string calldata _eventId,
        string calldata _assetId,
        string calldata _eventType,
        string calldata _payloadHash
    ) external onlyGateway {
        require(assets[_assetId].active, "Asset not active");

        // We don't store the full event details to save gas.
        // We only store the fact that it happened and verify the data integrity via hash.
        
        emit EventAnchored(_eventId, _assetId, _eventType, _payloadHash);
    }

    /**
     * @notice Records a maintenance action.
     */
    function recordMaintenance(
        string calldata _workOrderId,
        string calldata _assetId,
        string calldata _maintenanceType,
        string calldata _attachmentHash
    ) external onlyGateway {
        require(assets[_assetId].active, "Asset not active");

        emit MaintenanceRecorded(_workOrderId, _assetId, _maintenanceType, _attachmentHash);
    }

    // --- Admin Functions ---
    
    function setGatewayStatus(address _gateway, bool _status) external onlyAdmin {
        authorizedGateways[_gateway] = _status;
    }
}
