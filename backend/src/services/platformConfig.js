export const PLATFORMS = [
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    category: 'Messaging',
    website: 'https://web.whatsapp.com',
    pingUrl: 'https://web.whatsapp.com',
    statusPageUrl: 'https://downdetector.com/status/whatsapp/',
    icon: 'whatsapp',
    checkType: 'http',
    description: 'Global instant messaging and voice-over-IP service owned by Meta.'
  },
  {
    id: 'instagram',
    name: 'Instagram',
    category: 'Social Media',
    website: 'https://www.instagram.com',
    pingUrl: 'https://www.instagram.com',
    statusPageUrl: 'https://downdetector.com/status/instagram/',
    icon: 'instagram',
    checkType: 'http',
    description: 'Photo and video sharing social networking service by Meta.'
  },
  {
    id: 'youtube',
    name: 'YouTube',
    category: 'Streaming & Video',
    website: 'https://www.youtube.com',
    pingUrl: 'https://www.youtube.com',
    statusPageUrl: 'https://www.youtube.com',
    icon: 'youtube',
    checkType: 'http',
    description: 'Online video sharing and streaming platform owned by Google.'
  },
  {
    id: 'twitter',
    name: 'Twitter / X',
    category: 'Social Media',
    website: 'https://x.com',
    pingUrl: 'https://x.com',
    statusPageUrl: 'https://api.twitterstat.us/',
    icon: 'twitter',
    checkType: 'http',
    description: 'Microblogging and social networking platform.'
  },
  {
    id: 'discord',
    name: 'Discord',
    category: 'Chat & Gaming',
    website: 'https://discord.com',
    pingUrl: 'https://discord.com',
    statusApiUrl: 'https://discordstatus.com/api/v2/summary.json',
    statusPageUrl: 'https://discordstatus.com',
    icon: 'discord',
    checkType: 'statuspage',
    description: 'Voice, video, and text communication platform for communities and gamers.'
  },
  {
    id: 'reddit',
    name: 'Reddit',
    category: 'Community & Forums',
    website: 'https://www.reddit.com',
    pingUrl: 'https://www.reddit.com',
    statusApiUrl: 'https://www.redditstatus.com/api/v2/summary.json',
    statusPageUrl: 'https://www.redditstatus.com',
    icon: 'reddit',
    checkType: 'statuspage',
    description: 'Network of communities where people dive into their interests and hobbies.'
  },
  {
    id: 'github',
    name: 'GitHub',
    category: 'Developer Platform',
    website: 'https://github.com',
    pingUrl: 'https://github.com',
    statusApiUrl: 'https://www.githubstatus.com/api/v2/summary.json',
    statusPageUrl: 'https://www.githubstatus.com',
    icon: 'github',
    checkType: 'statuspage',
    description: 'Software development platform providing distributed version control and hosting.'
  },
  {
    id: 'telegram',
    name: 'Telegram',
    category: 'Messaging',
    website: 'https://web.telegram.org',
    pingUrl: 'https://web.telegram.org',
    statusPageUrl: 'https://downdetector.com/status/telegram/',
    icon: 'telegram',
    checkType: 'http',
    description: 'Cloud-based mobile and desktop messaging app with end-to-end encryption.'
  }
];
