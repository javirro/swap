import { Web3 } from "web3"
import { EIP1193Provider } from "../../../types/Metamask"
import { etherToWeiConverter } from "../../SwapMethods/tokenHelper"
import { contractsAbi } from ".."
import { addresses } from "../addresses"
import { blockchain } from "../.."
import { getPath } from "../../SwapMethods/getPath"

export const getAmountOut = async (amountIn: string, from: string, to: string, provider: EIP1193Provider, chainId: string): Promise<string> => {
  const tokensList: any = blockchain.tokens.find(token => token.chainId === chainId)?.tokens

  const fromAddress: string = tokensList[from.toLowerCase()]

  const web3 = new Web3(provider)

  const routerContract = new web3.eth.Contract(contractsAbi.pancakeswapV2RouterAbi, addresses.bscRouterV2)
  const tokenInContract = new web3.eth.Contract(contractsAbi.tokenAbi, fromAddress)

  const tokenInDecimals: string = from.toLowerCase() === "bnb" ? "18" : ((await tokenInContract.methods.decimals().call()) as any).toString()

  const fixedAmountIn: string = amountIn.replace(",", ".")

  let amountInWei: string
  if (tokenInDecimals === "18") amountInWei = web3.utils.toWei(fixedAmountIn, "ether")
  else {
    amountInWei = etherToWeiConverter(fixedAmountIn, tokenInDecimals)
  }

  const realFrom = from.toLowerCase() === "bnb" ? "wbnb" : from
  if(from === to) return amountIn
  const path: string[] = getPath(realFrom, to, chainId)
  // Returns an array of bigInt with Input-output
 
  const amountsOut: bigint[] = await routerContract.methods.getAmountsOut(amountInWei, path).call()
  const ethAmountOut = web3.utils.fromWei(amountsOut[1].toString(), "ether")
  return ethAmountOut
}
