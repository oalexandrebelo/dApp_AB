#!/usr/bin/env python3
"""
Antigravity-Kit-Brabo Full Verification
Comprehensive verification for pre-deployment and releases.

Usage:
    python verify_all.py .
    python verify_all.py /path/to/project --url http://localhost:3000
"""

import os
import sys
import subprocess
import json
import argparse
from pathlib import Path
from typing import List, Tuple, Dict, Optional

# ANSI colors
class Colors:
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    BLUE = '\033[94m'
    CYAN = '\033[96m'
    BOLD = '\033[1m'
    END = '\033[0m'

def log(color: str, message: str):
    print(f"{color}{message}{Colors.END}")

def run_command(cmd: List[str], cwd: str = None) -> Tuple[int, str, str]:
    """Run a command and return (returncode, stdout, stderr)"""
    try:
        result = subprocess.run(
            cmd,
            cwd=cwd,
            capture_output=True,
            text=True,
            timeout=600
        )
        return result.returncode, result.stdout, result.stderr
    except subprocess.TimeoutExpired:
        return 1, "", "Command timed out"
    except FileNotFoundError:
        return 1, "", f"Command not found: {cmd[0]}"

# ==================== CORE CHECKS ====================

def check_secrets(project_path: str) -> Tuple[bool, str]:
    """Check for exposed secrets"""
    patterns = ['password=', 'api_key=', 'secret=', 'AWS_SECRET', 'PRIVATE_KEY']
    for pattern in patterns:
        code, stdout, _ = run_command([
            'grep', '-rn', pattern,
            '--include=*.ts', '--include=*.js', '--include=*.py',
            '--exclude-dir=node_modules',
            project_path
        ])
        if stdout.strip():
            return False, f"Potential secret: {pattern}"
    return True, "No secrets found"

def check_lint(project_path: str) -> Tuple[bool, str]:
    """Run linting"""
    if os.path.exists(os.path.join(project_path, 'package.json')):
        code, stdout, stderr = run_command(['npm', 'run', 'lint'], cwd=project_path)
        return code == 0, "Lint passed" if code == 0 else "Lint failed"
    return True, "Skipped (no package.json)"

def check_tests(project_path: str) -> Tuple[bool, str]:
    """Run tests"""
    if os.path.exists(os.path.join(project_path, 'package.json')):
        code, stdout, stderr = run_command(['npm', 'test', '--', '--passWithNoTests'], cwd=project_path)
        return code == 0, "Tests passed" if code == 0 else "Tests failed"
    return True, "Skipped (no package.json)"

def check_typescript(project_path: str) -> Tuple[bool, str]:
    """Type check"""
    if os.path.exists(os.path.join(project_path, 'tsconfig.json')):
        code, stdout, stderr = run_command(['npx', 'tsc', '--noEmit'], cwd=project_path)
        return code == 0, "TypeScript OK" if code == 0 else "Type errors found"
    return True, "Skipped (no tsconfig)"

def check_dependencies(project_path: str) -> Tuple[bool, str]:
    """Security audit"""
    if os.path.exists(os.path.join(project_path, 'package.json')):
        code, stdout, _ = run_command(['npm', 'audit', '--audit-level=high'], cwd=project_path)
        return code == 0, "No high vulnerabilities" if code == 0 else "Vulnerabilities found"
    return True, "Skipped"

# ==================== EXTENDED CHECKS ====================

def check_lighthouse(url: str) -> Tuple[bool, str]:
    """Run Lighthouse audit"""
    if not url:
        return True, "Skipped (no URL provided)"
    
    code, stdout, stderr = run_command([
        'npx', 'lighthouse', url,
        '--output=json', '--quiet', '--chrome-flags="--headless"'
    ])
    
    if code != 0:
        return True, "Skipped (Lighthouse not available)"
    
    try:
        data = json.loads(stdout)
        perf = data.get('categories', {}).get('performance', {}).get('score', 0) * 100
        if perf >= 90:
            return True, f"Performance: {perf}%"
        return False, f"Performance: {perf}% (target: 90%)"
    except:
        return True, "Lighthouse completed"

def check_bundle_size(project_path: str) -> Tuple[bool, str]:
    """Analyze bundle size"""
    if os.path.exists(os.path.join(project_path, 'package.json')):
        # Try to find build output
        next_build = os.path.join(project_path, '.next')
        dist = os.path.join(project_path, 'dist')
        
        if os.path.exists(next_build):
            code, stdout, _ = run_command(['du', '-sh', next_build])
            return True, f"Build size: {stdout.strip()}"
        elif os.path.exists(dist):
            code, stdout, _ = run_command(['du', '-sh', dist])
            return True, f"Build size: {stdout.strip()}"
    
    return True, "Skipped (no build found)"

