
// To run this script: npm run db:seed:dev-users
// Make sure your .env.local file has NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
// Also, ensure your database schema (profiles, categories, nfts, collections, favorites tables, etc.) is created first.

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
const dataAiHints = ["abstract art", "pixel character", "retro music", "landscape photo", "metaverse asset", "utility token", "fantasy creature", "sci-fi concept", "geometric pattern", "nature illustration", "space nebula", "cityscape night", "futuristic car", "ancient artifact", "glowing orb"];

function getRandomElement<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

async function seedUserCollections(userId: string, username: string): Promise<string[]> {
    const collectionIds: string[] = [];
    const numCollections = Math.floor(Math.random() * 2) + 1; // 1 or 2 collections per user

    for (let i = 0; i < numCollections; i++) {
        const collectionName = i === 0 ? `${username}'s Picks` : `My ${getRandomElement(nftTitlePrefixes)} Collection`;
        const collectionDescription = `A curated collection by ${username}.`;
        
        const { data, error } = await supabase
            .from('collections')
            .insert({ user_id: userId, name: collectionName, description: collectionDescription })
            .select('id')
            .single();

        if (error) {
            console.error(`Error seeding collection "${collectionName}" for ${username}:`, error.message);
        } else if (data) {
            console.log(`Seeded collection: "${collectionName}" for ${username} (ID: ${data.id})`);
            collectionIds.push(data.id);
        }
    }
    return collectionIds;
}


async function seedNftsForUser(userId: string, artistName: string, categoryMap: Map<string, string>, nftSet: NftSeedData[], collectionIds: string[] = [], isSpecificSet: boolean = false): Promise<string[]> {
    const createdNftIds: string[] = [];
    if (categoryMap.size === 0) {
        console.warn(`No categories available for user ${artistName}. Skipping NFT seeding for this set.`);
        return createdNftIds;
    }
    
    const categoryEntries = Array.from(categoryMap.entries()); 

    for (const nftData of nftSet) {
        const randomCategoryEntry = getRandomElement(categoryEntries);
        const categoryId = randomCategoryEntry[1]; 
        const categoryName = randomCategoryEntry[0]; 

        const createdAt = nftData.created_at_offset_days
            ? new Date(Date.now() - nftData.created_at_offset_days * 24 * 60 * 60 * 1000).toISOString()
            : new Date().toISOString();

        const assignedCollectionId = collectionIds.length > 0 && Math.random() < 0.5 ? getRandomElement(collectionIds) : null;

        const nftToInsert = {
            owner_id: userId,
            creator_id: userId,
            title: nftData.title,
            description: nftData.description,
            image_url: nftData.image_url.replace(/(\d+)x(\d+)/, '400x400') + `?dummy=${Date.now()}${Math.random()}`,
            price: nftData.price,
            artist_name: artistName,
            status: nftData.status || 'listed',
            category: categoryName,
            category_id: categoryId,
            collection_id: assignedCollectionId,
            created_at: createdAt,
            updated_at: createdAt,
        };

        const { data, error } = await supabase.from('nfts').insert(nftToInsert).select('id').single();

        if (error) {
            console.error(`Error seeding NFT "${nftData.title}" for ${artistName} (Category: ${categoryName}, Price: ${nftData.price}):`, error.message, error.details ? JSON.stringify(error.details) : '');
        } else if (data) {
            if (!isSpecificSet) {
                // console.log(`Seeded generic NFT: "${nftData.title}" for ${artistName}`);
            }
            createdNftIds.push(data.id);
        }
    }
    return createdNftIds;
}

