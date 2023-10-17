. ./scripts/spinner.sh

./scripts/install/install-zsh10k.sh 1>/dev/null 2>&1 &
spinner $! "Installing ZSH powerlevel10k 🚀"
echo "✔ Installing ZSH powerlevel10k 🚀"
./scripts/install/install-bun.sh 1>/dev/null 2>&1 &
spinner $! "Installing bun 🔥"
echo "✔ Installing bun 🔥"
./scripts/install/install-git-hooks.sh 1>/dev/null 2>&1 &
spinner $! "Installing git hooks 🛠️"
echo "✔ Installing git hooks 🛠️"
npm install 1>/dev/null 2>&1 &
spinner $! "Installing dependencies 📦"
echo "✔ Installing dependencies 📦"
echo "✔ Installation complete 🎉"