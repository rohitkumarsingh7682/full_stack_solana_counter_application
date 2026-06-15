import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { expect } from "chai";

import { Counter } from "../target/types/counter";

describe("counter", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Counter as Program<Counter>;

  const id = new anchor.BN(1);

  const [counterPda] = anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from("counter"),
      provider.wallet.publicKey.toBuffer(),
      id.toArrayLike(Buffer, "le", 8),
    ],
    program.programId
  );

  it("Initialize counter", async () => {
    await program.methods
      .initialize(id)
      .accountsPartial({
        counterAccount: counterPda,
        signer: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    const account = await program.account.counterStruct.fetch(
      counterPda
    );

    expect(account.id.toNumber()).to.equal(1);
    expect(account.count).to.equal(0);
  });

  it("Update counter", async () => {
    await program.methods
      .update(id, 10)
      .accountsPartial({
        updateAccount: counterPda,
        signer: provider.wallet.publicKey,
      })
      .rpc();

    const account = await program.account.counterStruct.fetch(
      counterPda
    );

    expect(account.count).to.equal(10);
  });

  it("Delete counter", async () => {
    await program.methods
      .delete(id)
      .accountsPartial({
        deleteAccount: counterPda,
        signer: provider.wallet.publicKey,
      })
      .rpc();

    try {
      await program.account.counterStruct.fetch(counterPda);
      expect.fail("Account should be deleted");
    } catch (err) {
      expect(true).to.equal(true);
    }
  });
});