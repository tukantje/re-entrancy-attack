import hre from "hardhat";

describe("BadContract", function () {
  it("Should drain GoodContract", async function () {
    const goodContract = await hre.ethers.deployContract("GoodContract", []);
    await goodContract.waitForDeployment();

    const badContract = await hre.ethers.deployContract("BadContract", [
      goodContract.target,
    ]);
    await badContract.waitForDeployment();

    const [_, user, attacker] = await hre.ethers.getSigners();

    const depositAmount = hre.ethers.parseEther("10");
    const depositTx = await goodContract.connect(user).deposit({
      value: depositAmount,
    });
    await depositTx.wait();

    const balanceBeforeAttack = await hre.ethers.provider.getBalance(
      goodContract.target
    );
    expect(balanceBeforeAttack).toEqual(depositAmount);

    const attackTx = await badContract.connect(attacker).attack({
      value: hre.ethers.parseEther("1"),
    });
    await attackTx.wait();

    const balanceAfterAttack = await hre.ethers.provider.getBalance(
      goodContract.target
    );
    expect(balanceAfterAttack).toEqual(hre.ethers.parseEther("0"));

    const badContractBalance = await hre.ethers.provider.getBalance(
      badContract.target
    );
    expect(badContractBalance).toEqual(hre.ethers.parseEther("11"));
  });
});
