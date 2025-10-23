# Garmin MCP VS Code Extension

This VS Code extension integrates the [Garmin MCP Server](https://github.com/Taxuspt/garmin_mcp) with GitHub Copilot, giving your AI assistant access to your Garmin Connect fitness and health data.

## Features

- 🏃 **Activity Data**: Access your recent activities, runs, rides, and workouts
- 💪 **Health Metrics**: Query steps, heart rate, and sleep data
- 📊 **Body Composition**: View body composition and weight data
- 🤖 **AI Integration**: Ask Copilot questions about your fitness data directly in VS Code

## Prerequisites

- VS Code with GitHub Copilot enabled
- Python 3.10 or higher
- Garmin Connect account
- `uv` package manager (recommended) or `pip`

## Installation

### 1. Install the Garmin MCP Server

The extension requires the Garmin MCP server to be installed. You can install it using `uv`:

```bash
uv pip install git+https://github.com/Taxuspt/garmin_mcp
```

Or with pip:

```bash
pip install git+https://github.com/Taxuspt/garmin_mcp
```

### 2. Install the Extension

1. Download the `.vsix` file from the releases page
2. Open VS Code
3. Go to Extensions view (Ctrl+Shift+X / Cmd+Shift+X)
4. Click the "..." menu and select "Install from VSIX..."
5. Select the downloaded `.vsix` file

### 3. Configure Credentials

1. Open VS Code Settings (File > Preferences > Settings)
2. Search for "Garmin MCP"
3. Enter your Garmin Connect credentials:
   - **Email**: Your Garmin Connect email address
   - **Password**: Your Garmin Connect password

**Security Note**: Your credentials are stored in VS Code's secure settings and are only used to authenticate with Garmin Connect. They are passed to the MCP server via environment variables.

## Usage

Once installed and configured, you can ask GitHub Copilot questions about your Garmin data:

- "Show me my recent activities"
- "What was my sleep like last night?"
- "How many steps did I take yesterday?"
- "Show me the details of my latest run"
- "What's my average heart rate this week?"

The extension automatically provides Copilot with access to the following tools:

- `list_activities`: Get your recent activities
- `get_activity`: Get detailed information about a specific activity
- `get_steps`: View your step count
- `get_heart_rate`: Check your heart rate data
- `get_sleep`: See your sleep metrics
- `get_body_composition`: View body composition data

## Configuration Options

| Setting | Default | Description |
|---------|---------|-------------|
| `garminMcp.email` | `""` | Your Garmin Connect email address |
| `garminMcp.password` | `""` | Your Garmin Connect password |
| `garminMcp.serverPath` | `"garmin-mcp"` | Path to the garmin-mcp executable |

## Troubleshooting

### "Credentials not configured" error

Make sure you've set both `garminMcp.email` and `garminMcp.password` in VS Code settings.

### "Could not verify server" warning

The extension couldn't verify the Garmin MCP server installation. Check that:
- The server is installed correctly
- The `garminMcp.serverPath` setting points to the correct executable
- Python and required packages are available in your PATH

### Authentication issues with Garmin Connect

If you encounter login issues:
1. Verify your credentials are correct
2. Check if Garmin Connect requires additional verification (2FA, etc.)
3. Try logging in directly to the Garmin Connect website
4. Ensure the `garminconnect` package is up to date

## Privacy & Security

- Your Garmin credentials are stored securely in VS Code settings
- Credentials are only used to authenticate with Garmin Connect
- No data is sent to third parties
- All communication happens locally between VS Code, the MCP server, and Garmin Connect

## Credits

This extension integrates with the [Garmin MCP Server](https://github.com/Taxuspt/garmin_mcp) by Taxuspt, which uses the [garminconnect](https://github.com/cyberjunky/python-garminconnect) library.

## License

MIT License - see LICENSE file for details

## Support

For issues related to:
- **This extension**: Open an issue on the [extension repository](https://github.com/svarun115/garmin-mcp-vscode-extension)
- **The MCP server**: Open an issue on the [Garmin MCP repository](https://github.com/Taxuspt/garmin_mcp)
- **Garmin Connect API**: Check the [garminconnect library](https://github.com/cyberjunky/python-garminconnect)
