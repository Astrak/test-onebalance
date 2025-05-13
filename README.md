# test-onebalance

This is the candidate test for OneBalance.

## Installation

```bash
npm run install:all
```

## Startup

```bash
npm run start:dev
```

## Explanation

As mentionned in the interview, I went to use AI for fastest development possible. I've started this morning at 8am. I went for Claude AI. Since Anthropy will soon release Claude Code for in-repo modifications I thought that it would be better to show ability to work with such tools and not code the obvious by myself.

What I've asked the AI was to generate a monorepo with the backend and frontend folders as NPM workspaces. I initially wanted to do a NextJS app with create-next-app but it didn't meet the requirements of separate folders. I've asked it to use NestJS for the backend, React for the front. One thing the AI contributed to and that I didn't know, was using the Llama RPC, which I didn't know is publicly available without API key. I would have gone for Infura or Alchemy and shared a private key separately for you to add a .env. This adds simplicity for this test.

I had a battery issue at the café I was working at, I have a portable battery but brought the wrong cable so I moved back to my place for noon and felt the need to add more personal features, as the core code was a bit too easily completed with the help of the AI, without demonstrating a personal touch.

I have then coded the requirement for displaying the 4 significant digits of a balance (code in frontend/src/utils/show4SignificantDigits.ts). I did balance result caching as well, as was suggested in the requirements. For this test I did a simple object cache. For a dev or production server, a DB would of course be needed. I would need to set up a DB in the environment and ideally dockerize the whole to make it more convenient but I have stopped there.

Happy to discuss the code in a video call.

UPDATE from May 13th:
I've fixed an error of checking USDC instead of USDT, and I've implemented a dockerized Redis cache.
