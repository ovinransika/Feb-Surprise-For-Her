export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  icon: 'heart' | 'star' | 'music' | 'camera' | 'plane';
}

export interface Reason {
  id: string;
  text: string;
}

export interface DateIdea {
  id: string;
  title: string;
  icon: string;
}

export interface AppConfig {
  senderName: string;
  recipientName: string;
  timeline: TimelineEvent[];
  reasons: Reason[];
  loveLetter: string[];
  proposalMessage: string;
  dateIdeas: DateIdea[];
  whatsappNumber: string;
}

export const DEFAULT_CONFIG: AppConfig = {
  senderName: "Sansikehhh",
  recipientName: "Heliiiii",
  whatsappNumber: "94772245080",
  timeline: [
    { id: '1', date: '2018-01-31', title: 'The Beginning ✨', description: 'The day my world changed forever.', icon: 'heart' },
    { id: '2', date: '2023', title: 'First Date 🍕', description: 'Pizza while holding hands!', icon: 'heart' },
    { id: '3', date: '2024', title: 'First Kiss 💋', description: 'OMG Baby! I have No Words! Teri Baaton Mein 😏', icon: 'heart' },
    { id: '4', date: 'Today', title: 'Growing Stronger ❤️', description: 'Every day with you is a gift.', icon: 'heart' },
  ],
  reasons: [
    { id: '1', text: 'Your kindness!' },
    { id: '2', text: 'The way you laugh at my bad jokes.' },
    { id: '3', text: 'Your support when I am down.' },
    { id: '4', text: 'The way you care for me!' },
    { id: '5', text: 'The way you make me feel so special!' },
    { id: '6', text: 'Simply being you.' },
  ],
  loveLetter: [
    "To my favorite person,",
    "I sit here thinking about how lucky I am to have you in my life. You bring so much light, laughter, and warmth into my world. Every moment we share becomes a cherished memory.",
    "Forever yours,"
  ],
  proposalMessage: "You make me the happiest person alive. Let's make this official!",
  dateIdeas: [
    { id: '1', title: 'Candle Lit Dinner', icon: '🕯️' },
    { id: '2', title: 'Pizza Picnic', icon: '🍕' },
    { id: '3', title: 'Musical Show', icon: '🎭' },
    { id: '4', title: 'Movie', icon: '🎬' },
    { id: '5', title: 'All of the above', icon: '✨' },
  ]
};