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
    contract = await TestUniswapLiquidity.at('0xCD068a6ba8f87f1abECC8789c6D906beBc9dCf0E');
    
    masterChef = await MasterChef.at('0x6c840D2f085D8647F4fb1572D817B39Eb4350F36')
    sushiToken = await SushiToken.at('0xbE61945fa677d2dF3267D485527561B58BFa26a2')

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
    console.log(liqAdd)
    await masterChef.add(1, liqAdd, true, { from: CALLER });
    let userliq = await contract.getLiquidityAmount(tokenA.address,tokenB.address)
    console.log(userliq)
    userliqToken = await IERC20.at(liqAdd)
    userliqToken.approve(CALLER, 100000000)
    tokenA.approve(CALLER, 1000000000)
          tokenB.approve(CALLER, 1000000000)
    //poolID  = await masterChef.poolInfo[0].call()
    console.log("we are hereeee???")
    await masterChef.deposit(0,  0, { from: CALLER });
    let events = await masterChef.getPastEvents('Deposit', { fromBlock: 0, toBlock: 'latest' })
    console.log(events)



  });
});


// cli commands
// source .env
// ganache --fork --unlock $DAI_WHALE --unlock $WETH_WHALE --unlock $USDC_WHALE --port 8456
// truffle test test/test-uni-liquidity.js --network development