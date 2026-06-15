"use client";

import { useState } from "react";

import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";

import {
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";

import {
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";

import idl from "../idl/counter.json";
import { useRouter } from "next/navigation";

const PROGRAM_ID = new anchor.web3.PublicKey(
  "AkgL2oepiB9e4Y3gx9Z6LdkavoFdwEBEMs4LQ8GMny1"
);

export default function Home() {

  const router = useRouter();
  const seedeatils = () => {
    router.push("/transation")
  };

  const { connection } = useConnection();
  const wallet = useWallet();

  const [txSig, setTxSig] = useState("");
  const [loading, setLoading] = useState(false);

  const initializeCounter = async () => {
    try {
      if (!wallet.publicKey) {
        alert("Connect Phantom first");
        return;
      }

      if (
        !wallet.signTransaction ||
        !wallet.signAllTransactions
      ) {
        alert("Wallet cannot sign transactions");
        return;
      }

      setLoading(true);

      const provider = new anchor.AnchorProvider(
        connection,
        {
          publicKey: wallet.publicKey,
          signTransaction: wallet.signTransaction,
          signAllTransactions: wallet.signAllTransactions,
        },
        {
          commitment: "confirmed",
        }
      );

      const program = new Program(
        idl as anchor.Idl,
        provider
      );

      const id = new anchor.BN(1);

      const [counterPda] =
        anchor.web3.PublicKey.findProgramAddressSync(
          [
            Buffer.from("counter"),
            wallet.publicKey.toBuffer(),
            id.toArrayLike(Buffer, "le", 8),
          ],
          PROGRAM_ID
        );

      console.log(
        "Counter PDA:",
        counterPda.toBase58()
      );

      const signature = await program.methods
        .initialize(id)
        .accountsPartial({
          counterAccount: counterPda,
        })
        .rpc();

      console.log("TX:", signature);

      setTxSig(signature);
    } catch (err) {
      console.error(err);
      alert("Transaction failed. Check console.");
    } finally {
      setLoading(false);
    }


  };


  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white">
      <div className="container mx-auto flex min-h-screen items-center justify-center px-6">
        <div className="w-full max-w-3xl rounded-3xl border border-slate-800 bg-slate-900/70 p-8 shadow-2xl backdrop-blur-xl">

          {/* Header */}
          <div className="mb-10 text-center">
            <h1 className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-5xl font-bold text-transparent">
              Counter DApp
            </h1>

            <p className="mt-3 text-slate-400">
              Built with Solana, Anchor, Next.js & Phantom
            </p>
          </div>

          {/* Wallet */}
          <div className="mb-8 flex justify-center">
            <WalletMultiButton />
          </div>

          {/* Wallet Address */}
          {wallet.publicKey && (
            <div className="mb-8 rounded-2xl border border-slate-700 bg-slate-800/50 p-5">
              <p className="mb-2 text-sm text-slate-400">
                Connected Wallet
              </p>

              <p className="break-all font-mono text-cyan-400">
                {wallet.publicKey.toBase58()}
              </p>
            </div>
          )}

          {/* Counter Card */}
          <div className="rounded-2xl border border-slate-700 bg-slate-800/50 p-6">
            <h2 className="mb-2 text-2xl font-semibold">
              Initialize Counter
            </h2>

            <p className="mb-6 text-slate-400">
              Create your first counter account on
              Solana Devnet using Anchor.
            </p>

            <button
              onClick={initializeCounter}
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 px-6 py-4 font-semibold transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Initializing..."
                : "Initialize Counter"}
            </button>
          </div>

          {/* Transaction Success */}
          {txSig && (
            <div className="mt-8 rounded-2xl border border-green-800 bg-green-950/20 p-6">
              <h3 className="mb-4 text-lg font-semibold text-green-400">
                Transaction Successful 🎉
              </h3>

              <p className="mb-2 text-sm text-slate-400">
                Transaction Signature
              </p>

              <code className="block break-all rounded-lg bg-black/30 p-4 text-xs text-green-300">
                {txSig}
              </code>

              <a
                href={`https://explorer.solana.com/tx/${txSig}?cluster=devnet`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block text-cyan-400 transition hover:text-cyan-300"
              >
                View on Solana Explorer →
              </a>
            </div>
          )}

          {/* Footer */}
          <div className="mt-10 border-t border-slate-800 pt-6 text-center text-sm text-slate-500">
            Program ID
            <br />
            <span className="font-mono text-xs text-slate-400">
              {PROGRAM_ID.toBase58()}
            </span>

          </div>

          <div>
            <h1> See all the transations  details</h1>
            <button onClick={seedeatils} > click for the details</button>
          </div>
        </div>
      </div>

    </main>
  );
}