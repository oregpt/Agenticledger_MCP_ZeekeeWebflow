---
url: https://www.zircuit.com/blog/zircuit-technical-roadmap-part-i-performant-provers
title: Zircuit Technical Roadmap, Part I: Performant Provers
scraped: 2025-11-01T07:21:29.647Z
---

# Zircuit Technical Roadmap, Part I: Performant Provers

**Source:** https://www.zircuit.com/blog/zircuit-technical-roadmap-part-i-performant-provers

---

Zircuit launched its initial mainnet in July 2024, but this is by no means the end of the road for Zircuit in terms of technical innovation. Zircuit has planned major upgrades in the coming years, and this post is the first of a handful that will describe those upgrades. While many of these ideas have been mentioned in talks, we want to take a moment now – a year after Zircuit was announced – to revisit these ideas. We’ll outline the possible changes and future of Zircuit. Some posts in this series, just like this one, will mostly discuss the Zircuit network itself, while some will weigh in on the community building aspects. 

‍

## **Zircuit V1: A Recap**

Before we go further, we should recap the development of the Zircuit network so far.

**December 2022 - November 2023: Initial Research & Development and Private Testnet.** Zircuit was built over two years to ensure users have the best experience and security. This included a private testnet, audits, and more, and the initial stack is built using OP Stack code with a Halo2 proof system.

