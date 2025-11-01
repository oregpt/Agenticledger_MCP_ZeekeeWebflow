---
url: https://www.zircuit.com/blog/zircuit-at-ethglobal-cannes-2025-winners-and-project-spotlight
title: Zircuit at ETHGlobal Cannes 2025: Winners and Project Spotlight
scraped: 2025-11-01T07:21:29.641Z
---

# Zircuit at ETHGlobal Cannes 2025: Winners and Project Spotlight

**Source:** https://www.zircuit.com/blog/zircuit-at-ethglobal-cannes-2025-winners-and-project-spotlight

---

Following a tightly packed ETHCC\[8\] schedule in Cannes, Zircuit was proud to participate in the ETHGlobal Cannes Hackathon! The event ran from July 4th to July 6th and kicked off with a bang – literally. After getting settled into the venue and introducing our prizes, nearly everyone was excited to step out and watch the first fireworks of the _Festival Pyrotechnique de Cannes_ right on the doorstep of the event! But we’ll all just say that the fireworks were for the builders, Ethereum, and the conclusion of one of the hottest (literally and figuratively) weeks in web3.

‍

For this event, Zircuit decided to give out five prizes in three categories: best project on Zircuit, best use of Account Abstraction (using our [newly implemented EIP-7702](https://www.zircuit.com/blog/zircuit-at-eth-global-taipei-2025-the-year-of-ai-eip-7702) support), and best killer app idea. That last category didn’t even need code, though submissions often provided it. As cliche as it sounds, it was as hard as ever to pick winners. We got a lot of submissions and spent the entire morning meeting with the teams. In the end, we only had 10 minutes to deliberate and choose the winners. Nonetheless, we’re proud of the winners below and the honorable mentions and hope that we see everyone again at the next [ETHGlobal hackathon in New York](https://ethglobal.com/events/newyork2025) in August.

# Best Project on Zircuit: 🩸 PrivyCycle

Zircuit was really impressed with this project. It stood out as a real-world use case for blockchain that was presented alongside a clear target market. PrivyCycle is a secure, AI-powered period tracker with encrypted logs that can be shared. Executed correctly, this project stands to onboard thousands of users while abstracting away the blockchain itself. In the demo we saw, the team used Zircuit to record IPFS entries of encrypted data so that it could be shared. We saw the team think carefully about the target audience, the UI, and the needs of their users. We wish them luck in bringing this project to those who would use and benefit from it!

# Best Use of Account Abstraction: ⚡ BeamPay

BeamPay built payment infrastructure around ERC-20 token transfers. Specifically, they wanted to put useful metadata on-chain. They did this using EIP-7702 to “wrap” token transfers with extra data and confirm that the correct amounts were sent. If the industry is serious about institutional adoption, we see this as a critical use case: transfers that specify tax identifies, purchase orders, or other less obvious data will make understanding on-chain actions easier.  The use of EIP-7702 ensures that additional steps are abstracted away and users don’t need to build out their own infrastructure to add this data. The team showed off their technical prowess by building out the infrastructure to leverage EIP-7702 support on Zircuit, which included a browser plugin and deploying the relevant smart contracts. Amazing work, and hopefully we can simplify 7702 use on Zircuit by the next hackathon. Congratulations!

# Best App Idea:

There were three winners in this category. This category didn’t require a functional prototype for an application, just an idea. Nonetheless, many teams did come with some kind of proof of concept and it was very difficult to only pick three winners.

## 🎣 PhishStake

PhishStake is working towards a goal we take very seriously at Zircuit: security. The team built out an AI that could be run locally to monitor your screen. That sounds scary, but it’s done with care. At regular intervals, the AI takes a screenshot of your screen to see if any phishing attempts are present. If it detects any, it warns you; if it suspects one, it will ask you to confirm the result or flag it as a false positive. As this is done locally, there’s no sharing of your screen necessary. And it uses a blockchain to have users present phishing attempt examples, which must be accompanied by a stake to ensure that only legitimate attempts are recorded. Creative ideas like this one are needed to overcome the ever resourceful attackers out there to keep users and their funds safe.

## 🤝 ShowUp 🤝

ShowUp was an app that solves a relatable problem: friends don’t show up to planned events. The application showcased a telegram bot that group chats could use in order to get participants to stake assets as a promise of their attendance for upcoming events. The stake took place on Zircuit and slashed stakes were redistributed to participating friends. Users had to prove their location relative to the event (though we hope they can use some ZK approaches in the future to do this!) and could even mint NFTs based on uploaded pictures during the event. This dApp has the potential to take group travel out of the group chats all the while abstracting the blockchain away – giving it a lot of potential to be a killer app.

## 😎 Zircuit Prolog Preex

This idea was that _Zircuit itself_ would be the killer app, and we just couldn’t resist. The project outlines integration of a Prolog Pre-Execution Environment for Zircuit, which allows users to submit Prolog code. While Prolog isn’t the most popular language, it has been around forever and can do some very interesting things. This project outlined the potential use cases for this, and what needs to be done. The plan would involve adding precompiles to our zkVM when it goes live (the writeup uses SP1 as an example, but we’re not sharing an exact VM just yet).  The quality of the write-up, coupled with the fact that the idea is an interesting research direction (if not an addictive user facing application) is what won the judges’ hearts. There were also thoughts of using Prolog’s nondeterministic language for intents. In short, there was a lot of technicality to this idea. We’ve always been open to research collaboration, and while we’re not going to promise a Prolog co-processor or pre-compiles, we love to see ideas that challenge the notion that rollups should _only_ be a faster Ethereum.

# Honorable Mentions:

Regrettably, not every project could take home a Zircuit prize. While many were on our minds long after judging closed, we wanted to give a shoutout to our honorable mentions!

## 📢 OpinionMARKET

OpinionMARKET presented a Polymarket-like dApp where voting on outcomes never ended. The idea was to open a market for a subjective topic and see where the masses vote. If you voted with them, you’d profit. Given the success of Polymarket, we see this as an interesting dApp that could get people debating controversial ideas and using their assets as arguments.

## 🐧 Zkipper

Zkipper demonstrated role-based access control, where users could use account abstract to even make their account (or some of their signatures) post-quantum (PQ) secure. The prototype was very expertly crafted and demonstrated and got us thinking about our own PQ-secure roadmap. We loved the use of EIP-7702 with new cryptography and hope that this team keeps up their good work.

## 🐱 Make Cat Fat & Save

This adorable project took your leftover assets (and more) on other blockchains – dust – and bridged it to a savings account on Zircuit. That account was represented by a cute Zircuit cat that got fatter as you deposited until you finally withdrew the funds. The use case was helpful and convenient, and the design fit right in with our branding.
