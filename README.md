# WL Meme Break

> Take a break with random programming memes. Stay refreshed, code better! 😂

## Features

### 🎲 Random Programming Memes
Press `Cmd+Shift+M` (Mac) or `Ctrl+Shift+M` (Windows) for instant meme therapy.

### ⏰ Break Timer
Set a timer to remind you to take breaks. Get memes automatically!

### 🎯 Meme Sources
- r/ProgrammerHumor (default)
- Customize your favorite subreddits

## Commands

| Command | Shortcut | Description |
|---------|----------|-------------|
| WL Meme: Show Random Meme | `Cmd+Shift+M` | Show a random meme |
| WL Meme: Start Break Timer | - | Start break reminder |
| WL Meme: Stop Break Timer | - | Stop break reminder |

## Usage

### Quick Meme
Just press `Cmd+Shift+M` whenever you need a laugh.

### Break Timer
1. Open Command Palette (`Cmd+Shift+P`)
2. Run "WL Meme: Start Break Timer"
3. Get memes every hour (configurable)

## Settings

```json
{
  "wl-meme.breakInterval": 60,        // Minutes between breaks
  "wl-meme.autoShowMeme": true,       // Auto-show meme on break
  "wl-meme.memeSubreddits": [         // Meme sources
    "ProgrammerHumor",
    "programmerreactions"
  ]
}
```

## Why Meme Breaks?

- 🧠 Mental refresh
- 😊 Mood boost
- 💪 Prevent burnout
- 🎯 Better focus after breaks

## Screenshot

```
┌─────────────────────────────────────┐
│         😂 Meme Break!              │
├─────────────────────────────────────┤
│                                     │
│    [Programming Meme Image]         │
│                                     │
│    "When the code works first try"  │
│                                     │
│         [ 🎲 Next Meme ]            │
│                                     │
│  "A meme a day keeps burnout away"  │
└─────────────────────────────────────┘
```

## Requirements

- VS Code 1.85+
- Internet connection (for fresh memes)

---

## Changelog

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
