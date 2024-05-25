import { blockchain } from "../../blockchain"
import "./ShowTxHash.css"

const ShowTxHash = ({ txHash, chainId }: { txHash: string; chainId: string }) => {
  const networkInfo = blockchain.networks.find(network => network.chainId === chainId)
  return (
    <a href={networkInfo?.blockExplorerUrl + "/tx/" + txHash} target="blank_" rel="noreferrer" className="tx-hash">
      See transaction on Scan
    </a>
  )
}

export default ShowTxHash
