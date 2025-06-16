{pkgs}: {
  # Which nixpkgs channel to use.
  channel = "stable-24.11"; # or "unstable"
  # Use https://search.nixos.org/packages to find packages
  packages = [
    pkgs.nodejs_20
    pkgs.postgresql # For backend database consistency
    pkgs.openssh
  ];
  # Sets environment variables in the workspace
  env = {
    GOOGLE_API_KEY = "b5fd2a58-0ed9-4c0a-957c-ee0fb58e7ad7";
    # NEXT_PUBLIC_BACKEND_URL is best set in .env.local or via IDX secrets
    # COINMARKETCAP_API_KEY is best set in .env.local or via IDX secrets
  };
  # This adds a file watcher to startup the firebase emulators. The emulators will only start if
  # a firebase.json file is written into the user's directory
  services.firebase.emulators = {
    detect = true;
    projectId = "artnft-dev-emulator"; # Updated project ID
    services = ["auth", "firestore"]; # Review if these are needed for ArtNFT
  };
  idx = {
    # Search for the extensions you want on https://open-vsx.org/ and use "publisher.id"
    extensions = [
      "dbaeumer.vscode-eslint", # ESLint
      "esbenp.prettier-vscode", # Prettier
      "bradlc.vscode-tailwindcss", # Tailwind CSS IntelliSense
      "eamodio.gitlens", # GitLens
      "VisualStudioExptTeam.vscodeintellicode", # IntelliCode
      "SimonSiefke.vscode-handlebars" # Handlebars for Genkit prompts
    ];
    workspace = {
      onCreate = {
        default.openFiles = [
          "README.md",
          "src/app/home/page.tsx",
          "src/ai/flows/generate-nft-description-flow.ts",
          # "artnft-backend-node/src/server.ts" # Uncomment if backend structure is confirmed
        ];
      };
    };
    # Enable previews and customize configuration
    previews = {
      enable = true;
      previews = {
        web = {
          command = ["npm", "run", "dev", "--", "--port", "$PORT", "--hostname", "0.0.0.0"];
          manager = "web";
        };
        backend = { # Preview for the Node.js backend
          command = ["npm", "run", "dev", "--prefix", "artnft-backend-node"];
          manager = "web";
          port = 5000; # Default port for the backend
        };
        genkit = { # Preview for Genkit Developer UI
          command = ["npm", "run", "genkit:watch"];
          manager = "web";
          port = 4000; # Default port for Genkit UI
        };
      };
    };
  };
}
