import { EIP1193Provider } from "../../types/Metamask"
import Web3 from "web3"
import { contractsAbi } from "../contracts"
import { addresses } from "../contracts/addresses"

const swapExactTokensForTokens = async (amountIn: string, from: string, to: string, deadline: string, provider: EIP1193Provider, userAccount: string) => {
  const amountOutMin = "0"
  const path: string[] = []
  const web3 = new Web3(provider)
  const routerContract = new web3.eth.Contract(contractsAbi.pancakeswapV2RouterAbi, addresses.bscRouterV2)

  const amountInParsed: string = web3.utils.toWei(amountIn, 'ether')
  const amountOutMinParsed = ethers.utils.parseUnits(amountOutMin, 18)
  const deadlineParsed = parseInt(deadline) + Math.floor(Date.now() / 1000)
  const tx = await routerContract.methods.swapExactTokensForTokens(amountInParsed, amountOutMinParsed, path, to, deadlineParsed, {
    gasLimit: 1000000,
    gasPrice: ethers.utils.parseUnits("5", "gwei"),
    value: 0,
    from: userAccount,
  })

  return tx
}

export default swapExactTokensForTokens
