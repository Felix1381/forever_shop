const fs = require('fs');
const path = require('path');

// Fichiers à corriger
const filesToFix = [
  'src/app/admin/categories/page.tsx',
  'src/app/admin/categories/new/page.tsx',
  'src/app/admin/categories/[id]/page.tsx',
  'src/app/admin/categories/[id]/edit/page.tsx'
];

function fixJSXSyntaxInFile(filePath) {
  const fullPath = path.join(process.cwd(), filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  Fichier non trouvé: ${filePath}`);
    return false;
  }
  
  console.log(`🔧 Correction de la syntaxe JSX: ${filePath}`);
  
  let content = fs.readFileSync(fullPath, 'utf8');
  let hasChanges = false;
  
  // Corriger les attributs placeholder dupliqués ou mal formatés
  const placeholderRegex = /placeholder:text-muted-foreground placeholder="/g;
  if (content.match(placeholderRegex)) {
    content = content.replace(placeholderRegex, 'placeholder="');
    hasChanges = true;
    console.log('  ✅ Corrigé: attributs placeholder dupliqués');
  }
  
  // Corriger les classes CSS dupliquées (ex: bg-background bg-background)
  const duplicateClassRegex = /(\w+-\w+(?:-\w+)*)\s+\1/g;
  if (content.match(duplicateClassRegex)) {
    content = content.replace(duplicateClassRegex, '$1');
    hasChanges = true;
    console.log('  ✅ Corrigé: classes CSS dupliquées');
  }
  
  // Corriger les espaces multiples dans les className
  const multipleSpacesRegex = /className="([^"]*?)\s{2,}([^"]*?)"/g;
  if (content.match(multipleSpacesRegex)) {
    content = content.replace(multipleSpacesRegex, 'className="$1 $2"');
    hasChanges = true;
    console.log('  ✅ Corrigé: espaces multiples dans className');
  }
  
  // Corriger les attributs JSX malformés (ex: attribut:valeur)
  const malformedAttributeRegex = /(\w+):(\w+(?:-\w+)*)\s+(\w+)="/g;
  if (content.match(malformedAttributeRegex)) {
    content = content.replace(malformedAttributeRegex, '$3="');
    hasChanges = true;
    console.log('  ✅ Corrigé: attributs JSX malformés');
  }
  
  // Nettoyer les className avec des classes en double
  const classNameRegex = /className="([^"]*)"/g;
  content = content.replace(classNameRegex, (match, classes) => {
    const classArray = classes.split(/\s+/).filter(Boolean);
    const uniqueClasses = [...new Set(classArray)];
    return `className="${uniqueClasses.join(' ')}"`;
  });
  
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
  console.log('🔧 Correction des erreurs de syntaxe JSX dans les pages de catégories admin...\n');
  
  let totalFixed = 0;
  
  filesToFix.forEach(filePath => {
    if (fixJSXSyntaxInFile(filePath)) {
      totalFixed++;
    }
    console.log(''); // Ligne vide pour la lisibilité
  });
  
  console.log(`🎉 Correction terminée !`);
  console.log(`📊 Résumé: ${totalFixed}/${filesToFix.length} fichiers corrigés`);
  
  if (totalFixed > 0) {
    console.log('\n✨ Les erreurs de syntaxe JSX ont été corrigées !');
    console.log('🚀 Vous pouvez maintenant relancer le serveur de développement.');
  }
}

// Exécuter le script
if (require.main === module) {
  main();
}

module.exports = { fixJSXSyntaxInFile };
