
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

// Initialize Supabase client
// Note: For scripts like this, it's okay to use the anon key.
// For server-side operations within your app that require elevated privileges,
// you'd typically use the service_role key, but that's not needed for seeding client-side accessible data.
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
    email: 'artist_creator@artnft.io', // This user will be assigned the "latest" and "popular" NFTs
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
        // Upsert based on slug to avoid duplicates and allow updates if name/description changes
        const { data, error } = await supabase
            .from('categories')
            .upsert(
                { slug: catData.slug, name: catData.name, description: catData.description },
                { onConflict: 'slug', ignoreDuplicates: false } // Ensure name/desc are updated if slug matches
            )
            .select('id, name') // Select to get the ID back, especially if it was an insert
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

// Helper arrays for generating varied NFT data
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
    const categoryValues = Array.from(categoryMap.values()); // Get array of category UUIDs

    for (const nftData of nftSet) {
        // Randomly select a category ID from the available ones
        const randomCategoryId = categoryValues[Math.floor(Math.random() * categoryValues.length)];
        const createdAt = nftData.created_at_offset_days
            ? new Date(Date.now() - nftData.created_at_offset_days * 24 * 60 * 60 * 1000).toISOString()
            : new Date().toISOString();

        const nftToInsert = {
            owner_id: userId,
            creator_id: userId, // Assuming the user is also the creator for these seeded NFTs
            title: nftData.title,
            description: nftData.description,
            image_url: nftData.image_url.replace('600x400', '400x400') + `?dummy=${Date.now()}${Math.random()}`, // Add dummy query for uniqueness if needed
            price: nftData.price,
            category_id: randomCategoryId, // Link to a seeded category
            artist_name: artistName, // Denormalized for easier display
            status: nftData.status || 'listed',
            created_at: createdAt,
            updated_at: createdAt, // Set updated_at to created_at initially
        };

        const { error } = await supabase.from('nfts').insert(nftToInsert);

        if (error) {
            console.error(`Error seeding NFT "${nftData.title}" for ${artistName}:`, error.message, error.details);
        } else {
            // console.log(`NFT "${nftData.title}" seeded for ${artistName}.`); // Reduce verbosity for many NFTs
        }
    }
    console.log(`Finished seeding ${nftSet.length} NFTs for ${artistName}.`);
}


async function seedDevUsersAndProfiles() {
  console.log('Starting user, profile, and NFT seeding process...');

  const categoryMap = await seedInitialCategories();
  let pixelPainterUserId: string | null = null;
  let pixelPainterArtistName: string = 'PixelPainter'; // Default if profile not found

  for (const userData of dummyUsersForSeeding) {
    let authUser: User | null = null;
    let session; // To store session if sign-in is needed

    console.log(`\nProcessing user: ${userData.email}`);

    // Try to sign up the user
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
    });

    if (signUpError) {
      if (signUpError.message.includes('User already registered') || signUpError.message.includes('already registered') || signUpError.message.includes('Email rate limit exceeded')) {
        console.warn(`User ${userData.email} likely already exists or rate limit hit. Attempting to fetch their ID by signing in.`);
        // If user exists, try to sign in to get their ID
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email: userData.email,
            password: userData.password,
        });

        if (signInError) {
            console.error(`Error signing in existing user ${userData.email} to retrieve ID:`, signInError.message);
            continue; // Skip this user if sign-in also fails
        }
        authUser = signInData?.user || null;
        session = signInData?.session; // Store session to sign out later if needed
      } else {
        // For other signup errors, log and skip
        console.error(`Error signing up ${userData.email}:`, signUpError.message);
        continue;
      }
    } else {
      // Signup was successful (or user was auto-confirmed if email confirmation is off)
      authUser = signUpData.user;
      session = signUpData.session;
      if (authUser) {
        console.log(`User ${userData.email} signed up successfully. User ID: ${authUser.id}`);
      } else {
        console.error(`Signup for ${userData.email} did not return a user object, though no explicit error was thrown. This can happen if email confirmation is on and no session is returned immediately.`);
        // We might still have a user object in signUpData.user even if session is null.
        // Let's proceed if authUser has an ID.
        if (!authUser || !authUser.id) {
          console.error(`Could not obtain a valid User ID for ${userData.email} after signup attempt. Skipping profile and NFT creation.`);
          continue;
        }
      }
    }

    // If a session was created (either from signUp or signIn), sign out to ensure script doesn't keep user logged in.
    // This is mainly for the case where we signed in just to get an existing user's ID.
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

    // Create or update profile for the user
    console.log(`Attempting to create/update profile for ${userData.profileData.username} with User ID: ${authUser.id}`);
    const profileToUpsert = {
        id: authUser.id, // Link to the auth.users table
        username: userData.profileData.username,
        avatar_url: userData.profileData.avatar_url,
        bio: userData.profileData.bio,
        updated_at: new Date().toISOString(),
        // created_at will be set by default by the database if not provided and table has default
    };

    const { error: profileError } = await supabase
      .from('profiles')
      .upsert(profileToUpsert, { onConflict: 'id' }); // Upsert on 'id'

    if (profileError) {
      console.error(`Error creating/updating profile for ${userData.profileData.username} (User ID: ${authUser.id}):`, profileError.message);
    } else {
      console.log(`Profile for ${userData.profileData.username} (User ID: ${authUser.id}) created/updated successfully.`);
      // Seed some generic NFTs for this user
      const userNfts: NftSeedData[] = [
          { title: `${userData.profileData.username}'s First Creation`, description: getRandomElement(nftDescriptions), image_url: 'https://placehold.co/400x300.png', price: parseFloat((Math.random() * 2 + 0.1).toFixed(2)), dataAiHint: 'abstract digital' },
          { title: `Thoughts in Color by ${userData.profileData.username}`, description: getRandomElement(nftDescriptions), image_url: 'https://placehold.co/300x400.png', price: parseFloat((Math.random() * 3 + 0.2).toFixed(2)), dataAiHint: 'colorful pattern' },
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
    const latestNftsData: NftSeedData[] = [];
    for (let i = 0; i < 20; i++) {
        latestNftsData.push({
            title: `Latest NFT ${i + 1}: ${getRandomElement(nftTitlePrefixes)} ${getRandomElement(nftTitleSuffixes)}`,
            description: getRandomElement(nftDescriptions),
            image_url: `https://placehold.co/600x400.png?text=Latest${i + 1}`,
            price: parseFloat((Math.random() * 3 + 0.5).toFixed(2)),
            dataAiHint: `latest abstract ${i % 5}`,
            created_at_offset_days: Math.floor(i / 4), // Spread out over the last 0-4 days
        });
    }
    await seedNftsForUser(pixelPainterUserId, pixelPainterArtistName, categoryMap, latestNftsData);

    const popularNftsData: NftSeedData[] = [];
     for (let i = 0; i < 20; i++) {
        popularNftsData.push({
            title: `Popular Gem ${i + 1}: ${getRandomElement(nftTitlePrefixes)} ${getRandomElement(nftTitleSuffixes)}`,
            description: getRandomElement(nftDescriptions),
            image_url: `https://placehold.co/600x400.png?text=Popular${i + 1}`,
            price: parseFloat((Math.random() * 5 + 1).toFixed(2)), // Popular might be pricier
            dataAiHint: `popular collectible ${i % 5}`,
            created_at_offset_days: 30 + Math.floor(i / 2), // Spread out over 30-39 days ago
        });
    }
    await seedNftsForUser(pixelPainterUserId, pixelPainterArtistName, categoryMap, popularNftsData);
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
