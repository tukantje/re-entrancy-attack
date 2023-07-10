import hre from "hardhat";

describe("FixedGoodContract", function () {
  it("Should be able to deposit", async function () {
    const fixedGoodContract = await hre.ethers.deployContract(
      "FixedGoodContract",
      []
    );
    await fixedGoodContract.waitForDeployment();

    const [_, user] = await hre.ethers.getSigners();
    const depositAmount = hre.ethers.parseEther("10");

    const depositTx = await fixedGoodContract
      .connect(user)
      .deposit({ value: depositAmount });
    await depositTx.wait();

    const balance = await hre.ethers.provider.getBalance(
      fixedGoodContract.target
    );
    expect(balance).toEqual(depositAmount);
  });

  it("Should not be drainable", async function () {
    const fixedGoodContract = await hre.ethers.deployContract(
      "FixedGoodContract",
      []
    );
    await fixedGoodContract.waitForDeployment();

    const badContract = await hre.ethers.deployContract("BadContract", [
      fixedGoodContract.target,
    ]);
    await badContract.waitForDeployment();

    const [_, user, attacker] = await hre.ethers.getSigners();

    const depositAmount = hre.ethers.parseEther("10");
    const depositTx = await fixedGoodContract.connect(user).deposit({
      value: depositAmount,
    });
    await depositTx.wait();

    const balanceBeforeAttack = await hre.ethers.provider.getBalance(
      fixedGoodContract.target
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
      fixedGoodContract.target
    );
    expect(balanceAfterAttack).toEqual(depositAmount);

    const badContractBalance = await hre.ethers.provider.getBalance(
      badContract.target
    );
    expect(badContractBalance).toEqual(hre.ethers.parseEther("0"));
  });
});
