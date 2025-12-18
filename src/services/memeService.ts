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

  constructor(subreddits: string[] = ['ProgrammerHumor']) {
    this.subreddits = subreddits;
  }

  setSubreddits(subreddits: string[]): void {
    this.subreddits = subreddits;
  }

  async getRandomMeme(): Promise<Meme> {
    const subreddit = this.subreddits[Math.floor(Math.random() * this.subreddits.length)];

    try {
      const meme = await this.fetchFromReddit(subreddit);
      return meme;
    } catch {
      // Fallback to built-in memes
      return this.getBuiltInMeme();
    }
  }

  private fetchFromReddit(subreddit: string): Promise<Meme> {
    return new Promise((resolve, reject) => {
      const url = `https://meme-api.com/gimme/${subreddit}`;

      https.get(url, (res) => {
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
      }).on('error', reject);
    });
  }

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
      }
    ];

    return builtInMemes[Math.floor(Math.random() * builtInMemes.length)];
  }
}
