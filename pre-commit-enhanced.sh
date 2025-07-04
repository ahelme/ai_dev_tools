#!/bin/bash

# Enhanced Pre-commit Hook for JS AI Development
# Integrates with existing lint-staged setup
# Add package freshness checks when ready

set -e

echo "🔍 Running enhanced pre-commit checks..."

# 1. Run existing lint-staged (ESLint + Prettier)
echo "📝 Running lint-staged..."
npx lint-staged

# 2. Run existing test suite 
echo "🧪 Running tests..."
npm run test:run

# 3. Type checking
echo "🔍 Type checking..."
npm run type-check

# 4. Security audit (current - only fails on high/critical)
echo "🔒 Security audit..."
npm audit --audit-level=high

# 5. Package freshness check (FUTURE - currently disabled)
# Uncomment when ready to enforce:
# echo "📦 Checking package freshness..."
# node scripts/check-package-freshness.js

echo "✅ All pre-commit checks passed!"