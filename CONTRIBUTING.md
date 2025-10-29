# Contributing to TikTok Trainer

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to the project.

## Getting Started

1. **Fork the repository**
2. **Clone your fork**
   ```bash
   git clone https://github.com/your-username/tiktok-trainer-v2.git
   cd tiktok-trainer-v2
   ```
3. **Install dependencies**
   ```bash
   npm install
   ```
4. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### Code Style

- Use TypeScript for all new files
- Follow the existing code structure
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused

### Component Guidelines

```typescript
// Use functional components with TypeScript
interface MyComponentProps {
  title: string;
  onPress: () => void;
}

export const MyComponent: React.FC<MyComponentProps> = ({ title, onPress }) => {
  // Component logic
  return (
    // JSX
  );
};
```

### Styling

- Use the theme constants from `src/constants/theme.ts`
- Create StyleSheet at the bottom of component files
- Follow existing spacing and color patterns
- Ensure responsive design

### State Management

- Use Zustand store for global state (`src/store/useAppStore.ts`)
- Use local state for component-specific data
- Keep state minimal and derived values computed

## Types of Contributions

### 🐛 Bug Fixes

1. Check existing issues first
2. Create an issue if one doesn't exist
3. Reference the issue in your PR
4. Include steps to reproduce
5. Add tests if applicable

### ✨ New Features

1. Open an issue to discuss the feature first
2. Wait for approval before starting work
3. Keep features focused and atomic
4. Update documentation
5. Add examples in comments

### 📝 Documentation

- Fix typos and grammar
- Add examples and clarifications
- Improve README sections
- Add code comments
- Create tutorials

### 🎨 UI/UX Improvements

- Follow existing design patterns
- Ensure accessibility
- Test on multiple devices
- Provide before/after screenshots

## Pull Request Process

1. **Update your branch**
   ```bash
   git fetch origin
   git rebase origin/main
   ```

2. **Test your changes**
   ```bash
   npm start
   # Test on iOS/Android
   ```

3. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

   Use conventional commit messages:
   - `feat:` New feature
   - `fix:` Bug fix
   - `docs:` Documentation changes
   - `style:` Code style changes (formatting)
   - `refactor:` Code refactoring
   - `test:` Adding tests
   - `chore:` Maintenance tasks

4. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create a Pull Request**
   - Provide a clear description
   - Reference related issues
   - Add screenshots for UI changes
   - List any breaking changes

## Project Structure

```
src/
├── components/      # Reusable UI components
├── constants/       # Theme, badges, prompts
├── navigation/      # Navigation setup
├── screens/         # Screen components
├── services/        # Business logic
├── store/          # State management
└── types/          # TypeScript definitions
```

## Adding New Features

### Adding a New Screen

1. Create file in `src/screens/`
2. Add navigation in `src/navigation/RootNavigator.tsx`
3. Update types if needed
4. Add to bottom tab or stack as appropriate

### Adding a New Service

1. Create file in `src/services/`
2. Export functions with clear names
3. Add JSDoc comments
4. Handle errors gracefully
5. Update store if needed

### Adding New Badges

1. Add definition to `src/constants/badges.ts`
2. Implement unlock logic in `src/services/badgeService.ts`
3. Test unlock conditions
4. Update documentation

### Adding Prompt Templates

1. Add to `src/constants/prompts.ts`
2. Follow existing structure
3. Keep prompts conversational
4. Test with activities

## Testing

### Manual Testing Checklist

- [ ] Test on iOS (if available)
- [ ] Test on Android (if available)
- [ ] Test all user flows
- [ ] Check accessibility
- [ ] Verify error handling
- [ ] Test edge cases

### Future: Automated Testing

We plan to add:
- Unit tests (Jest)
- Integration tests
- E2E tests (Detox)

## Code Review

Your PR will be reviewed for:

- **Functionality**: Does it work as intended?
- **Code Quality**: Is it readable and maintainable?
- **Performance**: Is it efficient?
- **Design**: Does it match the app's style?
- **Documentation**: Is it well-documented?

## Questions?

- Open an issue for questions
- Check existing documentation
- Review code examples

## Recognition

Contributors will be:
- Listed in README
- Mentioned in release notes
- Credited in app (future feature)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to TikTok Trainer! 🎉

