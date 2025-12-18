import * as https from 'https';

export interface Meme {
  title: string;
  url: string;
  author: string;
  subreddit: string;
  postLink: string;
  created: number;
}

interface RedditPost {
  title: string;
  url: string;
  author: string;
  subreddit: string;
  permalink: string;
  created_utc: number;
  post_hint?: string;
  is_video: boolean;
  over_18: boolean;
}

export type SortBy = 'hot' | 'new' | 'top';

export class MemeService {
  private subreddits: string[];
  private seenMemes: Set<string> = new Set();
  private maxHistory: number = 50;
  private sortBy: SortBy = 'hot';
  private memeCache: Map<string, Meme[]> = new Map();
  private cacheExpiry: Map<string, number> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  private includeKhmerMemes: boolean = false;
  private readonly KHMER_SUBREDDITS = ['cambodia', 'Khmer', 'phnompenh'];

  constructor(subreddits: string[] = ['ProgrammerHumor']) {
    this.subreddits = subreddits;
  }

  setIncludeKhmerMemes(include: boolean): void {
    this.includeKhmerMemes = include;
  }

  setSubreddits(subreddits: string[]): void {
    this.subreddits = subreddits;
  }

  setSortBy(sortBy: SortBy): void {
    this.sortBy = sortBy;
    // Clear cache when sort changes
    this.memeCache.clear();
    this.cacheExpiry.clear();
  }

  async getRandomMeme(): Promise<Meme> {
    // Include Khmer subreddits if enabled
    const allSubreddits = this.includeKhmerMemes
      ? [...this.subreddits, ...this.KHMER_SUBREDDITS]
      : this.subreddits;

    // Try to get a fresh meme from hot/new posts
    for (let attempt = 0; attempt < 3; attempt++) {
      const subreddit = allSubreddits[Math.floor(Math.random() * allSubreddits.length)];

      try {
        const memes = await this.fetchFromReddit(subreddit);
        const uniqueMeme = memes.find(m => !this.seenMemes.has(m.url));

        if (uniqueMeme) {
          this.addToHistory(uniqueMeme.url);
          return uniqueMeme;
        }
      } catch {
        // Continue to next attempt
      }
    }

    // Try all subreddits
    for (const subreddit of allSubreddits) {
      try {
        const memes = await this.fetchFromReddit(subreddit);
        const uniqueMeme = memes.find(m => !this.seenMemes.has(m.url));

        if (uniqueMeme) {
          this.addToHistory(uniqueMeme.url);
          return uniqueMeme;
        }
      } catch {
        // Continue
      }
    }

    // Fallback to meme-api.com
    try {
      const meme = await this.fetchFromMemeApi();
      if (!this.seenMemes.has(meme.url)) {
        this.addToHistory(meme.url);
        return meme;
      }
    } catch {
      // Fall through
    }

    // Final fallback to built-in memes
    return this.getBuiltInMeme();
  }

  private addToHistory(url: string): void {
    this.seenMemes.add(url);

    if (this.seenMemes.size > this.maxHistory) {
      const firstItem = this.seenMemes.values().next().value;
      if (firstItem) {
        this.seenMemes.delete(firstItem);
      }
    }
  }

  private async fetchFromReddit(subreddit: string): Promise<Meme[]> {
    const cacheKey = `${subreddit}-${this.sortBy}`;
    const now = Date.now();

    // Check cache
    if (this.memeCache.has(cacheKey)) {
      const expiry = this.cacheExpiry.get(cacheKey) || 0;
      if (now < expiry) {
        return this.memeCache.get(cacheKey) || [];
      }
    }

    return new Promise((resolve, reject) => {
      const url = `https://www.reddit.com/r/${subreddit}/${this.sortBy}.json?limit=50&raw_json=1`;

      const options = {
        headers: {
          'User-Agent': 'MemeBreak/1.1.0 (VSCode Extension)'
        }
      };

      const req = https.get(url, options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            const json = JSON.parse(data);

            if (!json.data?.children) {
              reject(new Error('Invalid response'));
              return;
            }

            const memes: Meme[] = json.data.children
              .map((child: { data: RedditPost }) => child.data)
              .filter((post: RedditPost) => {
                // Filter for image posts only
                if (post.over_18) return false;
                if (post.is_video) return false;

                const url = post.url.toLowerCase();
                const isImage = url.endsWith('.jpg') ||
                               url.endsWith('.jpeg') ||
                               url.endsWith('.png') ||
                               url.endsWith('.gif') ||
                               url.includes('i.redd.it') ||
                               url.includes('i.imgur.com');

                return isImage || post.post_hint === 'image';
              })
              .map((post: RedditPost) => ({
                title: post.title,
                url: post.url,
                author: post.author,
                subreddit: post.subreddit,
                postLink: `https://reddit.com${post.permalink}`,
                created: post.created_utc * 1000
              }));

            // Cache results
            this.memeCache.set(cacheKey, memes);
            this.cacheExpiry.set(cacheKey, now + this.CACHE_DURATION);

            resolve(memes);
          } catch {
            reject(new Error('Failed to parse response'));
          }
        });
      });

      req.on('error', reject);

      req.setTimeout(8000, () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });
    });
  }

  private fetchFromMemeApi(): Promise<Meme> {
    return new Promise((resolve, reject) => {
      const subreddit = this.subreddits[Math.floor(Math.random() * this.subreddits.length)];
      const url = `https://meme-api.com/gimme/${subreddit}`;

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
                created: Date.now()
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
        postLink: "",
        created: Date.now()
      },
      {
        title: "When the code works first try",
        url: "https://i.imgur.com/Y5CQkQE.png",
        author: "DevMemes",
        subreddit: "ProgrammerHumor",
        postLink: "",
        created: Date.now()
      },
      {
        title: "Debugging be like",
        url: "https://i.imgur.com/Q3cUg29.gif",
        author: "DevMemes",
        subreddit: "ProgrammerHumor",
        postLink: "",
        created: Date.now()
      },
      {
        title: "Stack Overflow is down",
        url: "https://i.imgur.com/pR9Kp93.jpg",
        author: "DevMemes",
        subreddit: "ProgrammerHumor",
        postLink: "",
        created: Date.now()
      },
      {
        title: "Documentation? What documentation?",
        url: "https://i.imgur.com/XS5LK.gif",
        author: "DevMemes",
        subreddit: "ProgrammerHumor",
        postLink: "",
        created: Date.now()
      },
      {
        title: "Git push --force",
        url: "https://i.imgur.com/kZlyN61.gif",
        author: "DevMemes",
        subreddit: "ProgrammerHumor",
        postLink: "",
        created: Date.now()
      },
      {
        title: "Senior dev reviewing my code",
        url: "https://i.imgur.com/c4jt321.png",
        author: "DevMemes",
        subreddit: "ProgrammerHumor",
        postLink: "",
        created: Date.now()
      },
      {
        title: "Tabs vs Spaces debate",
        url: "https://i.imgur.com/91sn32X.jpg",
        author: "DevMemes",
        subreddit: "ProgrammerHumor",
        postLink: "",
        created: Date.now()
      }
    ];

    const meme = builtInMemes[this.builtInIndex % builtInMemes.length];
    this.builtInIndex++;
    return meme;
  }

  clearHistory(): void {
    this.seenMemes.clear();
    this.builtInIndex = 0;
    this.memeCache.clear();
    this.cacheExpiry.clear();
  }
}
