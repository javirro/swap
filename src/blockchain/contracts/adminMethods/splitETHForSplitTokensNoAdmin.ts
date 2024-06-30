import { Web3 } from "web3"
import { SplitExactTokensForTokensParams } from "./splitExactTokensForTokensNoAdmin"
import { getPath } from "../../SwapMethods/getPath"
import { contractsAbi } from ".."
import { addresses } from "../addresses"

export const splitETHForSplitTokensNoAdmin = async ({ provider, userAccount, chainId, tokenOutA, tokenOutB, amount }: SplitExactTokensForTokensParams) => {
  const amountOutMinA = "0"
  const amountOutMinB = "0"

  const web3 = new Web3(provider)
  const splitContract = new web3.eth.Contract(contractsAbi.adminContractAbi, addresses.adminContract)

  const fixedAmountIn: string = amount.replace(",", ".")

  const amountInWei: string = web3.utils.toWei(fixedAmountIn, "ether")

  const pathA: string[] = getPath("wbnb", tokenOutA, chainId)
  const pathB: string[] = getPath("wbnb", tokenOutB, chainId)

  const deadline: number = new Date().getTime() + 1000 * 60 * 10
  const gasPrice = await web3.eth.getGasPrice()

  const tx = await splitContract.methods.swapETHForSplitTokens(amountInWei, amountOutMinA, amountOutMinB, pathA, pathB, userAccount, deadline).send({
    gasPrice: gasPrice.toString(),
    from: userAccount,
    value: amountInWei,
  })
  return tx
}
