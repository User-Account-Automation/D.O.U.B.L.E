# Contributing to D.O.U.B.L.E

Thanks for your interest in contributing to D.O.U.B.L.E. This is a personal project for automating Discord user accounts, and contributions are welcome.

## Development Setup

1. Fork the repository
2. Clone your fork
3. Install dependencies: `npm install`
4. Copy `.env.example` to `.env` and add your Discord token
5. Run tests: `npm test`
6. Run linter: `npm run lint`
7. Format code: `npm run format`

## Code Style

- Use 2 spaces for indentation
- Use single quotes
- Always use semicolons
- Follow ESLint rules
- Write clear, human-readable code

## Safety Features

This library prioritizes user account safety. When contributing:

- Never remove or weaken safety features
- Always add risk assessment for new actions
- Include proper rate limiting for new endpoints
- Document any security implications
- Test safety features work correctly

## Adding New Features

1. Create a feature branch
2. Implement the feature with safety checks
3. Add tests for the new functionality
4. Update documentation
5. Submit a pull request

## Important Notes

- Self-bots violate Discord Terms of Service
- This library is for educational purposes
- Always prioritize user safety over convenience
- Document any risks or limitations

## License

By contributing, you agree that your code will be licensed under the MIT License.
