const { ethers } = require("hardhat");
const { expect } = require("chai"); 



const toWei = (value) => ethers.parseEther(value.toString());

const fromWei = (value) => {
        const formattedValue = ethers.formatEther(value);

// Round to a specific number of decimal places (e.g., 15)
        const roundedValue = Number(formattedValue).toPrecision(3);
        return roundedValue;
}

//const getBalance = ethers.provider.getBalance;

describe ("Exchange", ()=>{
    let owner;
    let user;
    let exchange;
    let token;
    let exchangeAddress ; 
    let tokenAddress ; 
  
    beforeEach (async ()=>{
        [owner,user] = await ethers.getSigners();

        const Token = await ethers.getContractFactory("Token");
        token = await Token.deploy("Token", "TKN", toWei(1000000));
       

        const Exchange = await ethers.getContractFactory("Exchange");
        exchange = await Exchange.deploy(await token.getAddress());
         exchangeAddress  =await exchange.getAddress();
         tokenAddress = await token.getAddress();
      
    });
    it("is deployed", async ()=>{

        
        expect(exchangeAddress).to.be.properAddress;
        expect(tokenAddress).to.be.properAddress;
    });



    describe ("addLiduidity", async ()=>{
        it("adds liduidity", async() => {
            
            // approving the exchange contract to spend our 200 of TKN on our behave
            await token.approve(exchangeAddress, toWei(200));
           
            // adding liquidity  of 200 token to 100 ether  k = 200*100 =20000
            await exchange.addLiquidity(toWei(200),{value :toWei(100)}); 
          
            expect (await  ethers.provider.getBalance(exchangeAddress)).to.equal(toWei(100));
          
            expect (await exchange.getReserve()).to.equal(toWei(200));
        });
    });


    describe("getTokenAmount", async () => {
        it("returns correct token amount", async () => {
        // ... addLiquidity ...
        // approving the exchange contract to spend our 200 of TKN on our behave
            await token.approve(exchangeAddress, toWei(200));
           
            // adding liquidity  of 200 token to 100 ether  k = 200*100 =20000
            await exchange.addLiquidity(toWei(200),{value :toWei(100)}); 
          
        let tokensOut = await exchange.getTokenAmount(toWei(1));
        
       
        expect(fromWei(tokensOut)).to.equal("1.980");
    
        tokensOut = await exchange.getTokenAmount(toWei(100));
        expect(fromWei(tokensOut)).to.equal("181.818181818181818181");

        tokensOut = await exchange.getTokenAmount(toWei(1000));
        expect(fromWei(tokensOut)).to.equal("1000.0");
        });
    });

    describe("getEthAmount", async () => {
        it("returns correct eth amount", async () => {
            //... addLiquidity ...
            // approving the exchange contract to spend our 200 of TKN on our behave
            await token.approve(exchangeAddress, toWei(200));
           
            // adding liquidity  of 200 token to 100 ether  k = 200*100 =20000
            await exchange.addLiquidity(toWei(200),{value :toWei(100)}); 
          
            let ethOut = await exchange.getEthAmount(toWei(2));
            expect(fromWei(ethOut)).to.equal("0.990");
            
            ethOut = await exchange.getEthAmount(toWei(100));
            expect(fromWei(ethOut)).to.equal("47.619047619047619047");

            ethOut = await exchange.getEthAmount(toWei(2000));
            expect(fromWei(ethOut)).to.equal("500.0");
        });
    });

});