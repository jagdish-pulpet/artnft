
// To run this script: npx tsx src/lib/supabase/seed-dev-users.ts
// Make sure your .env.local file has NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY

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

// IMPORTANT: For a seeding script that might run in Node.js,
// we use createClient directly. For admin-level operations like this,
// you might consider using the service_role key for broader permissions if needed,
// but for user signup and profile creation linked to auth.uid(), anon_key is fine
// as long as RLS policies allow it.
// However, `signUp` itself is a public operation that uses the anon key.
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        // autoRefreshToken: false, // Not strictly necessary for a short-lived script
        // persistSession: false, // Not strictly necessary for a short-lived script
    }
});

const dummyUsers = [
  {
    email: 'testuser1@artnft.io',
    password: 'Password123!',
    username: 'TestUserAlpha',
    avatar_url: 'https://placehold.co/150x150.png?text=TA',
    bio: 'Alpha tester and NFT enthusiast. Looking for groundbreaking digital art.',
  },
  {
    email: 'collector22@artnft.io',
    password: 'Password123!',
    username: 'CollectorBeta',
    avatar_url: 'https://placehold.co/150x150.png?text=CB',
    bio: 'Beta phase art collector. Specializing in abstract and pixel art forms.',
  },
  {
    email: 'artist_creator@artnft.io',
    password: 'Password123!',
    username: 'CreatorGamma',
    avatar_url: 'https://placehold.co/150x150.png?text=CG',
    bio: 'Gamma wave artist. Creating generative patterns and surreal landscapes with a touch of code.',
  },
  { // Special test user from previous instructions
    email: 'testuser@artnft.com',
    password: 'password123',
    username: 'TestUserMain',
    avatar_url: 'https://placehold.co/150x150.png?text=TM',
    bio: 'Main test user for specific simulated data scenarios.',
  },
  { // Admin user
    email: 'admin@artnft.com', // Match your admin login simulation
    password: 'adminpass',      // Match your admin login simulation
    username: 'ArtNFTAdmin',
    avatar_url: 'https://placehold.co/150x150.png?text=AD',
    bio: 'Platform Administrator for ArtNFT Marketplace.',
  }
];

async function seedDevUsersAndProfiles() {
  console.log('Starting user and profile seeding...');

  for (const userData of dummyUsers) {
    let authUser: User | null = null;

    // 1. Check if user exists by email (as a proxy, since we can't query auth.users directly without admin API)
    //    A more robust way if you had admin rights would be to use supabase.auth.admin.getUserByEmail()
    //    For now, we'll try to sign up and handle the "User already registered" error.
    console.log(`Processing user: ${userData.email}`);

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      // options: { data: { full_name: userData.username } } // Example of adding metadata during signup
    });

    if (signUpError) {
      if (signUpError.message.includes('User already registered') || signUpError.message.includes('Email rate limit exceeded')) {
        console.warn(`User ${userData.email} already exists or rate limit hit. Attempting to fetch.`);
        // If user exists, we need their ID. Sign in to get the session/user object.
        // This is a workaround as we can't directly query auth.users by email easily with anon key.
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email: userData.email,
            password: userData.password,
        });
        if (signInError) {
            console.error(`Error signing in existing user ${userData.email} to get ID:`, signInError.message);
            continue; // Skip to next user
        }
        authUser = signInData?.user || null;
        // Important: Sign out immediately after fetching user if a session was created
        if (signInData?.session) {
            await supabase.auth.signOut();
        }

      } else {
        console.error(`Error signing up ${userData.email}:`, signUpError.message);
        continue; // Skip to next user if signup failed for other reasons
      }
    } else {
      authUser = signUpData.user;
      console.log(`User ${userData.email} signed up successfully.`);
      // If email confirmation is enabled, user might be in auth.users but session is null.
      // The profile can still be created.
    }

    if (!authUser || !authUser.id) {
      console.error(`Could not obtain user ID for ${userData.email}. Skipping profile creation.`);
      continue;
    }

    // 2. Create or update their profile in public.profiles
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert(
        {
          id: authUser.id, // Link to the auth.users table
          username: userData.username,
          avatar_url: userData.avatar_url,
          bio: userData.bio,
          updated_at: new Date().toISOString(), // Set updated_at
          // created_at will be set by default by the database if inserting
        },
        {
          onConflict: 'id', // If profile with this ID exists, update it
        }
      );

    if (profileError) {
      console.error(`Error creating/updating profile for ${userData.username} (User ID: ${authUser.id}):`, profileError.message);
    } else {
      console.log(`Profile for ${userData.username} (User ID: ${authUser.id}) created/updated successfully.`);
    }
  }

  console.log('User and profile seeding finished.');
}

seedDevUsersAndProfiles().catch((e) => {
  console.error('Seeding script failed:');
  console.error(e);
  process.exit(1);
});
