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
      await this.showMemePopup(meme);
    } catch {
      vscode.window.showErrorMessage('Failed to fetch meme 😢');
    }
  }

  private async showMemePopup(meme: Meme): Promise<void> {
    // Create a modal popup with the meme
    const panel = vscode.window.createWebviewPanel(
      'wlMemePopup',
      '😂 Quick Meme!',
      {
        viewColumn: vscode.ViewColumn.Beside,
        preserveFocus: true,
      },
      {
        enableScripts: true,
        retainContextWhenHidden: false,
      }
    );

    panel.webview.html = this.getPopupHtml(meme);

    // Auto-close after 30 seconds or on click
    const timeout = setTimeout(() => {
      panel.dispose();
    }, 30000);

    panel.webview.onDidReceiveMessage((message) => {
      if (message.command === 'close') {
        clearTimeout(timeout);
        panel.dispose();
      } else if (message.command === 'next') {
        this.loadNextMeme(panel);
      }
    });

    panel.onDidDispose(() => {
      clearTimeout(timeout);
    });
  }

  private async loadNextMeme(panel: vscode.WebviewPanel): Promise<void> {
    try {
      const meme = await this.memeService.getRandomMeme();
      panel.webview.html = this.getPopupHtml(meme);
    } catch {
      // Keep current meme
    }
  }

  private getPopupHtml(meme: Meme): string {
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
          justify-content: center;
          min-height: 100vh;
          padding: 15px;
          background: linear-gradient(135deg, #1e1e2e 0%, #2d2d44 100%);
          color: white;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          cursor: pointer;
        }
        .title {
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 10px;
          text-align: center;
          max-width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .source {
          font-size: 11px;
          opacity: 0.6;
          margin-bottom: 15px;
        }
        .meme-img {
          max-width: 100%;
          max-height: 50vh;
          border-radius: 8px;
          box-shadow: 0 5px 20px rgba(0,0,0,0.4);
        }
        .actions {
          display: flex;
          gap: 10px;
          margin-top: 15px;
        }
        button {
          padding: 8px 16px;
          font-size: 12px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }
        button:hover {
          transform: scale(1.05);
        }
        .next-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }
        .close-btn {
          background: rgba(255,255,255,0.1);
          color: white;
        }
        .hint {
          font-size: 10px;
          opacity: 0.5;
          margin-top: 10px;
        }
      </style>
    </head>
    <body>
      <div class="title">${this.escapeHtml(meme.title)}</div>
      <div class="source">r/${meme.subreddit} • u/${meme.author}</div>
      <img class="meme-img" src="${meme.url}" alt="Meme" />
      <div class="actions">
        <button class="next-btn" onclick="nextMeme()">🎲 Next</button>
        <button class="close-btn" onclick="closeMeme()">✕ Close</button>
      </div>
      <div class="hint">Auto-closes in 30s</div>

      <script>
        const vscode = acquireVsCodeApi();
        function nextMeme() {
          vscode.postMessage({ command: 'next' });
        }
        function closeMeme() {
          vscode.postMessage({ command: 'close' });
        }
        // Click anywhere to close
        document.body.addEventListener('dblclick', closeMeme);
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
