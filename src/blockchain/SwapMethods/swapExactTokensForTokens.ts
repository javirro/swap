import { EIP1193Provider } from "../../types/Metamask"
import Web3 from "web3"
import { contractsAbi } from "../contracts"
import { addresses } from "../contracts/addresses"
import { blockchain } from ".."
import { etherToWeiConverter } from "./tokenHelper"
import { getPath } from "./getPath"

const swapExactTokensForTokens = async (amountIn: string, from: string, to: string, provider: EIP1193Provider, userAccount: string, chainId: string) => {
  const tokensList: any = blockchain.tokens.find(token => token.chainId === chainId)?.tokens

  const fromAddress: string = tokensList[from.toLowerCase()]
  const amountOutMin = "0"

  const web3 = new Web3(provider)

  const routerContract = new web3.eth.Contract(contractsAbi.pancakeswapV2RouterAbi, addresses.bscRouterV2)
  const tokenInContract = new web3.eth.Contract(contractsAbi.tokenAbi, fromAddress)
  console.log({ tokenInContract })
  const tokenInDecimals: string = ((await tokenInContract.methods.decimals().call()) as any).toString()
  console.log({ tokenInDecimals })
  const fixedAmountIn: string = amountIn.replace(",", ".")

  let amountInWei: string
  if (tokenInDecimals === "18") amountInWei = web3.utils.toWei(fixedAmountIn, "ether")
  else {
    amountInWei = etherToWeiConverter(fixedAmountIn, tokenInDecimals)
  }

  const path: string[] = getPath(from, to, chainId)
  const deadline: number = new Date().getTime() + 1000 * 60 * 10
  const gasPrice = await web3.eth.getGasPrice()
  const currentAllowance: number = await tokenInContract.methods.allowance(userAccount, addresses.bscRouterV2).call()
  console.log({ currentAllowance, amountInWei })
  if (currentAllowance < parseFloat(amountInWei)) {
    const approveTx = await tokenInContract.methods.approve(addresses.bscRouterV2, amountInWei).send({
      from: userAccount,
    })
    console.log(approveTx)
  }

  console.log({ amountInWei, amountOutMin, path, userAccount, deadline, gasPrice })
  const tx = await routerContract.methods.swapExactTokensForTokens(amountInWei, amountOutMin, path, userAccount, deadline, {
    gasLimit: 1000000,
    gasPrice,
    value: 0,
    from: userAccount,
  })

  return tx
}

export default swapExactTokensForTokens
