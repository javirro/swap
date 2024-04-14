import { blockchain } from ".."
import { tokenNameToAddress } from "../../utils/tokenNameToAddress"

export const getPath = (tokenFromName: string, tokenToName: string, chainId: string): string[] => {
  const pathsList: any = blockchain.tokens.find(token => token.chainId === chainId)?.path
  const toPathList: any = pathsList[tokenToName.toLowerCase()]
  const path: string[] = toPathList[tokenFromName.toLowerCase()]
  const pathAddresses: string[] = path.map((token: string) => tokenNameToAddress(token))
  return pathAddresses
}