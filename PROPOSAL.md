# Project Proposal: Privacy-Preserving Sealed-Bid Auction on Midnight Network

## 1. Executive Summary

**Project Name:** Sealed-Bid Auction  
**Network:** Midnight Preprod Network  
**Contract ID:** `86acae374f30f3091570fabcbca34031d6154810c50d4f7c12483d1f1cf80740`  
**Live Demo:** [https://sealed-bid-auction-mu.vercel.app](https://sealed-bid-auction-mu.vercel.app)  

**Sealed-Bid Auction** is a privacy-first decentralized application (dApp) built on the **Midnight Network** using the **Compact** smart contract language. By leveraging Midnight’s zero-knowledge (ZK) technology and selective disclosure paradigm, the application enables fair, tamper-proof, and front-running resistant auctions where bid values remain strictly confidential during the bidding phase.

---

## 2. Problem Statement

Traditional blockchain auctions (e.g., standard English or Dutch auctions on transparent ledgers like Ethereum) suffer from inherent structural flaws:

1. **Front-Running & MEV (Maximal Extractable Value):** Because all bids are publicly broadcasted to the mempool, malicious actors and bots can front-run legitimate buyers.
2. **Bid Shading & Collusion:** Publicly visible bids encourage participants to shade their bids based on competitor behavior rather than their true valuation.
3. **Sniper Bot Manipulation:** Automated scripts submit bids in the final seconds of an auction to exploit public pricing information.
4. **Lack of Privacy:** Bidders are forced to expose their financial intent, bidding strategies, and historical activity to all network observers.

Existing attempts to solve this on transparent blockchains require complex commit-reveal schemes backed by centralized servers or trusted escrows, reintroducing single points of failure.

---

## 3. The Solution: Midnight-Powered Sealed-Bid Auction

Our solution utilizes Midnight’s **selective disclosure** architecture to decouple private state (bid amounts, salts, secret keys) from public consensus state (auction phase, commitments, winning bid):

- **Commitment Phase (Bidding):** Each participant submits a cryptographic commitment `makeCommitment(bidAmount, salt)` alongside a domain-separated nullifier `bidNullifier(secretKey)`. The actual bid amount and salt never touch the public ledger.
- **Reveal Phase:** Bidders reveal their `bidAmount` and `salt`. The Compact smart contract executes on-chain zero-knowledge circuits to verify that the revealed values match the original commitment.
- **Winner Determination:** The contract automatically tracks the highest verified bid and winning nullifier. Unrevealed bids remain completely private forever.

---

## 4. Key Technical Architecture

### 4.1 Compact Smart Contract (`sealed-bid-auction.compact`)
The core contract implements a three-phase state machine:
1. `Bidding (Phase 0)`: Accepts bid commitments and nullifiers.
2. `Reveal (Phase 1)`: Accepts bid disclosures and validates commitments.
3. `Ended (Phase 2)`: Finalizes the auction and declares the winning nullifier and bid.

### 4.2 Witness Architecture
Private keys and bid parameters are handled through client-side witness functions (`localSecretKey`, `localBidAmount`, `localBidSalt`). Private state never leaves the user's local browser environment.

### 4.3 Browser Integration & Wallet Bridge
- **Wallet Support:** Integrated with the **1AM Wallet Extension** using `midnight-wallet-kit`.
- **In-Browser Proof Generation:** Generates ZK proofs directly in the user's browser using client-side WASM artifacts (`.bzkir`, `.prover`, `.verifier`).
- **Direct Deployment:** Supports deploying new auction instances directly from the web interface to the Midnight Preprod Network.

---

## 5. Privacy & Security Model

| Data Item | Visibility | Protection Mechanism |
| :--- | :--- | :--- |
| **Bid Amount (Bidding Phase)** | 🔒 Confidential | Hidden inside Poseidon hash commitment |
| **Bidder Identity** | 🔒 Anonymous | Represented by pseudonymous nullifier |
| **Bid Salt** | 🔒 Confidential | Retained locally in client browser |
| **Unrevealed Bids** | 🔒 Confidential | Never disclosed on-chain |
| **Highest Revealed Bid** | 🌐 Public (Reveal/Ended) | Verifiable on Midnight ledger |
| **Winning Nullifier** | 🌐 Public (Ended) | Verified by Compact circuit logic |

---

## 6. Project Deliverables

- [x] **Smart Contract:** Fully tested Compact contract (`contract/src/sealed-bid-auction.compact`).
- [x] **Contract Test Suite:** 9 passing unit/integration tests covering double-bidding, phase gating, unauthorized access, and unrevealed privacy.
- [x] **Web Application:** Modern React/Vite frontend supporting 1AM Wallet connection, contract deployment, and full auction interaction.
- [x] **Preprod Deployment:** Active contract deployed to Midnight Preprod (`86acae374f30f3091570fabcbca34031d6154810c50d4f7c12483d1f1cf80740`).
- [x] **CI/CD Integration:** Automated GitHub Actions pipeline verifying contract compilation and tests on every commit.

---

## 7. Future Roadmap

1. **Multi-Asset Auctions:** Extend contract logic to support native Midnight tokens and custom privacy tokens.
2. **Automated Timed Phase Transitions:** Integrate Midnight block height timestamps for automatic phase transitions from Bidding to Reveal to Ended.
3. **Decentralized Auction Explorer:** Build a dashboard to browse, query, and participate in active sealed-bid auctions deployed across the Midnight Network.
