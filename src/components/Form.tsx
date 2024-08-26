import { toast } from "react-toastify";
import {
    useIsConnected,
    useWallet
  } from "@fuels/react";
import { Src20AssetAbi__factory } from "../constants/Src20_asset/typegen";
import {AssetIdInput} from "../constants/Src20_asset/typegen/Src20AssetAbi";
import {getMintedAssetId, bn} from "fuels"
import { LootboxAbi__factory } from "../constants/lootbox/lootbox_impl/typegen";
import { Lootbox_contract } from "../config/dev";
interface FormProps {
  // ... props for form data and handlers
  tokenAddress : string,
  setTokenAddress: any,
  blockchain : string,
  setBlockchain: any,
  setStep: any
  rangeStart: any,
  rangeEnd: any,
  setRangeStart: any,
  setRangeEnd: any,
  depositAmount: any,
  setDepositAmount: any,
  decimal: any,
  setDecimal: any
  step: any,
  balance: any,
  setBalance: any

}

const Form = (props: FormProps) => {
    const { isConnected } = useIsConnected();
    const { wallet } = useWallet();
    const isValidTokenAddress = async(address : string)=> {
        try {
            if(isConnected && wallet){
               
               const assetContract = Src20AssetAbi__factory.connect(address,wallet);

               const assetID = getMintedAssetId(address,"0x0000000000000000000000000000000000000000000000000000000000000000");

               console.log("asset id in string",assetID);

               const AssetID :AssetIdInput= {
                bits: assetID
               }
               const decimal: any = await assetContract.functions.decimals(AssetID).get();
               console.log(">>>decimal",decimal.value);
            
                // If the call is successful, it's likely a valid token contract
               if(decimal){
                props.setDecimal(decimal.value);
                return decimal.value;
               }
                
              } else {
                toast.error("Connect wallet !");
                return false
              }
            }
            catch (error: any) {
                // An error occurred, indicating it's not a valid ERC-20 token contract
                console.log(error);
                return false;
              }

           
    };


    const CreateLootbox = async(address: any, rangeStart: number, rangeEnd: number,deposit: number, decimal: any) => {
        try {
            if(isConnected && wallet){

                if(rangeEnd < rangeStart){
                    toast.error("Range End should be greater than range Start")
                    return;
                }

                if(deposit < rangeEnd) {
                    toast.error("Deposit amount should be greater than range End")
                    return;
                }

                const balance : number = await getBalance(address);

                if(balance < deposit){
                    toast.error("Balance is less than deposit amount");
                    return;

                }

                const contract = LootboxAbi__factory.connect(Lootbox_contract, wallet);

                const assetID = getMintedAssetId(address,"0x0000000000000000000000000000000000000000000000000000000000000000");

               console.log("asset id in string",assetID);

               const AssetID :AssetIdInput= {
                bits: assetID
               }

               const txn = await contract.functions
                .Initialize([rangeStart * 10 ** decimal,rangeEnd * 10 ** decimal],AssetID,deposit* 10 ** decimal)
                .callParams({
                    forward: [bn(deposit * 10 ** decimal), assetID],
                })
                .call();

                console.log("Transaction Id: ", txn.transactionId);

                if(txn.transactionId){
                    toast.success("Create Lootbox successfull");

                    props.setStep(props.step +1);
                    await getBalance(address);
                }  


            }
        }catch(e: any){

            console.log("Error in Create lootbox",e);
            toast.error("Error in creating Lootbox")
            return;

        }
    }


    const getBalance =async (token: any) => {

        try {
            if(isConnected && wallet){
               

               const assetID = getMintedAssetId(token,"0x0000000000000000000000000000000000000000000000000000000000000000");

               console.log("asset id in string",assetID);

              
              const balance = await wallet.getBalance(assetID);

              props.setBalance(Number(balance) /10 ** props.decimal);
              console.log("Balance",Number(balance) / 10 ** props.decimal)
              return Number(balance) * 10 ** props.decimal;
            
            
                
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
    
    
    return (
        <>
            <div className="bg-white p-8 rounded-lg shadow-md">
                
            <button
              type="button"
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
              onClick={() => {
                  props.setStep(0)
              }}
              >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="rgba(0,0,0,1)" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>

              </button>

              
              <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                    onClick={() => {
                        props.setStep(props.step + 1); // or whatever step is the next one
                    }}
                >

                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="rgba(0,0,0,1)" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>

                    
              </button>
                
                <h2 className="text-2xl font-bold mb-4 text-black">Create Lootbox</h2>
                
                <div className="mb-4">
                    <label htmlFor="tokenAddress" className="block text-black font-bold mb-2">
                        Token Address
                    </label>
                    <input
                        type="text"
                        id="tokenAddress"
                        value={props.tokenAddress}
                        onChange={(e) => props.setTokenAddress(e.target.value)} // handle change
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="mb-4 relative">
                    <label htmlFor="range" className="block text-black font-bold mb-2">
                        Range
                    </label>
                    <div className="flex space-x-2">
                        <input
                            type="number"
                            id="range-start"
                            placeholder="Min"
                            value={props.rangeStart}
                            onChange={(e) => props.setRangeStart(e.target.value)} // handle change for min value
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline"
                        />
                        <input
                            type="number"
                            id="range-end"
                            placeholder="Max"
                            value={props.rangeEnd}
                            onChange={(e) => props.setRangeEnd(e.target.value)} // handle change for max value
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                </div>

                <div className="mb-4">
                    <label htmlFor="range" className="block text-black font-bold mb-2">
                        Deposit Amount
                    </label>
                    <input
                        type="number"
                        id="deposit"
                        placeholder="Amount"
                        value={props.depositAmount}
                        onChange={(e) => props.setDepositAmount(e.target.value)} // handle change for min value
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>

                    <button
                    type="submit"
                    className={`bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-2 px-4 rounded-full ${props.tokenAddress ? '' : 'opacity-50 cursor-not-allowed'}`}
                    onClick={async() => {
                            const decimal = await isValidTokenAddress(props.tokenAddress)
                            if(decimal){
                                await CreateLootbox(props.tokenAddress,Number(props.rangeStart),Number(props.rangeEnd), Number(props.depositAmount), decimal)
                            }else {
                                toast.error("Not valid token address")
                            }
                            
                    }}
                    disabled={props.tokenAddress === ""}
                >
                    Continue
                </button>
            </div>
    
        </>
  );
};

export default Form;