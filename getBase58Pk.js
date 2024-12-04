import fs from 'fs';

import { Keypair } from '@solana/web3.js';
import bs58 from 'bs58';

const keypairFilePath = '/Users/jacektrocinski/.config/solana/id.json'; // you can view this by running `solana config get`

const data = fs.readFileSync(keypairFilePath, 'utf8');
const keypairJson = JSON.parse(data);
const keypair = Keypair.fromSecretKey(Uint8Array.from(keypairJson));
const base58EncodedPrivateKey = bs58.encode(keypair.secretKey);

console.log(base58EncodedPrivateKey);
