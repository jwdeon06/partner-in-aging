# Partner in Aging

## Development Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd partner-in-aging
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```
Then edit `.env` with your actual configuration values.

4. Start the development server:
```bash
npm run dev
```

## Git Workflow

We use conventional commits for clear and standardized commit messages. Each commit message should follow this format:

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or modifying tests
- `chore`: Build process, dependencies, etc
- `ci`: CI/CD changes
- `revert`: Revert changes

Example:
```bash
git commit -m "feat(auth): add user authentication flow"
```

## Code Quality

- ESLint and Prettier are configured for code quality and formatting
- Husky is set up with pre-commit hooks to:
  - Run linting
  - Format code
  - Validate commit messages
- Run tests before pushing:
```bash
npm test
```

## Branch Strategy

1. Create feature branches from `main`:
```bash
git checkout -b feature/your-feature-name
```

2. Make your changes and commit using conventional commits

3. Push your branch and create a Pull Request

4. After review and approval, merge into `main`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm test` - Run tests
- `npm run test:coverage` - Run tests with coverage report