# WL Meme Break

> Take a break with random programming memes. Stay refreshed, code better! 😂

## Features

### 🎲 Random Programming Memes
Press `Cmd+Shift+M` (Mac) or `Ctrl+Shift+M` (Windows) for instant meme therapy.

### 🪟 Popup Mode (NEW!)
Quick meme popup that auto-closes after 30 seconds. Perfect for a quick laugh!

### ⏰ Break Timer
Set a timer to remind you to take breaks. Get memes automatically!

### 🎯 10 Meme Sources (Default)
- r/ProgrammerHumor
- r/programmerreactions
- r/softwaregore
- r/iiiiiiitttttttttttt
- r/techhumor
- r/linuxmemes
- r/webdev
- r/javascript
- r/coding
- r/cscareerquestions

## Commands

| Command | Shortcut | Description |
|---------|----------|-------------|
| WL Meme: Show Random Meme | `Cmd+Shift+M` | Show meme in full panel |
| WL Meme: Popup Meme | - | Quick popup meme (auto-close) |
| WL Meme: Start Break Timer | - | Start break reminder |
| WL Meme: Stop Break Timer | - | Stop break reminder |

## Usage

### Quick Meme
Just press `Cmd+Shift+M` whenever you need a laugh.

### Popup Mode
Run "WL Meme: Popup Meme" for a quick view that auto-closes.

### Break Timer
1. Open Command Palette (`Cmd+Shift+P`)
2. Run "WL Meme: Start Break Timer"
3. Get memes every hour (configurable)

## Settings

```json
{
  "wl-meme.breakInterval": 60,
  "wl-meme.autoShowMeme": true,
  "wl-meme.displayMode": "panel",  // or "popup"
  "wl-meme.memeSubreddits": [
    "ProgrammerHumor",
    "programmerreactions",
    "softwaregore",
    "iiiiiiitttttttttttt",
    "techhumor",
    "linuxmemes",
    "webdev",
    "javascript",
    "coding",
    "cscareerquestions"
  ]
}
```

## Why Meme Breaks?

- 🧠 Mental refresh
- 😊 Mood boost
- 💪 Prevent burnout
- 🎯 Better focus after breaks

## Requirements

- VS Code 1.85+
- Internet connection (for fresh memes)

---

## Changelog

### v1.0.2
- **Popup Mode** - Quick meme popup that auto-closes after 30s
- **10 Subreddits** - Way more variety with 10 default channels
- **Display Mode Setting** - Choose between panel or popup
- New command: "WL Meme: Popup Meme (Quick View)"

### v1.0.1
- Fix duplicate memes - now tracks last 50 memes to ensure uniqueness
- Fetch multiple memes at once for better variety
- Added more built-in fallback memes
- Added request timeout handling

### v1.0.0
- Initial release
- Random meme viewer
- Break timer with notifications
- Customizable meme sources
- Beautiful meme panel UI

---

Made with 😂 by [@rithytep](https://github.com/rithytep)

*Remember: Take breaks, laugh often, code better!*
