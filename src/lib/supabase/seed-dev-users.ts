
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
        cover_image_url: 'https://placehold.co/600x200.png?text=Explorer+Banner'
    }
  },
  {
    email: 'collector22@artnft.io',
    password: 'Password123!',
    profileData: {
        username: 'NFTCollectorPro',
        avatar_url: 'https://placehold.co/150x150.png?text=NP',
        bio: 'Seasoned collector focusing on generative art and rare collectibles.',
        cover_image_url: 'https://placehold.co/600x200.png?text=Collector+Banner'
    }
  },
  {
    email: 'artist_creator@artnft.io', // This user will get more specific NFTs
    password: 'Password123!',
    profileData: {
        username: 'PixelPainter',
        avatar_url: 'https://placehold.co/150x150.png?text=PP',
        bio: 'Creating vibrant worlds one pixel at a time. Lover of retro and modern digital art.',
        cover_image_url: 'https://placehold.co/400x150.png?text=PixelArt+Cover'
    }
  },
  {
    email: 'testuser2@artnft.io',
    password: 'Password123!',
    profileData: {
        username: 'MetaverseMaven',
        avatar_url: 'https://placehold.co/150x150.png?text=MM',
        bio: 'Virtual world enthusiast and digital asset trader.',
        cover_image_url: 'https://placehold.co/600x200.png?text=Metaverse+Banner'
    }
  },
  {
    email: 'gallery_owner@artnft.io',
    password: 'Password123!',
    profileData: {
        username: 'ArtNFTGallery',
        avatar_url: 'https://placehold.co/150x150.png?text=AG',
        bio: 'Curating the finest digital art for the ArtNFT Marketplace.',
        cover_image_url: 'https://placehold.co/600x200.png?text=Gallery+Banner'
    }
  },
  {
    email: 'testuser@artnft.com', // Original test user
    password: 'password123',
    profileData: {
        username: 'AppTester01',
        avatar_url: 'https://placehold.co/150x150.png?text=AT',
        bio: 'Dedicated to testing and experiencing the ArtNFT platform.',
        cover_image_url: 'https://placehold.co/600x200.png?text=Test+Banner'
    }
  },
   {
    email: 'admin@artnft.com', // Original admin user
    password: 'adminpass',
    profileData: {
        username: 'ArtNFTAdminConsole',
        avatar_url: 'https://placehold.co/150x150.png?text=AC',
        bio: 'Platform Administrator for ArtNFT Marketplace. Managing operations.',
        cover_image_url: 'https://placehold.co/600x200.png?text=Admin+Banner'
    }
  },
  {
    email: 'user_alice@artnft.io',
    password: 'Password123!',
    profileData: {
        username: 'AliceArt',
        avatar_url: 'https://placehold.co/150x150.png?text=AA',
        bio: 'Lover of bright colors and bold statements in digital form.',
        cover_image_url: 'https://placehold.co/600x200.png?text=Alice+Banner'
    }
  },
  {
    email: 'user_bob@artnft.io',
    password: 'Password123!',
    profileData: {
        username: 'BobCollects',
        avatar_url: 'https://placehold.co/150x150.png?text=BC',
        bio: 'Searching for the rarest and most unique digital collectibles.',
        cover_image_url: 'https://placehold.co/600x200.png?text=Bob+Banner'
    }
  },
  {
    email: 'user_charlie@artnft.io',
    password: 'Password123!',
    profileData: {
        username: 'CharlieCreates',
        avatar_url: 'https://placehold.co/150x150.png?text=CC',
        bio: 'Generative artist exploring the intersection of code and aesthetics.',
        cover_image_url: 'https://placehold.co/600x200.png?text=Charlie+Banner'
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
                { onConflict: 'slug', ignoreDuplicates: false } // Ensure this matches your table's unique constraint for upsert
            )
            .select('id, name')
            .single();

        if (error) {
            console.error(`Error seeding category "${catData.name}":`, error.message);
        } else if (data) {
            console.log(`Category "${data.name}" (ID: ${data.id}) seeded/verified.`);
            categoryMap.set(data.name, data.id); // Store by name for easy lookup if needed
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
    created_at_offset_days?: number; // Days ago this NFT was "created"
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
const dataAiHints = ["abstract art", "pixel character", "retro music", "landscape photo", "metaverse asset", "utility token", "fantasy creature", "sci-fi concept", "geometric pattern", "nature illustration", "space nebula", "cityscape night", "futuristic car", "ancient artifact", "glowing orb"];


function getRandomElement<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

async function seedNftsForUser(userId: string, artistName: string, categoryMap: Map<string, string>, nftSet: NftSeedData[], isSpecificSet: boolean = false) {
    if (categoryMap.size === 0) {
        console.warn(`No categories available for user ${artistName}. Skipping NFT seeding for this set.`);
        return;
    }
    
    const categoryEntries = Array.from(categoryMap.entries()); 

    for (const nftData of nftSet) {
        const randomCategoryEntry = getRandomElement(categoryEntries);
        const categoryId = randomCategoryEntry[1]; 
        const categoryName = randomCategoryEntry[0]; 

        const createdAt = nftData.created_at_offset_days
            ? new Date(Date.now() - nftData.created_at_offset_days * 24 * 60 * 60 * 1000).toISOString()
            : new Date().toISOString();

        const nftToInsert = {
            owner_id: userId,
            creator_id: userId,
            title: nftData.title,
            description: nftData.description,
            image_url: nftData.image_url.replace(/(\d+)x(\d+)/, '400x400') + `?dummy=${Date.now()}${Math.random()}`,
            price: nftData.price,
            artist_name: artistName,
            status: nftData.status || 'listed',
            category: categoryName, // Storing category name as TEXT
            category_id: categoryId, // Storing category_id as UUID (FK to categories table)
            created_at: createdAt,
            updated_at: createdAt,
        };

        const { error } = await supabase.from('nfts').insert(nftToInsert);

        if (error) {
            console.error(`Error seeding NFT "${nftData.title}" for ${artistName} (Category: ${categoryName}, Price: ${nftData.price}):`, error.message, error.details ? JSON.stringify(error.details) : '');
        } else if (!isSpecificSet) {
            // console.log(`Seeded generic NFT: "${nftData.title}" for ${artistName}`);
        }
    }
}

async function seedDevUsersAndProfiles() {
  console.log('Starting user, profile, category, and NFT seeding process...');

  const categoryMap = await seedInitialCategories();
  let pixelPainterUserId: string | null = null;
  let pixelPainterArtistName: string = 'PixelPainter'; // Default if not found

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
        session = signInData?.session; // Capture session if sign-in is successful
      } else {
        console.error(`Error signing up ${userData.email}:`, signUpError.message);
        continue;
      }
    } else {
      authUser = signUpData.user;
      session = signUpData.session; // Capture session from signup
      if (authUser) {
        console.log(`User ${userData.email} signed up successfully. User ID: ${authUser.id}`);
      } else {
        // This block might be less necessary if Supabase always returns a user object on successful signup,
        // or if the "already registered" error is handled correctly by falling back to signIn.
        // However, keeping it as a safeguard if admin API is ever needed.
        const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers({ email: userData.email } as any); 
        if (usersError || !users || users.length === 0) {
            console.error(`Could not find user ${userData.email} via admin API after signup attempt. Skipping profile/NFT creation.`);
            continue;
        }
        authUser = users[0];
        console.log(`Fetched user ${userData.email} via admin API. User ID: ${authUser.id}`);
      }
    }
    
    // Sign out the temporary session for the current user to avoid interference
    // Only do this if a session was actually established.
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
        cover_image_url: userData.profileData.cover_image_url,
        updated_at: new Date().toISOString(),
    };

    const { error: profileError } = await supabase
      .from('profiles')
      .upsert(profileToUpsert, { onConflict: 'id' });

    if (profileError) {
      console.error(`Error creating/updating profile for ${userData.profileData.username} (User ID: ${authUser.id}):`, profileError.message);
    } else {
      console.log(`Profile for ${userData.profileData.username} (User ID: ${authUser.id}) created/updated successfully.`);
      
      // Seed 2-3 generic NFTs for each regular user
      if (userData.email !== 'artist_creator@artnft.io') { // Don't seed generic for the showcase artist here
        const numGenericNfts = Math.floor(Math.random() * 2) + 2; // 2 or 3 NFTs
        const userNfts: NftSeedData[] = [];
        for (let i = 0; i < numGenericNfts; i++) {
            userNfts.push({
                title: `${getRandomElement(nftTitlePrefixes)} #${i + 1} by ${userData.profileData.username}`,
                description: getRandomElement(nftDescriptions),
                image_url: `https://placehold.co/600x400.png?text=${encodeURIComponent(userData.profileData.username.substring(0,3))}${i+1}`,
                price: parseFloat((Math.random() * 2 + 0.1).toFixed(2)),
                dataAiHint: getRandomElement(dataAiHints),
                created_at_offset_days: Math.floor(Math.random() * 90) // Randomly created in the last 3 months
            });
        }
        await seedNftsForUser(authUser.id, userData.profileData.username || 'Unknown Artist', categoryMap, userNfts);
        console.log(`Seeded ${userNfts.length} generic NFTs for ${userData.profileData.username}.`);
      }


      if (userData.email === 'artist_creator@artnft.io') {
          pixelPainterUserId = authUser.id;
          pixelPainterArtistName = userData.profileData.username || pixelPainterArtistName;
      }
    }
  }

  // Seed specific "Latest" and "Popular" NFTs for PixelPainter
  if (pixelPainterUserId) {
    console.log(`\nSeeding specific "Latest" and "Popular" NFTs for ${pixelPainterArtistName} (ID: ${pixelPainterUserId})`);
    
    const latestNftsData: NftSeedData[] = [];
    for (let i = 0; i < 15; i++) { // Generate 15 "latest"
        latestNftsData.push({
            title: `Latest Gem ${i + 1}: ${getRandomElement(nftTitlePrefixes)} ${getRandomElement(nftTitleSuffixes)}`,
            description: getRandomElement(nftDescriptions),
            image_url: `https://placehold.co/600x400.png?text=Latest${i + 1}`,
            price: parseFloat((Math.random() * 3 + 0.5).toFixed(2)), // Prices between 0.5 and 3.5 ETH
            dataAiHint: getRandomElement(dataAiHints),
            created_at_offset_days: Math.floor(i / 3), // Spread out creation over last 0-4 days
        });
    }
    await seedNftsForUser(pixelPainterUserId, pixelPainterArtistName, categoryMap, latestNftsData, true);
    console.log(`Seeded ${latestNftsData.length} 'Latest' NFTs for ${pixelPainterArtistName}.`);

    const popularNftsData: NftSeedData[] = [];
     for (let i = 0; i < 15; i++) { // Generate 15 "popular"
        popularNftsData.push({
            title: `Popular Choice ${i + 1}: ${getRandomElement(nftTitlePrefixes)} ${getRandomElement(nftTitleSuffixes)}`,
            description: getRandomElement(nftDescriptions),
            image_url: `https://placehold.co/600x400.png?text=Popular${i + 1}`,
            price: parseFloat((Math.random() * 5 + 1).toFixed(2)), // Prices between 1 and 6 ETH
            dataAiHint: getRandomElement(dataAiHints),
            created_at_offset_days: 30 + Math.floor(i / 2), // Spread out creation over 30-37 days ago
        });
    }
    await seedNftsForUser(pixelPainterUserId, pixelPainterArtistName, categoryMap, popularNftsData, true);
    console.log(`Seeded ${popularNftsData.length} 'Popular' NFTs for ${pixelPainterArtistName}.`);

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

// Ensure your 'categories' table has: id (UUID, PK), name (TEXT, UNIQUE), slug (TEXT, UNIQUE), description (TEXT)
// Ensure your 'nfts' table has: id (UUID, PK), owner_id (UUID FK to auth.users), creator_id (UUID FK to auth.users),
// title (TEXT), description (TEXT), image_url (TEXT), price (NUMERIC), artist_name (TEXT), status (TEXT),
// category (TEXT), category_id (UUID FK to categories.id), created_at (TIMESTAMPTZ), updated_at (TIMESTAMPTZ)
// Ensure your 'profiles' table has: id (UUID, PK, FK to auth.users), username (TEXT, UNIQUE), avatar_url (TEXT), bio (TEXT), cover_image_url (TEXT), updated_at (TIMESTAMPTZ)
    
