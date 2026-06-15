"use client";

import { useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

export default function WalletDashboard() {
  const { connection } = useConnection();
  const wallet = useWallet();

  const [balance, setBalance] = useState<number | null>(null);
  const [accountInfo, setAccountInfo] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadWalletData = async () => {
    if (!wallet.publicKey) return;

    try {
      setLoading(true);

      // Balance
      const balanceLamports =
        await connection.getBalance(wallet.publicKey);

      setBalance(
        balanceLamports / LAMPORTS_PER_SOL
      );

      // Account Info
      const info =
        await connection.getAccountInfo(
          wallet.publicKey
        );

      setAccountInfo(info);

      // Recent Transactions
      const txs =
        await connection.getSignaturesForAddress(
          wallet.publicKey,
          {
            limit: 10,
          }
        );

      setTransactions(txs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWalletData();
  }, [wallet.publicKey]);

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6">
      <div className="mx-auto max-w-6xl">

        <h1 className="text-4xl font-bold mb-8">
          Wallet Dashboard
        </h1>

        {!wallet.publicKey ? (
          <div className="rounded-xl border border-red-700 p-6">
            Connect Phantom Wallet
          </div>
        ) : (
          <>
            {/* Address */}
            <div className="mb-6 rounded-xl border border-slate-700 p-6">
              <h2 className="text-xl font-semibold mb-3">
                Wallet Address
              </h2>

              <p className="break-all font-mono text-cyan-400">
                {wallet.publicKey.toBase58()}
              </p>
            </div>

            {/* Stats */}
            <div className="grid md:grid-cols-3 gap-4 mb-6">

              <div className="rounded-xl border border-slate-700 p-6">
                <h3 className="text-slate-400">
                  SOL Balance
                </h3>

                <p className="text-3xl font-bold">
                  {balance ?? 0}
                </p>
              </div>

              <div className="rounded-xl border border-slate-700 p-6">
                <h3 className="text-slate-400">
                  Executable
                </h3>

                <p className="text-3xl font-bold">
                  {accountInfo?.executable
                    ? "Yes"
                    : "No"}
                </p>
              </div>

              <div className="rounded-xl border border-slate-700 p-6">
                <h3 className="text-slate-400">
                  Rent Epoch
                </h3>

                <p className="text-3xl font-bold">
                  {accountInfo?.rentEpoch ??
                    "N/A"}
                </p>
              </div>

            </div>

            {/* Account Info */}
            <div className="mb-6 rounded-xl border border-slate-700 p-6">
              <h2 className="text-xl font-semibold mb-4">
                Account Information
              </h2>

              <div className="space-y-2">

                <div>
                  <strong>Owner:</strong>{" "}
                  {accountInfo?.owner?.toBase58()}
                </div>

                <div>
                  <strong>Lamports:</strong>{" "}
                  {accountInfo?.lamports}
                </div>

                <div>
                  <strong>Data Length:</strong>{" "}
                  {accountInfo?.data?.length}
                </div>

              </div>
            </div>

            {/* Transactions */}
            <div className="rounded-xl border border-slate-700 p-6">

              <h2 className="text-xl font-semibold mb-4">
                Recent Transactions
              </h2>

              {transactions.length === 0 ? (
                <p>No transactions found.</p>
              ) : (
                <div className="space-y-3">
                  {transactions.map((tx) => (
                    <div
                      key={tx.signature}
                      className="rounded-lg bg-slate-900 p-4"
                    >
                      <div className="break-all font-mono text-sm text-cyan-400">
                        {tx.signature}
                      </div>

                      <div className="mt-2 text-sm text-slate-400">
                        Slot: {tx.slot}
                      </div>

                      <div className="text-sm text-slate-400">
                        Status:{" "}
                        {tx.err
                          ? "Failed"
                          : "Success"}
                      </div>

                      <div className="text-sm text-slate-400">
                        Time:{" "}
                        {tx.blockTime
                          ? new Date(
                              tx.blockTime * 1000
                            ).toLocaleString()
                          : "N/A"}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {loading && (
          <div className="mt-6">
            Loading wallet data...
          </div>
        )}
      </div>
    </main>
  );
}