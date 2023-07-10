# Re-Entrancy Attack Example

This repository exemplifies what an re-entrancy attack is and how it can be exploited.

## What is a re-entrancy attack?

A re-entrancy attack is a type of attack that allows an attacker to withdraw more funds than they are allowed to. This is done by repeatedly calling the withdraw function before the balance is updated. This is possible because the balance is updated after the funds are sent to the attacker. This allows the attacker to withdraw more funds than they are allowed to.

## How does it work?

The attacker creates a contract that calls the withdraw function of the vulnerable contract. The attacker then sends funds to the vulnerable contract and calls the withdraw function of the vulnerable contract. The vulnerable contract then sends the funds to the attacker. The attacker then calls the withdraw function of the vulnerable contract again. The vulnerable contract then sends the funds to the attacker again. This process is repeated until the attacker has withdrawn all the funds from the vulnerable contract.

## How can it be prevented?

The best way to prevent a re-entrancy attack is to update the balance before sending the funds to the attacker. This will prevent the attacker from withdrawing more funds than they are allowed to.

You can also use a reentrancy guard, which is a modifier that prevents the function from being called again until the previous call has finished. This will prevent the attacker from calling the function again before the balance is updated. However this is less gas efficient than updating the balance before sending the funds to the attacker.
