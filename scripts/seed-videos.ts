import { db } from '@/db';
import { videoUpload } from '@/db/schema';
import dotenv from 'dotenv';
dotenv.config();

const sampleVideos = [
  {
    url: "https://videos.pexels.com/video-files/3959524/3959524-uhd_2560_1440_30fps.mp4",
    thumbnail: "https://images.pexels.com/photos/3959524/pexels-photo-3959524.jpeg?auto=compress&cs=tinysrgb&w=800",
    title: "Aloma Organic Ritual",
  },
  {
    url: "https://videos.pexels.com/video-files/4041164/4041164-uhd_2560_1440_30fps.mp4",
    thumbnail: "https://images.pexels.com/photos/4041164/pexels-photo-4041164.jpeg?auto=compress&cs=tinysrgb&w=800",
    title: "Nature's Essence",
  },
  {
    url: "https://videos.pexels.com/video-files/6127103/6127103-uhd_2560_1440_30fps.mp4",
    thumbnail: "https://images.pexels.com/photos/6127103/pexels-photo-6127103.jpeg?auto=compress&cs=tinysrgb&w=800",
    title: "Morning Radiance",
  },
  {
    url: "https://videos.pexels.com/video-files/3764513/3764513-uhd_2560_1440_25fps.mp4",
    thumbnail: "https://images.pexels.com/photos/3764513/pexels-photo-3764513.jpeg?auto=compress&cs=tinysrgb&w=800",
    title: "Botanic Glow",
  },
];

async function seed() {
  console.log('Seeding videos...');
  for (const video of sampleVideos) {
    await db.insert(videoUpload).values(video);
  }
  console.log('Done!');
}

seed().catch(console.error);
