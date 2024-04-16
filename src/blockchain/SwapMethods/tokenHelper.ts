import { BigNumber } from "ethers"

export const etherToWeiConverter = (amount: string, tokenDecimals: string): string => {
  // Check for invalid input
  if (amount < "0" || tokenDecimals < "0") {
    throw new Error("Amount and decimals cannot be negative")
  }

  const amountNotDecimal = parseFloat(amount) * 10 ** 6
  // Convert amount to BigNumber
  const amountBN = BigNumber.from(amountNotDecimal)

  // Calculate factor for conversion (10 raised to power of token decimals)
  const factor = BigNumber.from(10).pow(tokenDecimals)

  // Convert to wei using BigNumber multiplication
  const weiAmountWithExtraFactor = amountBN.mul(factor)
  const weiAmount = weiAmountWithExtraFactor.div(BigNumber.from(10).pow(6))
  return Math.floor(+(weiAmount.toString())).toFixed(0)
}
