import * as vscode from 'vscode';

export class BreakTimer {
  private timer: NodeJS.Timeout | undefined;
  private intervalMinutes: number;
  private statusBarItem: vscode.StatusBarItem;
  private isRunning: boolean = false;
  private onBreakCallback: () => void;
  private startTime: number = 0;

  constructor(intervalMinutes: number, onBreak: () => void) {
    this.intervalMinutes = intervalMinutes;
    this.onBreakCallback = onBreak;

    this.statusBarItem = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Right,
      100
    );
    this.statusBarItem.command = 'wl-meme.showMeme';
    this.statusBarItem.tooltip = 'Click for a meme! Timer for break reminder';
  }

  start(): void {
    if (this.isRunning) {
      this.stop();
    }

    this.isRunning = true;
    this.startTime = Date.now();

    this.timer = setInterval(() => {
      this.onBreakCallback();
      this.startTime = Date.now();
    }, this.intervalMinutes * 60 * 1000);

    this.updateStatusBar();
    this.startStatusBarUpdate();
    this.statusBarItem.show();

    vscode.window.showInformationMessage(
      `Break timer started! You'll get a meme every ${this.intervalMinutes} minutes.`
    );
  }

  stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = undefined;
    }

    this.isRunning = false;
    this.statusBarItem.hide();

    vscode.window.showInformationMessage('Break timer stopped');
  }

  private startStatusBarUpdate(): void {
    // Update status bar every minute
    setInterval(() => {
      if (this.isRunning) {
        this.updateStatusBar();
      }
    }, 60000);
  }

  private updateStatusBar(): void {
    const elapsed = Math.floor((Date.now() - this.startTime) / 60000);
    const remaining = this.intervalMinutes - elapsed;

    if (remaining > 0) {
      this.statusBarItem.text = `$(clock) ${remaining}m until meme break`;
    } else {
      this.statusBarItem.text = `$(smiley) Meme time!`;
    }
  }

  setInterval(minutes: number): void {
    this.intervalMinutes = minutes;
    if (this.isRunning) {
      this.start(); // Restart with new interval
    }
  }

  isActive(): boolean {
    return this.isRunning;
  }

  dispose(): void {
    this.stop();
    this.statusBarItem.dispose();
  }
}
