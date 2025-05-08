# test-onebalance

This is the candidate test for OneBalance.

This is what I did:

As mentionned in the interview, I went to use AI for fastest development possible. I've started this morning at 8am. I went for Claude AI. Since Anthropy will soon release Claude Code for in-repo modifications I thought that it would be better to show ability to work with such tools and not code everything without it. If this raises any doubt about my personal capabilities, I'm open to do another test without AI, or discuss the details of the implementation in a video call, or be asked what each piece of code is doing.

What I've asked the AI was to generate a multirepo with the backend and frontend folders as NPM workspaces. I initially wanted to do a NextJS app with create-next-app but it didn't meet the requirements of separate folders.

I've asked it to use NestJS for the backend, React for the front.

One thing the AI contributed to and that I didn't know, was using the llama RPC, which I didn't know is publicly available without API key. I would have gone for Infura or Alchemy and shared a private key separately for you to add a .env. This adds simplicity for this test.

I have personnally coded the requirement for displaying the 4 significant digits of a balance (code in frontend/src/utils/show4SignificantDigits.ts).

Because of this flow, the commit steps are not that informative, as was asked, however the main coding was done in a very short time.
