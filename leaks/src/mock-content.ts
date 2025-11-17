export default {
  "src/components/Button.tsx": `@prefix ex: <http://example.org/> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .

ex:Button rdf:type ex:Component ;
  ex:name "Button" ;
  ex:type "tsx" .`,
  "src/components/Header.tsx": `@prefix ex: <http://example.org/> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .

ex:Header rdf:type ex:Component ;
  ex:name "Header" ;
  ex:type "tsx" .`,
  "src/components/utils/helpers.ts": `@prefix ex: <http://example.org/> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .

ex:helpers rdf:type ex:Utility ;
  ex:name "helpers" ;
  ex:type "typescript" .`,
  "src/components/utils/constants.ts": `@prefix ex: <http://example.org/> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .

ex:constants rdf:type ex:Utility ;
  ex:name "constants" ;
  ex:type "typescript" .`,
  "src/pages/Home.tsx": `@prefix ex: <http://example.org/> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .

ex:Home rdf:type ex:Page ;
  ex:name "Home" ;
  ex:type "tsx" .`,
  "src/pages/About.tsx": `@prefix ex: <http://example.org/> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .

ex:About rdf:type ex:Page ;
  ex:name "About" ;
  ex:type "tsx" .`,
  "src/pages/admin/Dashboard.tsx": `@prefix ex: <http://example.org/> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .

ex:Dashboard rdf:type ex:Page ;
  ex:name "Dashboard" ;
  ex:type "tsx" ;
  ex:section "admin" .`,
  "src/pages/admin/Settings.tsx": `@prefix ex: <http://example.org/> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .

ex:Settings rdf:type ex:Page ;
  ex:name "Settings" ;
  ex:type "tsx" ;
  ex:section "admin" .`,
  "src/utils/api.ts": `@prefix ex: <http://example.org/> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .

ex:api rdf:type ex:Utility ;
  ex:name "api" ;
  ex:type "typescript" .`,
  "src/utils/validation.ts": `@prefix ex: <http://example.org/> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .

ex:validation rdf:type ex:Utility ;
  ex:name "validation" ;
  ex:type "typescript" .`,
  "src/index.ts": `@prefix ex: <http://example.org/> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .

ex:index rdf:type ex:EntryPoint ;
  ex:name "index" ;
  ex:type "typescript" .`,
  "src/App.tsx": `@prefix ex: <http://example.org/> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .

ex:App rdf:type ex:Application ;
  ex:name "App" ;
  ex:type "tsx" .`,
  "public/images/logo.png": `@prefix ex: <http://example.org/> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .

ex:logo rdf:type ex:Image ;
  ex:name "logo" ;
  ex:format "png" .`,
  "public/images/banner.jpg": `@prefix ex: <http://example.org/> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .

ex:banner rdf:type ex:Image ;
  ex:name "banner" ;
  ex:format "jpg" .`,
  "public/favicon.ico": `@prefix ex: <http://example.org/> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .

ex:favicon rdf:type ex:Icon ;
  ex:name "favicon" ;
  ex:format "ico" .`,
  "public/robots.txt": `@prefix ex: <http://example.org/> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .

ex:robots rdf:type ex:Config ;
  ex:name "robots" ;
  ex:format "txt" .`,
  "tests/unit/utils.test.ts": `@prefix ex: <http://example.org/> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .

ex:utilsTest rdf:type ex:Test ;
  ex:name "utils.test" ;
  ex:type "typescript" ;
  ex:category "unit" .`,
  "tests/unit/components.test.ts": `@prefix ex: <http://example.org/> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .

ex:componentsTest rdf:type ex:Test ;
  ex:name "components.test" ;
  ex:type "typescript" ;
  ex:category "unit" .`,
  "tests/integration/api.test.ts": `@prefix ex: <http://example.org/> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .

ex:apiTest rdf:type ex:Test ;
  ex:name "api.test" ;
  ex:type "typescript" ;
  ex:category "integration" .`,
  "config/dev.json": `@prefix ex: <http://example.org/> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .

ex:devConfig rdf:type ex:Config ;
  ex:name "dev" ;
  ex:format "json" ;
  ex:environment "development" .`,
  "config/prod.json": `@prefix ex: <http://example.org/> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .

ex:prodConfig rdf:type ex:Config ;
  ex:name "prod" ;
  ex:format "json" ;
  ex:environment "production" .`,
  "config/env/.env.example": `@prefix ex: <http://example.org/> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .

ex:envExample rdf:type ex:Config ;
  ex:name ".env.example" ;
  ex:format "env" .`,
  "package.json": `@prefix ex: <http://example.org/> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .

ex:package rdf:type ex:Config ;
  ex:name "package" ;
  ex:format "json" .`,
  "README.md": `@prefix ex: <http://example.org/> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .

ex:readme rdf:type ex:Documentation ;
  ex:name "README" ;
  ex:format "markdown" .`,
  "tsconfig.json": `@prefix ex: <http://example.org/> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .

ex:tsconfig rdf:type ex:Config ;
  ex:name "tsconfig" ;
  ex:format "json" .`,
  ".gitignore": `@prefix ex: <http://example.org/> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .

ex:gitignore rdf:type ex:Config ;
  ex:name ".gitignore" ;
  ex:format "text" .`
};