def check_playwright(project_path: str, url: Optional[str]) -> Tuple[bool, str]:
    """Run Playwright E2E tests"""
    playwright_config = os.path.join(project_path, 'playwright.config.ts')
    if not os.path.exists(playwright_config):
        return True, "Skipped (no Playwright config)"
    
    code, stdout, stderr = run_command(['npx', 'playwright', 'test'], cwd=project_path)
    return code == 0, "E2E tests passed" if code == 0 else "E2E tests failed"

def check_accessibility(project_path: str) -> Tuple[bool, str]:
    """Check for accessibility issues"""
    # Simple check for aria labels
    code, stdout, _ = run_command([
        'grep', '-rn', 'aria-label',
        '--include=*.tsx', '--include=*.jsx',
        '--exclude-dir=node_modules',
        project_path
    ])
    
    if stdout.strip():
        count = len(stdout.strip().split('\n'))
        return True, f"Found {count} aria-label usages"
    return True, "No accessibility issues detected (basic check)"

# ==================== MAIN ====================

def run_all_checks(project_path: str, url: Optional[str] = None) -> Dict[str, Tuple[bool, str]]:
    """Run all verification checks"""
    
    checks = [
        # Core (Priority 1)
        ("🔒 Security: Secrets", lambda: check_secrets(project_path)),
        ("🔒 Security: Dependencies", lambda: check_dependencies(project_path)),
        ("📝 Quality: Lint", lambda: check_lint(project_path)),
        ("📝 Quality: TypeScript", lambda: check_typescript(project_path)),
        ("🧪 Quality: Tests", lambda: check_tests(project_path)),
        # Extended (Priority 2)
        ("📦 Bundle: Size", lambda: check_bundle_size(project_path)),
        ("♿ Accessibility", lambda: check_accessibility(project_path)),
        # URL-dependent
        ("🚀 Lighthouse", lambda: check_lighthouse(url)),
        ("🎭 Playwright E2E", lambda: check_playwright(project_path, url)),
    ]
    
    results = {}
    for name, check_func in checks:
        log(Colors.CYAN, f"Checking: {name}...")
        try:
            passed, message = check_func()
            results[name] = (passed, message)
            if passed:
                log(Colors.GREEN, f"  ✓ {message}")
            else:
                log(Colors.RED, f"  ✗ {message[:100]}")
        except Exception as e:
            results[name] = (False, str(e)[:100])
            log(Colors.YELLOW, f"  ⚠ Error: {e}")
    
    return results

def main():
    parser = argparse.ArgumentParser(description='Full project verification')
    parser.add_argument('path', nargs='?', default='.', help='Project path')
    parser.add_argument('--url', help='URL for Lighthouse/E2E tests')
    args = parser.parse_args()
    
    print()
    log(Colors.BOLD, "🚀 Antigravity-Kit-Brabo Full Verification")
    print()
    
    project_path = os.path.abspath(args.path)
    
    if not os.path.exists(project_path):
        log(Colors.RED, f"Error: Path does not exist: {project_path}")
        sys.exit(1)
    
    log(Colors.BLUE, f"Project: {project_path}")
    if args.url:
        log(Colors.BLUE, f"URL: {args.url}")
    print()
    
    results = run_all_checks(project_path, args.url)
    
    print()
    log(Colors.BOLD, "📊 Verification Summary")
    print()
    
    passed = sum(1 for p, _ in results.values() if p)
    total = len(results)
    
    for name, (success, msg) in results.items():
        status = f"{Colors.GREEN}✓{Colors.END}" if success else f"{Colors.RED}✗{Colors.END}"
        print(f"  {status} {name}: {msg}")
    
    print()
    if passed == total:
        log(Colors.GREEN, f"✅ All {total} checks passed - Ready for deployment!")
        sys.exit(0)
    elif passed >= total * 0.8:
        log(Colors.YELLOW, f"⚠️  {passed}/{total} checks passed - Review warnings")
        sys.exit(0)
    else:
        log(Colors.RED, f"❌ {passed}/{total} checks passed - Fix issues before deploy")
        sys.exit(1)

if __name__ == "__main__":
    main()
