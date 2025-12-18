import * as vscode from 'vscode';
import { MemeService, Meme } from '../services/memeService';

export class PopupMeme {
  private memeService: MemeService;

  constructor(memeService: MemeService) {
    this.memeService = memeService;
  }

  async show(): Promise<void> {
    try {
      const meme = await this.memeService.getRandomMeme();
      await this.showMemeDialog(meme);
    } catch {
      vscode.window.showErrorMessage('Failed to fetch meme 😢');
    }
  }

  private async showMemeDialog(meme: Meme): Promise<void> {
    // Create a centered dialog-style popup
    const panel = vscode.window.createWebviewPanel(
      'wlMemeDialog',
      '😂 Meme Break!',
      {
        viewColumn: vscode.ViewColumn.Active,
        preserveFocus: false,
      },
      {
        enableScripts: true,
        retainContextWhenHidden: false,
      }
    );

    panel.webview.html = this.getDialogHtml(meme);

    // Auto-close after 30 seconds
    const timeout = setTimeout(() => {
      panel.dispose();
    }, 30000);

    panel.webview.onDidReceiveMessage(async (message) => {
      if (message.command === 'close') {
        clearTimeout(timeout);
        panel.dispose();
      } else if (message.command === 'next') {
        await this.loadNextMeme(panel);
      }
    });

    panel.onDidDispose(() => {
      clearTimeout(timeout);
    });
  }

  private async loadNextMeme(panel: vscode.WebviewPanel): Promise<void> {
    try {
      panel.webview.html = this.getLoadingHtml();
      const meme = await this.memeService.getRandomMeme();
      panel.webview.html = this.getDialogHtml(meme);
    } catch {
      // Keep loading state briefly then show error
    }
  }

  private getLoadingHtml(): string {
    return `<!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          margin: 0;
          padding: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: rgba(0, 0, 0, 0.9);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        .loader {
          font-size: 64px;
          animation: spin 1s ease-in-out infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
    </head>
    <body>
      <div class="loader">🎲</div>
    </body>
    </html>`;
  }

  private getDialogHtml(meme: Meme): string {
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
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: rgba(0, 0, 0, 0.85);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        .dialog {
          background: linear-gradient(145deg, #2d2d3a, #1e1e28);
          border-radius: 16px;
          padding: 24px;
          max-width: 90vw;
          max-height: 90vh;
          box-shadow: 0 25px 80px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255,255,255,0.1);
          display: flex;
          flex-direction: column;
          align-items: center;
          animation: slideIn 0.3s ease-out;
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 16px;
          width: 100%;
        }
        .emoji {
          font-size: 32px;
        }
        .title-section {
          flex: 1;
        }
        .title {
          font-size: 16px;
          font-weight: 600;
          color: white;
          margin-bottom: 4px;
          max-width: 400px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .source {
          font-size: 12px;
          color: rgba(255,255,255,0.5);
        }
        .close-x {
          background: rgba(255,255,255,0.1);
          border: none;
          color: rgba(255,255,255,0.6);
          width: 32px;
          height: 32px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 18px;
          transition: all 0.2s;
        }
        .close-x:hover {
          background: rgba(255,100,100,0.3);
          color: white;
        }
        .meme-container {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 20px;
        }
        .meme-img {
          max-width: 500px;
          max-height: 50vh;
          display: block;
          border-radius: 12px;
        }
        .actions {
          display: flex;
          gap: 12px;
          width: 100%;
          justify-content: center;
        }
        button {
          padding: 12px 28px;
          font-size: 14px;
          font-weight: 600;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        button:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 20px rgba(0,0,0,0.3);
        }
        .next-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }
        .next-btn:hover {
          background: linear-gradient(135deg, #7b8ef0 0%, #8a5cb8 100%);
        }
        .close-btn {
          background: rgba(255,255,255,0.1);
          color: white;
          border: 1px solid rgba(255,255,255,0.2);
        }
        .close-btn:hover {
          background: rgba(255,255,255,0.2);
        }
        .timer {
          margin-top: 16px;
          font-size: 11px;
          color: rgba(255,255,255,0.4);
        }
      </style>
    </head>
    <body onclick="handleBodyClick(event)">
      <div class="dialog" onclick="event.stopPropagation()">
        <div class="header">
          <span class="emoji">😂</span>
          <div class="title-section">
            <div class="title">${this.escapeHtml(meme.title)}</div>
            <div class="source">r/${meme.subreddit} • u/${meme.author}</div>
          </div>
          <button class="close-x" onclick="closeMeme()">✕</button>
        </div>

        <div class="meme-container">
          <img class="meme-img" src="${meme.url}" alt="Meme" />
        </div>

        <div class="actions">
          <button class="next-btn" onclick="nextMeme()">
            🎲 Next Meme
          </button>
          <button class="close-btn" onclick="closeMeme()">
            Back to Code
          </button>
        </div>

        <div class="timer">Auto-closes in 30 seconds • Click outside to close</div>
      </div>

      <script>
        const vscode = acquireVsCodeApi();

        function nextMeme() {
          vscode.postMessage({ command: 'next' });
        }

        function closeMeme() {
          vscode.postMessage({ command: 'close' });
        }

        function handleBodyClick(event) {
          // Click outside dialog to close
          closeMeme();
        }

        // ESC key to close
        document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape') {
            closeMeme();
          }
        });
      </script>
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
}
