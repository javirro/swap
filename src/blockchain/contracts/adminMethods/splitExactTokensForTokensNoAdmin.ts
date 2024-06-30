import { Web3 } from "web3"
import { blockchain } from "../.."
import { EIP1193Provider } from "../../../types/Metamask"
import { addresses } from "../addresses"
import { contractsAbi } from ".."
import { etherToWeiConverter } from "../../SwapMethods/tokenHelper"
import { getPath } from "../../SwapMethods/getPath"


export interface SplitExactTokensForTokensParams {
  provider: EIP1193Provider
  userAccount: string
  chainId: string
  from: string
  tokenOutA: string
  tokenOutB: string
  amount: string
  slippage?: number
}

export const splitExactTokensForTokensNoAdmin = async ({
  provider,
  userAccount,
  chainId,
  from,
  tokenOutA,
  tokenOutB,
  amount,
}: SplitExactTokensForTokensParams) => {
  const tokensList: any = blockchain.tokens.find(token => token.chainId === chainId)?.tokens
  const contractAddress = addresses.adminContract
  const fromAddress: string = tokensList[from.toLowerCase()]
  const amountOutMinA = "0"
  const amountOutMinB = "0"

  const web3 = new Web3(provider)

  const splitContract = new web3.eth.Contract(contractsAbi.adminContractAbi, contractAddress)
  const tokenInContract = new web3.eth.Contract(contractsAbi.tokenAbi, fromAddress)
  const tokenInDecimals: string = ((await tokenInContract.methods.decimals().call()) as any).toString()

  const fixedAmountIn: string = amount.replace(",", ".")

  let amountInWei: string
  if (tokenInDecimals === "18") amountInWei = web3.utils.toWei(fixedAmountIn, "ether")
  else {
    amountInWei = etherToWeiConverter(fixedAmountIn, tokenInDecimals)
  }

  const pathA: string[] = getPath(from, tokenOutA, chainId)
  const pathB: string[] = getPath(from, tokenOutB, chainId)

  const deadline: number = new Date().getTime() + 1000 * 60 * 10
  const gasPrice = await web3.eth.getGasPrice()

  // Check allowance and approve if needed
  const currentAllowance: number = await tokenInContract.methods.allowance(userAccount, contractAddress).call()
  if (currentAllowance < parseFloat(amountInWei)) {
    await tokenInContract.methods.approve(contractAddress, amountInWei).send({ from: userAccount })
  }

  const tx = await splitContract.methods.swapTokenForSplitTokens(amountInWei, amountOutMinA, amountOutMinB, pathA, pathB, userAccount, deadline).send({
    gasPrice: gasPrice.toString(),
    from: userAccount,
  })
  return tx
}
