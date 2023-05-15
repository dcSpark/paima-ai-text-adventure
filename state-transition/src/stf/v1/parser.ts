import type { ParserRecord } from 'paima-sdk/paima-utils-backend';
import { PaimaParser } from 'paima-sdk/paima-utils-backend';
import type { NftMintInput, ParsedSubmittedInput } from './types';

const myGrammar = `
        joinNftToLobby       = j|lobbyId|nftId|initialDescription?|cdeName
        submitMove      = @m||moveEntry|lobbyId|nftId|cdeName
        nftMint             = nftmint|address|tokenId
`;

const nftMint: ParserRecord<NftMintInput> = {
  renameCommand: 'scheduledData',
  effect: 'nftMint',
  address: PaimaParser.WalletAddress(),
  tokenId: PaimaParser.NumberParser(),
};

const parserCommands = {
  joinNftToLobby: {
    lobbyId: PaimaParser.NCharsParser(0, 64),
    nftId: PaimaParser.NumberParser(0, 10000),
    initialDescription: PaimaParser.OptionalParser('', PaimaParser.NCharsParser(0, 64)),
    cdeName: PaimaParser.NCharsParser(0, 64),
  },
  submitMove: {
    moveEntry: PaimaParser.NCharsParser(0, 100),
    lobbyId: PaimaParser.NCharsParser(0, 64),
    nftId: PaimaParser.NumberParser(0, 10000),
    cdeName: PaimaParser.NCharsParser(0, 64),
  },
  nftMint,
};

const myParser = new PaimaParser(myGrammar, parserCommands);

function parse(s: string): ParsedSubmittedInput {
  try {
    const parsed = myParser.start(s);
    return { input: parsed.command, ...parsed.args } as any;
  } catch (e) {
    return { input: 'invalidString' };
  }
}

export default parse;
