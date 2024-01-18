import './App.css';
import { useState, useEffect } from 'react';
import { Routes, Route, NavLink, useNavigate } from "react-router-dom";
import { config, passport, blockchainData } from "@imtbl/sdk";
import { ethers, Signer, Wallet, getDefaultProvider } from "ethers";
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import Profile from './pages/Profile';
import Game from './pages/Game';
import Shop from './pages/Shop';
import Logout from './pages/Logout';
import SC_ABI from "./SC_ABI.json";

const settings = ['Profile', 'Logout'];

function App() {
  const passportClientId = process.env.REACT_APP_CLIENT_ID;
  const PRIVATE_KEY = process.env.REACT_APP_PRIVATE_KEY;
  const scAddress = process.env.REACT_APP_SC_ADDRESS;
  const API_KEY = process.env.REACT_APP_SECRET_API_KEY;
  const PUBLISHED_KEY = process.env.REACT_APP_SECRET_PUBLISHED_KEY;
  const [isLogin, setIsLogin] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [defaultAccount, setDefaultAccount] = useState("");
  const [contract, setContract] = useState();
  const [passportProviders, setPassportProviders] = useState();
  const [email, setEmail] = useState("");
  const [walletBalance, setWalletBalance] = useState("");
  const [points, setPoints] = useState();
  const params = new URLSearchParams(document.location.search);
  const date = Math.floor((new Date()).getTime() / 1000);
  const navigate = useNavigate();
  const CONTRACT_ABI = [
    'function grantRole(bytes32 role, address account)',
    'function MINTER_ROLE() view returns (bytes32)',
    'function mint(address to, uint256 tokenId)',
    'function ownerOf(uint256 tokenId) view returns (address)',
    'function hasRole(bytes32 role, address account) view returns (bool)',
    'function totalSupply() view returns (uint256)'
  ];

  const client = new blockchainData.BlockchainData({
    baseConfig: {
        environment: config.Environment.SANDBOX,
        apiKey: API_KEY,
        publishableKey: PUBLISHED_KEY,
    },
  });

  const passportInstance = new passport.Passport({
    baseConfig: new config.ImmutableConfiguration({
      environment: config.Environment.SANDBOX,
    }),
    clientId:  passportClientId,
    redirectUri: 'http://localhost:3000',
    logoutRedirectUri: 'http://localhost:3000',
    logoutMode: 'redirect',
    audience: 'platform_api',
    scope: 'openid offline_access email transact'
  });

  const stillConnect = async () => {
    const isExpired = isTokenExpired();
    if (!isExpired) {
      try{
        const passport = passportInstance.connectEvm();
        const providers = new ethers.providers.Web3Provider(passport);
        const accounts = await passport.request({ method: "eth_requestAccounts" });
        const idToken = await passportInstance.getIdToken();
        const signer = providers.getSigner();
        const userProfile = await passportInstance.getUserInfo();
        
        const contractInstance = new ethers.Contract(scAddress, SC_ABI, signer);
        const accountString = accounts[0].toString();
        const accountPoints = await contractInstance.showPoints(accountString);
  
        await checkBalance(accountString, passport);
  
        localStorage.setItem("Token", idToken.toString());
  
        setIsLogin(true);
        setPassportProviders(passport);
        setContract(contractInstance);
        setDefaultAccount(accountString);
        setEmail(userProfile.email);
        setPoints(parseInt(accountPoints / 1000000000000000000));
        if (window.location.href === "http://localhost:3000/") {
          navigateToGame();
        };
      } catch (e) {
        console.log(e);
        setIsLogin(false);
        setIsLoading(false);
      }
    }
  };

  const connect = async () => {
    try {
      // authenticate user
      setIsLoading(true);
      const passport = passportInstance.connectEvm();
      const providers = new ethers.providers.Web3Provider(passport);
      const accounts = await passport.request({ method: "eth_requestAccounts" });
      const idtoken = await passportInstance.getIdToken();
      const signer = providers.getSigner();
      const userProfile = await passportInstance.getUserInfo();
      
      const contractInstance = new ethers.Contract(scAddress, SC_ABI, signer);
      const accountString = accounts[0].toString();
      const wallet = await contractInstance.checkUserExists(accountString);
      const accountPoints = await contractInstance.showPoints(accountString);

      if (!wallet) {
        try{
          await contractInstance.addUser(accountString, userProfile.email, 0, {gasLimit: 2_000_000});
          alert(`Welcome ${userProfile.email}`);
          await checkBalance(accountString, passport);

          localStorage.setItem("Token", idtoken.toString());

          setDefaultAccount(accountString);
          setEmail(userProfile.email);
          setContract(contractInstance);
          setPoints(parseInt(accountPoints / 1000000000000000000));
          setIsLoading(false);
          window.location.reload();
        } catch (e) {
          console.log(e);
        }
      } else {
        alert(`Welcome ${userProfile.email}`);
        await checkBalance(accountString, passport);

        localStorage.setItem("Token", idtoken.toString());

        setDefaultAccount(accountString);
        setEmail(userProfile.email);
        setContract(contractInstance);
        setPoints(parseInt(accountPoints / 1000000000000000000));
        setIsLoading(false);
        window.location.reload();
      }
    } catch (e) {
      console.log(e);
      setIsLoading(false);
    }
  };

  const checkLogin = () => {
    const idToken = localStorage.getItem("Token");
    if (idToken != null) {
      stillConnect();
      setIsLogin(true);
    } else {
      setIsLogin(false);
      setIsLoading(false);
    }
  };

  function isTokenExpired() {
    const token = localStorage.getItem("Token");
    const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;

    return date >= expiry;
  };

  const checkBalance = async (accountString, passport) => {
    try {
      const balance =  parseInt(await passport.request({
          method: 'eth_getBalance',
          params: [accountString, 'latest']
      }));

      const balanceToString = ethers.utils.formatEther(balance.toString());
      setWalletBalance(Number(balanceToString).toPrecision(4));
    } catch (e) {
      console.log(e);
    }
};

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const navigateToGame = () => {
    navigate("/Game");
  };

  const grantMinterRole = async (scAddress) => {
    try {
      const provider = getDefaultProvider("https://rpc.testnet.immutable.com");
      const adminWallet = new ethers.Wallet(PRIVATE_KEY, provider);
      const contract = new ethers.Contract(scAddress, CONTRACT_ABI, adminWallet);
  
      const minterRole = await contract.MINTER_ROLE();
  
      const currentGasPrice = await provider.getGasPrice({gasLimit: 2_000_000});
      const adjustedGasPrice = currentGasPrice.add(ethers.utils.parseUnits('10', 'gwei'));
      const tx = await contract.grantRole(minterRole, defaultAccount, {
        gasPrice: adjustedGasPrice,
        gasLimit: 2_000_000
      });
  
      await tx.wait();
      console.log("Minter Role Granted to", defaultAccount);
    } catch (e) {
      console.error("Error in granting minter role:", e);
    }
  };

  const updatedNFT = async (chainName, scAddress, name, image, desc, tokenId) => {
    const contractAddress = scAddress.toString();
    try {
        await client.refreshNFTMetadata({
            chainName,
            contractAddress,
            refreshNFTMetadataByTokenIDRequest: {
                nft_metadata: [
                {
                    name: name,
                    animation_url: null,
                    image: image,
                    external_url: null,
                    youtube_url: null,
                    description: desc,
                    attributes: [],
                    token_id: tokenId,
                },
                ],
            },
        });

        console.log("Metadata Refresed!");
    } catch (e) {
        console.log(e);
    }
};

  useEffect(() => {
    if (params.get("code")) {
      try {
        passportInstance.loginCallback();
      } catch (e) {
        console.log(e);
      }
    }
  }, [defaultAccount]);

  useEffect(() => {
    checkLogin();
  }, [walletBalance]);

  useEffect(() => {
    const token = localStorage.getItem("Token");
    if (token !== null) {
      const isExpired = isTokenExpired();
      if (isExpired) {
        localStorage.clear();
        setIsLogin(false);
        setIsLoading(false);
        setDefaultAccount();
        navigate("/");
        alert("Token Expired Please Relogin");
      }
    } 
  }, [date])

  return (
    <>
      <nav>
        <ul className="nav">
          {isLogin ? (
            <>
              <NavLink to="/Game" className="nav-item font-bold text-white hover:bg-sky-700 rounded-lg">
                Game
              </NavLink>
              <NavLink to="/Shop" className="nav-item font-bold text-white hover:bg-sky-700 rounded-lg">
                Shop
              </NavLink>
            </>
          ) : (
            <></>
          )}
          <div className="acc-container">
            {isLogin ? (
              <div className="account">
                <Box sx={{ flexGrow: 0 }}>
                  <Tooltip title="Open settings">
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                      <Avatar alt={email} src="" />
                    </IconButton>
                  </Tooltip>
                  <Menu
                    sx={{ mt: '45px' }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                  >
                    {settings.map((setting) => (
                      <MenuItem key={setting} onClick={handleCloseUserMenu}>
                        <Typography textAlign="center"><NavLink to={setting}>{setting}</NavLink></Typography>
                      </MenuItem>
                    ))}
                  </Menu>
                </Box>
              </div>
            ) : (
              <div className="p-3">
                <button onClick={connect} disabled={isLoading} className="primary-btn">Login With Passport</button>
              </div>
            )}
          </div>
        </ul>
      </nav>

      <div className="flex flex-col">
        {!isLogin ? <div className="text-5xl font-bold center text-white">Connect Your Wallet First</div> : <></>}
      </div>

      <Routes>
      {isLogin ? (
        <>
          <Route path="/Game" element={<Game 
              CONTRACT_ABI={CONTRACT_ABI} 
              grantMinterRole={grantMinterRole} 
              passportProviders={passportProviders} 
              defaultAccount={defaultAccount} 
              contract={contract} 
              setPoints={setPoints}
              email={email}
              updatedNFT={updatedNFT}
            />} />
          <Route path="/Shop" element={<Shop 
              CONTRACT_ABI={CONTRACT_ABI}
              grantMinterRole={grantMinterRole} 
              passportProviders={passportProviders}
              setPoints={setPoints}
              contract={contract}
              defaultAccount={defaultAccount}
              checkBalance={checkBalance}
              updatedNFT={updatedNFT}
            />} />
          <Route path="/Profile" element={<Profile 
              defaultAccount={defaultAccount} 
              email={email} 
              walletBalance={walletBalance} 
              points={points}
            />} />
          <Route path="/Logout" element={<Logout 
              setIsLogin={setIsLogin} 
              passportInstance={passportInstance} 
              setDefaultAccount={setDefaultAccount}
            />} />
        </>
      ) : (
        <></>
      )}
      </Routes>
    </>
  );
}

export default App;
