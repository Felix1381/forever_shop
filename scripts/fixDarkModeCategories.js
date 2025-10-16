const fs = require('fs');
const path = require('path');

// Mappings des classes à remplacer pour le mode sombre
const colorMappings = {
  // Texte
  'text-gray-900': 'text-foreground',
  'text-gray-800': 'text-foreground',
  'text-gray-700': 'text-foreground',
  'text-gray-600': 'text-muted-foreground',
  'text-gray-500': 'text-muted-foreground',
  'text-gray-400': 'text-muted-foreground',
  
  // Backgrounds
  'bg-white': 'bg-card',
  'bg-gray-50': 'bg-muted/50',
  'bg-gray-100': 'bg-muted',
  'bg-gray-200': 'bg-muted',
  
  // Borders
  'border-gray-200': 'border-border',
  'border-gray-300': 'border-border',
  'border-red-300': 'border-red-500',
  
  // Dividers
  'divide-gray-200': 'divide-border',
  
  // Hovers
  'hover:bg-gray-50': 'hover:bg-muted/50',
  'hover:bg-gray-100': 'hover:bg-muted',
  
  // Placeholders dans les inputs
  'placeholder="': 'placeholder:text-muted-foreground placeholder="',
  
  // Erreurs
  'text-red-600': 'text-red-500',
};

// Corrections spéciales pour les inputs
const inputCorrections = [
  {
    from: /className="([^"]*?)border([^"]*?)"/g,
    to: (match, before, after) => {
      let newClass = `${before}bg-background border${after}`;
      if (!newClass.includes('text-')) {
        newClass += ' text-foreground';
      }
      if (!newClass.includes('placeholder:')) {
        newClass += ' placeholder:text-muted-foreground';
      }
      return `className="${newClass}"`;
    }
  }
];

// Fichiers à corriger
const filesToFix = [
  'src/app/admin/categories/page.tsx',
  'src/app/admin/categories/new/page.tsx',
  'src/app/admin/categories/[id]/page.tsx',
  'src/app/admin/categories/[id]/edit/page.tsx'
];

function fixDarkModeInFile(filePath) {
  const fullPath = path.join(process.cwd(), filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  Fichier non trouvé: ${filePath}`);
    return false;
  }
  
  console.log(`🔧 Correction du mode sombre: ${filePath}`);
  
  let content = fs.readFileSync(fullPath, 'utf8');
  let hasChanges = false;
  
  // Appliquer les mappings de couleurs
  Object.entries(colorMappings).forEach(([oldClass, newClass]) => {
    const regex = new RegExp(oldClass.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    if (content.includes(oldClass)) {
      content = content.replace(regex, newClass);
      hasChanges = true;
    }
  });
  
  // Corrections spéciales pour les inputs
  inputCorrections.forEach(correction => {
    const newContent = content.replace(correction.from, correction.to);
    if (newContent !== content) {
      content = newContent;
      hasChanges = true;
    }
  });
  
  // Corrections spécifiques pour les select et textarea
  content = content.replace(
    /className="([^"]*?)px-\d+ py-\d+ border border-border([^"]*?)"/g,
    'className="$1px-$2 py-$3 bg-background border border-border text-foreground$4"'
  );
  
  // Correction pour les messages d'erreur et de succès
  content = content.replace(
    /bg-green-50 text-green-800 border border-green-200/g,
    'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800'
  );
  
  content = content.replace(
    /bg-red-50 text-red-800 border border-red-200/g,
    'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800'
  );
  
  if (hasChanges) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`✅ Fichier corrigé: ${filePath}`);
    return true;
  } else {
    console.log(`ℹ️  Aucune correction nécessaire: ${filePath}`);
    return false;
  }
}

function main() {
  console.log('🌙 Correction du mode sombre pour les pages de catégories admin...\n');
  
  let totalFixed = 0;
  
  filesToFix.forEach(filePath => {
    if (fixDarkModeInFile(filePath)) {
      totalFixed++;
    }
  });
  
  console.log(`\n🎉 Correction terminée !`);
  console.log(`📊 Résumé: ${totalFixed}/${filesToFix.length} fichiers corrigés`);
  
  if (totalFixed > 0) {
    console.log('\n✨ Les pages de catégories admin sont maintenant compatibles avec le mode sombre !');
  }
}

// Exécuter le script
if (require.main === module) {
  main();
}

module.exports = { fixDarkModeInFile, colorMappings };
