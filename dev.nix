
# To learn more about how to use Nix to configure your environment
# see: https://firebase.google.com/docs/studio/customize-workspace
{pkgs}: {
  # Which nixpkgs channel to use.
  channel = "stable-24.11"; # or "unstable"
  # Use https://search.nixos.org/packages to find packages
  packages = [
    pkgs.nodejs_20
    # pkgs.zulu # Removed as Java is not used in this project
    pkgs.openssh
    pkgs.postgresql # Added for local PostgreSQL server for the backend
  ];
  # Sets environment variables in the workspace
  env = {};
  # This adds a file watcher to startup the firebase emulators. The emulators will only start if
  # a firebase.json file is written into the user's directory
  services.firebase.emulators = {
    detect = true; # Consider setting to false if not using Firebase emulators for this project
    projectId = "artnft-dev-emulator"; # Updated project ID
    services = ["auth" "firestore"]; # Review if these are needed for ArtNFT
  };
  idx = {
    # Search for the extensions you want on https://open-vsx.org/ and use "publisher.id"
    extensions = [
      "dbaeumer.vscode-eslint",
      "esbenp.prettier-vscode",
      "bradlc.vscode-tailwindcss",
      "eamodio.gitlens",
      "VisualStudioExptTeam.vscodeintellicode"
      # "vscodevim.vim"
    ];
    workspace = {
      # Runs when the workspace is first created
      onCreate = {
        default.openFiles = [
          "README.md",
          "src/app/home/page.tsx",
          "artnft-backend-node/src/server.ts"
        ];
      };
      # Runs when the workspace is started
      # onStart = {
      #   # Example: Install project dependencies or run a script
      #   # project-setup = "npm install && npm run db:migrate";
      # };
    };
    # Enable previews and customize configuration
    previews = {
      enable = true;
      previews = {
        web = {
          command = ["npm" "run" "dev" "--" "--port" "$PORT" "--hostname" "0.0.0.0"];
          manager = "web";
          label = "Frontend (Next.js)";
        };
        backend = {
          # Assuming your backend dev script is in artnft-backend-node/package.json
          command = ["npm" "run" "dev" "--prefix" "artnft-backend-node"];
          manager = "web"; # "process" might also be suitable if it's just logs
          port = 5000; # Default port for the Node.js backend
          label = "Backend API";
        };
        genkitUI = {
          command = ["npm" "run" "genkit:watch"];
          manager = "web";
          port = 4000; # Default port for Genkit Developer UI
          label = "Genkit Dev UI";
        };
      };
    };
    # VSCode settings that are applied to the workspace
    # "settings": {
    #   "editor.formatOnSave": true,
    #   "[typescript]": {
    #     "editor.defaultFormatter": "esbenp.prettier-vscode"
    #   },
    #   "[typescriptreact]": {
    #     "editor.defaultFormatter": "esbenp.prettier-vscode"
    #   }
    # }
  };
}
