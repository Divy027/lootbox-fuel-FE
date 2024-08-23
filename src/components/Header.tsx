// import { useState } from "react";
// import { useSelector, useDispatch } from "react-redux";

import Logo from "../../public/assets/lync (1).png";
// import CONFIG from "../config";
import {
  useConnectUI,
  useIsConnected,
  useWallet,
} from "@fuels/react";
import 'react-toastify/dist/ReactToastify.css';
 const Header = ()=> {
   

    const { connect, isConnecting } = useConnectUI();
    const { isConnected } = useIsConnected();
    const { wallet } = useWallet();
    // const { balance } = useBalance({
    //   address: wallet?.address.toAddress(),
    //   assetId: wallet?.provider.getBaseAssetId(),
    // });
    
      
    return(
      <div className="mx-auto flex items-center justify-between py-6 px-4 bg-opacity-80 backdrop-filter backdrop-blur-lg bg-black">
        <div className="flex items-center cursor-pointer">
          <img
            src={Logo} // Replace with your logo image source
            alt="Logo"
            className="h-12 w-12 mr-3 rounded-full" // Adjust the size as needed
          />
          <div className="text-white">
            <p className="font-bold text-lg">Lootbox on Fuel</p>
            <p className="text-sm opacity-75 hidden sm:block">Open Create Claim</p>
          </div>
        </div>

        <button className="bg-white text-black font-bold py-2 px-6 rounded-full border border-black hover:border-blue-500 hover:text-blue-500">
          { isConnected? (
            <span >
              {wallet?.address
                ? `${wallet?.address.toB256().substr(0, 6)}...${wallet?.address.toB256().substr(wallet?.address.toB256().length - 4, 4)}`
                : "Connect Wallet"}
            </span>
          ) : (
              <span  onClick={() => {
                connect();
              }}>
                {isConnecting ? "Connecting" : "Connect"}
              </span>
          )}
        </button>
       
      </div>

    )
}
export default Header;