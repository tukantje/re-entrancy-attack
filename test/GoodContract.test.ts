import hre from "hardhat";

describe("GoodContract", function () {
  it("Should be able to deposit", async function () {
    const goodContract = await hre.ethers.deployContract("GoodContract", []);
    await goodContract.waitForDeployment();

    const [_, user] = await hre.ethers.getSigners();
    const depositAmount = hre.ethers.parseEther("10");

    const depositTx = await goodContract
      .connect(user)
      .deposit({ value: depositAmount });
    await depositTx.wait();

    const balance = await hre.ethers.provider.getBalance(goodContract.target);
    expect(balance).toEqual(depositAmount);
  });
});
