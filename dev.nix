# To learn more about how to use Nix to configure your environment
# see: https://firebase.google.com/docs/studio/customize-workspace
{pkgs}: {
  # Which nixpkgs channel to use.
  channel = "stable-24.11"; # or "unstable"
  # Use https://search.nixos.org/packages to find packages
  packages = [
    pkgs.nodejs_20
    pkgs.postgresql # For MySQL/MariaDB, you'd use pkgs.mysql or pkgs.mariadb if needed directly via Nix
    pkgs.openssh
  ];
  # Sets environment variables in the workspace
  env = {
    # Example: For Next.js app in apps/web
    # NEXT_PUBLIC_BACKEND_URL = "http://localhost:5001"; # Adjust if API port changes
    # For API app in apps/api
    # PORT = "5001"; # Or whatever your API will run on
    GOOGLE_API_KEY = "b5fd2a58-0ed9-4c0a-957c-ee0fb58e7ad7";
  };
  # This adds a file watcher to startup the firebase emulators. The emulators will only start if
  # a firebase.json file is written into the user's directory
  services.firebase.emulators = {
    detect = true;
    projectId = "artnft-dev-emulator";
    services = ["auth" "firestore"];
  };
  idx = {
    # Search for the extensions you want on https://open-vsx.org/ and use "publisher.id"
    extensions = [
      "dbaeumer.vscode-eslint",
      "esbenp.prettier-vscode",
      "bradlc.vscode-tailwindcss",
      "eamodio.gitlens",
      "VisualStudioExptTeam.vscodeintellicode",
      "SimonSiefke.vscode-handlebars"
    ];
    workspace = {
      # Configures the root of the workspace. Can be relative or absolute.
      # root = "."; # default value, current directory
      onCreate = {
        default.openFiles = [
          "README.md",
          "apps/web/src/app/home/page.tsx",
          "apps/api/src/server.ts",
          "apps/web/src/ai/flows/generate-nft-description-flow.ts"
        ];
      };
    };
    # Enable previews and customize configuration
    previews = {
      enable = true;
      previews = {
        web = {
          # Command to run from the root of the monorepo, targeting the web app
          command = ["npm" "run" "dev:web" "--" "--port" "$PORT" "--hostname" "0.0.0.0"];
          manager = "web";
          # cwd = "apps/web"; # if the command needs to be run from the app's directory
        };
        api = {
          # Command to run from the root, targeting the api app
          command = ["npm" "run" "dev:api"]; # Assumes API runs on port defined in its .env (e.g., 5000)
          manager = "process";
          # cwd = "apps/api";
        };
        genkit = {
          # Command to run from the root, targeting genkit in the web app
          command = ["npm" "run" "genkit:watch"]; # This script is in apps/web/package.json
          manager = "process"; # Genkit runs its own server, typically on port 4000
          # cwd = "apps/web";
        };
      };
    };
  };
}
