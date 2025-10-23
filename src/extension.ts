import * as vscode from 'vscode';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

interface PrerequisiteCheck {
  name: string;
  passed: boolean;
  message: string;
  critical: boolean;
}

/**
 * Activates the Garmin MCP VS Code extension
 */
export async function activate(context: vscode.ExtensionContext) {
  console.log('Garmin MCP Extension is activating...');

  try {
    // Run prerequisite checks
    const checks = await runPrerequisiteChecks();
    const result = await showPrerequisiteResults(checks);

    if (!result.canProceed) {
      console.log('Garmin MCP Extension: Prerequisites not met, activation paused');
      return;
    }

    // Register the MCP server with the Language Model API
    await registerMcpServer(context);

    console.log('Garmin MCP Extension activated successfully');
  } catch (error) {
    console.error('Garmin MCP Extension activation failed:', error);
    vscode.window.showErrorMessage(
      `Garmin MCP Extension failed to activate: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Runs all prerequisite checks
 */
async function runPrerequisiteChecks(): Promise<PrerequisiteCheck[]> {
  const checks: PrerequisiteCheck[] = [];

  // Check 1: Garmin credentials configured
  const credentialsCheck = await checkCredentials();
  checks.push(credentialsCheck);

  // Check 2: Server command available
  const serverCheck = await checkServerCommand();
  checks.push(serverCheck);

  return checks;
}

/**
 * Check if Garmin Connect credentials are configured
 */
async function checkCredentials(): Promise<PrerequisiteCheck> {
  const config = vscode.workspace.getConfiguration('garminMcp');
  const email = config.get<string>('email', '').trim();
  const password = config.get<string>('password', '').trim();

  if (!email || !password) {
    return {
      name: 'Garmin Connect Credentials',
      passed: false,
      message: 'Email or password not configured. Please set garminMcp.email and garminMcp.password in settings.',
      critical: true,
    };
  }

  // Basic email validation
  if (!email.includes('@')) {
    return {
      name: 'Garmin Connect Credentials',
      passed: false,
      message: 'Email appears invalid. Please check your configuration.',
      critical: true,
    };
  }

  return {
    name: 'Garmin Connect Credentials',
    passed: true,
    message: 'Credentials configured',
    critical: true,
  };
}

/**
 * Check if garmin-mcp command is available
 */
async function checkServerCommand(): Promise<PrerequisiteCheck> {
  const config = vscode.workspace.getConfiguration('garminMcp');
  const serverPath = config.get<string>('serverPath', 'garmin-mcp');

  try {
    const { stdout, stderr } = await execAsync(`${serverPath} --version`, {
      timeout: 5000,
      shell: process.env.SHELL || 'bash',
    });

    const output = (stdout + stderr).trim();
    
    if (output.includes('garmin-mcp') || output.includes('version')) {
      return {
        name: 'Garmin MCP Server',
        passed: true,
        message: `Server found: ${output}`,
        critical: false,
      };
    } else {
      return {
        name: 'Garmin MCP Server',
        passed: true,
        message: `Server command works (${output})`,
        critical: false,
      };
    }
  } catch (error: any) {
    return {
      name: 'Garmin MCP Server',
      passed: true,
      message: `Warning: Could not verify server (${error.message}). Will attempt to use anyway.`,
      critical: false,
    };
  }
}

/**
 * Shows prerequisite check results and determines if activation can proceed
 */
async function showPrerequisiteResults(
  checks: PrerequisiteCheck[]
): Promise<{ canProceed: boolean }> {
  const failed = checks.filter((c) => !c.passed);
  const criticalFailed = failed.filter((c) => c.critical);

  if (criticalFailed.length > 0) {
    const messages = criticalFailed.map((c) => `❌ ${c.name}: ${c.message}`).join('\n');
    const action = await vscode.window.showErrorMessage(
      `Garmin MCP Extension: Critical prerequisites not met:\n\n${messages}`,
      'Open Settings',
      'Dismiss'
    );

    if (action === 'Open Settings') {
      vscode.commands.executeCommand('workbench.action.openSettings', 'garminMcp');
    }

    return { canProceed: false };
  }

  // Show warnings for non-critical issues
  const warnings = failed.filter((c) => !c.critical);
  if (warnings.length > 0) {
    const messages = warnings.map((c) => `⚠️ ${c.name}: ${c.message}`).join('\n');
    console.warn('Garmin MCP Extension warnings:\n', messages);
  }

  return { canProceed: true };
}

/**
 * Registers the Garmin MCP server with VS Code's Language Model API
 */
async function registerMcpServer(context: vscode.ExtensionContext): Promise<void> {
  const config = vscode.workspace.getConfiguration('garminMcp');
  const email = config.get<string>('email', '').trim();
  const password = config.get<string>('password', '').trim();
  const serverPath = config.get<string>('serverPath', 'garmin-mcp');

  try {
    // Register the MCP server provider
    const mcpProvider: vscode.McpServerDefinitionProvider<vscode.McpStdioServerDefinition> = {
      provideMcpServerDefinitions(_token: vscode.CancellationToken): vscode.ProviderResult<vscode.McpStdioServerDefinition[]> {
        console.log('Garmin MCP: Providing MCP server definitions');
        
        // Get latest configuration (in case settings changed)
        const currentConfig = vscode.workspace.getConfiguration('garminMcp');
        const currentEmail = currentConfig.get<string>('email', '').trim();
        const currentPassword = currentConfig.get<string>('password', '').trim();
        
        // Check if credentials are configured
        if (!currentEmail || !currentPassword) {
          console.warn('Garmin MCP: Credentials not configured, server not started');
          return [];
        }
        
        // Set up environment variables with credentials
        const envVars: Record<string, string> = {
          'GARMIN_EMAIL': currentEmail,
          'GARMIN_PASSWORD': currentPassword
        };
        
        // Return the MCP server definition
        return [{
          label: 'Garmin MCP',
          command: serverPath,
          args: [],
          env: envVars
        }];
      }
    };

    // Register the provider with VS Code
    const registration = vscode.lm.registerMcpServerDefinitionProvider('garmin-mcp-provider', mcpProvider);
    context.subscriptions.push(registration);

    console.log('Garmin MCP server registered successfully');
  } catch (error) {
    console.error('Failed to register Garmin MCP server:', error);
    throw new Error(
      `Failed to register Garmin MCP server: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Deactivates the extension
 */
export function deactivate() {
  console.log('Garmin MCP Extension is deactivating...');
}
