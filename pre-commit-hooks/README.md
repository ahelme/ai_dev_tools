# 🤖 AI Development Toolkit: JS/TS/React/Next/Node

**Preventing Time-Blindness in AI-Assisted Development**

A comprehensive toolkit designed to solve the critical problem of AI models recommending outdated packages, deprecated practices, and stale dependencies due to training data cutoffs.

## 🎯 The Problem

AI programming assistants suffer from "time-blindness" - they operate on training data that may be months or years old, leading to:

- ❌ Recommending deprecated packages (e.g., Create-React-App in 2025)
- ❌ Installing outdated dependencies with security vulnerabilities
- ❌ Using obsolete best practices and patterns
- ❌ Missing critical security updates and patches

## 🛡️  The Solution

This toolkit provides **automated guardrails** that prevent time-blindness issues through:

### 1. **Real-time Package Freshness Validation**
- Pre-commit hooks that check dependency staleness
- Configurable age thresholds for major/minor/patch versions
- Automatic security vulnerability scanning
- Network-aware checks with graceful degradation

### 2. **Modern Project Templates**
- Always-current boilerplate configurations
- Pre-configured dependency management (Renovate/Dependabot)
- Built-in quality pipelines from day one
- VSCode extensions for real-time monitoring

### 3. **Development Environment Guards**
- IDE extensions showing package freshness inline
- Automated quality checks preventing stale commits
- Live registry verification during package installation

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)
```bash
# For new projects
npx @yourname/ai-dev-toolkit setup

# For existing projects
npm install --save-dev @yourname/ai-dev-toolkit
npx ai-dev-setup
```

### Option 2: Manual Installation
```bash
# 1. Install the toolkit
npm install --save-dev @yourname/ai-dev-toolkit

# 2. Setup Husky pre-commit hooks
npx husky install
echo "npx ai-dev-check" > .husky/pre-commit

# 3. Configure package.json scripts
npm pkg set scripts.quality="npm run lint:check && npm run type-check && npm run test:run"
npm pkg set scripts.outdated:check="npm outdated"
```

## 📋 Features

### Pre-commit Validation
- ✅ **Package Freshness Check**: Warns about outdated dependencies
- ✅ **Security Audit**: Blocks commits with high/critical vulnerabilities
- ✅ **Code Quality**: ESLint, Prettier, TypeScript checks
- ✅ **Test Suite**: Ensures all tests pass before commit

### IDE Integration
- ✅ **Version Lens**: Shows latest versions inline in package.json
- ✅ **Import Cost**: Displays bundle impact of dependencies
- ✅ **Security Scanner**: Real-time vulnerability detection
- ✅ **Dependency Analytics**: Package health insights

### Automation Setup
- ✅ **Dependabot/Renovate**: Automated dependency update PRs
- ✅ **GitHub Actions**: CI pipeline with dependency checks
- ✅ **Quality Scripts**: Consistent development workflows

## ⚙️ Configuration

### Package Freshness Thresholds
```javascript
// .ai-dev-config.js
module.exports = {
  thresholds: {
    major: 365,  // 1 year for major versions
    minor: 180,  // 6 months for minor versions
    patch: 90,   // 3 months for patch versions
    security: 7  // 1 week for security fixes
  },
  allowNetworkFailure: true,  // Don't block if npm registry is down
  verbose: process.env.CI !== 'true'
};
```

### VSCode Extensions (Auto-installed)
```json
{
  "recommendations": [
    "pflannery.vscode-versionlens",
    "codeandstuff.package-json-upgrade",
    "snyk-security.snyk-vulnerability-scanner",
    "redhat.fabric8-analytics",
    "wix.vscode-import-cost"
  ]
}
```

## 🏗️  Modern Project Templates

### React (2025-Current)
```bash
# Vite replaces deprecated Create-React-App
npm create vite@latest my-app -- --template react-ts
cd my-app
npx @yourname/ai-dev-toolkit setup
```

### Next.js Full-Stack
```bash
npx create-next-app@latest my-app --typescript --tailwind --app
cd my-app
npx @yourname/ai-dev-toolkit setup
```

### Node.js Backend
```bash
mkdir my-api && cd my-api
npm init -y
npx @yourname/ai-dev-toolkit setup
```

## 🔄 Development Workflow

### 1. Session Start Checklist
```bash
# Verify current state
npm run outdated:check
npm run security:audit
npm run quality
```

### 2. During Development
- Real-time package monitoring via VSCode extensions
- Automatic quality checks on file save
- Live dependency freshness indicators

### 3. Before Commit
```bash
# Automated via pre-commit hooks
npm run quality           # Code quality checks
npx ai-dev-check         # Package freshness validation
npm audit --audit-level=high  # Security scan
```

## 🎨 AI-Specific Best Practices

### For AI Programming Assistants

1. **Always verify current date** at session start
2. **Query live package registries** before recommendations
3. **Use maintained templates** rather than starting from scratch
4. **Check package.json for existing patterns** before adding dependencies
5. **Verify deprecation status** of any suggested tools/frameworks

### Template-First Development
```bash
# ❌ NEVER start from empty directory
mkdir my-app && cd my-app && npm init

# ✅ ALWAYS use current templates
npm create vite@latest my-app -- --template react-ts
```

### Live Registry Verification
```bash
# Before suggesting packages, verify current versions
npm view react versions --json
npm view @types/node versions --json
npm view vite versions --json
```

## 📊 Success Metrics

- 🎯 **Zero deprecated packages** in new projects
- 🔒 **Zero high/critical vulnerabilities** at commit time
- 📈 **Reduced technical debt** from outdated dependencies
- ⚡ **Faster onboarding** with pre-configured environments
- 🤖 **AI-resistant development** patterns

## 🤝 Contributing

We welcome contributions! This toolkit is designed to evolve with the rapidly changing JavaScript/TypeScript ecosystem.

### Development Setup
```bash
git clone https://github.com/yourname/ai-dev-toolkit
cd ai-dev-toolkit
npm install
npm test
```

### Adding New Checks
1. Add your check to `lib/checks/`
2. Update `bin/ai-dev-check.js` to include it
3. Add tests in `test/`
4. Update this README

## 📚 Related Resources

- [Renovate Documentation](https://docs.renovatebot.com/)
- [Dependabot Documentation](https://docs.github.com/en/code-security/dependabot)
- [Modern React Setup Guide (2025)](https://react.dev/learn/start-a-new-react-project)
- [VSCode Extension Marketplace](https://marketplace.visualstudio.com/)

## 📄 License

MIT License - Feel free to use this in any project to improve AI-assisted development quality.

---

**Co-authored-by: A Helme <ahelme@users.noreply.github.com> in collaboration with 🤖 Claude 4 Sonnet <support@mail.anthropic.com>**
