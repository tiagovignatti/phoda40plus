# Phoda 40+

App Treino Phoda 40+: web app instalável (PWA) com os treinos da semana e a
linha do tempo do objetivo. Abre no treino do dia, funciona sem rede e segue a
data do aparelho.

Endereço: https://tiagovignatti.github.io/phoda40plus/

## Como funciona

- `src/plano.js`: os dados. Treinos, escada de saltos e fases do objetivo.
- `src/app.html` e `src/app.js`: a interface.
- `src/sw.js` e `src/manifest.webmanifest`: offline e instalação.
- `build.py`: monta `dist/` com as fontes embutidas e os ícones.
- `.github/workflows/publicar.yml`: a cada push no `main`, monta o site e envia
  para o ramo `gh-pages`, que é o que o GitHub Pages serve.

## Editar o plano

Edite `src/plano.js` e faça push no `main`. Em cerca de um minuto o site está
atualizado; na próxima abertura o app mostra “Tem versão nova do plano”.

- `semana`: qual sessão cai em cada dia (0 = domingo … 6 = sábado).
- `treinos`: blocos e itens, com os minutos `de` e `ate`. A altura de cada linha
  na tela vem daí: 1 minuto = 20 px.
- `escada`: os degraus de salto e a data prevista de cada um.
- `objetivos`: as fases, com `inicio` e `fim` em `AAAA-MM-DD`. Fase com
  `aberta: true` aparece como “a definir”.

## Rodar na sua máquina

    npm install
    python3 -m venv .venv && .venv/bin/pip install -r requirements.txt
    .venv/bin/python build.py
    python3 -m http.server --directory dist 8000

## Instalar no iPhone

Abra o endereço no Safari, toque em Compartilhar e depois em Adicionar à Tela
de Início. Abra uma vez com rede; daí em diante funciona offline.

## Notas

- O repositório e o site são públicos. A página pede aos buscadores que não a
  indexem (`noindex`), mas quem tiver o endereço consegue abrir.
- Fontes Big Shoulders e Libre Franklin, licença SIL Open Font License 1.1,
  instaladas pelo npm (`@fontsource-variable`).
