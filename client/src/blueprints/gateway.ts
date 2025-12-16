import { ethers } from "ethers";
import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";

dotenv.config();

// --- Configuration ---
const PORT = process.env.PORT || 3000;
const RPC_URL = process.env.RPC_URL || "http://127.0.0.1:8545";
const PRIVATE_KEY = process.env.PRIVATE_KEY; 
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

// ABI Extraction (Simplified for MVP)
const CONTRACT_ABI = [
  "function recordEventAnchor(string _eventId, string _assetId, string _eventType, string _payloadHash) external",
  "function recordMaintenance(string _workOrderId, string _assetId, string _maintenanceType, string _attachmentHash) external"
];

// --- Setup ---
const app = express();
app.use(bodyParser.json());

// Blockchain Provider & Signer
const provider = new ethers.JsonRpcProvider(RPC_URL);
// @ts-ignore
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const contract = new ethers.Contract(CONTRACT_ADDRESS!, CONTRACT_ABI, wallet);

// In-Memory Persistence (Replace with SQLite/Postgres)
const offChainStore: Record<string, any> = {};

// --- Simulator ---
function startFieldSimulator() {
    console.log("[SIM] Starting Field Device Simulator...");
    setInterval(async () => {
        const events = ["BREAKER_TRIP", "VOLTAGE_SAG", "SETPOINT_CHANGE"];
        const assets = ["AST-101", "AST-102", "AST-201"];
        
        const randomEvent = events[Math.floor(Math.random() * events.length)];
        const randomAsset = assets[Math.floor(Math.random() * assets.length)];
        
        const payload = {
            eventId: `EVT-${Date.now()}`,
            assetId: randomAsset,
            eventType: randomEvent,
            timestamp: new Date().toISOString(),
            values: {
                voltage: 13.8 + (Math.random() * 0.2),
                current: 450 + (Math.random() * 50)
            }
        };

        console.log(`[SIM] Generated Event: ${payload.eventId}`);
        await processEvent(payload);

    }, 10000); // Every 10 seconds
}

// --- Core Logic ---

async function processEvent(payload: any) {
    // 1. Hash the payload
    const payloadString = JSON.stringify(payload);
    const payloadHash = ethers.id(payloadString);

    // 2. Store off-chain
    offChainStore[payloadHash] = payload;
    console.log(`[DB] Stored payload for hash: ${payloadHash.slice(0, 10)}...`);

    // 3. Anchor to Blockchain
    try {
        console.log(`[CHAIN] Submitting tx for ${payload.eventId}...`);
        const tx = await contract.recordEventAnchor(
            payload.eventId,
            payload.assetId,
            payload.eventType,
            payloadHash
        );
        console.log(`[CHAIN] Tx Sent: ${tx.hash}`);
        await tx.wait();
        console.log(`[CHAIN] Tx Confirmed`);
    } catch (err) {
        console.error(`[CHAIN] Error:`, err);
    }
}

// --- API Endpoints ---

app.post("/events", async (req, res) => {
    const payload = req.body;
    if (!payload.eventId || !payload.assetId) {
        return res.status(400).json({ error: "Invalid payload" });
    }
    
    // Async processing
    processEvent(payload).catch(console.error);
    
    res.json({ status: "Processing", eventId: payload.eventId });
});

app.get("/events/:hash", (req, res) => {
    const payload = offChainStore[req.params.hash];
    if (!payload) return res.status(404).json({ error: "Not found" });
    res.json(payload);
});

// --- Start ---
app.listen(PORT, () => {
    console.log(`[GATEWAY] Listening on port ${PORT}`);
    startFieldSimulator();
});
