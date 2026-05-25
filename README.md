# Monad Time Capsule

Write now. Open later. Forever on Monad.

## Stack
- Next.js + TypeScript + Tailwind CSS
- wagmi + viem + RainbowKit
- Solidity 0.8.24+

## Environment
Create `.env.local`:

```bash
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=
NEXT_PUBLIC_CONTRACT_ADDRESS=
```

## Run locally
```bash
npm install
npm run dev
```

## Remix contract deployment guide
1. Open https://remix.ethereum.org
2. Create file `MonadTimeCapsule.sol`
3. Paste `contracts/MonadTimeCapsule.sol`
4. Compile with Solidity `0.8.24+`
5. In wallet, switch to Monad Mainnet
6. In Remix Deploy tab, choose `Injected Provider - MetaMask`
7. Confirm network is Chain ID `143`
8. Deploy `MonadTimeCapsule`
9. Copy deployed contract address
10. Copy ABI from Compilation Details
11. Put address into frontend `.env.local`:
   `NEXT_PUBLIC_CONTRACT_ADDRESS=0x...`
12. Put ABI into `lib/abi.ts`

## Monad network config
- Chain ID: `143`
- RPC URL: `https://rpc.monad.xyz`
- Native token: `MON`
- Explorer: `https://monadvision.com`

## Vercel deployment guide
1. Push project to GitHub
2. Import this repo into Vercel
3. Add env variables:
   - `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`
   - `NEXT_PUBLIC_CONTRACT_ADDRESS`
4. Build command: `npm run build`
5. Framework: `Next.js`
6. Deploy

## ABI
The ABI is already prepared in `lib/abi.ts` and matches the contract in `contracts/MonadTimeCapsule.sol`.
