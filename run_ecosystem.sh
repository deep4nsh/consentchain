#!/bin/bash

# ConsentChain Ecosystem Orchestrator
# This script launches the main vault and all demo portals simultaneously.

# Colors for better visibility
GREEN='\033[0;32m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

echo -e "${PURPLE}🧬 ConsentChain Ecosystem: Starting Engines...${NC}"

# 1. Start Main Vault (Next.js)
echo -e "${BLUE}[Vault]${NC} Starting Next.js on port 3000..."
(cd . && npm run dev) &

# 2. Start Medical Demo
if [ -d "../medical-demo" ]; then
    echo -e "${GREEN}[Medical]${NC} Serving Medical Demo on port 3001..."
    (cd ../medical-demo && npx -y serve -l 3001) &
else
    echo -e "${BLUE}[Medical]${NC} medical-demo directory not found in parent folder."
fi

# 3. Start Banking Demo
if [ -d "../banking-demo" ]; then
    echo -e "${GREEN}[Banking]${NC} Serving Banking Demo on port 3002..."
    (cd ../banking-demo && npx -y serve -l 3002) &
else
    echo -e "${BLUE}[Banking]${NC} banking-demo directory not found in parent folder."
fi

# 4. Start Insurance Demo
if [ -d "../insurance-demo" ]; then
    echo -e "${GREEN}[Insurance]${NC} Serving Insurance Demo on port 3003..."
    (cd ../insurance-demo && npx -y serve -l 3003) &
else
    echo -e "${BLUE}[Insurance]${NC} insurance-demo directory not found in parent folder."
fi

echo -e "${PURPLE}--------------------------------------------------${NC}"
echo -e "🚀 ${GREEN}Ecosystem Live!${NC}"
echo -e "Vault:     http://localhost:3000"
echo -e "Medical:   http://localhost:3001"
echo -e "Banking:   http://localhost:3002"
echo -e "Insurance: http://localhost:3003"
echo -e "${PURPLE}--------------------------------------------------${NC}"
echo "Press Ctrl+C to shut down all services."

# Wait for all background processes
wait
