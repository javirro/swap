import { EIP1193Provider } from "../../types/Metamask"
import Web3 from "web3"
import { contractsAbi } from "../contracts"
import { addresses } from "../contracts/addresses"
import { blockchain } from ".."
import { etherToWeiConverter } from "./tokenHelper"

const swapExactTokensForTokens = async (
  amountIn: string,
  from: string,
  to: string,
  deadline: string,
  provider: EIP1193Provider,
  userAccount: string,
  chainId: string
) => {
  const tokensList: any = blockchain.tokens.find(token => token.chainId === chainId)?.tokens
  const fromAddress: string = tokensList[from.toLowerCase()]
  const toAddress: string = tokensList[to.toLowerCase()]
  const amountOutMin = "0"
  const path: string[] = []
  const web3 = new Web3(provider)
  const routerContract = new web3.eth.Contract(contractsAbi.pancakeswapV2RouterAbi, addresses.bscRouterV2)
  const tokenInContract = new web3.eth.Contract(contractsAbi.tokenAbi, fromAddress)
  const tokenInDecimals: string = await tokenInContract.methods.decimals().call()
  let amountInWei: string
  if (tokenInDecimals === "18") amountInWei = web3.utils.toWei(amountIn, "ether")
  else {
    amountInWei = etherToWeiConverter(amountIn, tokenInDecimals)
  }

  const deadlineParsed = parseInt(deadline) + Math.floor(Date.now() / 1000)
  const gasPrice = await web3.eth.getGasPrice()
  const tx = await routerContract.methods.swapExactTokensForTokens(amountInWei, amountOutMin, path, to, deadlineParsed, {
    gasLimit: 1000000,
    gasPrice,
    value: 0,
    from: userAccount,
  })

  return tx
}

export default swapExactTokensForTokens
