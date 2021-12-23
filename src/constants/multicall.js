/*
  Snippet taken from README at: https://www.npmjs.com/package/ethereum-multicall

  Multicall contracts
  by default it looks at your network from the provider you passed in and makes the contract address to that:

  Network	Address
    mainnet	0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696
    kovan	0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696
    görli	0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696
    rinkeby	0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696
    ropsten	0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696
    binance smart chain	0xC50F4c1E81c873B2204D7eFf7069Ffec6Fbe136D
    bsc testnet	0x6e5BB1a5Ad6F68A8D7D6A5e47750eC15773d6042
    xdai	0x2325b72990D81892E0e09cdE5C80DD221F147F8B
    mumbai	0xe9939e7Ea7D7fb619Ac57f648Da7B1D425832631
    matic	0x275617327c958bD06b5D6b871E7f491D76113dd8
    arbitrum	0x7a7443f8c577d537f1d8cd4a629d40a3148dd7ee
    avalaunche fuji	0x3D015943d2780fE97FE3f69C97edA2CCC094f78c
    avalaunche mainnet	0xed386Fe855C1EFf2f843B910923Dd8846E45C5A4

  If you wanted this to point at a different multicall contract address just pass that in the options when creating the multicall instance, example:

  const multicall = new Multicall({
    multicallCustomContractAddress: '0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696',
    // your rest of your config depending on the provider your using.
  });
*/