async function seedUserFavorites(userId: string, allNftIds: string[], userOwnedNftIds: string[]) {
    if (allNftIds.length === 0) {
        console.warn(`No NFTs available to favorite for user ID ${userId}.`);
        return;
    }
    const numFavorites = Math.floor(Math.random() * 4) + 2; // 2 to 5 favorites
    const availableNftsToFavorite = allNftIds.filter(id => !userOwnedNftIds.includes(id));

    if (availableNftsToFavorite.length === 0) {
        console.warn(`No NFTs available for user ID ${userId} to favorite (excluding their own).`);
        return;
    }

    const selectedNftIdsForFavorites = new Set<string>();
    for (let i = 0; i < numFavorites && selectedNftIdsForFavorites.size < availableNftsToFavorite.length; i++) {
        selectedNftIdsForFavorites.add(getRandomElement(availableNftsToFavorite));
    }

    for (const nftId of selectedNftIdsForFavorites) {
        const { error } = await supabase.from('favorites').insert({ user_id: userId, nft_id: nftId });
        if (error) {
            if (error.code === '23505') { // Unique violation, already favorited (shouldn't happen with Set logic but good fallback)
                // console.warn(`User ${userId} already favorited NFT ${nftId}. Skipping.`);
            } else {
                console.error(`Error adding favorite for user ${userId} on NFT ${nftId}:`, error.message);
            }
        } else {
            // console.log(`User ${userId} favorited NFT ${nftId}`);
        }
    }
}


