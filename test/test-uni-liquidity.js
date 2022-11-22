const BN = require("bn.js");
const { sendEther, pow } = require("./util");
const { USDC, DAI, USDC_WHALE, WETH, WETH_WHALE, DAI_WHALE } = require("./config");

const IERC20 = artifacts.require("IERC20");
const TestUniswapLiquidity = artifacts.require("TestUniswapLiquidity");
const MasterChef = artifacts.require("MasterChef");
const SushiToken = artifacts.require("SushiToken");
const MockERC20 = artifacts.require('ERC20Mock');

contract("TestUniswapLiquidity", (accounts) => {
 const CALLER = accounts[0];
  const TOKEN_A = WETH;
  const TOKEN_A_WHALE = WETH_WHALE;
  const TOKEN_B = DAI;
  const TOKEN_B_WHALE = DAI_WHALE;
  const TOKEN_A_AMOUNT = pow(10, 18);
  const TOKEN_B_AMOUNT = pow(10, 18);

  let contract;
  let tokenA;
  let tokenB;
  beforeEach(async () => {
    lp = await MockERC20.new('LPToken', 'LP', '10000000000', { from: CALLER });    masterChef = await MasterChef.deployed()
    sushiToken = await SushiToken.deployed()    
    tokenA = await IERC20.at(TOKEN_A);
    tokenB = await IERC20.at(TOKEN_B);
    contract = await TestUniswapLiquidity.new()
    liqAdd = await contract.getLiquidityAddress(tokenA.address,tokenB.address) 

    // send ETH to cover tx fee
    await sendEther(web3, accounts[0], TOKEN_A_WHALE, 10);
    await sendEther(web3, accounts[0], TOKEN_B_WHALE, 10);
    await tokenA.transfer(CALLER, TOKEN_A_AMOUNT, { from: TOKEN_A_WHALE });
    await tokenB.transfer(CALLER, TOKEN_B_AMOUNT, { from: TOKEN_B_WHALE });
    
    await tokenA.approve(contract.address, TOKEN_A_AMOUNT, { from: CALLER });
    await tokenB.approve(contract.address, TOKEN_B_AMOUNT, { from: CALLER });
  });

  it("add liquidity and remove liquidity", async () => {
    let tx = await contract.addLiquidity(
      tokenA.address,
      tokenB.address,
      TOKEN_A_AMOUNT,
      TOKEN_B_AMOUNT,
      {
        from: CALLER,
      }
    );
    console.log("=== add liquidity ===");
    for (const log of tx.logs) {
      console.log(`${log.args.message} ${log.args.val}`);
    }

    // tx = await contract.removeLiquidity(tokenA.address, tokenB.address, {
    //   from: CALLER,
    // });
    console.log("=== stake ===");
    for (const log of tx.logs) {
      console.log(`${log.args.message} ${log.args.val}`);
    }
    // liqAdd = await contract.getLiquidityAddress(tokenA.address,tokenB.address)
    // let userliq = await contract.getLiquidityAmount(tokenA.address,tokenB.address)
    // userLiquidityToken = await IERC20.at(liqAdd)
    // hey = await userLiquidityToken.balanceOf(CALLER)
   
    // userBalance = await userLiquidityToken.balanceOf(CALLER);
    // console.log("userBalance", userBalance)
    await masterChef.add('100', lp.address, true);
    await lp.approve(masterChef.address, '1000', { from: CALLER });
    await masterChef.deposit(0, '100', { from: CALLER });
    // for (const log of tx.logs) {
    //   console.log(`${log.args.message} ${log.args.val}`);
    // }
    //adding lp token
    await masterChef.add('100', liqAdd, true, { from: CALLER });    
    //userLiquidityToken.approve(CALLER, 100000000)
    // tokenA.approve(CALLER, 1000000000)
    // tokenB.approve(CALLER, 1000000000)
    console.log("we are hereeee???")
    //await masterChef.deposit(0,  '100', { from: CALLER });
    //let events = await masterChef.getPastEvents('Deposit', { fromBlock: 0, toBlock: 'latest' })
   //console.log(events)
   console.log("we are hereeee???")


  });
});


// cli commands
// source .env
// ganache --fork --unlock $DAI_WHALE --unlock $WETH_WHALE --unlock $USDC_WHALE --port 8456
// truffle test test/test-uni-liquidity.js --network development
// common errors found 
// sender account now recongizned means you didn't source .env