# Meme Break

> Take a break with the latest programming memes. Stay refreshed, code better! 😂

## Features

### 🔥 Latest & Trending Memes
Fetches hot/trending memes directly from Reddit for the freshest content.

### 🎲 Random Programming Memes
Press `Cmd+Shift+M` (Mac) or `Ctrl+Shift+M` (Windows) for instant meme therapy.

### 🪟 Popup Dialog Mode
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
| Meme Break: Show Latest Meme | `Cmd+Shift+M` | Show meme in full panel |
| Meme Break: Popup Meme | - | Quick popup meme (dialog) |
| Meme Break: Start Break Timer | - | Start break reminder |
| Meme Break: Stop Break Timer | - | Stop break reminder |

## Usage

### Quick Meme
Just press `Cmd+Shift+M` whenever you need a laugh.

### Popup Mode
Run "Meme Break: Popup Meme" for a quick view dialog that auto-closes.

### Break Timer
1. Open Command Palette (`Cmd+Shift+P`)
2. Run "Meme Break: Start Break Timer"
3. Get memes every hour (configurable)

## Settings

```json
{
  "meme-break.breakInterval": 60,
  "meme-break.autoShowMeme": true,
  "meme-break.displayMode": "panel",
  "meme-break.sortBy": "hot",
  "meme-break.memeSubreddits": [
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

### Sort Options
- `hot` - Trending memes (default)
- `new` - Latest memes
- `top` - Best memes

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

### v1.1.0
- **Renamed** - Now "Meme Break" (removed WL prefix)
- **Latest Memes** - Fetches hot/trending memes directly from Reddit
- **Sort Options** - Choose between hot, new, or top memes
- **Better Caching** - 5-minute cache for faster responses
- **Direct Reddit API** - More reliable meme fetching

### v1.0.3
- **Dialog Popup** - Centered modal dialog instead of side panel
- Close by clicking outside, pressing ESC, or X button
- Smooth slide-in animation
- Dark overlay background for focus

### v1.0.2
- **Popup Mode** - Quick meme popup that auto-closes after 30s
- **10 Subreddits** - Way more variety with 10 default channels
- **Display Mode Setting** - Choose between panel or popup
- New command: "Popup Meme (Quick View)"

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
