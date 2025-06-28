#!/usr/bin/env node

/**
 * Package Freshness Pre-commit Check
 * Prevents commits when dependencies are significantly outdated
 * Configurable thresholds and graceful degradation for network issues
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  // Maximum age thresholds (in days)
  MAJOR_VERSION_THRESHOLD: 365,    // 1 year for major versions
  MINOR_VERSION_THRESHOLD: 180,    // 6 months for minor versions  
  PATCH_VERSION_THRESHOLD: 90,     // 3 months for patch versions
  
  // Security thresholds
  SECURITY_VULNERABILITY_THRESHOLD: 7,  // 1 week for security fixes
  
  // Behavior options
  NETWORK_TIMEOUT: 10000,          // 10 seconds timeout for npm calls
  ALLOW_NETWORK_FAILURE: true,     // Don't block commits if npm registry is down
  VERBOSE: process.env.CI !== 'true', // Show detailed output locally, brief in CI
};

class PackageFreshnessChecker {
  constructor() {
    this.packageJsonPath = path.join(process.cwd(), 'package.json');
    this.warnings = [];
    this.errors = [];
  }

  log(message, type = 'info') {
    if (CONFIG.VERBOSE || type === 'error') {
      const prefix = type === 'error' ? '❌' : type === 'warn' ? '⚠️' : 'ℹ️';
      console.log(`${prefix} ${message}`);
    }
  }

  async checkPackageExists() {
    if (!fs.existsSync(this.packageJsonPath)) {
      this.log('No package.json found, skipping package freshness check', 'warn');
      return false;
    }
    return true;
  }

  async getOutdatedPackages() {
    try {
      this.log('Checking for outdated packages...');
      
      // Use timeout to prevent hanging
      const command = `timeout ${CONFIG.NETWORK_TIMEOUT / 1000}s npm outdated --json 2>/dev/null || true`;
      const result = execSync(command, { 
        encoding: 'utf8',
        timeout: CONFIG.NETWORK_TIMEOUT 
      });
      
      if (!result.trim()) {
        this.log('All packages are up to date! ✅');
        return {};
      }
      
      return JSON.parse(result);
    } catch (error) {
      if (CONFIG.ALLOW_NETWORK_FAILURE) {
        this.log('Network timeout or registry unavailable - allowing commit', 'warn');
        return {};
      } else {
        throw new Error(`Failed to check package versions: ${error.message}`);
      }
    }
  }

  parseVersion(version) {
    const match = version.match(/^(\d+)\.(\d+)\.(\d+)/);
    if (!match) return null;
    return {
      major: parseInt(match[1]),
      minor: parseInt(match[2]), 
      patch: parseInt(match[3])
    };
  }

  getVersionDifference(current, latest) {
    const curr = this.parseVersion(current);
    const lat = this.parseVersion(latest);
    
    if (!curr || !lat) return 'unknown';
    
    if (lat.major > curr.major) return 'major';
    if (lat.minor > curr.minor) return 'minor';
    if (lat.patch > curr.patch) return 'patch';
    return 'none';
  }

  async checkSecurityVulnerabilities() {
    try {
      this.log('Checking for security vulnerabilities...');
      
      const auditResult = execSync('npm audit --json 2>/dev/null || echo "{}"', { 
        encoding: 'utf8',
        timeout: CONFIG.NETWORK_TIMEOUT 
      });
      
      const audit = JSON.parse(auditResult);
      
      if (audit.vulnerabilities && Object.keys(audit.vulnerabilities).length > 0) {
        const highSeverity = Object.values(audit.vulnerabilities)
          .filter(vuln => ['high', 'critical'].includes(vuln.severity));
        
        if (highSeverity.length > 0) {
          this.errors.push(
            `🔒 ${highSeverity.length} high/critical security vulnerabilities found! Run 'npm audit fix' before committing.`
          );
        }
      }
    } catch (error) {
      if (!CONFIG.ALLOW_NETWORK_FAILURE) {
        this.warnings.push('Could not check security vulnerabilities');
      }
    }
  }

  analyzeOutdatedPackages(outdated) {
    const packageNames = Object.keys(outdated);
    
    if (packageNames.length === 0) return;

    this.log(`Found ${packageNames.length} outdated packages:`);

    for (const [packageName, info] of Object.entries(outdated)) {
      const versionDiff = this.getVersionDifference(info.current, info.latest);
      const message = `  ${packageName}: ${info.current} → ${info.latest} (${versionDiff})`;
      
      switch (versionDiff) {
        case 'major':
          this.warnings.push(`📦 Major version available: ${message}`);
          break;
        case 'minor':
          this.warnings.push(`📦 Minor version available: ${message}`);
          break;
        case 'patch':
          this.errors.push(`🔧 Patch version available: ${message} - Consider updating soon`);
          break;
      }
      
      this.log(message);
    }
  }

  async run() {
    try {
      if (!(await this.checkPackageExists())) {
        return 0;
      }

      // Run checks in parallel where possible
      const [outdated] = await Promise.all([
        this.getOutdatedPackages(),
        this.checkSecurityVulnerabilities()
      ]);

      this.analyzeOutdatedPackages(outdated);

      // Report results
      if (this.errors.length > 0) {
        console.log('\n🚫 Pre-commit check FAILED:');
        this.errors.forEach(error => console.log(error));
        console.log('\nPlease address these issues before committing.');
        console.log('Hint: Run "npm update" or "npm audit fix" to resolve some issues.');
        return 1;
      }

      if (this.warnings.length > 0) {
        console.log('\n⚠️  Package freshness warnings:');
        this.warnings.forEach(warning => console.log(warning));
        console.log('\nConsider updating these packages when convenient.');
      }

      if (this.warnings.length === 0 && this.errors.length === 0) {
        this.log('Package freshness check passed! ✅');
      }

      return 0;

    } catch (error) {
      console.error(`❌ Package freshness check failed: ${error.message}`);
      return CONFIG.ALLOW_NETWORK_FAILURE ? 0 : 1;
    }
  }
}

// Run the check
if (require.main === module) {
  const checker = new PackageFreshnessChecker();
  checker.run().then(exitCode => {
    process.exit(exitCode);
  });
}

module.exports = PackageFreshnessChecker;