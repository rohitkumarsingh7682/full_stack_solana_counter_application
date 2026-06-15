use anchor_lang::prelude::*;

declare_id!("AkgL2oepiB9e4Y3gx9Z6LdkavoFdwEBEMs4LQ8GMny1");

#[program]
pub mod counter {
    use super::*;

    pub fn initialize(
        ctx: Context<Initialize>,
        id: u64,
    ) -> Result<()> {
        let user = &mut ctx.accounts.counter_account;

        user.count = 0;
        user.id = id;

        Ok(())
    }

    pub fn update(
        ctx: Context<Update>,
        id: u64,
        count: u32,
    ) -> Result<()> {
        let user = &mut ctx.accounts.update_account;

        user.count = count;
        user.id = id;

        Ok(())
    }

    pub fn delete(
        _ctx: Context<Delete>,
        id: u64,
    ) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(id: u64)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = signer,
        space = 8 + CounterStruct::INIT_SPACE,
        seeds = [
            b"counter",
            signer.key().as_ref(),
            &id.to_le_bytes()
        ],
        bump
    )]
    pub counter_account: Account<'info, CounterStruct>,

    #[account(mut)]
    pub signer: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(id: u64)]
pub struct Update<'info> {
    #[account(
        mut,
        seeds = [
            b"counter",
            signer.key().as_ref(),
            &id.to_le_bytes()
        ],
        bump,
        constraint = update_account.id == id
    )]
    pub update_account: Account<'info, CounterStruct>,

    pub signer: Signer<'info>,
}

#[derive(Accounts)]
#[instruction(id : u64)]
pub struct Delete<'info> {
    #[account(
        mut,
        seeds = [
            b"counter",
            signer.key().as_ref(),
            &id.to_le_bytes()
        ],
        bump,
        close = signer
    )]
    pub delete_account: Account<'info, CounterStruct>,

    #[account(mut)]
    pub signer: Signer<'info>,
}

#[account]
#[derive(InitSpace)]
pub struct CounterStruct {
    pub count: u32,
    pub id: u64,
}