
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
  { // User for app testing (matches default in /welcome)
    email: 'testuser@artnft.com',
    password: 'password123',
    profileData: {
        username: 'AppTester01',
        avatar_url: 'https://placehold.co/150x150.png?text=AT',
        bio: 'Dedicated to testing and experiencing the ArtNFT platform.',
    }
  },
  { // Admin user for admin panel testing
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
                { onConflict: 'slug', ignoreDuplicates: false } // Ensure name/desc are updated if slug matches
            )
            .select('id, name')
            .single(); // Expect single row due to upsert on unique slug

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
    created_at_offset_days?: number; // For simulating older NFTs
}

async function seedNftsForUser(userId: string, artistName: string, categoryMap: Map<string, string>, nftSet: NftSeedData[]) {
    console.log(`Attempting to seed ${nftSet.length} NFTs for user ${artistName} (ID: ${userId})...`);
    if (categoryMap.size === 0) {
        console.warn("No categories available to assign to NFTs. Skipping NFT seeding for this user.");
        return;
    }
    const categoryValues = Array.from(categoryMap.values());

    for (const nftData of nftSet) {
        const randomCategoryId = categoryValues[Math.floor(Math.random() * categoryValues.length)];
        const createdAt = nftData.created_at_offset_days
            ? new Date(Date.now() - nftData.created_at_offset_days * 24 * 60 * 60 * 1000).toISOString()
            : new Date().toISOString();

        const nftToInsert = {
            owner_id: userId,
            creator_id: userId,
            title: nftData.title,
            description: nftData.description,
            image_url: nftData.image_url.replace('600x400', '400x400') + `?dummy=${Date.now()}${Math.random()}`, // Add dummy query for uniqueness if needed
            price: nftData.price,
            category_id: randomCategoryId, // Link to a seeded category
            artist_name: artistName,
            status: nftData.status || 'listed',
            created_at: createdAt,
            updated_at: createdAt, // Set updated_at to created_at initially
        };

        const { error } = await supabase.from('nfts').insert(nftToInsert);

        if (error) {
            console.error(`Error seeding NFT "${nftData.title}" for ${artistName}:`, error.message, error.details);
        } else {
            console.log(`NFT "${nftData.title}" seeded for ${artistName}.`);
        }
    }
}


async function seedDevUsersAndProfiles() {
  console.log('Starting user, profile, and NFT seeding process...');

  const categoryMap = await seedInitialCategories();
  let pixelPainterUserId: string | null = null;
  let pixelPainterArtistName: string = 'PixelPainter'; // Default if profile not found

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
        console.error(`Signup for ${userData.email} did not return a user object.`);
        continue;
      }
    }

    if (session) { // Sign out if a session was created (e.g. email confirmation off or after sign-in)
        await supabase.auth.signOut();
    }

    if (!authUser || !authUser.id) {
      console.error(`Could not obtain a valid User ID for ${userData.email}. Skipping profile and NFT creation.`);
      continue;
    }

    console.log(`Attempting to create/update profile for ${userData.profileData.username} with User ID: ${authUser.id}`);
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
      // Seed some generic NFTs for this user
      const userNfts: NftSeedData[] = [
          { title: `${userData.profileData.username}'s First Creation`, description: 'A unique piece by a promising artist.', image_url: 'https://placehold.co/400x300.png', price: parseFloat((Math.random() * 2 + 0.1).toFixed(2)), dataAiHint: 'abstract digital' },
          { title: `Thoughts in Color by ${userData.profileData.username}`, description: 'Exploring the spectrum of emotions.', image_url: 'https://placehold.co/300x400.png', price: parseFloat((Math.random() * 3 + 0.2).toFixed(2)), dataAiHint: 'colorful pattern' },
      ];
      await seedNftsForUser(authUser.id, userData.profileData.username || 'Unknown Artist', categoryMap, userNfts);

      // Store the ID for PixelPainter to assign featured NFTs later
      if (userData.email === 'artist_creator@artnft.io') {
          pixelPainterUserId = authUser.id;
          pixelPainterArtistName = userData.profileData.username || pixelPainterArtistName;
      }
    }
  }

  // Seed Featured (Latest & Popular) NFTs, assigning to PixelPainter
  if (pixelPainterUserId) {
    console.log(`\nSeeding Featured NFTs for ${pixelPainterArtistName} (ID: ${pixelPainterUserId})`);
    const latestNftsData: NftSeedData[] = [
        { title: 'Future Cityscape', description: 'A glimpse into a neon-lit metropolis of tomorrow.', image_url: 'https://placehold.co/600x400.png', price: 2.5, dataAiHint: 'sci-fi city', created_at_offset_days: 0 },
        { title: 'Ephemeral Bloom', description: 'A digital flower that wilts and regrows in an endless cycle.', image_url: 'https://placehold.co/600x400.png', price: 1.8, dataAiHint: 'digital flower', created_at_offset_days: 0 },
        { title: 'Quantum Entanglement', description: 'Visual representation of interconnected particles.', image_url: 'https://placehold.co/600x400.png', price: 3.1, dataAiHint: 'abstract physics', created_at_offset_days: 1 },
        { title: 'Pixel Dreamer', description: 'Lost in a retro-futuristic 8-bit world.', image_url: 'https://placehold.co/600x400.png', price: 0.9, dataAiHint: 'pixel art character', created_at_offset_days: 1 },
        { title: 'Synthwave Journey', description: 'Riding the digital waves of a neon sunset.', image_url: 'https://placehold.co/600x400.png', price: 1.2, dataAiHint: 'synthwave landscape', created_at_offset_days: 2 },
        { title: 'Celestial Glitch', description: 'Beauty in the breakdown of digital constellations.', image_url: 'https://placehold.co/600x400.png', price: 2.2, dataAiHint: 'glitch art space', created_at_offset_days: 2 },
    ];
    await seedNftsForUser(pixelPainterUserId, pixelPainterArtistName, categoryMap, latestNftsData);

    const popularNftsData: NftSeedData[] = [
        { title: 'Ancient Algorithm', description: 'A pattern discovered in forgotten code.', image_url: 'https://placehold.co/600x400.png', price: 5.0, dataAiHint: 'ancient pattern', created_at_offset_days: 30 },
        { title: 'Serene Bytes', description: 'Finding peace in the digital noise.', image_url: 'https://placehold.co/600x400.png', price: 3.5, dataAiHint: 'calm digital', created_at_offset_days: 45 },
        { title: 'Forgotten Future Relic', description: 'An artifact from a future that never was.', image_url: 'https://placehold.co/600x400.png', price: 4.2, dataAiHint: 'future relic', created_at_offset_days: 60 },
    ];
    await seedNftsForUser(pixelPainterUserId, pixelPainterArtistName, categoryMap, popularNftsData);
  } else {
      console.warn("Could not find/create user 'artist_creator@artnft.io' (PixelPainter). Skipping featured NFT seeding.");
  }


  console.log('\nUser, profile, and NFT seeding process finished.');
  console.log('Please check your Supabase dashboard to verify.');
}

seedDevUsersAndProfiles().catch((e) => {
  console.error('\nSeeding script encountered a fatal error:');
  console.error(e);
  process.exit(1);
});
