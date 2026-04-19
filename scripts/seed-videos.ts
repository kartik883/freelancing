import dotenv from 'dotenv';
dotenv.config();

import { db } from '@/db';
import { videoUpload } from '@/db/schema';

const sampleVideos = [
  {
    url: "https://player.vimeo.com/external/517090082.sd.mp4?s=e995f57a3e70d79738f65427d6d376ca0cf599c4&profile_id=165&oauth2_token_id=57447761",
    thumbnail: "https://images.pexels.com/photos/3764513/pexels-photo-3764513.jpeg?auto=compress&cs=tinysrgb&w=800",
    title: "Organic Hydration Ritual",
    description: "Deeply hydrate and plump your skin with our signature organic mask treatment. Perfect for dry or tired skin that needs an immediate glow.",
    creatorName: "Aria Bloom",
  },
  {
    url: "https://player.vimeo.com/external/494252666.sd.mp4?s=72ce530c3098305018659d57a26f866b17c8ae97&profile_id=165&oauth2_token_id=57447761",
    thumbnail: "https://images.pexels.com/photos/4041164/pexels-photo-4041164.jpeg?auto=compress&cs=tinysrgb&w=800",
    title: "Morning Glow Routine",
    description: "Start your day with the ultimate 3-step morning routine for all-day radiance and protection against environmental stressors.",
    creatorName: "Chloe Rivers",
  },
  {
    url: "https://player.vimeo.com/external/448332306.sd.mp4?s=d00e695d713c82967f08819d9b6da894364c2438&profile_id=165&oauth2_token_id=57447761",
    thumbnail: "https://images.pexels.com/photos/6127103/pexels-photo-6127103.jpeg?auto=compress&cs=tinysrgb&w=800",
    title: "Nature's Purest Essence",
    description: "Discover the power of cold-pressed botanical oils in this evening treatment designed to repair your skin's natural barrier.",
    creatorName: "Elena Grace",
  },
  {
    url: "https://player.vimeo.com/external/517045571.sd.mp4?s=a20950392fec75fd57d07996c1f21226b68ac1b2&profile_id=165&oauth2_token_id=57447761",
    thumbnail: "https://images.pexels.com/photos/3764513/pexels-photo-3764513.jpeg?auto=compress&cs=tinysrgb&w=800",
    title: "Botanical Skin Therapy",
    description: "A calming ritual using our herbal extracts to soothe inflammation and restore balance to sensitive or stressed skin.",
    creatorName: "Sia Willow",
  },
  {
    url: "https://player.vimeo.com/external/517090082.sd.mp4?s=e995f57a3e70d79738f65427d6d376ca0cf599c4&profile_id=165&oauth2_token_id=57447761",
    thumbnail: "https://images.pexels.com/photos/3373739/pexels-photo-3373739.jpeg?auto=compress&cs=tinysrgb&w=800",
    title: "Vitamin C Brightening",
    description: "Watch how we use the Vitamin C serum to fade dark spots and achieve an even, luminious complexion in just 4 weeks.",
    creatorName: "Maya Sun",
  },
  {
    url: "https://player.vimeo.com/external/494252666.sd.mp4?s=72ce530c3098305018659d57a26f866b17c8ae97&profile_id=165&oauth2_token_id=57447761",
    thumbnail: "https://images.pexels.com/photos/3864115/pexels-photo-3864115.jpeg?auto=compress&cs=tinysrgb&w=800",
    title: "Aura Cleansing Ritual",
    description: "Not just skincare, but a soul-cleansing experience. Learn how to turn your daily wash into a meditative ritual.",
    creatorName: "Luna Star",
  },
  {
    url: "https://player.vimeo.com/external/448332306.sd.mp4?s=d00e695d713c82967f08819d9b6da894364c2438&profile_id=165&oauth2_token_id=57447761",
    thumbnail: "https://images.pexels.com/photos/3762466/pexels-photo-3762466.jpeg?auto=compress&cs=tinysrgb&w=800",
    title: "Silk Texture Treatment",
    description: "Achieve the coveted 'glass skin' look with our exfoliation-to-hydration technique that leaves skin incredibly smooth.",
    creatorName: "Zoe Silk",
  },
  {
    url: "https://player.vimeo.com/external/517045571.sd.mp4?s=a20950392fec75fd57d07996c1f21226b68ac1b2&profile_id=165&oauth2_token_id=57447761",
    thumbnail: "https://images.pexels.com/photos/4202325/pexels-photo-4202325.jpeg?auto=compress&cs=tinysrgb&w=800",
    title: "Overnight Repair Secret",
    description: "What happens while you sleep? Our night cream works overtime to stimulate collagen production and cellular repair.",
    creatorName: "Rose Night",
  },
];

async function seed() {
  console.log('Clearing existing videos...');
  await db.delete(videoUpload);
  console.log('Seeding fresh videos...');
  for (const video of sampleVideos) {
    await db.insert(videoUpload).values(video);
  }
  console.log('Done!');
}

seed().catch(console.error);


