import { useEffect, useState } from "react"
import { getAmountOut } from "../blockchain/contracts/estimateAmount/getAmountOut"
import { EIP1193Provider } from "../types/Metamask"

const useDebounceEstimation = (amountIn: string, from: string, to: string, provider: EIP1193Provider, chainId: string): string | undefined => {
  const [estimation, setEstimation] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (!amountIn || !from || !to || !provider || !chainId) return
    const runWhenFinish = setTimeout(() => {
      getAmountOut(amountIn, from, to, provider, chainId).then((amountOut: string) => setEstimation(amountOut))
    }, 500)

    return () => {
      clearTimeout(runWhenFinish)
    }
  }, [amountIn, from, to, provider, chainId])


  return estimation
}

export default useDebounceEstimation
