---
url: https://www.zircuit.com/blog/zircuit-technical-roadmap-part-ii-scaling-securely
title: Zircuit Technical Roadmap, Part II: Scaling Securely
scraped: 2025-11-01T07:21:29.646Z
---

# Zircuit Technical Roadmap, Part II: Scaling Securely

**Source:** https://www.zircuit.com/blog/zircuit-technical-roadmap-part-ii-scaling-securely

---

In the [previous post](https://www.zircuit.com/en/blog/zircuit-technical-roadmap-part-i-performant-provers), we outlined the near-term future of the Zircuit network. Now, we’ll look further ahead to mid-2025 and beyond. Our primary goal is to make Zircuit feature-complete, ensuring minimal transaction costs, maximum user security, and optimal network performance.

![](https://cdn.prod.website-files.com/652dc770169423e16ac4a7da/677d6523273bc740a815be46_AD_4nXcAt00rPOyXYd0JiePWDaiFW-YcXjqBFxCxIKTFsptNPX5kGtzn_VpmKxh2DEeu4Zc0vusvybqrpku7knRaG8Xf0Hy_lCZ1AOAg5f5oPzK9D2jXdtHx_8j1lpz1aMAu2fWdWTsStA.png)

‍

The biggest technical challenge ahead is completing the prover. Up until this version of the network, the prover will be Halo2 based, but this may change by mid-2025. General purpose zero-knowledge Virtual Machines (zkVMs) are becoming feasible and competitive when compared to specialized zero-knowledge Ethereum Virtual Machine (zkEVM) designs. As we roll out the changes listed in the last post, we’ll have a team of researchers assess zkVMs feasibility. As a result, we’ll have to make a decision:

-   **Switch to a zkVM-Based Proof System.  
    **If research aligns with zkVM marketing claims, we’ll seriously consider adopting a zkVM. Naturally, there are important things to think about: which one ([RISC0 or SP1 or others](https://vac.dev/rlog/zkVM-testing/)), [security concerns](https://www.zksecurity.xyz/blog/posts/zkvm-security/), performance, and cost. There’s a number of benefits for this approach: we’ll almost always have parity with Ethereum with minimal development time, for example (though we will retain any unique features we add). Research into zkVM options is already underway, and updates will follow.
-   **Develop our Final Halo2 prover.  
    **If it’s determined that zkVMs aren’t the silver bullet that they are hyped up to be (yet), we’ll continue working on our Halo2 prover. While less favorable, being an efficient and sound zero-knowledge rollup is important, and we always have a backup plan. The remaining changes will bring about changes to the stack that will see us deviate from our OP Stack origins, by changing the way deposits are handled on chain, for example.

‍

Supporting both proof systems is theoretically possible but requires significant engineering effort. It’s unlikely we’ll start with that course of action. Instead, supporting multiple node implementations along with multiple zkVMs may be an option. There may also be a migration needed for either system, though it’s most likely only necessary if we use a zkVM. In such a case, we’d minimize any impact to users and never risk funds.

‍

After selecting the feature-complete prover, we’ll optimize it. We have plans for **More GPU Optimizations**. Recall from our first blog post that we’re passionate about network performance, and that won’t change even if our proof system does. We’ll have a lot of performance in our bare-metal proving cluster to experiment with and no shortage of ideas.

‍

Performance only matters if users are secure. Zircuit’s unique [Sequencer Level Security](https://arxiv.org/abs/2405.01819) (SLS) has protected users since mainnet launched in July 2024, guarding against evolving smart contract exploits. The ideas behind SLS, the trade-offs, and designs, are described in depth in our original research. We have invested this year in developing the world’s first-ever SLS-protected blockchain system, and gaining experience with operating it. It has been a very experience for us as avid blockchain and security researchers, as well as for our community. Partnering with threat intelligence experts at Hypernative, we integrated an oracle trained on over $4B transactions from other EVM compatible chains. As [published](https://www.hypernative.io/blog/how-kinetic-stopped-a-hack-and-saved-5m-with-hypernative), this oracle achieves accuracy that can exceed 99.5% of hacks, with a false positive rate as low as 0.01%. Translated into numbers, the system is theoretically expected to prevent 199 out of 200 hacks, while falsely identifying only 1 out of 10,000 transactions as malicious. Our data show that the situation is even better. We luckily didn’t have a hack on Zircuit yet, but we developed end-to-end tests based on real-world hacks from the past, and confirmed that they are detected. We just recently published our methodology and learnings in an academic paper that is going to appear in [WETSEB 2025](https://www.agile-group.org/wetseb2025/accepted-papers/). The false positive rate that the system exhibits is far lower than predicted and sits at approximately 0.00045%. This number should not be taken as definite for the long term as it may evolve with an evolving transaction spectrum. In all cases of quarantined transactions, our monitoring systems went off, and the quarantined transactions were immediately investigated by security experts. In all cases, we confirmed that the transactions were identified as exploits falsely, and that they did not exploit and reveal vulnerabilities in any protocol deployed on Zircuit. Some of them exhibited signs of automatically generated trading traffic, and were immediately replaced by different transactions produced by the transaction sender. The remaining ones were released from the quarantine as soon as the security investigation concluded, within an order of 10s of minutes. We also had a chance to stress test the system. We discovered some implementation-related performance issues, but we were able to promptly resolve them. SLS currently doesn’t represent an operational bottleneck for Zircuit, and we don’t expect it to become one. 

‍

But there’s always more we can do. Major upgrades to this system – **SLS 2.0** and later **SLS 3.0** – will be brought online starting in Q2 or Q3 of 2025 and will continue as innovations are ready. These upgrades will progress along the path outlined in our research published [here](https://arxiv.org/abs/2405.01819) and [here](https://arxiv.org/abs/2408.14621). In brevity, the upcoming upgrades to the SLS system will enable more complex analyses of on-chain threats without sacrificing performance. These analyses will operate at various granularities: 

-   **Sub-transaction level**, where we will check that smart contract invariants are not violated;
-   **Transaction level**, where we will check that a single transaction isn’t executing an exploit; and
-   **Block level**, where we will check that transactions with a set of blocks aren’t acting together to pull off a sophisticated attack. 

We have also architected improvements to the pipeline, which enables running more complex analyses on transactions that individually appear suspicious, without hindering the liveness and performance for the chain. Overall, the upgrades will not only improve the detection capabilities, but also enable new use cases for the system. We also intend to expand the spectrum of transaction analyzers that SLS on Zircuit uses.

‍

SLS brings about unique functionality onto the chain, but the goal is not to complicate developer or user experience. To keep the development experience as simple as possible, we’re building out an **SDK** that will work with the changes we’ve introduced by SLS or other features. We’re currently looking at providing an extension to [Viem](https://github.com/wevm/viem) for this purpose.

‍

We’ll also start looking at other unique functionality to support AI applications and agents on our chain. As these become more popular and useful, we’ll look into giving them what they need to succeed on-chain. Vitalik’s [post](https://vitalik.eth.limo/general/2024/01/30/cryptoai.html) in early 2024 highlights practical and interesting synergies between these blockchains and AIs. We can’t overstate our excitement for making more of these possible. Right now, they may be too expensive (in terms of off-chain compute or on-chain gas requirements), slow, or require data that isn’t easily available. We’ll look at removing those boundaries to make Zircuit the chain for cognitive agents and users.

‍

In our next roadmap post, we’ll talk about even longer term goals for the network’s development – stay tuned!
