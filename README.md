# CRA Started with Smart Contract development.

Includes a working demo of client and smart contract integrated together.

## Client

- Create React App
- Styles - Tailwind + Chakra UI You can delete chakra or tailwind. Up to you
- Web3 - Quiver (https://www.npmjs.com/package/@raidguild/quiver)
- DX - Typescript, eslint, prettier
- Utilities - Moment.js, react-hot-toast, lodash, date-fns, etc.

## Smart Contract

- Hardhat
- DX - Typechain, Typescript, eslint, prettier
- Testing - Waffle, Chai, Mocha
- Scripts - deploy, verification
- Compilation - Generates the types directly in the client directory.

## How to use

1. Clone the repo
2. In both sc and client folders install deps (yarn install)
3. In the sc directory, look at the package.json and remove the network in the deploy and verify scripts to deploy on hardhart.
4. Run a hardhat node (npx hardhat node)
5. Deploy to hardhat
6. In the client folder, start the application
7. In the Home page /components/pages/Home enter the deployed contract address
8. Now you should be able to connect and see the message in the UI.
