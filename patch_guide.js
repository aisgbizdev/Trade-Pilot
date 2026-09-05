const fs = require('fs');

let code = fs.readFileSync('artifacts/ai-trading/src/pages/guide.tsx', 'utf8');
code = code.replace('\nimport { useGetProgressionCatalog } from "@workspace/api-client-react";', '');
code = code.replace('import { Layout } from "@/components/layout";', 'import { Layout } from "@/components/layout";\nimport { useGetProgressionCatalog } from "@workspace/api-client-react";');
fs.writeFileSync('artifacts/ai-trading/src/pages/guide.tsx', code);
