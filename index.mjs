import { loadStdlib } from "@reach-sh/stdlib";
import * as backend from "./build/index.main.mjs";
const stdlib = loadStdlib();

const startingBalance = stdlib.parseCurrency(100);

const [accAlice, accBob] = await stdlib.newTestAccounts(2, startingBalance);
console.log("Hello, Alice and Bob!");

const fmt=(x)=>stdlib.formatCurrency(x,4)
const getBalance=async (who)=>fmt (await stdlib.balanceOf(who))
const beforeAlice = await getBalance(accAlice);
const beforeBob = await getBalance(accBob);

console.log("Launching...");
const ctcAlice = accAlice.contract(backend);
const ctcBob = accBob.contract(backend, ctcAlice.getInfo());

const HAND = ["rock", "paper", "scissors"];
const OUTCOME = ["bob wins", "draw", "aclice wins"];
const player = (who) => ({
	getHand: () => {
		const hand = Math.floor(Math.random() * 3);
		console.log(`${who} played ${HAND[hand]}`);
		return hand;
	},
	seeOutcome: (outcome) => {
		console.log(`${who} saw outcome ${OUTCOME[outcome]}`);
	},
});

console.log("Starting backends...");
await Promise.all([
	ctcAlice.p.Alice({
		...player("Alice"),
    wager:stdlib.parseCurrency(5)
		// implement Alice's interact object here
	}),
	ctcBob.Bob({
		...player("Bob"),
    acceptWager:(amt)=>{
      console.log(`Bob accepts a wager amount of ${fmt(amt)}`)
    }
		// implement Bob's interact object here
	}),
]);

const afterAlice = await getBalance(accAlice);
const afterBob = await getBalance(accBob);
console.log(`Alice went from ${beforeAlice} to ${afterAlice}`)
console.log(`Bob went from ${beforeBob} to ${afterBob}`)

console.log("Goodbye, Alice and Bob!");
