"reach 0.1";

const player = {
	getHand: Fun([], UInt),
	seeOutcome: Fun([UInt], Null),
};

export const main = Reach.App(() => {
	const Alice = Participant("Alice", {
		// Specify Alice's interact interface here
		...player,
		wager: UInt,
	});
	const Bob = Participant("Bob", {
		// Specify Bob's interact interface here
		...player,
		acceptWager: Fun([UInt], Null),
	});
	init();
	// The first one to publish deploys the contract
	Alice.only(() => {
		const wager = declassify(interact.wager);
		const handAlice = declassify(interact.getHand());
	});
	Alice.publish(wager, handAlice).pay(wager);
	commit();
	// The second one to publish always attaches
	Bob.only(() => {
		interact.acceptWager(wager);
		const handBob = declassify(interact.getHand());
	});
	Bob.publish(handBob).pay(wager);

	const outcome = (handAlice + (4 - handBob)) % 3;
	const [forAlice, forBob] =
		outcome == 2 ? [2, 0] : outcome == 0 ? [0, 2] : /* tie      */ [1, 1];
	transfer(forAlice * wager).to(Alice);
	transfer(forBob * wager).to(Bob);
	commit();

	each([Alice, Bob], () => {
		interact.seeOutcome(outcome);
	});
	// write your program here
});
