# To learn more about how to use Nix to configure your environment
# see: https://firebase.google.com/docs/studio/customize-workspace
{pkgs}: {
  # Which nixpkgs channel to use.
  channel = "stable-24.11"; # or "unstable"

  # Use https://search.nixos.org/packages to find packages
  packages = [
    pkgs.nodejs_20 # Essential for Next.js, Node.js backend, and Genkit
    pkgs.postgresql # For the ArtNFT backend's database
    pkgs.openssh # General utility
  ];

  # Sets environment variables in the workspace
  env = {
    # Example: For PostgreSQL if managed via Nix and data needs to persist locally
    # PGDATA = "/workspace/.pgdata";
    # Note: GOOGLE_API_KEY for Genkit should be managed via .env.local or IDX secrets
  };

  # Firebase emulators. Review if auth/firestore are needed, as ArtNFT uses a custom backend.
  services.firebase.emulators = {
    detect = true; # Auto-starts if firebase.json is present
    projectId = "artnft-dev-emulator"; # Updated project ID for clarity
    services = ["auth" "firestore"]; # List the emulators you might use
  };

  idx = {
    # Search for extensions on https://open-vsx.org/ and use "publisher.id"
    extensions = [
      "dbaeumer.vscode-eslint", # ESLint for code quality
      "esbenp.prettier-vscode", # Prettier for code formatting
      "bradlc.vscode-tailwindcss", # Tailwind CSS IntelliSense
      "eamodio.gitlens", # GitLens for Git insights
      "VisualStudioExptTeam.vscodeintellicode", # AI-assisted IntelliSense
      "SimonSiefke.vscode-handlebars" # For Genkit prompt template highlighting
      # "vscodevim.vim" # Uncomment if you use Vim keybindings
    ];

    workspace = {
      # Runs on workspace creation
      onCreate = {
        default.openFiles = [
          "README.md",
          "src/app/home/page.tsx", # Main frontend page
          "artnft-backend-node/src/server.ts", # Backend entry point
          "src/ai/flows/generate-nft-description-flow.ts" # Example AI flow
        ];
      };
    };

    # Enable previews and customize configuration
    previews = {
      enable = true;
      previews = {
        web = { # Next.js Frontend
          command = ["npm" "run" "dev" "--" "--port" "$PORT" "--hostname" "0.0.0.0"];
          manager = "web";
          # label = "Next.js Frontend"; # Optional label
        };
        backend = { # Node.js Backend
          command = ["cd" "artnft-backend-node" "&&" "npm" "run" "dev"];
          manager = "web"; # IDX will assign a port. Check backend logs.
          # label = "Node.js Backend"; # Optional label
        };
        genkit = { # Genkit Developer UI
          command = ["npm" "run" "genkit:watch"]; # Uses the script from package.json
          manager = "web"; # Genkit UI typically runs on port 4000 by default
          # label = "Genkit Dev UI"; # Optional label
        };
      };
    };
  };
}
