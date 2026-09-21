# André Luiz Barbosa — Professional Hub V3

Esta versão corrige o problema de mistura entre o HTML novo e o CSS/JS antigo em cache.

## IMPORTANTE — COMO PUBLICAR
No repositório `DecoLB.github.io`, substitua os arquivos antigos pelos arquivos desta pasta.

A raiz do repositório deve ficar assim:

- index.html
- style-v3.css
- script-v3.js
- andre-profile.png
- Curriculo_Andre_Barbosa.pdf
- Carta_Apresentacao_Andre_Barbosa.pdf
- favicon.svg
- manifest.json
- robots.txt
- sitemap.xml
- README.md

### Remova os arquivos antigos
Se existirem, exclua:
- style.css
- script.js
- pasta assets/
- pasta documents/

O `index.html` desta versão referencia arquivos versionados (`style-v3.css?v=3` e `script-v3.js?v=3`) para eliminar o cache da versão anterior.

Depois do commit:
1. aguarde o GitHub Pages publicar;
2. abra https://decolb.github.io;
3. pressione Ctrl+Shift+R ou Ctrl+F5.

Build marker: ALB-V3-FIXED-20260921
