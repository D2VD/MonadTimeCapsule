'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { createPublicClient, formatEther, http } from 'viem';
import { useAccount, useChainId, useReadContract, useSwitchChain, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { monadTimeCapsuleAbi } from '@/lib/abi';
import { monadMainnet } from '@/lib/chain';

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}` | undefined;
const publicClient = createPublicClient({ chain: monadMainnet, transport: http('https://rpc.monad.xyz') });

type Capsule = { id: number; author: `0x${string}`; message: string; createdAt: bigint; unlockAt: bigint; amountPaid: bigint; isUnlocked: boolean };

const short = (a: string) => `${a.slice(0, 6)}...${a.slice(-4)}`;
const fmt = (n: bigint) => new Date(Number(n) * 1000).toLocaleString();
const countdown = (u: bigint) => {
  const s = Number(u) - Math.floor(Date.now() / 1000);
  if (s <= 0) return 'Opening now';
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  return `${d}d ${h}h ${m}m`;
};

export default function Home() {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const [message, setMessage] = useState('Dear future me...');
  const [customDate, setCustomDate] = useState('');
  const [unlockAt, setUnlockAt] = useState<number>(Math.floor(Date.now() / 1000) + 86400);
  const [capsules, setCapsules] = useState<Capsule[]>([]);

  const { data: txHash, isPending: isWriting, writeContract } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash: txHash });

  const { data: capsuleCount, refetch: refetchCount } = useReadContract({ abi: monadTimeCapsuleAbi, address: contractAddress, functionName: 'getCapsuleCount', query: { enabled: Boolean(contractAddress) } });

  const canSubmit = useMemo(() => isConnected && chainId === 143 && message.trim().length > 0 && message.length <= 500 && unlockAt > Math.floor(Date.now() / 1000), [isConnected, chainId, message, unlockAt]);

  async function loadCapsules() {
    if (!contractAddress) return;
    const total = Number((await refetchCount()).data ?? 0n);
    const ids = Array.from({ length: Math.min(30, total) }, (_, i) => total - 1 - i);
    const result = await Promise.all(ids.map(async (id) => {
      const [author, body, createdAt, unlockTs, amountPaid, isUnlocked] = await publicClient.readContract({ abi: monadTimeCapsuleAbi, address: contractAddress, functionName: 'getCapsule', args: [BigInt(id)] });
      return { id, author, message: body, createdAt, unlockAt: unlockTs, amountPaid, isUnlocked };
    }));
    setCapsules(result);
  }

  useEffect(() => { loadCapsules(); }, [capsuleCount]);
  useEffect(() => { if (isSuccess) loadCapsules(); }, [isSuccess]);

  function preset(sec: number) { const ts = Math.floor(Date.now() / 1000) + sec; setUnlockAt(ts); setCustomDate(new Date(ts * 1000).toISOString().slice(0, 16)); }
  function submit(e: FormEvent) { e.preventDefault(); if (!contractAddress) return; writeContract({ abi: monadTimeCapsuleAbi, address: contractAddress, functionName: 'createCapsule', args: [message, BigInt(unlockAt)], value: 0n }); }

  return <main className="mx-auto max-w-5xl px-4 py-10 space-y-8">{/* omitted for brevity */}
    <section className="card text-center space-y-3"><h1 className="text-4xl font-bold">Monad Time Capsule</h1><p className="text-monad-50/90">Write now. Open later. Forever on Monad.</p><p>Write a message to your future self. Lock it on Monad.</p><div className="flex justify-center"><ConnectButton /></div></section>
    {chainId !== 143 && isConnected && <section className="card flex items-center justify-between gap-4"><p>Wrong network. Please switch to Monad Mainnet (Chain ID 143).</p><button className="rounded-xl bg-monad-500 px-4 py-2" onClick={() => switchChain({ chainId: 143 })}>Switch Network</button></section>}
    <section className="card"><h2 className="text-2xl font-semibold mb-4">Seal Capsule</h2><form onSubmit={submit} className="space-y-4"><textarea value={message} onChange={(e) => setMessage(e.target.value)} maxLength={500} className="w-full min-h-40 rounded-xl border border-monad-400/40 bg-black/50 p-3" /><p className="text-sm text-monad-50/80">{message.length}/500</p><div className="flex gap-2 flex-wrap"><button type="button" className="rounded-xl border px-3 py-2" onClick={() => preset(86400)}>1 Day</button><button type="button" className="rounded-xl border px-3 py-2" onClick={() => preset(86400 * 7)}>7 Days</button><button type="button" className="rounded-xl border px-3 py-2" onClick={() => preset(86400 * 30)}>30 Days</button></div><input type="datetime-local" value={customDate} onChange={(e) => { setCustomDate(e.target.value); setUnlockAt(Math.floor(new Date(e.target.value).getTime() / 1000)); }} className="rounded-xl border border-monad-400/40 bg-black/50 p-3" /><p className="text-sm">Fee: <span className="font-semibold">0 MON (network gas only)</span></p><button disabled={!canSubmit || isWriting || isConfirming} className="rounded-xl bg-monad-500 px-4 py-2 font-semibold disabled:opacity-50">{isWriting || isConfirming ? 'Creating...' : 'Create Time Capsule'}</button></form>{txHash && <p className="mt-3 text-sm">Tx: <a className="underline" href={`https://monadvision.com/tx/${txHash}`} target="_blank">{short(txHash)}</a></p>}{isSuccess && <p className="mt-2 text-green-400">Unlocked from the future: capsule sealed successfully.</p>}</section>
    <section className="card space-y-4"><div className="flex items-center justify-between"><h2 className="text-2xl font-semibold">Public Capsules Feed</h2><button onClick={loadCapsules} className="rounded-xl border px-3 py-2">Refresh</button></div><div className="space-y-3">{capsules.map((c) => <article key={c.id} className="rounded-xl border border-monad-400/30 p-4 bg-black/30">{c.isUnlocked ? <p className="mb-2">⏳ Unlocked from the future</p> : <p className="mb-2">🔒 Opening soon</p>}<p className="text-monad-50/90">{c.isUnlocked ? c.message : 'This message is still traveling through time.'}</p><div className="mt-2 text-sm text-monad-50/70">ID #{c.id} · {short(c.author)} · Created {fmt(c.createdAt)} · Unlock {fmt(c.unlockAt)} {!c.isUnlocked && `· ${countdown(c.unlockAt)}`}</div><div className="text-xs text-monad-50/60">Paid {formatEther(c.amountPaid)} MON</div></article>)}</div></section>
    <footer className="text-center text-sm text-monad-50/70 pb-10">Contract: {contractAddress ?? 'Set NEXT_PUBLIC_CONTRACT_ADDRESS'} · Monad Mainnet · <a href="https://monadvision.com" className="underline" target="_blank">Explorer</a></footer>
  </main>;
}
