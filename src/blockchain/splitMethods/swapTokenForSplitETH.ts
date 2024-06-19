import { Web3 } from "web3"
import { blockchain } from ".."
import { addresses } from "../contracts/addresses"
import { getPath } from "../SwapMethods/getPath"
import { etherToWeiConverter } from "../SwapMethods/tokenHelper"
import { SplitExactTokensForTokensParams } from "./swapExactTokensForTokens"
import { contractsAbi } from "../contracts"

export const swapTokenForSplitETH = async ({
  provider,
  userAccount,
  chainId,
  from,
  tokenOutA,
  tokenOutB,
  percentageA,
  amount,
}: SplitExactTokensForTokensParams) => {
  const tokensList: any = blockchain.tokens.find(token => token.chainId === chainId)?.tokens
  const fromAddress: string = tokensList[from.toLowerCase()]
  const amountOutMinA = "0"
  const amountOutMinB = "0"

  const web3 = new Web3(provider)

  const splitContract = new web3.eth.Contract(contractsAbi.splitEthContractAbi, addresses.splitEthContract)
  const tokenInContract = new web3.eth.Contract(contractsAbi.tokenAbi, fromAddress)
  const tokenInDecimals: string = ((await tokenInContract.methods.decimals().call()) as any).toString()

  const fixedAmountIn: string = amount.replace(",", ".")

  let amountInWei: string
  if (tokenInDecimals === "18") amountInWei = web3.utils.toWei(fixedAmountIn, "ether")
  else {
    amountInWei = etherToWeiConverter(fixedAmountIn, tokenInDecimals)
  }

  let pathA: string[] = []// This is always the path from the input token to BNB
  let pathB: string[] = []
  console.log({ tokenOutA, tokenOutB })
  if (tokenOutA.toLowerCase() === "bnb") {
    pathA = getPath(from, "wbnb", chainId)
    pathB = getPath(from, tokenOutB, chainId)
  } else if (tokenOutB.toLowerCase() === "bnb") {
    pathA = getPath(from, "wbnb", chainId)
    pathB = getPath(from, tokenOutA, chainId)
  }

  const deadline: number = new Date().getTime() + 1000 * 60 * 10
  const gasPrice = await web3.eth.getGasPrice()

  // Check allowance and approve if needed
  const currentAllowance: number = await tokenInContract.methods.allowance(userAccount, addresses.splitEthContract).call()
  if (currentAllowance < parseFloat(amountInWei)) {
    await tokenInContract.methods.approve(addresses.splitEthContract, amountInWei).send({ from: userAccount })
  }

  console.log({ amountInWei, amountOutMinA, amountOutMinB, pathA, pathB, percentageA, userAccount, deadline })
  const bpsA: number = percentageA * 100
  const tx = await splitContract.methods.swapTokenForSplitETH(amountInWei, amountOutMinA, amountOutMinB, pathA, pathB, bpsA, userAccount, deadline).send({
    gasPrice:  Math.ceil(parseFloat(gasPrice.toString()) * 2).toString(),
    from: userAccount,
  })
  return tx
}