async function seedDevUsersAndProfiles() {
  console.log('Starting user, profile, category, NFT, collections, and favorites seeding process...');

  const categoryMap = await seedInitialCategories();
  let pixelPainterUserId: string | null = null;
  let pixelPainterArtistName: string = 'PixelPainter';
  
  const allSeededUserIds: string[] = [];
  const allSeededNftIds: string[] = [];
  const userOwnedNftMap: Map<string, string[]> = new Map(); // Map<userId, nftId[]>


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
      }
    }
    
    if (session) {
        const { error: signOutError } = await supabase.auth.signOut();
        if (signOutError) {
            console.warn(`Could not sign out temporary session for ${userData.email}: ${signOutError.message}`);
        }
    }

    if (!authUser || !authUser.id) {
      console.error(`Could not obtain a valid User ID for ${userData.email}. Skipping further processing for this user.`);
      continue;
    }
    allSeededUserIds.push(authUser.id);
    userOwnedNftMap.set(authUser.id, []);

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
      
      const userCollectionIds = await seedUserCollections(authUser.id, userData.profileData.username);

      if (userData.email !== 'artist_creator@artnft.io') {
        const numGenericNfts = Math.floor(Math.random() * 2) + 2;
        const userNftsData: NftSeedData[] = [];
        for (let i = 0; i < numGenericNfts; i++) {
            userNftsData.push({
                title: `${getRandomElement(nftTitlePrefixes)} #${i + 1} by ${userData.profileData.username}`,
                description: getRandomElement(nftDescriptions),
                image_url: `https://placehold.co/600x400.png?text=${encodeURIComponent(userData.profileData.username.substring(0,3))}${i+1}`,
                price: parseFloat((Math.random() * 2 + 0.1).toFixed(2)),
                dataAiHint: getRandomElement(dataAiHints),
                created_at_offset_days: Math.floor(Math.random() * 90)
            });
        }
        const createdIds = await seedNftsForUser(authUser.id, userData.profileData.username || 'Unknown Artist', categoryMap, userNftsData, userCollectionIds);
        allSeededNftIds.push(...createdIds);
        userOwnedNftMap.get(authUser.id)?.push(...createdIds);
        console.log(`Seeded ${createdIds.length} generic NFTs for ${userData.profileData.username}.`);
      }

      if (userData.email === 'artist_creator@artnft.io') {
          pixelPainterUserId = authUser.id;
          pixelPainterArtistName = userData.profileData.username || pixelPainterArtistName;
      }
    }
  }

  if (pixelPainterUserId) {
    console.log(`\nSeeding specific "Latest" and "Popular" NFTs for ${pixelPainterArtistName} (ID: ${pixelPainterUserId})`);
    const pixelPainterCollections = await seedUserCollections(pixelPainterUserId, pixelPainterArtistName);
    
    const latestNftsData: NftSeedData[] = [];
    for (let i = 0; i < 20; i++) {
        latestNftsData.push({
            title: `Latest Gem ${i + 1}: ${getRandomElement(nftTitlePrefixes)} ${getRandomElement(nftTitleSuffixes)}`,
            description: getRandomElement(nftDescriptions),
            image_url: `https://placehold.co/600x400.png?text=Latest${i + 1}`,
            price: parseFloat((Math.random() * 3 + 0.5).toFixed(2)),
            dataAiHint: getRandomElement(dataAiHints),
            created_at_offset_days: Math.floor(i / 5), // 0-4 days
        });
    }
    const latestCreatedIds = await seedNftsForUser(pixelPainterUserId, pixelPainterArtistName, categoryMap, latestNftsData, pixelPainterCollections, true);
    allSeededNftIds.push(...latestCreatedIds);
    userOwnedNftMap.get(pixelPainterUserId)?.push(...latestCreatedIds);
    console.log(`Seeded ${latestCreatedIds.length} 'Latest' NFTs for ${pixelPainterArtistName}.`);

    const popularNftsData: NftSeedData[] = [];
     for (let i = 0; i < 20; i++) {
        popularNftsData.push({
            title: `Popular Choice ${i + 1}: ${getRandomElement(nftTitlePrefixes)} ${getRandomElement(nftTitleSuffixes)}`,
            description: getRandomElement(nftDescriptions),
            image_url: `https://placehold.co/600x400.png?text=Popular${i + 1}`,
            price: parseFloat((Math.random() * 5 + 1).toFixed(2)),
            dataAiHint: getRandomElement(dataAiHints),
            created_at_offset_days: 30 + Math.floor(i / 2), // 30-39 days ago
        });
    }
    const popularCreatedIds = await seedNftsForUser(pixelPainterUserId, pixelPainterArtistName, categoryMap, popularNftsData, pixelPainterCollections, true);
    allSeededNftIds.push(...popularCreatedIds);
    userOwnedNftMap.get(pixelPainterUserId)?.push(...popularCreatedIds);
    console.log(`Seeded ${popularCreatedIds.length} 'Popular' NFTs for ${pixelPainterArtistName}.`);

  } else {
      console.warn("Could not find/create user 'artist_creator@artnft.io' (PixelPainter). Skipping featured NFT seeding.");
  }

  console.log('\nSeeding user favorites...');
  for (const userId of allSeededUserIds) {
      const ownedNfts = userOwnedNftMap.get(userId) || [];
      await seedUserFavorites(userId, allSeededNftIds, ownedNfts);
  }
  console.log('User favorites seeding finished.');

  console.log('\nUser, profile, category, NFT, collections, and favorites seeding process finished.');
  console.log('Please check your Supabase dashboard to verify the data.');
}

seedDevUsersAndProfiles().catch((e) => {
  console.error('\nSeeding script encountered a fatal error:');
  console.error(e);
  process.exit(1);
});

// Ensure your database schema includes:
// - `profiles`: id (UUID PK, FK to auth.users), username (TEXT UNIQUE), avatar_url (TEXT), bio (TEXT), cover_image_url (TEXT), updated_at (TIMESTAMPTZ)
// - `categories`: id (UUID PK), name (TEXT UNIQUE), slug (TEXT UNIQUE), description (TEXT)
// - `collections`: id (UUID PK), user_id (UUID FK to auth.users), name (TEXT), description (TEXT)
// - `nfts`: id (UUID PK), owner_id (UUID FK to auth.users), creator_id (UUID FK to auth.users), title (TEXT), description (TEXT), image_url (TEXT), price (NUMERIC), artist_name (TEXT), status (TEXT), category (TEXT), category_id (UUID FK to categories), collection_id (UUID FK to collections, nullable), created_at (TIMESTAMPTZ), updated_at (TIMESTAMPTZ)
// - `favorites`: user_id (UUID FK to auth.users), nft_id (UUID FK to nfts), created_at (TIMESTAMPTZ), PRIMARY KEY (user_id, nft_id)
