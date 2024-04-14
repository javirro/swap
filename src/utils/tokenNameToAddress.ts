import { blockchain } from "../blockchain"

export const tokenNameToAddress = (tokenName: string): string => {
  if (tokenName.length === 42) return tokenName.toLowerCase()
  const tokens: any = blockchain.tokens
  const tokenAddress: string = tokens[tokenName]
  return tokenAddress?.toLowerCase()
}
