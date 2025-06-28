#!/usr/bin/env node

/**
 * AI Development Project Setup
 * Automatically configures fresh projects with time-blindness prevention tools
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class AIDevProjectSetup {
  constructor() {
    this.projectRoot = process.cwd();
    this.packageJsonPath = path.join(this.projectRoot, 'package.json');
  }

  log(message, type = 'info') {
    const prefix = type === 'error' ? '❌' : type === 'warn' ? '⚠️' : type === 'success' ? '✅' : 'ℹ️';
    console.log(`${prefix} ${message}`);
  }

  checkPrerequisites() {
    if (!fs.existsSync(this.packageJsonPath)) {
      throw new Error('No package.json found. Run this from a Node.js project root.');
    }

    // Check if npm is available
    try {
      execSync('npm --version', { stdio: 'ignore' });
    } catch {
      throw new Error('npm is not available. Please install Node.js and npm.');
    }
  }

  setupHusky() {
    this.log('Setting up Husky pre-commit hooks...');
    
    try {
      // Install husky if not already installed
      execSync('npm install --save-dev husky', { stdio: 'inherit' });
      
      // Initialize husky
      execSync('npx husky install', { stdio: 'inherit' });
      
      // Create pre-commit hook
      const preCommitContent = `#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# AI Development Enhanced Pre-commit
npx ai-dev-check
npx lint-staged`;

      fs.writeFileSync('.husky/pre-commit', preCommitContent);
      execSync('chmod +x .husky/pre-commit');
      
      this.log('Husky pre-commit hooks configured', 'success');
    } catch (error) {
      this.log(`Failed to setup Husky: ${error.message}`, 'error');
    }
  }

  setupLintStaged() {
    this.log('Configuring lint-staged...');
    
    const packageJson = JSON.parse(fs.readFileSync(this.packageJsonPath, 'utf8'));
    
    if (!packageJson['lint-staged']) {
      packageJson['lint-staged'] = {
        "*.{ts,tsx,js,jsx}": [
          "eslint --fix",
          "prettier --write"
        ],
        "*.{json,md,css}": [
          "prettier --write"  
        ]
      };
      
      fs.writeFileSync(this.packageJsonPath, JSON.stringify(packageJson, null, 2));
      this.log('lint-staged configuration added to package.json', 'success');
    } else {
      this.log('lint-staged already configured', 'info');
    }
  }

  setupDependabot() {
    this.log('Setting up Dependabot configuration...');
    
    const dependabotDir = path.join(this.projectRoot, '.github');
    const dependabotFile = path.join(dependabotDir, 'dependabot.yml');
    
    if (!fs.existsSync(dependabotDir)) {
      fs.mkdirSync(dependabotDir, { recursive: true });
    }
    
    const dependabotConfig = `version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 5
    reviewers:
      - "@me"
    assignees:
      - "@me"
    commit-message:
      prefix: "chore"
      include: "scope"`;

    fs.writeFileSync(dependabotFile, dependabotConfig);
    this.log('Dependabot configuration created', 'success');
  }

  setupQualityScripts() {
    this.log('Adding quality scripts to package.json...');
    
    const packageJson = JSON.parse(fs.readFileSync(this.packageJsonPath, 'utf8'));
    
    const qualityScripts = {
      "quality": "npm run lint:check && npm run format:check && npm run type-check && npm run test:run",
      "quality:fix": "npm run lint && npm run format && npm run test:run",
      "outdated:check": "npm outdated",
      "security:audit": "npm audit --audit-level=moderate"
    };

    packageJson.scripts = { ...packageJson.scripts, ...qualityScripts };
    
    fs.writeFileSync(this.packageJsonPath, JSON.stringify(packageJson, null, 2));
    this.log('Quality scripts added to package.json', 'success');
  }

  createVSCodeSettings() {
    this.log('Creating VSCode settings for dependency monitoring...');
    
    const vscodeDir = path.join(this.projectRoot, '.vscode');
    const settingsFile = path.join(vscodeDir, 'settings.json');
    
    if (!fs.existsSync(vscodeDir)) {
      fs.mkdirSync(vscodeDir);
    }
    
    const vscodeSettings = {
      "editor.codeActionsOnSave": {
        "source.fixAll.eslint": true
      },
      "editor.formatOnSave": true,
      "typescript.preferences.includePackageJsonAutoImports": "auto",
      "npm.enableScriptExplorer": true
    };
    
    const extensionsFile = path.join(vscodeDir, 'extensions.json');
    const recommendedExtensions = {
      "recommendations": [
        "pflannery.vscode-versionlens",
        "codeandstuff.package-json-upgrade", 
        "snyk-security.snyk-vulnerability-scanner",
        "redhat.fabric8-analytics",
        "wix.vscode-import-cost"
      ]
    };
    
    fs.writeFileSync(settingsFile, JSON.stringify(vscodeSettings, null, 2));
    fs.writeFileSync(extensionsFile, JSON.stringify(recommendedExtensions, null, 2));
    
    this.log('VSCode settings and extension recommendations created', 'success');
  }

  async run() {
    try {
      this.log('🚀 Setting up AI Development toolkit...');
      
      this.checkPrerequisites();
      this.setupHusky();
      this.setupLintStaged();
      this.setupDependabot();
      this.setupQualityScripts();
      this.createVSCodeSettings();
      
      this.log('🎉 AI Development toolkit setup complete!', 'success');
      this.log('');
      this.log('Next steps:');
      this.log('1. Install recommended VSCode extensions');
      this.log('2. Run "npm run quality" to verify setup');
      this.log('3. Enable Dependabot in your GitHub repository');
      this.log('4. Make your first commit to test pre-commit hooks');
      
    } catch (error) {
      this.log(`Setup failed: ${error.message}`, 'error');
      process.exit(1);
    }
  }
}

if (require.main === module) {
  const setup = new AIDevProjectSetup();
  setup.run();
}

module.exports = AIDevProjectSetup;
