import { EndpointId } from '@layerzerolabs/lz-definitions'
import { ExecutorOptionType } from '@layerzerolabs/lz-v2-utilities'
import { generateConnectionsConfig } from '@layerzerolabs/metadata-tools'
import { OAppEnforcedOption, OmniPointHardhat } from '@layerzerolabs/toolbox-hardhat'

export const baseContract: OmniPointHardhat = {
    eid: EndpointId.BASE_V2_MAINNET,
    contractName: 'OrbitERC20OFTAdapter',
}

export const ethereumContract: OmniPointHardhat = {
    eid: EndpointId.ETHEREUM_V2_MAINNET,
    contractName: 'DEGENOFT',
}

export const arbitrumContract: OmniPointHardhat = {
    eid: EndpointId.ARBITRUM_V2_MAINNET,
    contractName: 'DEGENOFT',
}

export const degenContract: OmniPointHardhat = {
    eid: EndpointId.DEGEN_V2_MAINNET,
    contractName: 'OrbitNativeOFTAdapter',
}

export const solanaContract: OmniPointHardhat = {
    eid: EndpointId.SOLANA_V2_MAINNET,
    address: 'EYdX37fyQr1RAEiCU8PkxbitmLKv2hfLcz1e56pPv8Wg', // your OFT Store address
}

const EVM_ENFORCED_OPTIONS: OAppEnforcedOption[] = [
    {
        msgType: 1,
        optionType: ExecutorOptionType.LZ_RECEIVE,
        gas: 80000,
        value: 0,
    },
    {
        msgType: 2,
        optionType: ExecutorOptionType.LZ_RECEIVE,
        gas: 80000,
        value: 0,
    },
    {
        msgType: 2,
        optionType: ExecutorOptionType.COMPOSE,
        index: 0,
        gas: 80000,
        value: 0,
    },
]

const SOLANA_ENFORCED_OPTIONS: OAppEnforcedOption[] = [
    {
        msgType: 1,
        optionType: ExecutorOptionType.LZ_RECEIVE,
        gas: 200000,
        value: 2500000,
    },
    {
        msgType: 2,
        optionType: ExecutorOptionType.LZ_RECEIVE,
        gas: 200000,
        value: 2500000,
    },
    {
        // Solana options use (gas == compute units, value == lamports)
        msgType: 2,
        optionType: ExecutorOptionType.COMPOSE,
        index: 0,
        gas: 0,
        value: 0,
    },
]

export default async function () {
    // [srcContract, dstContract, [requiredDVNs, [optionalDVNs, threshold]], [srcToDstConfirmations, dstToSrcConfirmations]], [enforcedOptionsSrcToDst, enforcedOptionsDstToSrc]
    const connections = await generateConnectionsConfig([
        // base <-> ethereum
        [
            baseContract,
            ethereumContract,
            [['Stargate', 'LayerZero Labs', 'Polyhedra'], []],
            [10, 15], // confirmations for send and receive
            [EVM_ENFORCED_OPTIONS, EVM_ENFORCED_OPTIONS],
        ],

        // base <-> arbitrum
        [
            baseContract,
            arbitrumContract,
            [['Stargate', 'LayerZero Labs', 'Polyhedra'], []],
            [10, 20], // confirmations for send and receive
            [EVM_ENFORCED_OPTIONS, EVM_ENFORCED_OPTIONS],
        ],

        // base <-> degen
        [
            baseContract,
            degenContract,
            [['Stargate', 'LayerZero Labs', 'Nethermind'], []],
            [10, 21], // confirmations for send and receive
            [EVM_ENFORCED_OPTIONS, EVM_ENFORCED_OPTIONS],
        ],

        // ethereum <-> arbitrum
        [
            ethereumContract,
            arbitrumContract,
            [['Stargate', 'LayerZero Labs', 'Polyhedra'], []],
            [15, 20], // confirmations for send and receive
            [EVM_ENFORCED_OPTIONS, EVM_ENFORCED_OPTIONS],
        ],

        // ethereum <-> degen
        [
            ethereumContract,
            degenContract,
            [['Stargate', 'LayerZero Labs', 'Nethermind'], []],
            [15, 21], // confirmations for send and receive
            [EVM_ENFORCED_OPTIONS, EVM_ENFORCED_OPTIONS],
        ],

        // arbitrum <-> degen
        [
            arbitrumContract,
            degenContract,
            [['Stargate', 'LayerZero Labs', 'Nethermind'], []],
            [20, 21], // confirmations for send and receive
            [EVM_ENFORCED_OPTIONS, EVM_ENFORCED_OPTIONS],
        ],

        // base <-> solana
        [
            baseContract,
            solanaContract,
            [['Nethermind', 'LayerZero Labs'], []], // Solana DVNs and Base DVNs
            [10, 32], // confirmations for send and receive
            [SOLANA_ENFORCED_OPTIONS, EVM_ENFORCED_OPTIONS],
        ],

        // ethereum <-> solana
        [
            ethereumContract,
            solanaContract,
            [['Nethermind', 'LayerZero Labs'], []], // Solana DVNs and Ethereum DVNs
            [15, 32], // confirmations for send and receive
            [SOLANA_ENFORCED_OPTIONS, EVM_ENFORCED_OPTIONS],
        ],

        // arbitrum <-> solana
        [
            arbitrumContract,
            solanaContract,
            [['Nethermind', 'LayerZero Labs'], []], // Solana DVNs and Arbitrum DVNs
            [20, 32], // confirmations for send and receive
            [SOLANA_ENFORCED_OPTIONS, EVM_ENFORCED_OPTIONS],
        ],

        // degen <-> solana
        [
            degenContract,
            solanaContract,
            [['Nethermind', 'LayerZero Labs'], []], // Solana DVNs and Degen DVNs
            [21, 32], // confirmations for send and receive
            [SOLANA_ENFORCED_OPTIONS, EVM_ENFORCED_OPTIONS],
        ],
    ])

    return {
        contracts: [
            { contract: baseContract },
            { contract: ethereumContract },
            { contract: arbitrumContract },
            { contract: degenContract },
            { contract: solanaContract },
        ],
        connections,
    }
}
