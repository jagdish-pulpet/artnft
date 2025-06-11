
// To run this script: npm run db:seed:dev-users
// Make sure your .env.local file has NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
// Also, ensure your database schema (profiles, categories, nfts tables, etc.) is created first.

import { createClient, type User } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'Error: Supabase URL or Anon Key is not defined. Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are in your .env.local file.'
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const dummyUsersForSeeding = [
  {
    email: 'testuser1@artnft.io',
    password: 'Password123!',
    profileData: {
        username: 'DigitalExplorer',
        avatar_url: 'https://placehold.co/150x150.png?text=DE',
        bio: 'Exploring the vast universe of digital art and NFTs. Always curious.',
    }
  },
  {
    email: 'collector22@artnft.io',
    password: 'Password123!',
    profileData: {
        username: 'NFTCollectorPro',
        avatar_url: 'https://placehold.co/150x150.png?text=NP',
        bio: 'Seasoned collector focusing on generative art and rare collectibles.',
    }
  },
  {
    email: 'artist_creator@artnft.io',
    password: 'Password123!',
    profileData: {
        username: 'PixelPainter',
        avatar_url: 'https://placehold.co/150x150.png?text=PP',
        bio: 'Creating vibrant worlds one pixel at a time. Lover of retro and modern digital art.',
    }
  },
  {
    email: 'testuser2@artnft.io',
    password: 'Password123!',
    profileData: {
        username: 'MetaverseMaven',
        avatar_url: 'https://placehold.co/150x150.png?text=MM',
        bio: 'Virtual world enthusiast and digital asset trader.',
    }
  },
  {
    email: 'gallery_owner@artnft.io',
    password: 'Password123!',
    profileData: {
        username: 'ArtNFTGallery',
        avatar_url: 'https://placehold.co/150x150.png?text=AG',
        bio: 'Curating the finest digital art for the ArtNFT Marketplace.',
    }
  },
  {
    email: 'testuser@artnft.com',
    password: 'password123',
    profileData: {
        username: 'AppTester01',
        avatar_url: 'https://placehold.co/150x150.png?text=AT',
        bio: 'Dedicated to testing and experiencing the ArtNFT platform.',
    }
  },
  {
    email: 'admin@artnft.com',
    password: 'adminpass',
    profileData: {
        username: 'ArtNFTAdminConsole',
        avatar_url: 'https://placehold.co/150x150.png?text=AC',
        bio: 'Platform Administrator for ArtNFT Marketplace. Managing operations.',
    }
  }
];

interface CategoryData {
    name: string;
    slug: string;
    description: string;
}

const initialCategoriesData: CategoryData[] = [
    { name: 'Digital Art', slug: 'digital-art', description: 'Creations made with digital technologies.' },
    { name: 'Photography', slug: 'photography', description: 'Art captured through the lens.' },
    { name: 'Music', slug: 'music', description: 'Audio NFTs and music-related collectibles.' },
    { name: 'Collectibles', slug: 'collectibles', description: 'Unique digital items and memorabilia.' },
    { name: 'Virtual Worlds', slug: 'virtual-worlds', description: 'Assets for metaverses and virtual environments.' },
    { name: 'Utility', slug: 'utility', description: 'NFTs that provide specific functions or access.' },
    { name: 'Other', slug: 'other', description: 'Miscellaneous and uncategorized NFTs.' },
];

async function seedInitialCategories(): Promise<Map<string, string>> {
    console.log('\nAttempting to seed initial categories...');
    const categoryMap = new Map<string, string>();

    for (const catData of initialCategoriesData) {
        const { data, error } = await supabase
            .from('categories')
            .upsert(
                { slug: catData.slug, name: catData.name, description: catData.description },
                { onConflict: 'slug', ignoreDuplicates: false }
            )
            .select('id, name')
            .single();

        if (error) {
            console.error(`Error seeding category "${catData.name}":`, error.message);
        } else if (data) {
            console.log(`Category "${data.name}" (ID: ${data.id}) seeded/verified.`);
            categoryMap.set(data.name, data.id);
        }
    }
    console.log('Category seeding finished.');
    return categoryMap;
}

interface NftSeedData {
    title: string;
    description: string;
    image_url: string;
    price: number;
    status?: 'listed' | 'on_auction' | 'draft';
    dataAiHint: string;
    created_at_offset_days?: number;
}

