---
url: https://www.zircuit.com/blog/zircuit-x-sindri-powering-the-zkvm-upgrade
title: Zircuit × Sindri: Powering the zkVM Upgrade
scraped: 2025-11-01T07:21:29.636Z
---

# Zircuit × Sindri: Powering the zkVM Upgrade

**Source:** https://www.zircuit.com/blog/zircuit-x-sindri-powering-the-zkvm-upgrade

---

Last week, Zircuit upgraded its Garfield testnet to use zkVM-based provers instead of custom-built zkEVM circuits. This huge milestone modernizes Zircuit’s prover technology by replacing the difficult-to-maintain zkEVM circuits with a general-purpose zkVM, which allows Zircuit to ship faster while maintaining high security guarantees.

‍

This release, and the upcoming release of the zkVM on mainnet in the coming days, is made possible by a partnership between Zircuit and [Sindri](https://sindri.app/). Sindri provides developers with scalable, reliable infrastructure optimized for cryptographic workloads, including proof generation. We’ve been working with Sindri for a while now (even with Halo2 workloads), but their support for [SP1](https://github.com/succinctlabs/sp1) proof generation allowed us to rapidly prototype, test, and ultimately productionalize our zkVM release.

‍

This upgrade will use [OP-Succinct](https://github.com/succinctlabs/op-succinct) to prove the state transition function of Zircuit. OP-Succinct [includes](https://succinctlabs.github.io/op-succinct/) _Kona_ and _SP1_. _Kona_ is Optimism’s Rust implementation of their rollup state transition function – which is similar to Zircuit’s, since we’re built on the OP-stack. _SP1_ is a general-purpose zero-knowledge Virtual Machine (zkVM) built by [Succinct](https://www.succinct.xyz/) that was quickly proven to handle Ethereum workloads efficiently. Combined with Sindri’s easy-to-use zkVM-as-an-API infrastructure, this zkVM was a natural starting point for migrating away from our Halo2-based zkEVM.

‍

In the future, Zircuit will explore a multi-zkVM prover architecture. This modular design will help protect Zircuit from zkVM-specific bugs and allow us to choose the most efficient zkVM, whether that’s determined by hardware requirements, prover times, or something else. Sindri [supports Jolt](https://sindri.app/docs/how-to-guides/frameworks/jolt/), and Zircuit will also explore other zkVMs which can be used with our version of Kona (like [RISC0](https://risczero.com/)).

‍

Zircuit worked with Sindri in order to modify OP-succinct for our needs. First, we changed Kona to support Zircuit’s custom [Sequencer Level Security](https://docs.zircuit.com/architecture-and-concepts/sequencer-level-security-sls) functionality. Other Kona changes stemmed from more general-purpose needs. In particular, we’re not interested in using Kona for challenging state roots – we want to prove every block, in order to be a full zero-knowledge rollup. We’re also exploring optimizations for data availability (DA) posting and interpretations. Stay tuned for details when we’re ready to share them. And finally, instead of using the Succinct prover network, we’re making calls to Sindri’s API as they provide great developer support and experience. We hope to share many of these changes in case others want to use Kona on their rollups.

‍

The adoption of a zkVM-based prover architecture has great benefits for our users. Primarily, we’ll be able to simplify our internal development to ensure we always have the most recent EVM features. For future hardforks like [Fusaka](https://cointelegraph.com/news/ethereum-s-fusaka-fork-tipped-for-november-as-glamsterdam-comes-into-view), any features that would have heretofore required circuit changes of our Halo2 proof systems now get replaced with an upgraded version of the Kona EVM client. That means we’re going to be hot on the heels of any relevant upgrades – expect future hardforks on Ethereum to be adopted much more quickly on Zircuit. And these modern VMs can reduce prover costs and proof generation times – good things for Zircuit users.

‍

Zircuit’s collaboration with Sindri is bringing our prover technology into the future. While we’re also committed to generating proofs in-house over time, we’re excited that this partnership allows us to deploy in record time.

‍

See you next time,  
The Zircuit Team 💚
