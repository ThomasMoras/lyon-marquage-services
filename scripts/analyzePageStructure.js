import fs from "fs";
import path from "path";

function exploreDirectory(dir, basePath = "") {
  const structure = [];
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const itemPath = path.join(dir, item);
    const stat = fs.statSync(itemPath);

    if (stat.isDirectory()) {
      if (item === "api" || item === "_app" || item === "_document") continue;

      const subRoute = path.join(basePath, item);
      const children = exploreDirectory(itemPath, subRoute);
      structure.push({
        path: `/${subRoute}`,
        children,
        type: "directory",
      });
    } else if (
      stat.isFile() &&
      (item.endsWith(".js") ||
        item.endsWith(".jsx") ||
        item.endsWith(".ts") ||
        item.endsWith(".tsx"))
    ) {
      if (item === "_app.js" || item === "_document.js" || item.startsWith("_")) continue;

      let routePath = item.replace(/\.(js|jsx|ts|tsx)$/, "").replace(/index$/, "");

      if (routePath.includes("[") && routePath.includes("]")) {
        routePath = routePath.replace(/\[(.*?)\]/g, ":$1");
      }

      routePath = path.join(basePath, routePath);
      structure.push({
        path: routePath ? `/${routePath}` : "/",
        file: item,
        type: "file",
      });
    }
  }

  return structure;
}

function analyzeStructure() {
  try {
    let pagesDir;
    console.log(process.cwd());
    if (fs.existsSync(path.join(process.cwd(), "src/app"))) {
      pagesDir = path.join(process.cwd(), "src/app");
      console.log("Projet Next.js App Router détecté");
    } else if (fs.existsSync(path.join(process.cwd(), "pages"))) {
      pagesDir = path.join(process.cwd(), "pages");
      console.log("Projet Next.js Pages Router détecté");
    } else {
      throw new Error("Aucun répertoire pages ou app trouvé. Êtes-vous dans un projet Next.js ?");
    }

    const structure = exploreDirectory(pagesDir);

    fs.writeFileSync(
      path.join(process.cwd(), "page-structure.json"),
      JSON.stringify(structure, null, 2)
    );

    console.log("Structure de pages analysée et enregistrée dans page-structure.json");

    console.log("\nStructure de pages détectée :");
    printStructure(structure);
  } catch (error) {
    console.error("Erreur lors de l'analyse de la structure :", error);
  }
}

function printStructure(structure, indent = 0) {
  for (const item of structure) {
    const spaces = " ".repeat(indent * 2);
    console.log(`${spaces}${item.path}`);

    if (item.children) {
      printStructure(item.children, indent + 1);
    }
  }
}

analyzeStructure();
