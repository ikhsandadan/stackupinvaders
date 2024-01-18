import { useEffect, useState } from "react";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const Profile = ({defaultAccount, email, walletBalance, points}) => {
    const [data, setData] = useState();
    const chain_name = "imtbl-zkevm-testnet";

    const readData = async () => {
        try {
            await fetch(`https://api.sandbox.immutable.com/v1/chains/${chain_name}/accounts/${defaultAccount}/nfts`)
            .then((response) => response.json())
            .then((data) => {
            setData(data.result);
            });
        } catch (e) {
        console.log(e);
        }
    };

    useEffect(() => {
        readData();
    },[]);

    return (
        <div className="flex flex-col mx-10 gap-5 px-5 py-5 place-content-center text-center">
            <div className="font-sans text-6xl font-bold text-white">My Profile</div>
            {defaultAccount ? (
                <div className="flex flex-col mx-10 gap-5 px-5 py-5 place-content-center text-center">
                    <div className="flex flex-col place-self-center my-5 w-auto h-auto rounded-xl backdrop-blur-lg bg-white/90 p-2">
                        <div className="grid grid-cols-2">
                            <div className="font-sans text-start text-xl font-bold text-black">Wallet Address:</div>
                            <div className="font-sans text-xl font-bold text-black">{defaultAccount}</div>
                            <div className="font-sans text-start text-xl font-bold text-black">Email:</div>
                            <div className="font-sans text-xl font-bold text-black">{email}</div>
                            <div className="font-sans text-start text-xl font-bold text-black">Wallet Balance:</div>
                            <div className="font-sans text-xl font-bold text-black">{walletBalance} IMX</div>
                            <div className="font-sans text-start text-xl font-bold text-black">Points:</div>
                            <div className="font-sans text-xl font-bold text-black">{points}</div>
                        </div>
                    </div>
                    <div className="font-sans text-2xl font-bold text-white mt-10">My NFTs Collections:</div>
                    <div className="grid grid-cols-3 justify-center gap-5">
                        {data?.map((index, id) => (
                            <div key={id} className="flex flex-col place-self-center my-5 w-auto h-auto rounded-xl backdrop-blur-sm bg-white/40 p-2 hover:drop-shadow-lg hover:scale-105">
                                <img src={index.image} alt="NFT" className="place-self-center rounded-xl w-auto h-auto max-w-xs object-cover"/>
                                <div className="text-center text-white font-sans text-xl">{index.name}</div>
                                <div className="flex text-center justify-center">
                                    <p id={index.token_id} className="text-center text-white font-sans text-xs w-60 h-auto">{index.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <Box sx={{ display: "flex", textAlign: "center", justifyContent: "center"}}>
                    <CircularProgress sx={{ color: "white"}} />
                </Box>
            )}
        </div>
    )
}

export default Profile