import dynamic from "next/dynamic"
import { useAccount } from "wagmi"
import Profile from "./Profile"

// Pass client to React Context Provider
 function WalletConnect(props) {
    const {isConnected} = useAccount()
   
const getWallet = () => {

}

 return (
 
 <Profile to={props.to}/>
 
 
 )
}
export default dynamic(() => Promise.resolve(WalletConnect), {ssr: false})
