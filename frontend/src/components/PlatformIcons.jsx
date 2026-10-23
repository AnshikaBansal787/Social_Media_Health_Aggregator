import React from 'react';
import {
  MessageSquare,
  Instagram as InstagramIcon,
  Youtube as YoutubeIcon,
  Twitter as TwitterIcon,
  Headphones,
  Flame,
  Github as GithubIcon,
  Send,
  Globe
} from 'lucide-react';

export function PlatformIcon({ name, className = "w-5 h-5" }) {
  const normalized = (name || '').toLowerCase();

  if (normalized.includes('whatsapp')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.031 2C6.516 2 2.029 6.487 2.029 12.002c0 1.954.563 3.778 1.536 5.321L2 22l4.821-1.523a9.96 9.96 0 0 0 5.21 1.525c5.515 0 10.002-4.487 10.002-10.002C22.033 6.487 17.546 2 12.031 2zm5.786 14.28c-.244.686-1.42 1.312-1.97 1.393-.513.076-1.164.108-3.73-.956-3.284-1.359-5.385-4.693-5.55-4.912-.164-.219-1.328-1.767-1.328-3.37 0-1.603.837-2.392 1.135-2.721.298-.328.65-.41.867-.41.218 0 .435.002.626.012.202.01.472-.077.738.563.273.655.932 2.274 1.014 2.438.082.164.137.356.027.575-.11.219-.164.355-.328.547-.164.192-.345.428-.493.575-.164.164-.336.342-.144.671.192.328.851 1.402 1.824 2.27 1.252 1.116 2.308 1.462 2.636 1.626.328.164.52.137.712-.082.192-.219.822-.958 1.041-1.287.219-.328.438-.274.739-.164.301.11 1.916.903 2.245 1.067.329.164.548.246.629.383.082.137.082.793-.162 1.479z"/>
      </svg>
    );
  }

  if (normalized.includes('instagram')) {
    return <InstagramIcon className={className} />;
  }

  if (normalized.includes('youtube')) {
    return <YoutubeIcon className={className} />;
  }

  if (normalized.includes('twitter') || normalized.includes('x')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    );
  }

  if (normalized.includes('discord')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 chip 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
      </svg>
    );
  }

  if (normalized.includes('reddit')) {
    return <Flame className={className} />;
  }

  if (normalized.includes('github')) {
    return <GithubIcon className={className} />;
  }

  if (normalized.includes('telegram')) {
    return <Send className={className} />;
  }

  return <Globe className={className} />;
}