const nftTitlePrefixes = ["Cosmic", "Pixel", "Synthwave", "AI Generated", "Virtual", "Abstract", "Neon", "Galactic", "Mystic", "Quantum", "Ancient", "Future", "Dream", "Lost", "Found", "Sacred", "Silent", "Forgotten", "Eternal", "Chromatic", "Glitch", "Ethereal", "Surreal", "Geometric", "Minimal", "Luminous", "Ephemeral", "Timeless", "Whispering", "Celestial"];
const nftTitleSuffixes = ["Dreamscape", "Knight", "Sunset", "Landscape", "Parcel", "Flow", "Relic", "Genesis", "Echoes", "Voyage", "Odyssey", "Bloom", "Whisper", "Artifact", "Portrait", "Beats", "Token", "Figure", "Portal", "Monolith", "Fragment", "Key", "Orb", "Construct", "Vision", "Journey", "Horizon", "Serenade", "Chronicle", "Emblem"];
const nftDescriptions = [
    "A unique piece exploring the boundaries of digital art.", "This artwork captures a fleeting moment in a vibrant digital world.",
    "An exploration of color, form, and algorithm.", "Part of a limited series focusing on abstract digital landscapes.",
    "A collectible item from the dawn of a new digital era.", "Experience the fusion of technology and creativity.",
    "Meticulously crafted, this NFT is a testament to digital artistry.", "Own a piece of the future. This NFT unlocks new possibilities.",
    "From the artist's acclaimed 'Digital Dreams' collection.", "A surreal vision brought to life on the blockchain."
];

function getRandomElement<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

async function seedNftsForUser(userId: string, artistName: string, categoryMap: Map<string, string>, nftSet: NftSeedData[]) {
    console.log(`Attempting to seed ${nftSet.length} NFTs for user ${artistName} (ID: ${userId})...`);
    if (categoryMap.size === 0) {
        console.warn("No categories available to assign to NFTs. Skipping NFT seeding for this user.");
        return;
    }
    const categoryValues = Array.from(categoryMap.values());

    for (const nftData of nftSet) {
        const randomCategoryId = getRandomElement(categoryValues);
        const createdAt = nftData.created_at_offset_days
            ? new Date(Date.now() - nftData.created_at_offset_days * 24 * 60 * 60 * 1000).toISOString()
            : new Date().toISOString();

        const nftToInsert = {
            owner_id: userId,
            creator_id: userId,
            title: nftData.title,
            description: nftData.description,
            image_url: nftData.image_url.replace(/(\d+)x(\d+)/, '400x400') + `?dummy=${Date.now()}${Math.random()}`,
            price: nftData.price, // Price is now included
            category_id: randomCategoryId,
            artist_name: artistName, // Artist name is now included
            status: nftData.status || 'listed',
            created_at: createdAt,
            updated_at: createdAt,
        };

        const { error } = await supabase.from('nfts').insert(nftToInsert);

        if (error) {
            console.error(`Error seeding NFT "${nftData.title}" for ${artistName}:`, error.message, error.details);
        }
    }
    // console.log(`Finished seeding ${nftSet.length} NFTs for ${artistName}.`); // Reduce verbosity
}

