# Application submission

## What this is

This is a full-stack React application that demonstrates real blockchain integration without being overly complex. I wanted to create something that shows I understand both modern React patterns and Web3 development, while keeping the code clean and maintainable.

## Quick start

### Prerequisites

Node.js 20+ and npm. That's pretty much it. If you get some errors, try `npm install --legacy-peer-deps`, this should fix it.

### Installation

```bash
# Clone and install
git clone https://github.com/wonderland-quests/Leo-front.git
cd Leo-front
npm i

# Start development
npm run dev
```

Open `http://localhost:3000` and you should see the landing page with the animated globe.

### Environment setup

The app works out of the box with Ethereum Sepolia testnet. If you want to use different networks or contracts, you can configure them in `src/lib/wagmi.ts` and `src/lib/contracts.ts`.

## Key architecture decisions

### Why I chose this stack

- NextJS 15: Because I wanted server side rendering for the landing page SEO, and the new app router is pretty sweet for organizing routes.

- TypeScript: Non negotiable for any serious React app. Catches so many bugs before they happen.

- Zustand over Redux: Way less boilerplate, easier to understand, and perfect for this size of application. I split the store into slices to keep things organized.

- Wagmi + RainbowKit: The current gold standard for Web3 React-based apps. Wagmi handles all the blockchain complexity, RainbowKit gives us beautiful wallet UI out of the box. Been working with both for a while, so I'm pretty familiar with them.

- TailwindCSS: Rapid development, consistent design system, and smaller bundle size than component libraries. I'm a big fan of it.

### Folder organization

I structured this like a real production app, althought I know that every company has its own way of doing things:

```
src/
  app/           # Next.js 15+ appRouter pages
  components/    # Reusable ui components (of course I know that I could componentize until the infinite)
  lib/
    hooks/       # Custom hooks (walletsync, lenis, balance)
    store/       # Zustand state management
    contracts/   # abi and contract interaction logic
  styles/        # TailwindCSS
  test/          # Unit tests
```

The idea is that each folder has a single responsibility.

### Web3 integration approach

I wanted to show I understand proper Web3 patterns:

- Error handling: Custom error mapper that translates cryptic blockchain errors into user-friendly messages
- Transaction state: Full lifecycle tracking (initiated > pending > success|failed), everything is in-memory, I could use some external provider like etherscan API, Graphql, some other JSON-RPC, etc., but I wanted to keep it simple for the sake of demoing. -
- Real-time updates Balance updates via both polling and event watching
- Proper typing: blockchain calls are properly typed with TypeScript. Can it be done better? Sure, I could extended the wagmi usage, but would need more time!

### The Globe component

This was honestly just for fun, but also to show I can work with complex libraries like Three.js. It's a particle system that goes through different animation phases - spiral formation, sphere, rotation, and a little "supernova" effect. Overkill? Maybe, Wow factor? Definitely :)

### Custom theming

I added three: classic light and dark, plus a reading mode inspired by old school sepia notepads (ZBLOP: zero blue light on premise).

### Landing page

The landing page is mostly eye candy, scroll down to see the tech stack cards animate in. Click "Step into the app" to go to the application.

### Blockchain features

1. Connect Wallet: Click the wallet button in the navbar (RainbowKit handles this beautifully)

2. Mint Tokens:

   - Select a token from the dropdown
   - Enter amount to mint
   - Confirm transaction in your wallet
   - Watch your balance update in real-time

3. Transfer Tokens:

   - Choose token and recipient address
   - Enter amount (with balance validation)
   - Approve spending if needed (automatic detection)
   - Send transfer

4. View History:

   - Events tab shows all your transactions
   - Real-time status updates
   - Links to Etherscan for details

5. Error handling: had some issues with the error mapper, so I added a custom error handler that shows a toast with a user friendly message.

## Development features

### Code quality tools

- ESLint+Prettier: Consistent code style
- Husky: Precommit hooks to catch issues
- TypeScript: Strict mode enabled
- Vitest: Unit testing setup (though I focused more on the app itself)

### Development workflow

```bash
# Development with hot reload
npm run dev

# Build for production
npm run build

# Run linter
npm run lint

# Run tests
npm run test
```

## Solved technical challenges

### State management

Managing blockchain state is tricky, you have UI state, wallet state, transaction state, and token state all interacting. I solved this with Zustand slices that can cross-reference each other..

### Error handling

Blockchain errors are terrible for users. I built a not-so-comprehensive error mapping system that translates technical errors like "execution reverted" into messages like "insufficient funds" or "transaction cancelled by user". There are some uncovered edge cases, but it's a good start.

### Real-time balance updates

Balances need to update when transactions complete, but also when other users send you tokens. I use a combination of polling (every 10 seconds) and user-event watching for instant updates. In production, I would use a JSON-RPC provider like Alchemy or Infura, websockets, or a GraphQL API.

## Notes for reviewers

When I switched from the backend role to full-stack, I took this new challenge as a chance to demonstrate both my frontend engineering skills and product thinking. Instead of rushing through it, I treated it as a mini real-world project.

Over the course of these weeks, I worked steadily (2h every other day), delivering consistent progress with structured commits and PRs. I focused on crafting a strong user experience, including polished UI, theme handling, and advanced animations using Three.js, going beyond what was strictly required, because that’s how I enjoy working.

---

Thanks for reading!

Built with ❤️ by @EthSagan

Update: as no answer has not been received for a while, I'm moving this project to my repo.
