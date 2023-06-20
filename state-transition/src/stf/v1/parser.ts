import type { ParserRecord } from 'paima-sdk/paima-utils-backend';
import { PaimaParser } from 'paima-sdk/paima-utils-backend';
import type { ParsedSubmittedInput } from './types';
import type { DataInput, NftMintInput } from '@game/utils/src/onChainTypes';
import { isDataInput } from './helpers';

const myGrammar = `
        joinNftToLobby  = join|data
        submitMove      = move|data
        nftMint         = nftmint|address|tokenId
        createLobby     = c|nft_id
`;

const base64Parser = () => PaimaParser.RegexParser(/^[A-Za-z0-9+/=]+$/);

const nftMint: ParserRecord<NftMintInput> = {
  renameCommand: 'scheduledData',
  effect: 'nftMint',
  address: PaimaParser.WalletAddress(),
  tokenId: PaimaParser.NumberParser(),
};

const parserCommands = {
  joinNftToLobby: {
    data: base64Parser(),
  },
  submitMove: {
    data: base64Parser(),
  },
  nftMint,
  createLobby: {
    nft_id: PaimaParser.NCharsParser(1, 100), // todo: make into data
  },
};

const myParser = new PaimaParser(myGrammar, parserCommands);

const dataInputInput: DataInput['input'][] = ['joinNftToLobby', 'submitMove'];

function parse(s: string): ParsedSubmittedInput {
  try {
    const parsed = myParser.start(s);
    let input = { input: parsed.command, ...parsed.args };

    if ((dataInputInput as string[]).includes(input.input)) {
      // this is ok to cast because if it's wrong we want it to throw
      const data = (input as { input: string; data: string }).data;
      const json = Buffer.from(data, 'base64').toString();
      const parsedData = JSON.parse(json);
      const parsedDataInput = { input: input.input, ...parsedData };
      if (!isDataInput(parsedDataInput)) throw new Error('Invalid data input.');
      input = parsedDataInput;
    }

    return input as ParsedSubmittedInput;
  } catch (e) {
    return { input: 'invalidString' };
  }
}

export default parse;
