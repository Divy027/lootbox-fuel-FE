import '../App.css'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import enter from "../assets/enter.png"
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Preview from '../components/Preview';
import Form from '../components/Form';
import Header from '../components/Header';
import { IdentityInput} from "../constants/Src20_asset/typegen/Src20AssetAbi";
import { randomBytes, hexlify} from "fuels"
import { LootboxAbi__factory } from "../constants/lootbox/lootbox_impl/typegen";
import { Lootbox_contract,baseAssetId,vrf_impl_CONTRACT_ID  } from "../config/dev";
import {
  useIsConnected,
  useWallet
} from "@fuels/react";
import { VrfImplAbi__factory } from '../constants/lootbox/vrf_impl/contracts';
  


const Home = () => {
  const { isConnected } = useIsConnected();
  const { wallet} = useWallet();
 
  const [tokenAddress, setTokenAddress] = useState('');
  const [blockchain, setBlockchain] = useState("Zeta");
  const [step, setStep] = useState(0);
  const [rangeStart, setRangeStart] = useState(0);
  const [rangeEnd, setRangeEnd] = useState(0);
  const [deposit, setDeposit] = useState(0);
  const [decimal, setTokenDecimal] = useState(0);
  const [balance, setBalance] = useState(0);
  const [assetID, setassetID] = useState("");
  const [reward, setReward] = useState(0);
  

  const generateSeed = () => {
    let seed = randomBytes(32);
    return hexlify(seed);                   
  }

const OpenLootbox = async() => {
    try {
        if(isConnected && wallet){

            const seed = generateSeed();

            const contract = LootboxAbi__factory.connect(Lootbox_contract, wallet);

            const VrfImpl = VrfImplAbi__factory.connect(vrf_impl_CONTRACT_ID, wallet);
           

            let get_fee = await contract.functions.rng_cost()
            .addContracts([VrfImpl])
            .get();
            console.log("rng cost fee : ", get_fee.value.toString());

          
            let tx_open = await contract.functions.open_lootbox(seed)
            .callParams({
              forward: [get_fee.value.toString(), baseAssetId],
            })
            .addContracts([VrfImpl])
            .call();
            console.log("Transaction Id Open: ", tx_open.transactionId);

            

            if(tx_open.transactionId){
                toast.success("Open Lootbox successfull");

                setStep(step +1);
            }


        }
    }catch(e: any){

        console.log("Error in Open Lootbox",e);
        toast.error("Error in opening Lootbox")
        return;

    }
}

const getBalance =async (assetID: any) => {

  try {
      if(isConnected && wallet){
         
        

        const balance = await wallet.getBalance(assetID);

        setBalance(Number(balance) /10 ** 9);
        console.log("Balance",Number(balance) / 10 ** 9);
        return Number(balance) / 10 ** 9;
          
        } else {
          toast.error("Connect wallet !");
          return 0;
        }
      }
      catch (error: any) {
          // An error occurred, indicating it's not a valid ERC-20 token contract
          console.log("Error in fetching balance",error);
          return 0;
        }
  
}

const getLootbox = async () => {
  try {
    if(isConnected && wallet){

        const contract = LootboxAbi__factory.connect(Lootbox_contract, wallet);


        const sender: IdentityInput = {
          Address : {
            bits: wallet.address.toB256(),
          }
         
      }
      const loot = await contract.functions.get_lootbox(sender).get();
      console.log(`\nLootbox Value: ${JSON.stringify(loot.value, null, 2)}`);

      setassetID(loot.value.asset.bits);

      console.log(!loot.value);

      // if(!loot.value.id && step == 2 || step == 3 || step == 4){
      //   setStep(1);
      // }


    }
}catch(e: any){

    console.log("Error in Create lootbox",e);
  
    return;

}
}

const ClaimReward = async() => {
  try {
      if(isConnected && wallet){

        

          const contract = LootboxAbi__factory.connect(Lootbox_contract, wallet);

          const VrfImpl = VrfImplAbi__factory.connect(vrf_impl_CONTRACT_ID, wallet);
         

          const balance1 = await getBalance(assetID);

        
          let tx_claim = await contract.functions.claim_reward()
          .addContracts([VrfImpl])
          .call();
          console.log("Transaction Id claim: ", tx_claim.transactionId);

          const balance2 = await getBalance(assetID);

          const reward = balance2 - balance1;
          console.log("REward",reward);
          setReward(reward);


          if(tx_claim.transactionId){
              toast.success("Claim Reward successfull");

              setStep(step +1);
          }


      }
  }catch(e: any){

      console.log("Error in claiming lootbox",e);
      toast.error("Error in claiming Reward")
      return;

  }
}



useEffect(() => {
  getLootbox();

}, [isConnected, wallet]);

// useEffect(() => {
//   getLootbox();
// }, []);



  


 
  return (
    <div className=''>
    <Header/>
    <ToastContainer/>
    <div className=" flex items-center justify-center my-[40%] sm:my-0 sm:min-h-screen overflow-hidden">
      {step == 0 && (
        <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center h-full ">
          <h1 className="text-xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-2 sm:mb-4 text-black text-center">
            LootBox
          </h1>
          <p className="text-sm sm:text-xl mb-4 sm:mb-6 text-gray-600 text-center">
            Create, Open and Claim
          </p>
          <button
              className="bg-white text-black font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-full border border-black flex items-center justify-center hover:border-blue-500 hover:text-blue-500"
              onClick={() => setStep(1)}
            >
              <img
                src={enter}
                alt="WalletIcon"
                width={18}
                className="group-hover:translate-x-1 transition ease-in-out duration-300 ml-2"
              />

            </button>
            
          
        </div>
      </div>
      
      
      
      )}
      

      {step == 1 && (
        <Form tokenAddress={tokenAddress} setTokenAddress = {setTokenAddress} blockchain={blockchain} setBlockchain = {setBlockchain} setStep={setStep} step = {step} rangeStart={rangeStart} rangeEnd={rangeEnd} setRangeStart={setRangeStart} setRangeEnd={setRangeEnd} depositAmount={deposit} setDepositAmount={setDeposit} decimal={decimal} setDecimal={setTokenDecimal} balance = {balance} setBalance = {setBalance}/>
      )}

      {step == 2 && (
        <Preview setStep={setStep} step = {step} heading='Open lootbox' tokenAddress={tokenAddress} rangeEnd={rangeEnd} rangeStart={rangeStart} handleSubmit={OpenLootbox} balance={balance} setBalance={setBalance} decimal={decimal} reward={reward}  />
      )}

      {step == 3 && (
        <Preview setStep={setStep} step = {step}  heading='Claim Reward'  tokenAddress={tokenAddress} rangeEnd={rangeEnd} rangeStart={rangeStart} handleSubmit={ClaimReward} balance={balance} setBalance={setBalance} decimal={decimal} reward={reward} />
      )}

      {step == 4 && (
        <Preview setStep={setStep} step = {step}  heading='Result'  tokenAddress={tokenAddress} rangeEnd={rangeEnd} rangeStart={rangeStart} handleSubmit={ClaimReward} balance={balance} setBalance={setBalance} decimal={decimal} reward={reward} />
      )}
    </div>
    
    </div>
  )
}

export default Home
