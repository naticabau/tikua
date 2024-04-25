
const { createWalletClient, http } = require('viem');
const { localhost } = require('viem/chains')
const { privateKeyToAccount } = require('viem/accounts')
const { Tikua } = require('@doiim/tikua')

const testPrivateKey = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'
const account = privateKeyToAccount(testPrivateKey)

// Defining Dapp ABI
const abi = [
    "struct Dragon { uint256 id; uint256 life; }",
    "function attackDragon(uint256 dragonId)",
    "function drinkPotion()",
    "function heroStatus(address player) returns (uint256)",
    "function dragonStatus(uint256 dragonId) returns (uint256)",
    "function dragonsList() returns (Dragon[])",
];

const client = createWalletClient({
    account,
    chain: localhost,
    transport: http(),
})

const tikua = new Tikua({
    appEndpoint: 'http://localhost:8080',
    appAddress: '0xab7528bb862fB57E8A2BCd567a2e929a0Be56a5e',
    provider: client,
    abi: abi
})

tikua.addNoticesListener(1000, (result) => {
    console.log(result)
})

const main = async () => {
    console.log('HERO STATUS:', await tikua.fetchInspect('heroStatus', [account.address]))
    console.log('DRAGONS LIST:', await tikua.fetchInspect('dragonsList', []))

    await tikua.sendInput('attackDragon', [1])
}

main()