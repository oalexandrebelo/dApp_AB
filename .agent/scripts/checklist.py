#!/usr/bin/env python3
"""
Antigravity-Kit-Brabo Validation Checklist
Priority-based project validation for development workflow.

Usage:
    python checklist.py .
    python checklist.py /path/to/project
"""

import os
import sys
import subprocess
import json
from pathlib import Path
from typing import List, Tuple, Dict

# ANSI colors
class Colors:
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    BLUE = '\033[94m'
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
            timeout=300
        )
        return result.returncode, result.stdout, result.stderr
    except subprocess.TimeoutExpired:
        return 1, "", "Command timed out"
    except FileNotFoundError:
        return 1, "", f"Command not found: {cmd[0]}"

def check_secrets(project_path: str) -> Tuple[bool, str]:
    """Check for exposed secrets in code"""
    patterns = [
        r'password\s*=\s*["\'][^"\']+["\']',
        r'api_key\s*=\s*["\'][^"\']+["\']',
        r'secret\s*=\s*["\'][^"\']+["\']',
        r'AWS_SECRET',
        r'PRIVATE_KEY',
    ]
    
    issues = []
    for pattern in patterns:
        code, stdout, _ = run_command([
            'grep', '-rn', '-E', pattern,
            '--include=*.ts', '--include=*.js', '--include=*.py',
            '--exclude-dir=node_modules', '--exclude-dir=.git',
            project_path
        ])
        if stdout.strip():
            issues.append(f"Potential secret found: {pattern}")
    
    if issues:
        return False, "\n".join(issues)
    return True, "No exposed secrets found"

def check_lint(project_path: str) -> Tuple[bool, str]:
    """Run linting checks"""
    # Try npm lint
    if os.path.exists(os.path.join(project_path, 'package.json')):
        code, stdout, stderr = run_command(['npm', 'run', 'lint'], cwd=project_path)
        if code == 0:
            return True, "Lint passed"
        return False, stderr or stdout
    
    return True, "No lint configuration found (skipped)"

def check_tests(project_path: str) -> Tuple[bool, str]:
    """Run test suite"""
    if os.path.exists(os.path.join(project_path, 'package.json')):
        code, stdout, stderr = run_command(['npm', 'test', '--', '--passWithNoTests'], cwd=project_path)
        if code == 0:
            return True, "Tests passed"
        return False, stderr or stdout
    
    return True, "No test configuration found (skipped)"

def check_dependencies(project_path: str) -> Tuple[bool, str]:
    """Check for security vulnerabilities in dependencies"""
    if os.path.exists(os.path.join(project_path, 'package.json')):
        code, stdout, stderr = run_command(['npm', 'audit', '--json'], cwd=project_path)
        if code == 0:
            return True, "No vulnerabilities found"
        try:
            audit_data = json.loads(stdout)
            vulns = audit_data.get('metadata', {}).get('vulnerabilities', {})
            critical = vulns.get('critical', 0)
            high = vulns.get('high', 0)
            if critical > 0 or high > 0:
                return False, f"Found {critical} critical, {high} high vulnerabilities"
            return True, f"Found {vulns.get('moderate', 0)} moderate vulnerabilities (acceptable)"
        except json.JSONDecodeError:
            return True, "Audit completed"
    
    return True, "No package.json found (skipped)"

def check_typescript(project_path: str) -> Tuple[bool, str]:
    """Type check TypeScript files"""
    if os.path.exists(os.path.join(project_path, 'tsconfig.json')):
        code, stdout, stderr = run_command(['npx', 'tsc', '--noEmit'], cwd=project_path)
        if code == 0:
            return True, "TypeScript check passed"
        return False, stderr or stdout
    
    return True, "No TypeScript configuration found (skipped)"

def check_env(project_path: str) -> Tuple[bool, str]:
    """Check for .env file exposure"""
    env_files = ['.env', '.env.local', '.env.production']
    issues = []
    
    for env_file in env_files:
        env_path = os.path.join(project_path, env_file)
        if os.path.exists(env_path):
            # Check if it's in .gitignore
            gitignore_path = os.path.join(project_path, '.gitignore')
            if os.path.exists(gitignore_path):
                with open(gitignore_path, 'r') as f:
                    gitignore_content = f.read()
                    if env_file not in gitignore_content:
                        issues.append(f"{env_file} not in .gitignore")
            else:
                issues.append(f"No .gitignore found, {env_file} may be exposed")
    
    if issues:
        return False, "\n".join(issues)
    return True, "Environment files properly ignored"

def run_checklist(project_path: str) -> Dict[str, Tuple[bool, str]]:
    """Run all checks in priority order"""
    checks = [
        ("Security: Secrets", lambda: check_secrets(project_path)),
        ("Security: Dependencies", lambda: check_dependencies(project_path)),
        ("Security: Environment", lambda: check_env(project_path)),
        ("Quality: Lint", lambda: check_lint(project_path)),
        ("Quality: TypeScript", lambda: check_typescript(project_path)),
        ("Quality: Tests", lambda: check_tests(project_path)),
    ]
    
    results = {}
    for name, check_func in checks:
        log(Colors.BLUE, f"Running: {name}...")
        try:
            passed, message = check_func()
            results[name] = (passed, message)
            if passed:
                log(Colors.GREEN, f"  ✓ {message}")
            else:
                log(Colors.RED, f"  ✗ {message[:200]}")
        except Exception as e:
            results[name] = (False, str(e))
            log(Colors.RED, f"  ✗ Error: {e}")
    
    return results

def main():
    print()
    log(Colors.BOLD, "🚀 Antigravity-Kit-Brabo Validation Checklist")
    print()
    
    project_path = sys.argv[1] if len(sys.argv) > 1 else "."
    project_path = os.path.abspath(project_path)
    
    if not os.path.exists(project_path):
        log(Colors.RED, f"Error: Path does not exist: {project_path}")
        sys.exit(1)
    
    log(Colors.BLUE, f"Project: {project_path}")
    print()
    
    results = run_checklist(project_path)
    
    print()
    log(Colors.BOLD, "📊 Summary")
    print()
    
    passed = sum(1 for p, _ in results.values() if p)
    total = len(results)
    
    for name, (success, _) in results.items():
        status = f"{Colors.GREEN}✓{Colors.END}" if success else f"{Colors.RED}✗{Colors.END}"
        print(f"  {status} {name}")
    
    print()
    if passed == total:
        log(Colors.GREEN, f"✅ All checks passed ({passed}/{total})")
        sys.exit(0)
    else:
        log(Colors.YELLOW, f"⚠️  {passed}/{total} checks passed")
        sys.exit(1)

if __name__ == "__main__":
    main()
