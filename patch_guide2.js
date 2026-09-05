const fs = require('fs');

let code = fs.readFileSync('artifacts/ai-trading/src/pages/guide.tsx', 'utf8');

code = code.replace(/  const isAlreadyCompleted = useMemo\(\(\) => \{[\s\S]*?\}, \[activeArticleId, catalog\]\);/, '  const [completedGuides, setCompletedGuides] = useState<Set<string>>(new Set());\n  const isAlreadyCompleted = completedGuides.has(activeArticleId || "");');
code = code.replace('  const { data: catalog } = useGetProgressionCatalog();', '');

code = code.replace(/if \(res.reason === "duplicate"\) \{[\s\S]*?\} else if/s, `if (res.reason === "duplicate") {
          setCompletedGuides(prev => new Set([...prev, activeArticleId!]));
          toast({ title: t.progression.guide_already_completed });
        } else if`);

fs.writeFileSync('artifacts/ai-trading/src/pages/guide.tsx', code);