async function seedDevUsersAndProfiles() {
  console.log('Starting user, profile, category, and NFT seeding process...');

  const categoryMap = await seedInitialCategories();
  let pixelPainterUserId: string | null = null;
  let pixelPainterArtistName: string = 'PixelPainter';

  for (const userData of dummyUsersForSeeding) {
    let authUser: User | null = null;
    let session;

    console.log(`\nProcessing user: ${userData.email}`);

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
    });

    if (signUpError) {
      if (signUpError.message.includes('User already registered') || signUpError.message.includes('already registered') || signUpError.message.includes('Email rate limit exceeded')) {
        console.warn(`User ${userData.email} likely already exists or rate limit hit. Attempting to fetch their ID by signing in.`);
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email: userData.email,
            password: userData.password,
        });
        if (signInError) {
            console.error(`Error signing in existing user ${userData.email} to retrieve ID:`, signInError.message);
            continue;
        }
        authUser = signInData?.user || null;
        session = signInData?.session;
      } else {
        console.error(`Error signing up ${userData.email}:`, signUpError.message);
        continue;
      }
    } else {
      authUser = signUpData.user;
      session = signUpData.session;
      if (authUser) {
        console.log(`User ${userData.email} signed up successfully. User ID: ${authUser.id}`);
      } else {
        console.error(`Signup for ${userData.email} did not return a user object. This can happen if email confirmation is on and no session is returned immediately.`);
        if (!authUser || !authUser.id) {
          console.error(`Could not obtain a valid User ID for ${userData.email} after signup attempt. Skipping profile and NFT creation.`);
          continue;
        }
      }
    }

    if (session) {
        const { error: signOutError } = await supabase.auth.signOut();
        if (signOutError) {
            console.warn(`Could not sign out temporary session for ${userData.email}: ${signOutError.message}`);
        }
    }

    if (!authUser || !authUser.id) {
      console.error(`Could not obtain a valid User ID for ${userData.email}. Skipping profile and NFT creation.`);
      continue;
    }

    const profileToUpsert = {
        id: authUser.id,
        username: userData.profileData.username,
        avatar_url: userData.profileData.avatar_url,
        bio: userData.profileData.bio,
        updated_at: new Date().toISOString(),
    };

    const { error: profileError } = await supabase
      .from('profiles')
      .upsert(profileToUpsert, { onConflict: 'id' });

    if (profileError) {
      console.error(`Error creating/updating profile for ${userData.profileData.username} (User ID: ${authUser.id}):`, profileError.message);
    } else {
      console.log(`Profile for ${userData.profileData.username} (User ID: ${authUser.id}) created/updated successfully.`);
      const userNfts: NftSeedData[] = [];
      for (let i = 0; i < 2; i++) { // Seed 2 generic NFTs for each user
          userNfts.push({
              title: `${getRandomElement(nftTitlePrefixes)} #${i + 1} by ${userData.profileData.username}`,
              description: getRandomElement(nftDescriptions),
              image_url: `https://placehold.co/600x400.png?text=${userData.profileData.username.substring(0,3)}${i+1}`,
              price: parseFloat((Math.random() * 2 + 0.1).toFixed(2)),
              dataAiHint: `user general ${i % 2 === 0 ? 'abstract' : 'portrait'}`,
              created_at_offset_days: Math.floor(Math.random() * 90) // Randomly created in last 90 days
          });
      }
      await seedNftsForUser(authUser.id, userData.profileData.username || 'Unknown Artist', categoryMap, userNfts);

      if (userData.email === 'artist_creator@artnft.io') {
          pixelPainterUserId = authUser.id;
          pixelPainterArtistName = userData.profileData.username || pixelPainterArtistName;
      }
    }
  }

  if (pixelPainterUserId) {
    console.log(`\nSeeding Featured NFTs for ${pixelPainterArtistName} (ID: ${pixelPainterUserId})`);
    const latestNftsData: NftSeedData[] = [];
    for (let i = 0; i < 20; i++) {
        latestNftsData.push({
            title: `Latest NFT ${i + 1}: ${getRandomElement(nftTitlePrefixes)} ${getRandomElement(nftTitleSuffixes)}`,
            description: getRandomElement(nftDescriptions),
            image_url: `https://placehold.co/600x400.png?text=Latest${i + 1}`,
            price: parseFloat((Math.random() * 3 + 0.5).toFixed(2)),
            dataAiHint: `latest abstract ${i % 5}`,
            created_at_offset_days: Math.floor(i / 5), // Spread out over the last 0-3 days
        });
    }
    await seedNftsForUser(pixelPainterUserId, pixelPainterArtistName, categoryMap, latestNftsData);
    console.log(`Seeded ${latestNftsData.length} 'latest' NFTs for ${pixelPainterArtistName}.`);

    const popularNftsData: NftSeedData[] = [];
     for (let i = 0; i < 20; i++) {
        popularNftsData.push({
            title: `Popular Gem ${i + 1}: ${getRandomElement(nftTitlePrefixes)} ${getRandomElement(nftTitleSuffixes)}`,
            description: getRandomElement(nftDescriptions),
            image_url: `https://placehold.co/600x400.png?text=Popular${i + 1}`,
            price: parseFloat((Math.random() * 5 + 1).toFixed(2)),
            dataAiHint: `popular collectible ${i % 5}`,
            created_at_offset_days: 30 + Math.floor(i / 2), // Spread out over 30-39 days ago
        });
    }
    await seedNftsForUser(pixelPainterUserId, pixelPainterArtistName, categoryMap, popularNftsData);
    console.log(`Seeded ${popularNftsData.length} 'popular' NFTs for ${pixelPainterArtistName}.`);

  } else {
      console.warn("Could not find/create user 'artist_creator@artnft.io' (PixelPainter). Skipping featured NFT seeding.");
  }

  console.log('\nUser, profile, category and NFT seeding process finished.');
  console.log('Please check your Supabase dashboard to verify the data.');
  console.log('You may need to refresh your application or clear cache to see the new data immediately.');
}

seedDevUsersAndProfiles().catch((e) => {
  console.error('\nSeeding script encountered a fatal error:');
  console.error(e);
  process.exit(1);
});
