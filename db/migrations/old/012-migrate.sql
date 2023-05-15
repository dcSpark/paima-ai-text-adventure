alter table nft_state
drop constraint nft_state_current_owner_fkey,
drop column current_owner;

alter table match_moves drop constraint match_moves_wallet_fkey;