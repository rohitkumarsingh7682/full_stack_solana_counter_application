import * as anchor from "@coral-xyz/anchor";

import { Program } from "@coral-xyz/anchor";

import idl from "@/idl/counter.json";

import { PROGRAM_ID } from "./constants";

export function getProgram(
    provider: anchor.AnchorProvider
) {
    return new Program(
        idl as anchor.Idl, 
        provider
    
    )
}