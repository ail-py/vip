# .idx/dev.nix
{ pkgs, ... }: {
  # Select the stable channel
  channel = "stable-23.11";

  # Critical packages for VLESS + Rust project
  packages = [
    pkgs.nodejs_20          # For running JavaScript and Hono
    pkgs.rustc              # Rust compiler
    pkgs.cargo              # Rust package manager
    pkgs.wasm-pack          # Tool to convert Rust to WebAssembly
    pkgs.nodePackages.pnpm  # Fast package installer
  ];

  env = {
    RUST_SRC_PATH = "${pkgs.rust.packages.stable.rustPlatform.rustLibSrc}";
  };

  idx = {
    extensions = [
      "rust-lang.rust-analyzer"
      "tamasfe.even-better-toml"
      "esbenp.prettier-vscode"
    ];

    workspace = {
      onCreate = {
        # Automatically install Wrangler (Cloudflare tool)
        install-wrangler = "npm install -g wrangler";
      };
    };
  };
}