**November 2023 - July 2024: Public Testnet.** Zircuit launched the public testnet at DevConnect Istanbul in November 2023. We invited the users to try the Zircuit technology for the first time, and the network served as a final testbed for the code that would initially become the first Zircuit mainnet. This network boasted many nice features common to modern rollups (e.g., EIP-4844 support) but also included our unique feature: [Sequencer Level Security](https://arxiv.org/abs/2405.01819) (SLS). SLS [protects](https://www.youtube.com/watch?v=lRAb0_T6Ml8&list=PLXzKMXK2aHh4LcwDpGf_itZrAu7XRNb07&index=3&t=58s&pp=gAQBiAQB) end users and dApps on Zircuit by using an AI to classify transactions on the L2, quarantining those that are malicious. With this, we also launched our own block explorer and bridge websites, put together in collaboration with the talented team at [Sudo Labs](https://sudolabs.com/). 

**March 2024: Zircuit Staking Program.** Anticipating the launch of mainnet later in the year, we launched a staking program for LST/LRT tokens on Ethereum mainnet. The community has been able to stake the tokens of the partnered projects, and receive Zircuit incentives. These funds were pre-committed to enter the ecosystem of Zircuit when the mainnet is live - the staking system contains a mechanic for gasless migration of the tokens onto Zircuit when the user signs an approval. We collected over $3B in deposits over the first month. 

**June 2024: Trusted Setup Ceremony.** Working towards our initial mainnet launch, we conducted a public trusted ceremony necessary for the commitment scheme we use. The ceremony was a multi-party computation protocol designed to ensure the security of our proving system. It generated a trustable Structured Reference String (SRS) for the KZG Polynomial Commitment scheme. The ceremony ended on June 22, 2024. Thanks to all contributors and to everyone who expressed an interest in participating! The parameters we used can be found on [GitHub](https://github.com/zircuit-labs/ceremony).

**July 2024: Partner Mainnet.** We launched the first Zircuit mainnet for public use in July 2024. The network was made available to our partners for testing and early deployment, but the RPC endpoints remained unexposed to the public. Internally, we again confirmed the stability of the entire setup before opening the network for public access

**August 2024: Public Mainnet with Bridge Restrictions.** In August, we finally exposed the mainnet RPCs to everyone to transact on Zircuit mainnet. While being confident in our technology, we erred on the side of responsibility and imposed some fairly low limits on the amount of assets that each account was able to deposit on the network - units of ETH. For technical reasons. Zircuit provides experience similar to other rollups and EVM chains in most cases, but it is different under the hood. This way, we gave everyone the opportunity to get comfortable with the chain on an equal-level playing field

**September 2024 - October 2024: ERC20 Tokens and Liquidity Hub and Asset Migration.** From the moment of launching mainnet, we were slowly lifting the restrictions posed to the bridge. During this period, we removed restrictions on the deposits, and also started onboarding the most popular ERC20 tokens, such as stable coins. We also deployed the Zircuit [liquidity hub](https://app.zircuit.com/liquidity-hub), and commenced the migration of assets from the staking program onto Zircuit. More than $400M was migrated to Zircuit within the first two months, and the migration continues. 

**December 2024: Unrestricted Mainnet.** In December, we finally removed all the restrictions on the mainnet deposits and withdrawals. The last restriction had the form of throttling the periodic volume of withdrawals through the canonical bridge, and was removed on December 12, 2024.  
Though we’re proud of the initial mainnet launch, there are a few things that want to change to bring Zircuit into 2025 so that it continues being a modern, feature-complete zero-knowledger rollup that does everything it can to protect its users.

‍

## **Zircuit V2: A Work-in-Progress Vision**

To achieve the goal of modernizing and completing the Zircuit roadmap, there is a lot of work that needs to be done.

![](https://cdn.prod.website-files.com/652dc770169423e16ac4a7da/677450bae9d65d80eb975b0e_AD_4nXcQJzo4W-P61WYTRBtoz5E1zklxZzcJxIXdriliZn59VDxywNIWotNvQdre3QAFD9IRCOmU4ss9PRPbiNlwKsOImOxesR4voYhQs-1lrsXyKEsWVO-B5jYPyjj6GHIZDaxMITVNhw.png)

The image above outlines the major milestones we hope to achieve in the next release. Most of these milestones are related to improving the Zircuit prover, though there are some other important ones too. We will break them down below.

‍

Central to our next release is the use of a prover that ensures prover time is not wasted by proving as much as we can with each prover execution. Such an approach is sometimes called _chunking_ as things that are to be proved are split into chunks and those chunks are proved. These things may be blocks or transaction batches, but ultimately the abstraction doesn’t matter too much: the goal is to make the provers as cost-efficient as possible. When Halo2 generates proofs, it populates the inputs to be proved into a table. The size of the table is fixed. It cannot overflow, and when there is not enough data to fill it up, it gets padded with zeroes. Then, Halo2 works on proving the entire contents of the table, regardless of whether or not it is “empty”, so there are practical performance gains to be had by making sure we’re always proving something useful, not padding. The software services that ensure that the proving work is productive is what we call **Circuit Chunk Proposer and Prover.** The current version of the Zircuit prover operates without chunking. We have been working on this upgrade of the prover since about the time when we released mainnet (in fact, some of the work started even earlier). At the time of writing this text, in December 2024, we are almost done, and chunking will hit Zircuit’s production in early Q2 of 2025. 

‍

The change to the prover means some other things need to change too: blocks must be well defined in terms of gas limits, to ensure proving is always feasible: we’ll introduce a **Circuit Capacity Checker (CCC)** that will reject transactions if they are too complex (think of transactions that will require more memory than the prover has available) and reduce the size of our blocks by imposing a **Block Limit**.  These requirements are typical for zero-knowledge rollups and they ensure that the provers aren’t asked to prove something that doesn’t fit in memory. In practice, these limits will not be felt by users as they are set well above the requirements of the average transaction on any EVM network. This functionality is being tested and tuned using Zircuit testnet and mainnet to ensure that its introduction will not cause friction for Zircuit users.

‍

Chunking in Zircuit will introduce our **Modular Proving Pipeline** to our networks. Generally speaking, proving the execution of EVM for a zero-knowledge (ZK) rollup consists of several steps. The prover first proves statements about correct execution of the EVM, followed by a sequence of compression and proof batching steps. These steps are notoriously computationally intensive, and many teams are working on making them more efficient. We initially developed the modular proving pipeline to remove tight coupling in the computational process. This greatly improved our capability to integrate and evaluate ZK technologies and newly published libraries (like the [Axiom verifier](https://github.com/axiom-crypto/snark-verifier)) on real data from Zircuit with nearly no engineering friction. Throughout the past year, we have been using the modular proving pipeline for evaluations, and based on the results, we adopted some of the libraries into the prover that Zircuit is currently running. With the next prover upgrade, we are going to adopt in production the modular proving pipeline itself. This will allow us to release the prover upgrades in production just as seamlessly as we are currently able to work with them in the development process. If you want to learn more about our work in these areas we talked about both of these topics at Devcon SEA side-events ([GPU optimizations](https://www.youtube.com/watch?v=8L7s_SpiMwc) at zkAccelerate and [Modular Pipelines](https://www.youtube.com/watch?v=9jWyxNElCxc) at the Aggregation Summit).

‍

As [explained in the past](https://docs.zircuit.com/architecture-and-concepts/architecture/template-proofs), the Zircuit network currently uses template proofs for some of the blocks. The template proofs currently allow Zircuit to roll up state with the required cadence, but indeed, they do not belong to the rollup network that we want to build. With the chunk prover upgrade in Q1/Q2, these proofs will no longer be necessary. Every block will be equipped with the ZK proof, and the security guarantees that the network provides will reach the next level, appropriate for a ZK rollup. 

‍

The chunk prover will also be moving the execution layer of Zircuit towards one that is much more ZK friendly. Our initial design brought ZK proofs into the OP Stack, which required following the implementation that Optimism had. Naturally, they mimicked Ethereum and used Keccak256 in their L2 Geth, and we wanted to do that too. But after a lot of work, we learn that this really isn’t feasible to be cost competitive, so we’re upgrading the L2 Geth to use a **zkTrie** which uses Posiedon as the hash function. This is a more ZK-friendly hash function which is easier to prove. And since we’re changing our L2 Geth anyway, we might as well modernize it with a **Geth catch-up**: we’ll bring in things from the Cancun updates and the upcoming **Pectra** update. We may go ahead with some Pectra changes _before_ Ethereum has undergone the Pectra upgrade, but some things may come later (hence its position for later in the year). 

‍

Specifically speaking, we are very eagerly working on an implementation of EIP-7702 in Zircuit. The premise of this EIP is to allow externally owned accounts (EOAs) to set smart contract code for themselves and send transactions, and get this done by having a signed authorization submitted on-chain. With EIP-7702, it will become possible for accounts to pay gas for other accounts’ transactions. It will practically enable meta-transacting with any smart contract project, regardless of whether the project implemented such support or not. In combination with a system of transaction relayers, it can enable builders to develop applications with improved user experience. EOAs will also be able to interact with DeFi in a way that is safer via templated adapter smart wallet contracts. We perceive all the power that EIP-7702 elegantly brings to the Ethereum ecosystem in terms of account abstraction, and it is our goal to support EIP-7702 on Zircuit as soon as the Pectra upgrade is applied to Ethereum.

‍

Geth is a core piece of the Zircuit node code and is integral to our sequencer. Modernizing Geth also brings other benefits: sequencer performance. The Zircuit sequencer needs to handle a ton of requests: traces to the provers, calls to the SLS AI, logging, and more. For this reason, we’re also looking into improvements that we can make. We’re also not ruling out a switch to execution layers based on Reth or Erigon if it becomes apparent that there are significant performance boosts.

‍

Performance is not limited to our sequencer either. Improving the software we’re using to generate proofs is important but only a part of the puzzle. Another piece is the hardware we use to run the provers. Our provers have to be able to get data from our sequencer in an efficient and speedy way to ensure we don’t accrue lag from passing messages around. To maintain the best performance possible, our plan is to keep provers in-house for now. We’re working with a number of partners to enhance our prover performance (like [MayaZK](https://www.maya-zk.com/)) and to get the best proving environments (like [Sindri](https://sindri.app/)). We’re also assembling our own bare-metal server proving cluster. We’re working with experienced infrastructure partner [RockawayX](https://rockawayx.com/infrastructure) to enable the proving cluster in production in Q1/Q2. Over a series of benchmarks we performed up until today, and through our operating experience, we’ve learned that bare-metal servers easily achieve 40% performance improvement over cloud environments when it comes to proving. We did the math, and decided that assembling our own proving cluster using modern hardware is the investment that makes sense for us, as well as for our community. Based on our benchmarks of the upcoming chunk prover, the performance of the proving cluster will offer sufficient performance for a very comfortable transaction volume on Zircuit. It will not incur the recurring cloud cost, which will allow us to subsidize the cost of proving Zircuit longer, hopefully forever. The proving cluster will still be augmented with multiple cloud environments, as well as proving partners, which will help us with any excess or burst load. We may also explore (decentralized) proving marketplaces.  If you’re curious though, the last blog post in this series will talk about potentially decentralizing the network (which might include the provers). We intend to add features and innovate on our proving environments gradually and iteratively. We will first integrate the new provers in a shadow-mode, to confirm the performance, reliability, and ensure that they have no unexpected behaviour on the real-time data coming to Zircuit. Some shadow provers are already running!

‍

Our bare-metal proving cluster will over time also see our custom **GPU Optimizations** come on-line. We’ve been eagerly working to reduce the proving time via GPUs for the chunk prover. Brag alert! The performance of our optimized chunk prover on the servers installed in the bare-metal cluster scratches 11 minutes, and we still have more to go. This makes our prover one of the fastest in this category, if not the fastest one. Enabling the GPU optimizations on the cluster will provide us with an increased proving baseline performance. It can be used to handle increased transaction volume, reduce latency, or further reduce the subsidized proving cost (look forward to Part IV for why this matters). 

‍

It is important to note that as we go forward, the proof system we use may change. In a follow-up post, we’ll talk about explorations with general purpose zero-knowledge Virtual Machines (zkVMs), which are seeing great advancements over specialized zero-knowledge Ethereum Virtual Machines (zkEVMs). This will actually ease some tasks – like keeping our L2 Geth / node up-to-date with the EIPs that Ethereum itself implements – and will remove the need for some tasks altogether – like the block limit and CCC. So you can probably think of these things as temporary. However, since we’re a while away from a production-grade zkVM implementation, they are helpful and necessary in the short term.

‍

Not everything is solved by a zkVM though. Security for our end users remains paramount, and we want to ensure end-users are fully equipped with everything that they need. One of those things is an **Escape Hatch**: functionality that lets them withdraw from the network even if we (the operator) is offline for a period of time. We hope this is wasted effort – in the sense that we hope to never be offline – but we certainly want there to be a plan that everyone can count on. Beyond that, we’re going to work on getting the rest of our “**Green Pie”** (and upgrading our rollup [stage](https://ethereum-magicians.org/t/proposed-milestones-for-rollups-taking-off-training-wheels/11571)) on L2 Beat. We’ll be looking to make sure that we’ve got an answer for all of the security considerations they raise in order to provide maximum security to our end users. This will also entail open-sourcing relevant parts of repositories, and this will also mean that anyone can re-derive the L2 state by running the code and watching the Ethereum blockchain.

‍

Throughout all of these changes, we are actively working to secure external audits and rigorous third-party testing. We will continue to audit critical parts of the code base (and you can check the audits that [already have](https://docs.zircuit.com/security/audit-reports) for yourself). For testing, we are working with [Antithesis](https://antithesis.com/) to use autonomous testing to make sure we’ve covered all the corner cases. These efforts are integral to our process, helping to identify and address potential vulnerabilities during network development.

‍

All in all, in the next few months these changes will bring significant improvements to the Zircuit network. In short, there’s big changes coming in the near future. Stay tuned for the next posts to see where we go afterwards.
