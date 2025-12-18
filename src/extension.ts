import * as vscode from 'vscode';
import { MemeService } from './services/memeService';
import { BreakTimer } from './services/breakTimer';
import { MemePanel } from './commands/showMeme';

let memeService: MemeService;
let breakTimer: BreakTimer;

export function activate(context: vscode.ExtensionContext): void {
  console.log('WL Meme Break is now active!');

  const config = vscode.workspace.getConfiguration('wl-meme');
  const subreddits = config.get<string[]>('memeSubreddits') || ['ProgrammerHumor'];
  const breakInterval = config.get<number>('breakInterval') || 60;
  const autoShowMeme = config.get<boolean>('autoShowMeme') ?? true;

  memeService = new MemeService(subreddits);

  breakTimer = new BreakTimer(breakInterval, () => {
    if (autoShowMeme) {
      MemePanel.createOrShow(memeService);
    } else {
      vscode.window.showInformationMessage(
        'Time for a break! 🎮',
        'Show Meme'
      ).then(selection => {
        if (selection === 'Show Meme') {
          MemePanel.createOrShow(memeService);
        }
      });
    }
  });

  // Show Meme command
  const showMemeCmd = vscode.commands.registerCommand('wl-meme.showMeme', () => {
    MemePanel.createOrShow(memeService);
  });

  // Start Break Timer command
  const startTimerCmd = vscode.commands.registerCommand('wl-meme.startBreakTimer', () => {
    breakTimer.start();
  });

  // Stop Break Timer command
  const stopTimerCmd = vscode.commands.registerCommand('wl-meme.stopBreakTimer', () => {
    breakTimer.stop();
  });

  // Listen for config changes
  vscode.workspace.onDidChangeConfiguration(e => {
    if (e.affectsConfiguration('wl-meme')) {
      const newConfig = vscode.workspace.getConfiguration('wl-meme');
      memeService.setSubreddits(newConfig.get<string[]>('memeSubreddits') || ['ProgrammerHumor']);
      breakTimer.setInterval(newConfig.get<number>('breakInterval') || 60);
    }
  });

  context.subscriptions.push(showMemeCmd, startTimerCmd, stopTimerCmd);

  // Welcome message
  vscode.window.showInformationMessage(
    '😂 WL Meme Break ready! Press Cmd+Shift+M for a meme'
  );
}

export function deactivate(): void {
  if (breakTimer) {
    breakTimer.dispose();
  }
}
