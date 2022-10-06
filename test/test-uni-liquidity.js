const BN = require("bn.js");
const { sendEther, pow } = require("./util");
const { USDC, DAI, USDC_WHALE, DAI_WHALE } = require("./config");

const IERC20 = artifacts.require("IERC20");
const TestUniswapLiquidity = artifacts.require("TestUniswapLiquidity");
const MasterChef = artifacts.require("MasterChef");
const SushiToken = artifacts.require("SushiToken");

contract("TestUniswapLiquidity", (accounts) => {
  const CALLER = accounts[0];
  const TOKEN_A = USDC;
  const TOKEN_A_WHALE = USDC_WHALE;
  const TOKEN_B = DAI;
  const TOKEN_B_WHALE = DAI_WHALE;
  const TOKEN_A_AMOUNT = pow(10, 4);
  const TOKEN_B_AMOUNT = pow(10, 4);

  let contract;
  let tokenA;
  let tokenB;
  beforeEach(async () => {
    console.log("here?")
    tokenA = await IERC20.at(TOKEN_A);
    console.log("maybe")
    tokenB = await IERC20.at(TOKEN_B);
    console.log("balance")
    contract = await TestUniswapLiquidity.at('0x0e4CD17953b01d303BC71aE287f04FDE12B1d497');
    
    masterChef = await MasterChef.at('0x502b4FC50dFb393D116725E7BB4ff140F76117B9')
    sushiToken = await SushiToken.at('0xf4243380e675A1875f5c4356142d0FA2Dc8A497f')

    liqAdd = await contract.getLiquidityAddress(tokenA.address,tokenB.address)
   
    
    // send ETH to cover tx fee
    await sendEther(web3, accounts[0], TOKEN_A_WHALE, 1);
    await sendEther(web3, accounts[0], TOKEN_B_WHALE, 1);
    console.log("balanckhke")
    await tokenA.transfer(CALLER, TOKEN_A_AMOUNT, { from: TOKEN_A_WHALE });
    await tokenB.transfer(CALLER, TOKEN_B_AMOUNT, { from: TOKEN_B_WHALE });
    console.log("balanckhke")
    
    await tokenA.approve(contract.address, TOKEN_A_AMOUNT, { from: CALLER });
    await tokenB.approve(contract.address, TOKEN_B_AMOUNT, { from: CALLER });
  });

  it("add liquidity and remove liquidity", async () => {
    console.log("balance",balance)
    let tx = await contract.addLiquidity(
      tokenA.address,
      tokenB.address,
      TOKEN_A_AMOUNT,
      TOKEN_B_AMOUNT,
      {
        from: CALLER,
      }
    );


    liqAdd = await contract.getLiquidityAddress(tokenA.address,tokenB.address)
    await masterChef.add(1, liqAdd, false, { from: CALLER });
    let userliq = await contract.getLiquidityAmount(tokenA.address,tokenB.address)
    console.log(BigInt(userliq))
    userliqToken = await IERC20.at(liqAdd);
    balance = userliqToken.methods.balanceOf(CALLER);
    console.log("balance",balance)
    // userliqToken.approve(CALLER, userliq)
    // tokenA.approve(CALLER, 1000000000)
    // tokenB.approve(CALLER, 1000000000)
    // console.log("we are hereeee???")
    // await masterChef.deposit(400, 100000, { from: CALLER });




    // console.log("=== add liquidity ===");
    // for (const log of tx.logs) {
    //   console.log(`${log.args.message} ${log.args.val}`);
    // }

    // tx = await contract.removeLiquidity(tokenA.address, tokenB.address, {
    //   from: CALLER,
    // });
    // console.log("=== remove liquidity ===");
    // for (const log of tx.logs) {
    //   console.log(`${log.args.message} ${log.args.val}`);
    // }
  });
});