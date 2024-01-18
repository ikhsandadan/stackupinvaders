import { useEffect, useState } from 'react';
import { ethers, Signer, Wallet, getDefaultProvider } from "ethers";
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import CircularProgress from '@mui/material/CircularProgress';
import Canvas from './Canvas.js';
import ship1 from "../images/ship1.png";
import ship2 from "../images/ship2.png";
import ship3 from "../images/ship3.png";
import alien1 from "../images/alien1.png";
import alien2 from "../images/alien2.png";
import alien3 from "../images/alien3.png";
import boss from "../images/boss.png";

const Game = ({CONTRACT_ABI, grantMinterRole, passportProviders, defaultAccount, contract, setPoints, email, updatedNFT}) => {
    const scMintShipAddress = process.env.REACT_APP_SC_MINT_SHIP_ADDRESS;
    const [ShipName, setShipName] = useState("");
    const [redShip, setRedShip] = useState();
    const [greenShip, setGreenShip] = useState();
    const [Ship, setShip] = useState();
    const [hp, setHp] = useState("3");
    const [leaderboard, setLeaderboard] = useState();
    const [scores, setScores] = useState(0);
    const [startGame, setStartGame] = useState(false);
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const chainName = 'imtbl-zkevm-testnet';
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'text.secondary',
        p: 4,
    };

    const shipDetails = [
        {
            id: 1,
            image: 'https://amethyst-implicit-silkworm-944.mypinata.cloud/ipfs/QmQy7wjYKzGufhxUDgf5GxNQi3744ZYineNgDdD7mcwx7o',
            name: 'Blue Space Ship',
            description: 'This is your basic Space Ship'
        },
        {
            id: 2,
            image: 'https://amethyst-implicit-silkworm-944.mypinata.cloud/ipfs/QmfVJnAdPLSKYh1UHwFsjucRTVfh9madLRqjkCSNFhyECG',
            name: 'Red Space Ship',
            description: 'This NFT is a representation of your Space Ship with a price of 1000000 Points'
        },
        {
            id: 3,
            image: 'https://amethyst-implicit-silkworm-944.mypinata.cloud/ipfs/QmTN6zPJ1kpKY7HPsH4VGP5cYvAk9UHRzx1v1FgwAoxW2K',
            name: 'Green Space Ship',
            description: 'This NFT is a representation of your Space Ship with a price of 2000000 Points'
        }
    ];

    const handleClose = () => {
        setOpen(false);
        setStartGame(false);
    };

    const selectShip = async (shipName, NFTPoints, shipImage, shipDesc) => {
        if (shipName === "Green Space Ship") {
            if (shipName === greenShip) {
                await getOwnershipData(shipName, shipImage, shipDesc);
                setShip(ship3);
                setShipName(shipName);
                setStartGame(true);
                setIsLoading(false);
            } else {
                setIsLoading(true);
                await redeemNFT(NFTPoints, shipName, ship3);
                await getOwnershipData(shipName, shipImage, shipDesc);
            }
        } else if (shipName === "Red Space Ship") {
            if (shipName === redShip) {
                await getOwnershipData(shipName, shipImage, shipDesc);
                setShip(ship2);
                setShipName(shipName);
                setStartGame(true);
                setIsLoading(false);
            } else {
                setIsLoading(true);
                await redeemNFT(NFTPoints, shipName, ship2);
                await getOwnershipData(shipName, shipImage, shipDesc);
            }
        } else {
            setIsLoading(true);
            setShip(ship1);
            setShipName(shipName);
            setStartGame(true);
            setIsLoading(false);
        }
    };

    const buyNFT = async () => {
        try {
            const provider = new ethers.providers.Web3Provider(passportProviders);
            const signer = provider.getSigner();
            const userAddress = await signer.getAddress();
            const contract = new ethers.Contract(scMintShipAddress, CONTRACT_ABI, signer);
            const minterRole = await contract.MINTER_ROLE();
            const hasMinterRole = await contract.hasRole(minterRole, userAddress);
        
            if (!hasMinterRole) {
                console.log("Account doesnt have permissions to mint.");
                await grantMinterRole(scMintShipAddress);
            }

            const TOKEN_ID = getNextTokenId(contract);

            const currentGasPrice = await provider.getGasPrice({gasLimit: 2_000_000});
            const adjustedGasPrice = currentGasPrice.add(ethers.utils.parseUnits('10', 'gwei'));

            const tx = await contract.mint(userAddress, TOKEN_ID, {
                gasPrice: adjustedGasPrice,
                gasLimit: 2_000_000 // for pre-EIP-1559
            });
            
            await tx.wait();

        } catch (error) {
            console.error('Error minting the NFT:', error);
            setIsLoading(false);
            alert("Somethings Wrong Please Try Again!");
        }
    };

    const redeemNFT = async (NFTPoints, shipName, ship) => {
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
            setShip(ship);
            setShipName(shipName);
            setStartGame(true);
            setIsLoading(false);
            console.log("Successfully Transfer Points!");
        } catch (e) {
            console.log(e);
            setIsLoading(false);
            alert("Somethings Wrong Please Try Again!");
        }
    };

    const getOwnershipData = async (shipName, shipImage, shipDesc) => {
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
                            if (fetchDataPromises?.result[i].name === "Green Space Ship") {
                                setGreenShip(fetchDataPromises?.result[i].name);
                            } else if (fetchDataPromises?.result[i].name === "Red Space Ship") {
                                setRedShip(fetchDataPromises?.result[i].name);
                            } else if (fetchDataPromises?.result[i].name === null && fetchDataPromises?.result[i].metadata_id !== null) {
                                updatedNFT(chainName, scMintShipAddress, shipName, shipImage, shipDesc, fetchDataPromises?.result[i].token_id);
                            }
                        }
                    } else {
                        if (fetchDataPromises?.result[0].name === "Green Space Ship") {
                            setGreenShip(fetchDataPromises?.result[0].name);
                        } else if (fetchDataPromises?.result[0].name === "Red Space Ship") {
                            setRedShip(fetchDataPromises?.result[0].name);
                        } else if (fetchDataPromises?.result[0].name === null && fetchDataPromises?.result[0].metadata_id !== null) {
                            updatedNFT(chainName, scMintShipAddress, shipName, shipImage, shipDesc, fetchDataPromises?.result[0].token_id);
                        }
                    }
                }
        } catch (e) {
            console.log(e);
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

    const submitScores = async () => {
        try {
            setIsLoading(true);

            await contract.addTopScore(defaultAccount, email, ethers.utils.parseEther(scores.toString()), {gasLimit: 2_000_000});

            const newPoints = await contract.showPoints(defaultAccount);
            checkLeaderboard();
            setPoints(parseInt(newPoints / 1000000000000000000));

            setIsLoading(false);
            alert(`Successfuly adding ${scores} points to your account!`);
            handleClose();
        } catch (e) {
            console.log(e);
            alert("Somethings Wrong Please Try Again!");
            setIsLoading(false);
        }
    };

    const checkLeaderboard = async () => {
        try {
            const newLeaderboard = await contract.showTopScore();
            setLeaderboard(newLeaderboard);
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        if (hp === "0") {
            setOpen(true);
        }
    },[hp]);

    useEffect(() => {
        getOwnershipData();
        checkLeaderboard();
    },[defaultAccount]);
    
    
    return (
        <div className="container mx-auto">
            <div className="flex flex-col items-center">
                <div className="text-3xl font-bold text-white mt-5">GAME STACKUP INVADERS</div>
                <div id="canvas">
                    {!startGame ? (
                        defaultAccount ? (
                            <div className="flex flex-col items-center p-4">
                                <div className="flex flex-col w-1/2 h-auto rounded-xl backdrop-blur-sm bg-white/40 p-2">
                                    <p className="font-sans font-bold text-white text-center text-3xl mb-10 mt-2">LEADERBOARD:</p>
                                    <div className="flex flex-row place-content-center justify-between">
                                        <div className="font-sans font-bold text-white text-start text-xl mb-5">Players</div>
                                        <div className="font-sans font-bold text-white text-center text-xl mb-5">Points</div>
                                    </div>
                                        {leaderboard?.map((index, id) => (
                                            <div key={id} className="flex flex-row place-content-center justify-between">
                                                <div className="font-sans text-white text-start text-lg mb-2">
                                                    {Math.round(parseInt(index.points) / 1000000000000000000) === 0
                                                        ? ""
                                                        : `${index.email.split("@", 1)}`}
                                                </div>
                                                <div className="font-sans text-white text-center text-lg mb-2">
                                                    {Math.round(parseInt(index.points) / 1000000000000000000) === 0
                                                        ? ""
                                                        : `${Math.round(parseInt(index.points) / 1000000000000000000)}`}
                                                </div>
                                            </div>
                                        ))}
                                </div>
                                <div className="flex flex-col p-4 mt-14 w-22 rounded-xl place-content-center justify-items-center backdrop-blur-sm bg-white/40">
                                    <div className="text-3xl font-bold text-center text-white mb-3">How To Play:</div>
                                    <div className="text-2xl font-bold text-center text-white">Press the spacebar to shoot, Control (CTRL) to shoot laser, and arrows to move left or right!</div>
                                </div>
                                <div className="text-3xl font-bold text-white p-4 mt-14">Choose Your Fighter:</div>
                                <div className="flex flex-row place-content-center mx-10 gap-5 px-5 py-5 auto-rows-auto text-center">
                                    {shipDetails.map((ship, id) => (
                                        <div key={id} className="flex flex-col w-22 rounded-xl place-content-center justify-items-center backdrop-blur-sm bg-white/40 p-2 hover:drop-shadow-lg hover:scale-105">
                                            <img src={ship.image} alt="Ship" className="place-self-center rounded-xl object-cover w-auto h-auto max-w-xs" />
                                            <div className="text-center my-2 font-sans text-xl text-white" id="shipname">
                                                {ship.name}
                                            </div>
                                            <div className="flex text-center justify-center">
                                                <p id={id} className="text-center font-sans w-60 h-auto text-white">{ship.description}</p>
                                            </div>
                                            <div className="flex justify-center content-center m-0">
                                                <button
                                                    className="primary-btn ml-14 mr-14 my-5 w-32 font-semibold m-0 hover:scale-110"
                                                    onClick={async () => {
                                                        const NFTPoints = document.getElementById(id).innerHTML.replace(/\D/g, '');
                                                        selectShip(ship.name, NFTPoints, ship.image, ship.description);
                                                    }}
                                                    disabled={isLoading}
                                                >
                                                    {ship.name === "Blue Space Ship" || greenShip === ship.name || redShip === ship.name ? "Select Space Ship" : "Buy Space Ship"}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <Box sx={{ display: "flex", textAlign: "center", justifyContent: "center"}}>
                                <CircularProgress sx={{ color: "white"}} />
                            </Box>
                        )
                    ) : (
                        <Canvas ShipName={ShipName} setHp={setHp} setScores={setScores} Ship={Ship} alien1={alien1} alien2={alien2} alien3={alien3} boss={boss} />
                    )}
                </div>
                <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="parent-modal-title"
                aria-describedby="parent-modal-description"
                >
                <Box sx={style}>
                    <div className="flex flex-col items-center">
                        <div className="text-3xl font-bold text-white">GAME OVER</div>
                        <div className="text-xl font-bold text-white mb-3">Your Score: {scores}</div>
                        <button onClick={submitScores} disabled={isLoading} className="primary-btn">Submit Score to your Points</button>
                    </div>
                </Box>
                </Modal>
            </div>
        </div>
    )
}

export default Game