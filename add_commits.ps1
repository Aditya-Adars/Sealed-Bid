git config user.name "Aditya-Adars"
git config user.email "Aditya-Adars@users.noreply.github.com"

# Commit 1
Add-Content -Path "frontend/src/auction/browserDeploy.ts" -Value "// Utilities for deploying the sealed-bid auction contract via 1AM wallet"
git add "frontend/src/auction/browserDeploy.ts"
git commit -m "docs(frontend): add module description to browser deploy utils"
Start-Sleep -Seconds 1

# Commit 2
(Get-Content "frontend/src/App.tsx") -replace '"No wallet connected"', '"Disconnected from wallet"' | Set-Content "frontend/src/App.tsx"
git add "frontend/src/App.tsx"
git commit -m "refactor(frontend): improve initial wallet connection state message"
Start-Sleep -Seconds 1

# Commit 3
(Get-Content "frontend/src/App.tsx") -replace '"Connect 1AM first."', '"Please connect your 1AM wallet first."' | Set-Content "frontend/src/App.tsx"
git add "frontend/src/App.tsx"
git commit -m "feat(frontend): make wallet connection error more polite"
Start-Sleep -Seconds 1

# Commit 4
Add-Content -Path "README.md" -Value "
## Browser Compatibility

Currently, this dApp is optimized for Chromium-based browsers with the Midnight 1AM extension installed."
git add "README.md"
git commit -m "docs: add browser compatibility section to readme"
Start-Sleep -Seconds 1

# Commit 5
(Get-Content "frontend/src/App.tsx") -replace '"No preview wallet connected"', '"No preprod wallet connected"' | Set-Content "frontend/src/App.tsx"
git add "frontend/src/App.tsx"
git commit -m "fix(frontend): fix lingering preview string in wallet detail state"
Start-Sleep -Seconds 1

# Commit 6
Add-Content -Path "frontend/vite.config.ts" -Value "
// Vite configuration for the Midnight dApp frontend"
git add "frontend/vite.config.ts"
git commit -m "chore(frontend): add configuration comment to vite build script"
Start-Sleep -Seconds 1

# Commit 7
(Get-Content "frontend/src/App.tsx") -replace '<h1>Deploy from the browser.</h1>', '<h1>Deploy Contract via Browser</h1>' | Set-Content "frontend/src/App.tsx"
git add "frontend/src/App.tsx"
git commit -m "style(frontend): update deploy page heading casing"
Start-Sleep -Seconds 1

# Commit 8
Add-Content -Path "contract/tsconfig.json" -Value "
// Enforces strict type checking for the Midnight contract"
git add "contract/tsconfig.json"
git commit -m "chore(contract): annotate tsconfig with strictness reasoning"
Start-Sleep -Seconds 1

# Commit 9
(Get-Content "frontend/src/App.tsx") -replace '"Contract deployed through 1AM preprod."', '"Contract successfully deployed on 1AM preprod."' | Set-Content "frontend/src/App.tsx"
git add "frontend/src/App.tsx"
git commit -m "feat(frontend): enhance success message on contract deploy"
Start-Sleep -Seconds 1

# Commit 10
(Get-Content "README.md") -replace 'add a 1-minute walkthrough link', 'insert your 1-minute walkthrough demo link here' | Set-Content "README.md"
git add "README.md"
git commit -m "docs: clarify demo video placeholder instructions"
Start-Sleep -Seconds 1

# Commit 11
(Get-Content "frontend/src/App.tsx") -replace 'Error: {error}', 'Error Encountered: {error}' | Set-Content "frontend/src/App.tsx"
git add "frontend/src/App.tsx"
git commit -m "style(frontend): emphasize error messages in UI"
Start-Sleep -Seconds 1

# Commit 12
(Get-Content "frontend/src/App.tsx") -replace 'Success: {status}', 'Success: {status}' | Set-Content "frontend/src/App.tsx"
Add-Content -Path "frontend/src/main.tsx" -Value "
// Application entrypoint"
git add "frontend/src/main.tsx"
git commit -m "docs(frontend): document application entrypoint"
Start-Sleep -Seconds 1

git push new-origin main
