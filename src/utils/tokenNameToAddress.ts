import { blockchain } from "../blockchain"

export const tokenNameToAddress = (tokenName: string, chainId: string): string => {
  if (tokenName.length === 42) return tokenName.toLowerCase()
  const allNetworkTokens: any = blockchain.tokens
  const networkInfo = allNetworkTokens.find((network: any) => network.chainId === chainId)
  const tokenAddress: string = networkInfo.tokens[tokenName.toLowerCase()]
  return tokenAddress?.toLowerCase()
}
