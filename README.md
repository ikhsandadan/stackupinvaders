# StackUp Invaders X Immutable Passport
[StackUp Invaders](https://nashki-stackup-invaders.netlify.app/)

![FirstScreen](https://github.com/ikhsandadan/stackupinvaders/assets/116878888/b2501df0-d52a-48db-9d5d-fc5828af08cd)

For this bounty, I created StackUp Invaders based on React and integrated Immutable Passport and smart contracts. I utilized three smart contracts: NFT Spaceship, NFT Medal, and a functional smart contract. Additionally, I introduced several features to the StackUp Invaders Game, which I'll outline below.

 

 **1. 3 Spaceship Options**
 
 Here, I've designed three distinct spaceships for players to choose from: the Blue Space Ship, Red Space Ship, and the Green Space Ship. Each spaceship comes equipped with three lives and the ability to unleash unique lasers. I've also implemented metadata refresh, ensuring that if the NFT's name, description, or image is null, it will automatically receive updates.
 
![AllShips](https://github.com/ikhsandadan/stackupinvaders/assets/116878888/76031f34-6664-4484-80c3-aa106bf1a7a3)

![metadata](https://github.com/ikhsandadan/stackupinvaders/assets/116878888/5e7168a2-0b38-447b-ac22-85e9c6850b84)


**a. Blue Space Ship**

This is the fundamental spacecraft that players can immediately engage with. The Blue Space Ship is equipped with a small laser capable of dealing 0.2 damage, a laser width of 5, a maximum energy capacity of 50, and an energy regeneration rate of 0.05.

![enter image description here](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNmZ3eThwMnFoN21rZTMxMjF0ZDE4YXpnN2d2M2Q1b2p6dmt4Y2duYyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/iEsMneDKAVBtKVVmP9/giphy.gif)

![DrawLaser](https://github.com/ikhsandadan/stackupinvaders/assets/116878888/28de8fcf-badd-4b99-8f90-efcb9ae24fde)

![Energy](https://github.com/ikhsandadan/stackupinvaders/assets/116878888/838f0ee9-5487-43b4-a954-f1dc8813275b)

![SmallLaser](https://github.com/ikhsandadan/stackupinvaders/assets/116878888/c1a79f35-536a-491b-9222-7795885a2373)


**b. Red Space Ship**

This is a spacecraft available for purchase by players as an NFT, priced at 1,000,000 Points. The Red Space Ship is capable of firing large lasers with a damage output of 0.5, a laser width of 14, a maximum energy capacity of 75, and an energy regeneration rate of 0.10.

![enter image description here](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZnJvZzdwcnFpb3c0cG9lZ3N2bmhuaHl5M3d0dGM3b3BwMGNmYW1oNSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/X659L6vndgSRxEeqeB/giphy.gif)

![DrawLaser](https://github.com/ikhsandadan/stackupinvaders/assets/116878888/28de8fcf-badd-4b99-8f90-efcb9ae24fde)

![Energy](https://github.com/ikhsandadan/stackupinvaders/assets/116878888/838f0ee9-5487-43b4-a954-f1dc8813275b)

![BigLaser](https://github.com/ikhsandadan/stackupinvaders/assets/116878888/5992cc99-7ca4-45a6-84bc-446b6a156dcd)


**c. Green Space Ship**

This spacecraft is available for purchase by players as an NFT, priced at 2,000,000 Points. The Green Space Ship is equipped with powerful lasers, dealing 0.8 damage, featuring a broad laser width of 20, a maximum energy capacity of 100, and a rapid energy regeneration rate of 0.15.

![enter image description here](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcDdxejN6ZjF4M3VpejU0d3J1MHQ4cjBqaXB2NjExZW53eDJ6YzlrayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/p6B9z8ZEG7xsiseRX5/giphy.gif)

![DrawLaser](https://github.com/ikhsandadan/stackupinvaders/assets/116878888/28de8fcf-badd-4b99-8f90-efcb9ae24fde)

![Energy](https://github.com/ikhsandadan/stackupinvaders/assets/116878888/838f0ee9-5487-43b4-a954-f1dc8813275b)

![SuperBigLaser](https://github.com/ikhsandadan/stackupinvaders/assets/116878888/8a715e5f-a21e-4fd2-93f4-34162560d89f)


**2. Game Play**

Here, I've implemented a stage system comprising waves that progressively increase in difficulty. Each wave introduces a chance for spawning Alien1, Alien2, or Alien3, and each enemy has the ability to randomly fire bullets.

![Wave](https://github.com/ikhsandadan/stackupinvaders/assets/116878888/17846b25-618d-47c0-af97-bccf9ca1ab3e)

![DrawEnemy](https://github.com/ikhsandadan/stackupinvaders/assets/116878888/1c3276fa-f20d-4cb6-83a7-121f24627291)


Additionally, every even-numbered wave presents the player with a formidable Boss battle.

![WaveEnemyOrBoss](https://github.com/ikhsandadan/stackupinvaders/assets/116878888/fce102ac-257a-43ed-836c-f7313f2b154a)


**a. Alien1**

Alien1 is an adversary that players can combat, with a health value of 1. Successfully destroying Alien1 rewards players with 100 points.

![alien1](https://github.com/ikhsandadan/stackupinvaders/assets/116878888/08246faf-39c3-4c99-9ee9-3496f26a5e2a)

![Alien1](https://github.com/ikhsandadan/stackupinvaders/assets/116878888/f2126ea3-0173-4601-8271-ed65c2627891)


**b. Alien2**

Alien2 is an adversary that players can engage, possessing a health value of 2. Successfully defeating Alien2 yields 200 points for the player.

![alien2](https://github.com/ikhsandadan/stackupinvaders/assets/116878888/a3afe00c-5f94-4154-81df-fb560e53ca33)

![Alien2](https://github.com/ikhsandadan/stackupinvaders/assets/116878888/13d02d92-051e-473a-99e5-6ea416811009)


**c. Alien3**

Alien3 is an enemy that players can confront, having a health pool of 3. If a player manages to defeat Alien3, they will earn 300 points.

![alien3](https://github.com/ikhsandadan/stackupinvaders/assets/116878888/dca6408d-fc6e-4fce-9167-e4adf19689cb)

![Alien3](https://github.com/ikhsandadan/stackupinvaders/assets/116878888/55e08cf4-e1a8-48e3-8ea2-fb33af4cec19)


**d. Boss**

The Boss is a formidable foe, surpassing others in both size and firepower. Initially, the Boss boasts a health pool of 10, visibly represented on its body. Upon each successful defeat by a player, the Boss gains an additional 5 health. If a player manages to destroy it, they will earn points equal to 100 times the Boss's current health.

![boss](https://github.com/ikhsandadan/stackupinvaders/assets/116878888/bd3e9c16-4230-4f67-8d12-550e719e6fab)

![Boss](https://github.com/ikhsandadan/stackupinvaders/assets/116878888/5f328928-e0f8-4bb8-ab16-c5226b7d3c7c)

![BossLives](https://github.com/ikhsandadan/stackupinvaders/assets/116878888/6c597be0-9341-4a4a-9ecc-5bc0ffdfe8d5)


**3. Add Score to points dan Leaderboard**

Once the game concludes, players can convert their earned scores into points, which can be utilized to purchase NFTs. If a player achieves a sufficiently high score/points, their name will appear on the Leaderboard—a compilation of the top 10 scorers in the game.

![SubmitScore](https://github.com/ikhsandadan/stackupinvaders/assets/116878888/802ff56a-0ff8-472c-b2b9-b9b5119e0b54)

![Leaderboard](https://github.com/ikhsandadan/stackupinvaders/assets/116878888/67933c8b-7261-4dec-bbfc-f14d4f8bb616)


I accomplished this through a smart contract, employing the following method.

![Score](https://github.com/ikhsandadan/stackupinvaders/assets/116878888/951db38b-f77a-4636-84d6-d53f8d247054)


**4. Shop**

![Shop](https://github.com/ikhsandadan/stackupinvaders/assets/116878888/3e38ceff-33e4-427b-b093-48d406d95047)


The Shop is a page where players can purchase NFT Medals or acquire Points. Each player is limited to buying only one medal. Here, I've implemented metadata refresh to ensure that if the name, description, and image of the NFT are null, they will be automatically updated.

![metadata](https://github.com/ikhsandadan/stackupinvaders/assets/116878888/41491dc3-98f5-4c3d-8497-6bc0d9430ae3)


Here, I've created three NFT Medals, namely:


![1](https://github.com/ikhsandadan/stackupinvaders/assets/116878888/09e4ad1d-f802-4241-8acb-da03abee4751)

**a. Gold Medal**

The NFT that players can acquire by exchanging 1,000,000 Points.


![2](https://github.com/ikhsandadan/stackupinvaders/assets/116878888/3058882a-275f-4dff-a530-42aad4605af1)

**b. Silver Medal**

The NFT that players can acquire by exchanging 500,000 Points.


![3](https://github.com/ikhsandadan/stackupinvaders/assets/116878888/2979145b-a44a-48aa-bb10-572eefd3b327)

**b. Bronze Medal**

The NFT that players can acquire by exchanging 250,000 Points.

On this page, players can also purchase Points. There are two options for the amount of Points: 1,000,000 Points priced at 0.01 IMX and 2,000,000 Points priced at 0.02 IMX. Here, the method involves users transferring a certain amount of IMX as a fee to buy Points to the Admin Wallet.

![transferIMX](https://github.com/ikhsandadan/stackupinvaders/assets/116878888/3973bf6e-444e-4e39-8e16-cd311c881f30)

![BuyPoints](https://github.com/ikhsandadan/stackupinvaders/assets/116878888/53b3751c-fff1-42a2-8459-38f736babbbd)


**5. Profile**

This is the page that displays the player's profile. Some details presented include the Wallet address, email, balance, points, and NFT collection.

![Profile](https://github.com/ikhsandadan/stackupinvaders/assets/116878888/a179383b-27f0-440d-906d-1a09d842cc35)


Here is my explanation of StackUp Invaders that I've created. Below is a video snippet demonstrating how to play the game. Please enjoy!



https://github.com/ikhsandadan/stackupinvaders/assets/116878888/00bf7eba-df42-4c18-91f8-6c5d524d917a


