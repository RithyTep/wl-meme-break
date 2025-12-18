import * as https from 'https';

export interface Meme {
  title: string;
  url: string;
  author: string;
  subreddit: string;
  postLink: string;
}

export class MemeService {
  private subreddits: string[];
  private seenMemes: Set<string> = new Set();
  private maxHistory: number = 50;

  constructor(subreddits: string[] = ['ProgrammerHumor']) {
    this.subreddits = subreddits;
  }

  setSubreddits(subreddits: string[]): void {
    this.subreddits = subreddits;
  }

  async getRandomMeme(): Promise<Meme> {
    // Try multiple times to get a unique meme
    for (let attempt = 0; attempt < 5; attempt++) {
      const subreddit = this.subreddits[Math.floor(Math.random() * this.subreddits.length)];

      try {
        const meme = await this.fetchFromReddit(subreddit);

        // Check if we've seen this meme recently
        if (!this.seenMemes.has(meme.url)) {
          this.addToHistory(meme.url);
          return meme;
        }
      } catch {
        // Continue to next attempt
      }
    }

    // Try fetching multiple memes at once
    try {
      const memes = await this.fetchMultipleMemes(10);
      const uniqueMeme = memes.find(m => !this.seenMemes.has(m.url));
      if (uniqueMeme) {
        this.addToHistory(uniqueMeme.url);
        return uniqueMeme;
      }
    } catch {
      // Fall through to built-in
    }

    // Fallback to built-in memes
    return this.getBuiltInMeme();
  }

  private addToHistory(url: string): void {
    this.seenMemes.add(url);

    // Keep history size manageable
    if (this.seenMemes.size > this.maxHistory) {
      const firstItem = this.seenMemes.values().next().value;
      if (firstItem) {
        this.seenMemes.delete(firstItem);
      }
    }
  }

  private fetchFromReddit(subreddit: string): Promise<Meme> {
    return new Promise((resolve, reject) => {
      // Add timestamp to prevent caching
      const timestamp = Date.now();
      const url = `https://meme-api.com/gimme/${subreddit}?t=${timestamp}`;

      const req = https.get(url, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            const json = JSON.parse(data);
            if (json.url) {
              resolve({
                title: json.title || 'Programming Meme',
                url: json.url,
                author: json.author || 'Unknown',
                subreddit: json.subreddit || subreddit,
                postLink: json.postLink || '',
              });
            } else {
              reject(new Error('No meme found'));
            }
          } catch {
            reject(new Error('Failed to parse response'));
          }
        });
      });

      req.on('error', reject);

      // Set timeout
      req.setTimeout(5000, () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });
    });
  }

  private fetchMultipleMemes(count: number): Promise<Meme[]> {
    return new Promise((resolve, reject) => {
      const subreddit = this.subreddits[Math.floor(Math.random() * this.subreddits.length)];
      const timestamp = Date.now();
      const url = `https://meme-api.com/gimme/${subreddit}/${count}?t=${timestamp}`;

      const req = https.get(url, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            const json = JSON.parse(data);
            if (json.memes && Array.isArray(json.memes)) {
              const memes: Meme[] = json.memes.map((m: Record<string, string>) => ({
                title: m.title || 'Programming Meme',
                url: m.url,
                author: m.author || 'Unknown',
                subreddit: m.subreddit || subreddit,
                postLink: m.postLink || '',
              }));
              resolve(memes);
            } else {
              reject(new Error('No memes found'));
            }
          } catch {
            reject(new Error('Failed to parse response'));
          }
        });
      });

      req.on('error', reject);
      req.setTimeout(5000, () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });
    });
  }

  private builtInIndex: number = 0;

  private getBuiltInMeme(): Meme {
    const builtInMemes: Meme[] = [
      {
        title: "It works on my machine!",
        url: "https://i.imgur.com/HTisMpC.jpg",
        author: "DevMemes",
        subreddit: "ProgrammerHumor",
        postLink: ""
      },
      {
        title: "When the code works first try",
        url: "https://i.imgur.com/Y5CQkQE.png",
        author: "DevMemes",
        subreddit: "ProgrammerHumor",
        postLink: ""
      },
      {
        title: "Debugging be like",
        url: "https://i.imgur.com/Q3cUg29.gif",
        author: "DevMemes",
        subreddit: "ProgrammerHumor",
        postLink: ""
      },
      {
        title: "Stack Overflow is down",
        url: "https://i.imgur.com/pR9Kp93.jpg",
        author: "DevMemes",
        subreddit: "ProgrammerHumor",
        postLink: ""
      },
      {
        title: "Documentation? What documentation?",
        url: "https://i.imgur.com/XS5LK.gif",
        author: "DevMemes",
        subreddit: "ProgrammerHumor",
        postLink: ""
      },
      {
        title: "Git push --force",
        url: "https://i.imgur.com/kZlyN61.gif",
        author: "DevMemes",
        subreddit: "ProgrammerHumor",
        postLink: ""
      },
      {
        title: "Senior dev reviewing my code",
        url: "https://i.imgur.com/c4jt321.png",
        author: "DevMemes",
        subreddit: "ProgrammerHumor",
        postLink: ""
      },
      {
        title: "Tabs vs Spaces debate",
        url: "https://i.imgur.com/91sn32X.jpg",
        author: "DevMemes",
        subreddit: "ProgrammerHumor",
        postLink: ""
      }
    ];

    // Cycle through built-in memes instead of random
    const meme = builtInMemes[this.builtInIndex % builtInMemes.length];
    this.builtInIndex++;
    return meme;
  }

  clearHistory(): void {
    this.seenMemes.clear();
    this.builtInIndex = 0;
  }
}
