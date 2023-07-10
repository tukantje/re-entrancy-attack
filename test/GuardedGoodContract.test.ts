import hre from "hardhat";

describe("GuardedGoodContract", function () {
  it("Should be able to deposit", async function () {
    const guardedGoodContract = await hre.ethers.deployContract(
      "GuardedGoodContract",
      []
    );
    await guardedGoodContract.waitForDeployment();

    const [_, user] = await hre.ethers.getSigners();
    const depositAmount = hre.ethers.parseEther("10");

    const depositTx = await guardedGoodContract
      .connect(user)
      .deposit({ value: depositAmount });
    await depositTx.wait();

    const balance = await hre.ethers.provider.getBalance(
      guardedGoodContract.target
    );
    expect(balance).toEqual(depositAmount);
  });

  it("Should not be drainable", async function () {
    const guardedGoodContract = await hre.ethers.deployContract(
      "GuardedGoodContract",
      []
    );
    await guardedGoodContract.waitForDeployment();

    const badContract = await hre.ethers.deployContract("BadContract", [
      guardedGoodContract.target,
    ]);
    await badContract.waitForDeployment();

    const [_, user, attacker] = await hre.ethers.getSigners();

    const depositAmount = hre.ethers.parseEther("10");
    const depositTx = await guardedGoodContract.connect(user).deposit({
      value: depositAmount,
    });
    await depositTx.wait();

    const balanceBeforeAttack = await hre.ethers.provider.getBalance(
      guardedGoodContract.target
    );
    expect(balanceBeforeAttack).toEqual(depositAmount);

    try {
      const tx = await badContract.connect(attacker).attack({
        value: hre.ethers.parseEther("1"),
      });
      await tx.wait();
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect((<Error>err).message).toEqual(
        "VM Exception while processing transaction: reverted with reason string 'Failed.'"
      );
    }

    const balanceAfterAttack = await hre.ethers.provider.getBalance(
      guardedGoodContract.target
    );
    expect(balanceAfterAttack).toEqual(depositAmount);

    const badContractBalance = await hre.ethers.provider.getBalance(
      badContract.target
    );
    expect(badContractBalance).toEqual(hre.ethers.parseEther("0"));
  });
});
