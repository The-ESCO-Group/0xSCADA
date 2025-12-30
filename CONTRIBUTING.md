# Contributing to 0xSCADA

Thank you for your interest in contributing to 0xSCADA! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Making Changes](#making-changes)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)

## Code of Conduct

This project adheres to a code of conduct. By participating, you are expected to uphold this code. Please be respectful and constructive in all interactions.

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 15+
- Git

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/0xSCADA.git
   cd 0xSCADA
   ```
3. Add upstream remote:
   ```bash
   git remote add upstream https://github.com/The-ESCO-Group/0xSCADA.git
   ```

## Development Setup

### Install Dependencies

```bash
npm install
```

### Environment Configuration

Copy the example environment file:
```bash
cp .env.example .env
```

Configure the following variables:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/oxscada
HARDHAT_RPC_URL=http://127.0.0.1:8545
```

### Database Setup

Push the schema to your database:
```bash
npm run db:push
```

### Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5000`.

## Project Structure

```
0xSCADA/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── pages/         # Page components
│   │   ├── lib/           # Utilities and API client
│   │   └── hooks/         # Custom React hooks
├── server/                 # Express backend
│   ├── blueprints/        # Code generation engine
│   │   ├── code-generator.ts
│   │   ├── rockwell-adapter.ts
│   │   ├── siemens-adapter.ts
│   │   └── parsers/
│   ├── routes.ts          # API routes
│   └── storage.ts         # Database operations
├── shared/                 # Shared types and schema
│   └── schema.ts          # Drizzle ORM schema
├── contracts/             # Solidity smart contracts
└── docs/                  # Documentation
```

## Making Changes

### Branch Naming

Use descriptive branch names:
- `feature/add-vendor-support`
- `fix/code-generation-bug`
- `docs/update-api-reference`

### Creating a Branch

```bash
git checkout -b feature/your-feature-name
```

### Commit Messages

Follow conventional commits:
```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance

Examples:
```
feat(blueprints): add ABB vendor adapter
fix(codegen): correct data type mapping for TIME
docs(api): update endpoint documentation
```

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Enable strict mode
- Define explicit types (avoid `any`)
- Use interfaces for object shapes

```typescript
// Good
interface ControlModuleType {
  id: string;
  name: string;
  inputs: IODefinition[];
}

// Avoid
const cm: any = { ... };
```

### React Components

- Use functional components with hooks
- Use TypeScript for props
- Keep components focused and small

```tsx
interface StatCardProps {
  label: string;
  value: number;
  icon: React.ElementType;
}

function StatCard({ label, value, icon: Icon }: StatCardProps) {
  return (
    <div className="...">
      <Icon className="..." />
      <span>{value}</span>
      <span>{label}</span>
    </div>
  );
}
```

### API Routes

- Use async/await
- Handle errors with try/catch
- Return consistent response formats

```typescript
app.get("/api/resource", async (req, res) => {
  try {
    const data = await storage.getResource();
    res.json(data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to fetch resource" });
  }
});
```

### Database

- Use Drizzle ORM for all database operations
- Define schema in `shared/schema.ts`
- Use transactions for multi-step operations

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage
```

### Writing Tests

Place tests in `__tests__` directories or use `.test.ts` suffix:

```typescript
import { describe, it, expect } from 'vitest';

describe('CodeGenerator', () => {
  it('should generate valid SCL code', () => {
    const result = generateSCL(mockCMType);
    expect(result).toContain('FUNCTION_BLOCK');
  });
});
```

### Test Categories

1. **Unit Tests**: Test individual functions/components
2. **Integration Tests**: Test API endpoints
3. **E2E Tests**: Test complete user flows

## Submitting Changes

### Pull Request Process

1. Update your fork:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. Push your branch:
   ```bash
   git push origin feature/your-feature-name
   ```

3. Create a Pull Request on GitHub

4. Fill out the PR template:
   - Description of changes
   - Related issues
   - Testing performed
   - Screenshots (if UI changes)

### PR Requirements

- [ ] All tests pass
- [ ] Code follows style guidelines
- [ ] Documentation updated (if needed)
- [ ] No merge conflicts
- [ ] Reviewed by at least one maintainer

### Review Process

1. Automated checks run (lint, tests)
2. Maintainer reviews code
3. Address feedback
4. Merge when approved

## Adding New Vendors

To add support for a new PLC vendor:

1. Create adapter in `server/blueprints/`:
   ```typescript
   // server/blueprints/new-vendor-adapter.ts
   export class NewVendorAdapter {
     generateControlModule(cm: ControlModuleType): string { ... }
     generatePhase(phase: PhaseType): string { ... }
   }
   ```

2. Add data type mappings in `seed-database.ts`

3. Register in code generator:
   ```typescript
   // code-generator.ts
   case 'new-vendor':
     return new NewVendorAdapter().generateControlModule(cm);
   ```

4. Add tests for the new adapter

5. Update documentation

## Questions?

- Open an issue for bugs or feature requests
- Start a discussion for questions
- Check existing issues before creating new ones

Thank you for contributing! 🎉
