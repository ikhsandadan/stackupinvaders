import { useEffect, useState } from "react";
import { ethers } from "ethers";
import Points from "../images/points.png";

function RedeemButton({ id, getOwnershipData, redeemNFT, flag, setFlag, nftName, nftImage, nftDesc }) {
    const [isLoading, setIsLoading] = useState(false);
    return (
        <button
            className="primary-btn ml-14 mr-14 w-32 content-center items-center font-semibold m-0 hover:scale-110"
            onClick={async () => {
            setIsLoading(true);
            var NFTPoints = document.getElementById(id).innerHTML.replace(/\D/g, '');

            await redeemNFT(NFTPoints);

            await getOwnershipData(nftName, nftImage, nftDesc);
            setIsLoading(false);
            setFlag(!flag);
            }}
            disabled={isLoading}
        >
            {isLoading ? "Claiming..." : "Claim NFT"}
        </button>
    );
}

const Shop = ({CONTRACT_ABI, grantMinterRole, passportProviders, setPoints, contract, defaultAccount, checkBalance, updatedNFT }) => {
    const scMintMedal = process.env.REACT_APP_SC_MINT_MEDAL_ADDRESS;
    const [flag, setFlag] = useState(false);
    const [goldMedal, setGoldMedal] = useState();
    const [silverMedal, setSilverMedal] = useState();
    const [bronzeMedal, setBronzeMedal] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const chainName = "imtbl-zkevm-testnet";
    const dataNFT = [
        {
            id: 1,
            name: "Gold Medal",
            image: "https://amethyst-implicit-silkworm-944.mypinata.cloud/ipfs/QmdvyzDqckcQKSJGKjTuJMBjNFmoiHzvbU1J11mM22JdRT",
            description: "This is an NFT awarded to players who achieve a Points more than 1000000 points"
        },
        {
            id: 2,
            name: "Silver Medal",
            image: "https://amethyst-implicit-silkworm-944.mypinata.cloud/ipfs/QmdNg8TXfVcgPN3Bv81tsXpijrPwtKVnYNGw7bP4DVqqPV",
            description: "This is an NFT awarded to players who achieve a Points more than 500000 points"
        },
        {
            id: 3,
            name: "Bronze Medal",
            image: "https://amethyst-implicit-silkworm-944.mypinata.cloud/ipfs/QmbQh9ZTeWbiwkbagBDDhDWBb3DcFcwcF6SGPiV1gAbRap",
            description: "This is an NFT awarded to players who achieve a Points more than 250000 points"
        },
    ];

    const buyPoints = async (amountPoints) => {
        setIsLoading(true);
        await transferToAdmin(amountPoints);

        const amountToHex =  ethers.utils.parseEther(amountPoints.toString());

        try {
            const depo = await contract.deposit(defaultAccount, amountToHex, {gasLimit: 2_000_000});
            await depo.wait();
            const accountPoints = await contract.showPoints(defaultAccount);
            setPoints(parseInt(accountPoints / 1000000000000000000));
            setIsLoading(false);
            alert(`Succesfully Buying ${amountPoints} Points!`);
        } catch (e) {
            console.log(e);
            setIsLoading(false);
        }
    };

    const transferToAdmin = async (amountPoints) => {
        let amount = 0;
        if (amountPoints === "2000000") {
            amount = 0.02;
        } else {
            amount = 0.01;
        }

        const amountToHex = ethers.utils.parseEther(amount.toString());

        try {
            await passportProviders.request({
                method: 'eth_sendTransaction',
                params: [
                    {
                        to: '0xe9eE885c5F70EDBd39fe7bD488E6503c32e33626',
                        value: amountToHex
                    }, {gasLimit: 2_000_000}
                ]
            });

            checkBalance(defaultAccount, passportProviders);

            console.log("Successfully transfer to admin.");
        } catch (e) {
            console.log(e);
            alert("Transfer Failed. Please try again later!");
        }
    };

    const buyNFT = async () => {
        try {
            const provider = new ethers.providers.Web3Provider(passportProviders);
            const signer = provider.getSigner();
            const userAddress = await signer.getAddress();
            const contract = new ethers.Contract(scMintMedal, CONTRACT_ABI, signer);
            const minterRole = await contract.MINTER_ROLE();
            const hasMinterRole = await contract.hasRole(minterRole, userAddress);
        
            if (!hasMinterRole) {
                console.log("Account doesnt have permissions to mint.");
                await grantMinterRole(scMintMedal);
            }

            const TOKEN_ID = getNextTokenId(contract);

            const currentGasPrice = await provider.getGasPrice({gasLimit: 2_000_000});
            const adjustedGasPrice = currentGasPrice.add(ethers.utils.parseUnits('10', 'gwei'));

            const tx = await contract.mint(userAddress, TOKEN_ID, {
                gasPrice: adjustedGasPrice,
                gasLimit: 2_000_000 // for pre-EIP-1559
            });
            
            await tx.wait();
            console.log("Succesfull mint NFT");
        } catch (error) {
            console.error('Error minting the NFT:', error);
            setIsLoading(false);
            alert("Somethings Wrong Please Try Again!");
        }
    };

    const redeemNFT = async (NFTPoints) => {
        try {
            await contract.redeemNFT(defaultAccount, NFTPoints, ethers.utils.parseEther(
                NFTPoints.toString()),
                {
                    maxPriorityFeePerGas: 101e9,
                    maxFeePerGas: 102e9,
                    gasLimit: 2_000_000
                }
            );
    
            await buyNFT();
    
            const newPoints = await contract.showPoints(defaultAccount);
            setPoints(parseInt(newPoints / 1000000000000000000));
            setIsLoading(false);
            alert("Successfully buy NFT");
        } catch (e) {
            console.log(e);
            alert("Somethings Wrong Please Try Again!");
        }
    };

    const getNextTokenId = async (contract) => {
        try {
            const totalSupply = await contract.totalSupply();
            return totalSupply.toNumber() +1;
        } catch (error) {
            console.error('Error getting next token ID:', error);
            alert("Somethings Wrong Please Try Again!");
            return null;
        }
    };

    const getOwnershipData = async (nftName, nftImage, nftDesc) => {
        let fetchDataPromises = "";
        try {
            await fetch(`https://api.sandbox.immutable.com/v1/chains/${chainName}/accounts/${defaultAccount}/nfts`)
                .then((response) => response.json())
                .then((data) => {
                    fetchDataPromises = data;
                });

                if (fetchDataPromises?.result !== null) {
                    if (fetchDataPromises?.result.length > 1) {
                        for (let i = 0; i < fetchDataPromises?.result?.length; i++) {
                            if (fetchDataPromises?.result[i].name === "Gold Medal") {
                                setGoldMedal(fetchDataPromises?.result[i].name);
                            } else if (fetchDataPromises?.result[i].name === "Silver Medal") {
                                setSilverMedal(fetchDataPromises?.result[i].name);
                            } else if(fetchDataPromises?.result[i].name === "Bronze Medal") {
                                setBronzeMedal(fetchDataPromises?.result[i].name);
                            } else if (fetchDataPromises?.result[i].name === null && fetchDataPromises?.result[i].metadata_id !== null) {
                                updatedNFT(chainName, scMintMedal, nftName, nftImage, nftDesc, fetchDataPromises?.result[i].token_id);
                            }
                        }
                    } else {
                        if (fetchDataPromises?.result[0].name === "Gold Medal") {
                            setGoldMedal(fetchDataPromises?.result[0].name);
                        } else if (fetchDataPromises?.result[0].name === "Silver Medal") {
                            setSilverMedal(fetchDataPromises?.result[0].name);
                        } else if (fetchDataPromises?.result[0].name === "Bronze Medal") {
                            setBronzeMedal(fetchDataPromises?.result[0].name);
                        } else if (fetchDataPromises?.result[0].name === null && fetchDataPromises?.result[0].metadata_id !== null) {
                            updatedNFT(chainName, scMintMedal, nftName, nftImage, nftDesc, fetchDataPromises?.result[0].token_id);
                        }
                    }
                }
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        getOwnershipData();
    },[flag, defaultAccount]);

    return (
        <div className="flex flex-col items-center">
            <div className="text-3xl font-bold text-white mt-5">NFT COLLECTIONS</div>
            <div className="flex flex-row place-content-center mx-10 gap-5 px-5 py-5 auto-rows-auto text-center">
                {dataNFT.map((nft, id) => (
                    <div key={id} className="flex flex-col w-22 rounded-xl backdrop-blur-sm bg-white/40 p-2 hover:drop-shadow-lg hover:scale-105">
                        <img src={nft.image} alt="NFT" className="place-self-center rounded-xl object-cover w-auto h-auto max-w-xs" />
                        <div className="text-center text-white my-2 font-sans text-xl">
                            {nft.name}
                        </div>
                        <div className="flex text-center justify-center">
                            <p id={id} className="text-center text-white font-sans w-60 h-auto mb-5">{nft.description}</p>
                        </div>
                        <div className="flex text-center justify-center content-center m-0">
                            {goldMedal === nft.name || silverMedal === nft.name || bronzeMedal === nft.name ? (
                                    <div className="flex flex-col text-center justify-center my-2">
                                        <p className="text-center text-white text-xl font-sans">Already Claimed</p>
                                    </div>
                                ) : (
                                    <RedeemButton id={id} getOwnershipData={getOwnershipData} redeemNFT={redeemNFT} flag={flag} setFlag={setFlag} nftName={nft.name} nftImage={nft.image} nftDesc={nft.description}/>
                                )}
                        </div>
                    </div>
                ))}
            </div>
            <div className="text-3xl font-bold text-white mt-10">BUY POINTS</div>
            <div className="flex flex-row place-content-center mx-10 gap-5 px-5 py-5 auto-rows-auto text-center">
                <div className="flex flex-col w-22 rounded-xl backdrop-blur-sm bg-white/40 p-2 hover:drop-shadow-lg hover:scale-105">
                    <img src={Points} alt="Points" className="place-self-center rounded-xl object-cover w-auto h-auto max-w-xs" />
                    <div className="text-center place-self-center text-xl mt-5 text-white font-sans w-60 h-auto" id="points1">
                        Buy 1000000 Points
                    </div>
                    <button 
                        className="primary-btn ml-14 mr-14 my-5 w-32 place-self-center font-semibold m-0 hover:scale-110"
                        onClick={async () => {
                            const amountPoints = document.getElementById("points1").innerHTML.replace(/\D/g, '');
                            buyPoints(amountPoints);
                        }}
                        disabled={isLoading}
                    >
                        Buy Points
                    </button>
                </div>
                <div className="flex flex-col w-22 rounded-xl backdrop-blur-sm bg-white/40 p-2 hover:drop-shadow-lg hover:scale-105">
                    <img src={Points} alt="Points" className="place-self-center rounded-xl object-cover w-auto h-auto max-w-xs" />
                    <div className="text-center place-self-center text-xl mt-5 text-white font-sans w-60 h-auto" id="points2">
                        Buy 2000000 Points
                    </div>
                    <button 
                        className="primary-btn ml-14 mr-14 my-5 w-32 place-self-center font-semibold m-0 hover:scale-110"
                        onClick={async () => {
                            const amountPoints = document.getElementById("points2").innerHTML.replace(/\D/g, '');
                            buyPoints(amountPoints);
                        }}
                        disabled={isLoading}
                    >
                        Buy Points
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Shop