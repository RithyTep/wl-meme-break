import * as vscode from 'vscode';
import { MemeService } from './services/memeService';
import { BreakTimer } from './services/breakTimer';
import { MemePanel } from './commands/showMeme';
import { PopupMeme } from './commands/popupMeme';

let memeService: MemeService;
let breakTimer: BreakTimer;
let popupMeme: PopupMeme;

const DEFAULT_SUBREDDITS = [
  'ProgrammerHumor',
  'programmerreactions',
  'softwaregore',
  'iiiiiiitttttttttttt',
  'techhumor',
  'linuxmemes',
  'webdev',
  'javascript',
  'coding',
  'cscareerquestions'
];

export function activate(context: vscode.ExtensionContext): void {
  console.log('WL Meme Break is now active!');

  const config = vscode.workspace.getConfiguration('wl-meme');
  const subreddits = config.get<string[]>('memeSubreddits') || DEFAULT_SUBREDDITS;
  const breakInterval = config.get<number>('breakInterval') || 60;
  const autoShowMeme = config.get<boolean>('autoShowMeme') ?? true;
  const displayMode = config.get<string>('displayMode') || 'panel';

  memeService = new MemeService(subreddits);
  popupMeme = new PopupMeme(memeService);

  breakTimer = new BreakTimer(breakInterval, () => {
    if (autoShowMeme) {
      if (displayMode === 'popup') {
        popupMeme.show();
      } else {
        MemePanel.createOrShow(memeService);
      }
    } else {
      vscode.window.showInformationMessage(
        'Time for a break! 🎮',
        'Show Meme'
      ).then(selection => {
        if (selection === 'Show Meme') {
          if (displayMode === 'popup') {
            popupMeme.show();
          } else {
            MemePanel.createOrShow(memeService);
          }
        }
      });
    }
  });

  // Show Meme command (panel mode)
  const showMemeCmd = vscode.commands.registerCommand('wl-meme.showMeme', () => {
    MemePanel.createOrShow(memeService);
  });

  // Popup Meme command (quick view)
  const popupMemeCmd = vscode.commands.registerCommand('wl-meme.popupMeme', () => {
    popupMeme.show();
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
      memeService.setSubreddits(newConfig.get<string[]>('memeSubreddits') || DEFAULT_SUBREDDITS);
      breakTimer.setInterval(newConfig.get<number>('breakInterval') || 60);
    }
  });

  context.subscriptions.push(showMemeCmd, popupMemeCmd, startTimerCmd, stopTimerCmd);

  // Welcome message
  vscode.window.showInformationMessage(
    '😂 WL Meme Break ready! 10 subreddits loaded. Press Cmd+Shift+M for a meme'
  );
}

export function deactivate(): void {
  if (breakTimer) {
    breakTimer.dispose();
  }
}
