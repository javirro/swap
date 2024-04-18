import { blockchain } from "../blockchain"

export const tokenNameToAddress = (tokenName: string, chainId: string): string => {
  if (tokenName.length === 42) return tokenName.toLowerCase()

  const allNetworkTokens: any = blockchain.tokens
  const networkInfo = allNetworkTokens.find((network: any) => network.chainId === chainId)
  console.log("NETWORK INFO", networkInfo.tokens)
  console.log(tokenName)
  const tokenAddress: string = networkInfo.tokens[tokenName]
  return tokenAddress?.toLowerCase()
}
