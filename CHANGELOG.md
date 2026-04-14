# Changelog

All notable changes to D.O.U.B.L.E will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0] - 2026-04-14

### Added
- Initial release of D.O.U.B.L.E (Discord Operations for User-Based Logic and Execution)
- Full Discord user account API wrapper
- Smart rate limiting with human-like delays
- Comprehensive safety features with risk assessment
- Token validation and security features
- Event system for real-time updates
- REST API wrapper with 13 endpoint categories:
  - Account operations
  - Relationship management
  - Guild operations
  - Channel management
  - User operations
  - Voice control
  - Application management
  - Billing operations
  - Webhook support
  - Interaction handling (slash commands, buttons)
  - Emoji management
  - Sticker support
  - Thread operations
- Custom error types (APIError, RateLimitError, TokenError, SafetyError, ConnectionError, ValidationError, EmergencyStopError)
- TypeScript type definitions
- Comprehensive logging with sensitive data masking
- 6 example files demonstrating common use cases
- Full API documentation

### Security Features
- Environment variable enforcement (no hardcoded tokens)
- Per-endpoint and global rate limiting
- Automatic cooldowns between similar actions
- Risk assessment for all actions
- Emergency stop for high-risk operations
- Audit logging for all account modifications
- Safety levels: strict, moderate, permissive

### Performance
- Memory leak fixes in WebSocket event listeners
- Proper cleanup of rate limiter and safety manager data
- Periodic cleanup of audit logs and action timestamps
- Efficient retry logic with exponential backoff
- Global vs local rate limit detection

### Error Handling
- Comprehensive HTTP status code handling (400, 401, 403, 404, 429, 500, 502, 503, 504)
- Automatic retry for temporary failures
- Network error detection and recovery
- Proper error types for different failure scenarios
- Detailed logging for debugging

### Documentation
- README with usage examples and safety warnings
- Comprehensive API documentation
- CONTRIBUTING guide
- MIT License with attribution requirement

## Versioning Policy

D.O.U.B.L.E follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

### Version Format: MAJOR.MINOR.PATCH

- **MAJOR**: Incompatible API changes
- **MINOR**: Backwards-compatible functionality additions
- **PATCH**: Backwards-compatible bug fixes

### Release Types

**Major Release (X.0.0)**
- Breaking changes to public API
- Removal of deprecated features
- Major architectural changes

**Minor Release (0.X.0)**
- New features (backwards compatible)
- New endpoint categories
- Enhanced safety features
- Additional error types

**Patch Release (0.0.X)**
- Bug fixes
- Performance improvements
- Security patches
- Documentation updates
- Memory leak fixes
- Rate limit adjustments

### Pre-Release Versions

Pre-release versions may be denoted with a hyphen and an identifier:
- `0.1.0-alpha.1`
- `0.1.0-beta.1`
- `0.1.0-rc.1`

### Development Version

Development versions are denoted as:
- `0.1.0-dev`
- `0.1.0-dev.20260414`

### Release Process

1. Update version in `package.json`
2. Update CHANGELOG.md with release notes
3. Run full test suite
4. Commit changes with version number
5. Create git tag
6. Publish to npm

### Branch Strategy

- `main`: Stable releases
- `develop`: Development branch
- `feature/*`: Feature branches
- `fix/*`: Bug fix branches
- `release/*`: Release preparation branches

### Deprecation Policy

Features will be deprecated for at least one minor version before removal.
Deprecation notices will be added to documentation and logs.
