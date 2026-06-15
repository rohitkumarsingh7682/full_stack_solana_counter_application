import * as anchor from "@coral-xyz/anchor";

export function getCounterPda(
  programId: anchor.web3.PublicKey,
  signer: anchor.web3.PublicKey,
  id: anchor.BN
) {
  return anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from("counter"),
      signer.toBuffer(),
      id.toArrayLike(Buffer, "le", 8),
    ],
    programId
  )[0];
}