import * as anchor from "@coral-xyz/anchor";

export function getProvider(
  connection: any,
  wallet: any
) {
  return new anchor.AnchorProvider(
    connection,
    wallet,
    {
      commitment: "confirmed",
    }
  );
}