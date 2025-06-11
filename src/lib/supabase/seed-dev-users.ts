
// To run this script: npm run db:seed:dev-users
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

// For a seeding script that runs in Node.js, we use createClient directly.
// The anon key is used here, which is typical for client-side operations like signUp.
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        // autoRefreshToken: false, // Not strictly necessary for a short-lived script
        // persistSession: false, // Not strictly necessary for a short-lived script
    }
});

const dummyUsers = [
  {
    email: 'testuser1@artnft.io',
    password: 'Password123!', // Choose a strong password
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
  { // Test user from previous instructions for continuity
    email: 'testuser@artnft.com',
    password: 'password123',
    username: 'TestUserMain',
    avatar_url: 'https://placehold.co/150x150.png?text=TM',
    bio: 'Main test user for specific simulated data scenarios.',
  },
  { // Admin user for testing admin login
    email: 'admin@artnft.com',
    password: 'adminpass',
    username: 'ArtNFTAdmin',
    avatar_url: 'https://placehold.co/150x150.png?text=AD',
    bio: 'Platform Administrator for ArtNFT Marketplace.',
  }
];

async function seedDevUsersAndProfiles() {
  console.log('Starting user and profile seeding...');

  for (const userData of dummyUsers) {
    let authUser: User | null = null;

    console.log(`\nProcessing user: ${userData.email}`);

    // 1. Attempt to sign up the user.
    //    Supabase signUp will create the user in auth.users.
    //    If email confirmation is ON, data.session will be null.
    //    If email confirmation is OFF, data.session will contain the session.
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      // options: { data: { full_name: userData.username } } // Example to add metadata at signup
    });

    if (signUpError) {
      if (signUpError.message.includes('User already registered')) {
        console.warn(`User ${userData.email} already exists. Attempting to fetch their ID.`);
        // If user exists, sign them in temporarily to get their user object (and thus ID).
        // This is a common workaround when you can't directly query auth.users by email with anon key.
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email: userData.email,
            password: userData.password, // Use the same password defined for dummy user
        });

        if (signInError) {
            console.error(`Error signing in existing user ${userData.email} to retrieve ID:`, signInError.message);
            continue; // Skip to next user
        }
        authUser = signInData?.user || null;
        // IMPORTANT: Sign out immediately if a session was created just to get the ID
        if (signInData?.session) {
            const { error: signOutError } = await supabase.auth.signOut();
            if (signOutError) {
                console.warn(`Could not sign out temporary session for ${userData.email}:`, signOutError.message);
            }
        }
      } else if (signUpError.message.includes('Email rate limit exceeded')) {
        console.warn(`Email rate limit exceeded for ${userData.email}. You might need to wait or try confirming existing users.`);
        // Optionally try to sign in to get existing user ID if rate limited on signup
         const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email: userData.email,
            password: userData.password,
        });
         if (!signInError && signInData?.user) {
            authUser = signInData.user;
            if (signInData?.session) await supabase.auth.signOut();
         } else {
            console.error(`Could not sign in ${userData.email} after rate limit error.`);
            continue;
         }
      } else {
        console.error(`Error signing up ${userData.email}:`, signUpError.message);
        continue; // Skip to next user if signup failed for other reasons
      }
    } else {
      authUser = signUpData.user; // User object from successful signup
      if (authUser) {
        console.log(`User ${userData.email} signed up successfully. User ID: ${authUser.id}`);
        if (!signUpData.session) {
            console.log(`Email confirmation might be required for ${userData.email}.`);
        }
      } else {
        // This case should ideally not happen if signUpError is null
        console.error(`Signup for ${userData.email} did not return a user object, though no explicit error was thrown.`);
        continue;
      }
    }

    if (!authUser || !authUser.id) {
      console.error(`Could not obtain a valid User ID for ${userData.email}. Skipping profile creation.`);
      continue;
    }

    // 2. Create or update their profile in public.profiles, linking via the authUser.id
    //    The 'profiles' table should have RLS policies allowing authenticated users to insert/update their own profile.
    //    Since we are using the anon key here, and the user (authUser) might not have an active session *for this script's client instance*
    //    if email confirmation is pending, we might hit RLS issues if policies strictly require an active session for the insert.
    //    A more robust way for a script would be to use the SERVICE_ROLE_KEY for direct DB operations if RLS is restrictive,
    //    OR ensure users are confirmed and can sign in if policies depend on auth.uid().
    //    For this dev seeding script, we'll assume that either:
    //    a) Email confirmation is off, so signUp creates a session, OR
    //    b) The RLS policy for inserting into profiles allows it based on the ID matching a user in auth.users, even if not an active session for *this script client*.
    //       (auth.uid() = id on INSERT might be tricky if user is not "logged in" from script's perspective)
    //    Using upsert helps if the script is run multiple times.
    console.log(`Attempting to create/update profile for ${userData.username} with User ID: ${authUser.id}`);
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert(
        {
          id: authUser.id, // This is the crucial link to auth.users.id
          username: userData.username,
          avatar_url: userData.avatar_url,
          bio: userData.bio,
          updated_at: new Date().toISOString(), // Keep updated_at fresh
          // created_at will be set by default by the database if inserting a new row
        },
        {
          onConflict: 'id', // If a profile with this ID exists, update it
        }
      );

    if (profileError) {
      console.error(`Error creating/updating profile for ${userData.username} (User ID: ${authUser.id}):`, profileError.message);
      console.error('Details:', profileError.details, 'Hint:', profileError.hint);
    } else {
      console.log(`Profile for ${userData.username} (User ID: ${authUser.id}) created/updated successfully.`);
    }
  }

  console.log('\nUser and profile seeding process finished.');
  console.log('Please check your Supabase dashboard (Authentication > Users and Database > profiles table) to verify.');
}

seedDevUsersAndProfiles().catch((e) => {
  console.error('\nSeeding script encountered a fatal error:');
  console.error(e);
  process.exit(1);
});
