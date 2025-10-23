# Garmin MCP Extension - User Settings

This document explains how to configure your Garmin Connect credentials for the extension.

## Configuration Steps

### Method 1: Using VS Code Settings UI (Recommended)

1. Open VS Code Settings:
   - **Windows/Linux**: `File > Preferences > Settings` or `Ctrl+,`
   - **macOS**: `Code > Settings > Settings` or `Cmd+,`

2. Search for "Garmin MCP" in the settings search bar

3. Fill in the following settings:
   - **Garmin Mcp: Email**: Your Garmin Connect email address
   - **Garmin Mcp: Password**: Your Garmin Connect password
   - **Garmin Mcp: Server Path**: Leave as default `garmin-mcp` (unless you installed it elsewhere)

### Method 2: Using settings.json

1. Open Command Palette:
   - **Windows/Linux**: `Ctrl+Shift+P`
   - **macOS**: `Cmd+Shift+P`

2. Type "Preferences: Open User Settings (JSON)" and select it

3. Add these settings to your `settings.json`:

```json
{
  "garminMcp.email": "your-email@example.com",
  "garminMcp.password": "your-password-here",
  "garminMcp.serverPath": "garmin-mcp"
}
```

## Settings Reference

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `garminMcp.email` | string | `""` | Your Garmin Connect email address |
| `garminMcp.password` | string | `""` | Your Garmin Connect password |
| `garminMcp.serverPath` | string | `"garmin-mcp"` | Path to the garmin-mcp executable |

## Security Notes

- Your credentials are stored in VS Code's settings file
- On Windows, this is typically: `%APPDATA%\Code\User\settings.json`
- On macOS: `~/Library/Application Support/Code/User/settings.json`
- On Linux: `~/.config/Code/User/settings.json`
- These credentials are only used locally to authenticate with Garmin Connect
- They are passed to the MCP server via environment variables

## Testing Your Configuration

After setting your credentials:

1. Reload VS Code (`Ctrl+Shift+P` > "Developer: Reload Window")
2. Check the Output panel (`View > Output`)
3. Select "Garmin MCP Extension" from the dropdown
4. You should see "Garmin MCP Extension activated successfully"

## Troubleshooting

### "Credentials not configured" error
- Make sure both email and password are filled in
- Check for typos in the setting names
- Reload VS Code after making changes

### "Email appears invalid" error
- Ensure your email contains an `@` symbol
- Use the same email you use to log into Garmin Connect website

### Authentication failures
- Verify credentials by logging into https://connect.garmin.com
- If you have 2FA enabled, this may cause issues (check Garmin MCP server documentation)
- Check the Garmin MCP server logs for detailed error messages

## Example Configuration

Here's a complete example (remember to use your actual credentials):

```json
{
  "garminMcp.email": "runner@example.com",
  "garminMcp.password": "MySecurePassword123!",
  "garminMcp.serverPath": "garmin-mcp"
}
```

**Important**: Never commit your actual credentials to version control!
