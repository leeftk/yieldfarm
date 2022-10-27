const BN = require("bn.js");
const { sendEther, pow } = require("./util");
const { USDC, DAI, USDC_WHALE, WETH, WETH_WHALE, DAI_WHALE } = require("./config");

const IERC20 = artifacts.require("IERC20");
const TestUniswapLiquidity = artifacts.require("TestUniswapLiquidity");
const MasterChef = artifacts.require("MasterChef");
const SushiToken = artifacts.require("SushiToken");

contract("TestUniswapLiquidity", (accounts) => {
  const CALLER = accounts[0];
  const TOKEN_A = WETH;
  const TOKEN_A_WHALE = '0xd628f7c481c7Dd87F674870BEc5D7A311Fb1D9A2';
  const TOKEN_B = DAI;
  const TOKEN_B_WHALE = DAI_WHALE;
  const TOKEN_A_AMOUNT = pow(10, 18);
  const TOKEN_B_AMOUNT = pow(10, 18);

  let contract;
  let tokenA;
  let tokenB;
  beforeEach(async () => {
    console.log("here?")
    tokenA = await IERC20.at(TOKEN_A);
    console.log("maybe")
    tokenB = await IERC20.at(TOKEN_B);
    console.log("balance")
    contract = await TestUniswapLiquidity.at('0xAE7Efd03b6255339A159a02B368b8BB40E014e37');
    
    masterChef = await MasterChef.at('0x0E26E4A70C7ab689b35E2D3060152CF5d03483C9')
    sushiToken = await SushiToken.at('0x7888523EF197C3b741903fd2570c2cA6BFFDbB6a')

    liqAdd = await contract.getLiquidityAddress(tokenA.address,tokenB.address)
   
    
    // send ETH to cover tx fee
    await sendEther(web3, accounts[0], TOKEN_A_WHALE, 10);
    await sendEther(web3, accounts[0], TOKEN_B_WHALE, 10);
    console.log("balanckhkeeee")
    await tokenA.transfer(CALLER, TOKEN_A_AMOUNT, { from: TOKEN_A_WHALE });
    await tokenB.transfer(CALLER, TOKEN_B_AMOUNT, { from: TOKEN_B_WHALE });
    console.log("balanckhke")
    
    await tokenA.approve(contract.address, TOKEN_A_AMOUNT, { from: CALLER });
    await tokenB.approve(contract.address, TOKEN_B_AMOUNT, { from: CALLER });
  });

  it("add liquidity and remove liquidity", async () => {
    console.log("balance")
    let tx = await contract.addLiquidity(
      tokenA.address,
      tokenB.address,
      TOKEN_A_AMOUNT,
      TOKEN_B_AMOUNT,
      {
        from: CALLER,
      }
    );
    console.log('here???')

    liqAdd = await contract.getLiquidityAddress(tokenA.address,tokenB.address)
    await masterChef.add(1, liqAdd, false, { from: CALLER });
    let userliq = await contract.getLiquidityAmount(tokenA.address,tokenB.address)
    console.log(userliq)
    userliqToken = await IERC20.at(liqAdd);
    //balance = userliqToken.methods.balanceOf(CALLER);
    //console.log("balance",balance)
    userliqToken.approve(CALLER, 100000000)
    tokenA.approve(CALLER, 1000000000)
    tokenB.approve(CALLER, 1000000000)
    console.log("we are hereeee???")
    await masterChef.deposit(0, 100000, { from: CALLER });





  });
});


//cli commands
// source .env
// ganache --fork --unlock $DAI_WHALE --unlock $WETH_WHALE --unlock $USDC_WHALE --port 8456