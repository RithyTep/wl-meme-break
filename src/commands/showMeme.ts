import * as vscode from 'vscode';
import { MemeService, Meme } from '../services/memeService';

export class MemePanel {
  public static currentPanel: MemePanel | undefined;
  private readonly panel: vscode.WebviewPanel;
  private readonly memeService: MemeService;
  private disposables: vscode.Disposable[] = [];

  private constructor(panel: vscode.WebviewPanel, memeService: MemeService) {
    this.panel = panel;
    this.memeService = memeService;

    this.panel.onDidDispose(() => this.dispose(), null, this.disposables);

    this.panel.webview.onDidReceiveMessage(
      async (message) => {
        if (message.command === 'nextMeme') {
          await this.loadMeme();
        }
      },
      null,
      this.disposables
    );
  }

  public static async createOrShow(memeService: MemeService): Promise<void> {
    const column = vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.viewColumn
      : undefined;

    if (MemePanel.currentPanel) {
      MemePanel.currentPanel.panel.reveal(column);
      await MemePanel.currentPanel.loadMeme();
      return;
    }

    const panel = vscode.window.createWebviewPanel(
      'wlMemeBreak',
      '😂 Meme Break!',
      column || vscode.ViewColumn.One,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
      }
    );

    MemePanel.currentPanel = new MemePanel(panel, memeService);
    await MemePanel.currentPanel.loadMeme();
  }

  private async loadMeme(): Promise<void> {
    this.panel.webview.html = this.getLoadingHtml();

    try {
      const meme = await this.memeService.getRandomMeme();
      this.panel.webview.html = this.getMemeHtml(meme);
    } catch {
      this.panel.webview.html = this.getErrorHtml();
    }
  }

  private getLoadingHtml(): string {
    return `<!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        .loader {
          font-size: 48px;
          animation: bounce 0.5s ease infinite alternate;
        }
        @keyframes bounce {
          from { transform: translateY(0); }
          to { transform: translateY(-20px); }
        }
      </style>
    </head>
    <body>
      <div class="loader">🎲</div>
    </body>
    </html>`;
  }

  private getMemeHtml(meme: Meme): string {
    return `<!DOCTYPE html>
    <html>
    <head>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          display: flex;
          flex-direction: column;
          align-items: center;
          min-height: 100vh;
          padding: 20px;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          color: white;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        .header {
          text-align: center;
          margin-bottom: 20px;
        }
        .header h1 {
          font-size: 24px;
          margin-bottom: 5px;
        }
        .header .meta {
          font-size: 12px;
          opacity: 0.7;
        }
        .meme-container {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          max-width: 100%;
        }
        .meme-container img {
          max-width: 100%;
          max-height: 60vh;
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.5);
        }
        .actions {
          margin-top: 20px;
          display: flex;
          gap: 10px;
        }
        button {
          padding: 12px 24px;
          font-size: 16px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        button:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 20px rgba(0,0,0,0.3);
        }
        .next-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }
        .quote {
          margin-top: 20px;
          font-style: italic;
          opacity: 0.8;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${this.escapeHtml(meme.title)}</h1>
        <div class="meta">r/${meme.subreddit} • by u/${meme.author}</div>
      </div>

      <div class="meme-container">
        <img src="${meme.url}" alt="Meme" />
      </div>

      <div class="actions">
        <button class="next-btn" onclick="nextMeme()">🎲 Next Meme</button>
      </div>

      <p class="quote">"A meme a day keeps the burnout away" 💪</p>

      <script>
        const vscode = acquireVsCodeApi();
        function nextMeme() {
          vscode.postMessage({ command: 'nextMeme' });
        }
      </script>
    </body>
    </html>`;
  }

  private getErrorHtml(): string {
    return `<!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          color: white;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          text-align: center;
        }
        .emoji { font-size: 64px; margin-bottom: 20px; }
        button {
          margin-top: 20px;
          padding: 12px 24px;
          font-size: 16px;
          border: none;
          border-radius: 8px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          cursor: pointer;
        }
      </style>
    </head>
    <body>
      <div class="emoji">😅</div>
      <h2>Oops! Couldn't fetch a meme</h2>
      <p>Check your internet connection</p>
      <button onclick="location.reload()">Try Again</button>
    </body>
    </html>`;
  }

  private escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  public dispose(): void {
    MemePanel.currentPanel = undefined;
    this.panel.dispose();
    while (this.disposables.length) {
      const x = this.disposables.pop();
      if (x) {
        x.dispose();
      }
    }
  }
}
