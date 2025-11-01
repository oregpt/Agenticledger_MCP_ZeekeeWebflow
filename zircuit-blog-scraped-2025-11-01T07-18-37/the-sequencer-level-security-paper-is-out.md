---
url: https://www.zircuit.com/blog/the-sequencer-level-security-paper-is-out
title: The Sequencer Level Security Paper Is Out!
scraped: 2025-11-01T07:21:29.656Z
---

# The Sequencer Level Security Paper Is Out!

**Source:** https://www.zircuit.com/blog/the-sequencer-level-security-paper-is-out

---

Zircuit innovates on security guarantees provided by the blockchain to users by introducing a concept called [Sequencer Level Security (SLS)](https://3252263143-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2Fp2pPzGBdConDaqw5tnHs%2Fuploads%2FtXfssxyeaLJfkYIgsnOO%2FSLS_Arxiv%20\(10\).pdf?alt=media&token=afb53c40-2af7-477a-9b91-39fd5ab73c4b). The current status quo is that blockchain nodes secure the consensus of the chain. However, they do not protect users against malicious transactions in any way, meaning developers are responsible for the security of smart contracts and dApps that reside on blockchains. To ensure that no vulnerabilities are left behind,  developers should follow best practices for software engineering, test their code, utilize security screening tools capable of identifying some code defects, and undergo a security audit. Users, especially the non-technical community members, are forced to rely on the fact that all these measures were employed during the project’s implementation and that no attack vectors remained open. If this is not the case, their assets may be at risk. 

Zircuit’s Sequencer Level Security (SLS) introduces a new layer of security that is directly catered towards protecting users. The sequencer becomes an active element in the security landscape. Unlike in other blockchains, it scrutinizes every transaction before it places it into a block. It searches for transactions that exploit protocols and cause harm. Instead of including these transactions into blocks, it places them into quarantine. 

We presented the Sequencer Level Security (SLS) concept in early March 2024 during a [talk at ETH Denver](https://youtu.be/8RiLNXNEGs4) as well as at several subsequent venues including a [talk at Ethereum Zurich](https://youtu.be/IhmtmXuAFO8) in April 2024. 

Today, we are publishing a pre-print version of the academic paper describing all the nuanced and technical details of this concept that did not exist before Zircuit. You can read the full paper [here](https://3252263143-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2Fp2pPzGBdConDaqw5tnHs%2Fuploads%2FtXfssxyeaLJfkYIgsnOO%2FSLS_Arxiv%20\(10\).pdf?alt=media&token=afb53c40-2af7-477a-9b91-39fd5ab73c4b).

We are incredibly proud to be able to introduce this novel paradigm of blockchain security. We invite the entire security community to review our work, and welcome their feedback!
