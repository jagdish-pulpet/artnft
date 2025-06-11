
// To run this script: npm run db:seed:dev-users
// Make sure your .env.local file has NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
// Also, ensure your database schema (profiles table, etc.) is created first.

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

// For a seeding script that runs in Node.js, we use createClient directly.
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const dummyUsersForSeeding = [
  {
    email: 'testuser1@artnft.io',
    password: 'Password123!', // Choose a strong password for testing
    profileData: {
        username: 'TestUserAlpha',
        avatar_url: 'https://placehold.co/150x150.png?text=TA',
        bio: 'Alpha tester and NFT enthusiast. Looking for groundbreaking digital art.',
    }
  },
  {
    email: 'collector22@artnft.io',
    password: 'Password123!',
    profileData: {
        username: 'CollectorBeta',
        avatar_url: 'https://placehold.co/150x150.png?text=CB',
        bio: 'Beta phase art collector. Specializing in abstract and pixel art forms.',
    }
  },
  {
    email: 'artist_creator@artnft.io',
    password: 'Password123!',
    profileData: {
        username: 'CreatorGamma',
        avatar_url: 'https://placehold.co/150x150.png?text=CG',
        bio: 'Gamma wave artist. Creating generative patterns and surreal landscapes with a touch of code.',
    }
  },
  { // User for testing the profile page data fetching in your app
    email: 'testuser@artnft.com',
    password: 'password123',
    profileData: {
        username: 'TestUserMain',
        avatar_url: 'https://placehold.co/150x150.png?text=TM',
        bio: 'Main test user for specific simulated data scenarios and app testing.',
    }
  },
  { // Admin user for testing admin login
    email: 'admin@artnft.com',
    password: 'adminpass',
    profileData: {
        username: 'ArtNFTAdmin',
        avatar_url: 'https://placehold.co/150x150.png?text=AD',
        bio: 'Platform Administrator for ArtNFT Marketplace.',
    }
  }
];

async function seedDevUsersAndProfiles() {
  console.log('Starting user and profile seeding process...');

  for (const userData of dummyUsersForSeeding) {
    let authUser: User | null = null;
    let session; // To store session if one is created

    console.log(`\nProcessing user: ${userData.email}`);

    // 1. Attempt to sign up the user.
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
    });

    if (signUpError) {
      if (signUpError.message.includes('User already registered') || signUpError.message.includes('already registered')) {
        console.warn(`User ${userData.email} already exists. Attempting to fetch their ID by signing in.`);
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email: userData.email,
            password: userData.password,
        });

        if (signInError) {
            console.error(`Error signing in existing user ${userData.email} to retrieve ID:`, signInError.message);
            continue; 
        }
        authUser = signInData?.user || null;
        session = signInData?.session; // Store session if created
      } else if (signUpError.message.includes('Email rate limit exceeded')) {
        console.warn(`Email rate limit exceeded for ${userData.email}. Attempting to sign in to get existing user ID.`);
         const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email: userData.email,
            password: userData.password,
        });
         if (!signInError && signInData?.user) {
            authUser = signInData.user;
            session = signInData?.session;
         } else {
            console.error(`Could not sign in ${userData.email} after rate limit error: ${signInError?.message}`);
            continue;
         }
      } else {
        console.error(`Error signing up ${userData.email}:`, signUpError.message);
        continue; 
      }
    } else {
      authUser = signUpData.user;
      session = signUpData.session;
      if (authUser) {
        console.log(`User ${userData.email} signed up successfully. User ID: ${authUser.id}`);
        if (!session) { // session is null if email confirmation is required
            console.log(`Email confirmation might be required for ${userData.email}. For seeding, users are typically auto-confirmed or confirmation is off in dev.`);
        }
      } else {
        console.error(`Signup for ${userData.email} did not return a user object, though no explicit error was thrown.`);
        continue;
      }
    }

    // If a session was created (e.g., email confirmation off, or sign-in succeeded), sign out to clean up.
    // This script doesn't need to maintain an active session.
    if (session) {
        const { error: signOutError } = await supabase.auth.signOut();
        if (signOutError) {
            console.warn(`Could not sign out temporary session for ${userData.email}:`, signOutError.message);
        } else {
            console.log(`Signed out temporary session for ${userData.email}.`);
        }
    }

    if (!authUser || !authUser.id) {
      console.error(`Could not obtain a valid User ID for ${userData.email}. Skipping profile creation.`);
      continue;
    }

    // 2. Create or update their profile in public.profiles
    console.log(`Attempting to create/update profile for ${userData.profileData.username} with User ID: ${authUser.id}`);
    const profileToUpsert = {
        id: authUser.id, 
        username: userData.profileData.username,
        avatar_url: userData.profileData.avatar_url,
        bio: userData.profileData.bio,
        updated_at: new Date().toISOString(),
        // created_at will be set by DB default if new, or won't be touched if updating (unless specified)
    };

    const { error: profileError } = await supabase
      .from('profiles')
      .upsert(profileToUpsert, {
          onConflict: 'id', 
        });

    if (profileError) {
      console.error(`Error creating/updating profile for ${userData.profileData.username} (User ID: ${authUser.id}):`, profileError.message);
      console.error('Details:', profileError.details, 'Hint:', profileError.hint);
    } else {
      console.log(`Profile for ${userData.profileData.username} (User ID: ${authUser.id}) created/updated successfully.`);
    }
  }

  console.log('\nUser and profile seeding process finished.');
  console.log('Please check your Supabase dashboard (Authentication > Users and Database > profiles table) to verify.');
  console.log('If email confirmation is enabled in your Supabase project, you may need to confirm the users manually for them to be fully active for app login.');
}

seedDevUsersAndProfiles().catch((e) => {
  console.error('\nSeeding script encountered a fatal error:');
  console.error(e);
  process.exit(1);
});

