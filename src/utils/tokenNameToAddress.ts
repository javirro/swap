import { blockchain } from "../blockchain"

export const tokenNameToAddress = (tokenName: string, chainId: string): string => {
  if (tokenName.length === 42) return tokenName.toLowerCase()

  const tokens: any = blockchain.tokens
  const networkInfo = tokens.find((network: any) => network.chainId === chainId)
console.log(networkInfo, tokenName)
  const tokenAddress: string = tokens[0].tokens[tokenName]
  return tokenAddress?.toLowerCase()
}
