import fs from 'fs';

import { Keypair } from '@solana/web3.js';
import bs58 from 'bs58';
import { config } from 'dotenv';

config();

const base58PrivateKey = process.env.SOLANA_PRIVATE_KEY;

// Decode Base58 to get the raw secret key (Uint8Array)
const secretKey = bs58.decode(base58PrivateKey);

// Create a Keypair from the secret key
const keypair = Keypair.fromSecretKey(secretKey);

// Save the keypair as a JSON file (Solana CLI compatible format)
const keypairFilePath = '/Users/jacektrocinski/.config/solana/id.json'; // Define your output path
fs.writeFileSync(keypairFilePath, JSON.stringify(Array.from(keypair.secretKey)));

console.log(`Keypair saved to ${keypairFilePath}`);
