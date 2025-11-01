---
url: https://www.zircuit.com/blog/zircuit-technical-roadmap-part-iii-future-proof-features
title: Zircuit Technical Roadmap, Part III: Future-Proof Features
scraped: 2025-11-01T07:21:29.645Z
---

# Zircuit Technical Roadmap, Part III: Future-Proof Features

**Source:** https://www.zircuit.com/blog/zircuit-technical-roadmap-part-iii-future-proof-features

---

In this final installment of our technical roadmap series (see Part I and Part II), we’ll discuss the long-term technical directions for Zircuit. Unlike the earlier posts, we won’t  present a detailed list of explicit features here, as they’re still too far out – these items will be tackled in earnest starting in the latter half of 2025 and may take even longer to achieve significant progress. Both the features and their timelines, are subject to change as the future is hard to predict. Some ideas may become very important and critical, while others could be replaced by better approaches or deemed unnecessary ecosystem evolves. While this post is the most speculative of the series, we nonetheless want to discuss directions that we’ve long had on our mind.

Our focus for the long-term technical roadmap revolves around three core pillars: security, performance & cost, and community involvement.

‍

### **Enhancing Security**

To enhance security, we’re looking beyond being feature-complete with escape hatches and the appropriate upgrade settings. One area of particular interest is becoming **quantum resistant**. With [NIST](https://www.nist.gov/) [recommending](https://nvlpubs.nist.gov/nistpubs/ir/2024/NIST.IR.8547.ipd.pdf) that systems transition to quantum-resistant cryptography, we think there will be a huge interest in doing this in the web3 ecosystem. This is already on the Ethereum [roadmap](https://ethereum.org/en/roadmap/future-proofing/), and we want to be leading the way. The implementation will depend on what ideas are the forerunners within the broader space (as well as our proving architecture when we take on this task). Leveraging our  cryptography talent, we plan to propose new ideas to the community, build out existing ideas, and define specific changes to help Zircuit become truly future-proof. A concrete example might be to switch out our [KZG commitment](https://www.zircuit.com/blog/zircuit-kzg-ceremony) scheme to something that is based on [FRI](https://rdi.berkeley.edu/zkp-course/assets/lecture8.pdf).

‍

### **Performance & Cost Optimization**

That brings us to another topic: where our data goes. One reason we use KZG commitments is because it’s the standard for blobs introduced by [EIP-4844](https://ethereum.org/en/roadmap/danksharding/). If our commitment scheme changes, we may need to post our data elsewhere to ensure the cheapest data fees. And this may be true even if we _don’t_ change our commitment scheme or if Ethereum supports different schemes in the future. There may be cost savings to be had by posting data on other blockchains, though we’ll always weigh this with the trade-offs it introduces. While modularity may be the future, Ethereum’s reputation is certainly hard to beat. Nonetheless, we’ll consider **alternative data availability** solutions once more user-facing features are completed or as costs dictate a need for them. 

‍

### **Community Involvement**

Lastly, we’re looking at community involvement. There are a lot of great things in the works for community involvement and our ongoing initiatives, such as the [liquidity hub](https://app.zircuit.com/liquidity-hub), have already fostered robust community engagement. But in this post we’re talking about technical topics, so that brings us to **decentralization**: the opportunity for anyone to participate in the network itself. This is not trivial for any rollup and Zircuit actually makes it more complicated. 

‍

One attractive approach for interoperability between rollups is the use of so-called [_based sequencing_](https://ethresear.ch/t/based-rollups-superpowers-from-l1-sequencing/15016) that allows anyone to build Layer 2 (L2) blocks by submitting a Layer 1 (L1) transaction. However, when we’re looking at this kind of architecture we have to consider our network, and in particular, the complexity introduced by our [Sequencer Level Security](https://arxiv.org/abs/2405.01819) (SLS). We use AI to detect malicious transactions before we build L2 blocks, which is difficult to decentralize at this time. That doesn’t mean we’re incompatible with some this idea though; for example, we could introduce some based sequencing in the sense that we allow L1 users to submit transactions for the L2 blocks – i.e., allow anyone to order transactions – but we still apply the AI to ensure that only benign transactions are included. In such a situation, Zircuit gains ordering of transactions from the L1 in a decentralized manner ([which is core to rollups, anyway](https://www.youtube.com/watch?v=c1IbglrscSU)) without giving up the practical security we’ve introduced. And down the road there are other approaches: naturally, decentralizing the AI would be great (possibly through really performant [models and zkSNARKs](https://arxiv.org/abs/2402.02675), if that becomes feasible) or with cryptoeconomic incentives. Or if the future is really modular, maybe others can plug-in their own malice detection engines. The ways to overcome this particular challenge are numerous and exciting, but we want to make sure we don’t rush to decentralization too quickly. And in the mean time, recall from the last post that we’re working on escape hatches and other features to minimize trust.

There are a number of other topics too that will arise in the future that we’re going to consider. We’ve previously mentioned a desire to support account abstraction and related features. There are ideas about better interoperability, support for Layer 3 (L3) networks, and other ways to talk to other blockchains. And there are certainly a plethora of ways we can enhance SLS to bring practical, efficient security to users on our chain. We’ll also aim to implement and enhance AI support on the chain – we’ll talk a bit more about that in the next post.

We just wanted to highlight some of the ideas we’re thinking about above so that you know the future is really bright for Zircuit.

‍

See you next time! 

The Zircuit Team 💚
