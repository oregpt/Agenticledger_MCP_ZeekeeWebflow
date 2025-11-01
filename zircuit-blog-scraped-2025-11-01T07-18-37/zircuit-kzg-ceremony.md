---
url: https://www.zircuit.com/blog/zircuit-kzg-ceremony
title: Zircuit KZG Ceremony
scraped: 2025-11-01T07:21:29.654Z
---

# Zircuit KZG Ceremony

**Source:** https://www.zircuit.com/blog/zircuit-kzg-ceremony

---

## TL;DR

As part of using Halo2 proofs with KZG commitments, Zircuit needs to set up the KZG commitment scheme. To work, the scheme requires some parameters generated with a secret that should remain unknown to everyone. We organized a multi-party computation ceremony, which was **completed on June 22nd**. Thank you to everyone who participated!

‍

## What Exactly Are We Doing?

As part of using Halo2 proofs with KZG commitments, we need to set up the KZG commitment scheme. This is done via a KZG ([Kate-Zaverucha-Goldberg](https://www.iacr.org/archive/asiacrypt2010/6477178/6477178.pdf)) ceremony which involves generating public parameters for a zk-SNARKs system under a multi-party computation setting. Here’s a high-level breakdown of how the KZG ceremony typically unfolds.

1.  We first retrieve the latest contribution to a perpetual multi-party KZG ceremony [described here](https://www.iacr.org/archive/asiacrypt2010/6477178/6477178.pdf). This will be the base for the cryptographic computations that follow, providing us with a starting set of parameters.
2.  The parameters are then passed to the first participant in the ceremony; in this case, that’s us -- Zircuit. We will generate a secret based on things like the randomness in /dev/random and update the KZG parameters, computing new values based on our secret and the previous parameters. These computations will be done in such a way that we don’t leak our random secret, and we’ll delete it and the necessary files.
3.  A contribution includes a proof that we correctly followed the protocol. This proof is publicly verifiable, allowing everyone to check that no tampering has occurred and that the participant did not retain any information that could compromise the system. 
4.  After our contribution is verified, the updated parameters and proofs are passed on to the next participant. This process is repeated with each participant sequentially contributing to and then passing on the parameters, deleting their own randomness along the way. We have provided the code for the community to participate in this process and will accept contributions up to June 20, 2024. Note that this process may take several hours on your computer to complete.
5.  We appreciate all contributions, but each one may take several hours to finalize, limiting the number we can process. To ensure that everyone has a chance to contribute, we will periodically allow random beacon contributions, where we gather community-generated randomness and we compute a verifiable contribution from it.
6.  After the last contribution is verified, we _could_ generate our starting parameters from it. However, we (and you, the public) do not know if the last contribution may have introduced any kind of bias. Therefore, we’ll randomize the final contribution, using a seed that cannot be known during the entire contribution phase. For this, we’ll use a file that is the concatenation of the first block hashes of Bitcoin and Ethereum on June 22, 2024 (UTC). We will hash this file many times (2^30 times), and use the final result as part of the last contribution.
7.  The final set of parameters, after our last contribution by the given date, will be published as the official parameters for the Zircuit mainnet.

‍

The KZG distributed ceremony is critical because it ensures that no single party knows the entirety of the secret used to generate the parameters, making it infeasible for any participant (or group of colluding participants) to compromise the system -- including Zircuit. This type of ceremony was famously used during the [setup of Zcash](https://spectrum.ieee.org/the-crazy-security-behind-the-birth-of-zcash) and for [setting up Proto-Danksharing on Ethereum via EIP-4844](https://ceremony.ethereum.org/).

‍

For your participation in this KZG ceremony, you’ll be awarded Zircuit points at a later date. You’ll be able to check your points later and earn even more by participating in our [Build to Earn](https://build.zircuit.com/) program.

‍

More on KZG ceremonies:

-   [The KZG Ceremony - or How I Learnt to Stop Worrying and Love Trusted Setups by Carl Beekhuizen](https://www.youtube.com/watch?v=dTBy661ubgg) (YouTube - DevCon VI)
-   [KZG Ceremony FAQs](https://github.com/ethereum/kzg-ceremony/blob/main/FAQ.md) (GitHub - Ethereum)
-   [How do trusted setups work?](https://vitalik.eth.limo/general/2022/03/14/trustedsetup.html) (Vitalik’s blog)

‍
