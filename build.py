"""Monta o site em dist/: fontes embutidas, ícones e index.html.

Uso:  npm install && pip install -r requirements.txt && python build.py
"""
import base64
import pathlib
import shutil
import tempfile

from fontTools import subset
from PIL import Image, ImageDraw

RAIZ = pathlib.Path(__file__).resolve().parent
SRC, DIST = RAIZ / "src", RAIZ / "dist"
FONTES = RAIZ / "node_modules" / "@fontsource-variable"

# Só os caracteres que o português usa: deixa as fontes pequenas.
UNICODES = "U+0020-007E,U+00A0-00FF,U+2013,U+2014,U+2018,U+2019,U+201C,U+201D,U+2026,U+2022,U+2212"

MAR, AREIA, CEU = (14, 30, 38), (234, 223, 200), (143, 211, 255)


def fonte(arquivo):
    """Recorta a fonte e devolve o woff2 em base64."""
    with tempfile.TemporaryDirectory() as pasta:
        saida = pathlib.Path(pasta) / "fonte.woff2"
        subset.main([
            str(FONTES / arquivo),
            "--unicodes=" + UNICODES,
            "--layout-features=*",
            "--flavor=woff2",
            "--output-file=" + str(saida),
        ])
        return base64.b64encode(saida.read_bytes()).decode("ascii")


def icone(lado, escala=1.0, fator=4):
    """A régua: lombada vertical e graduações. A graduação azul é o “agora”."""
    n = lado * fator
    imagem = Image.new("RGB", (n, n), MAR)
    desenho = ImageDraw.Draw(imagem)
    u = n / 1024 * escala
    cx = cy = n / 2
    altura, x0 = 620, -250
    y0 = -altura / 2

    def barra(x, y, largura, alto, cor, raio):
        desenho.rounded_rectangle(
            [cx + (x0 + x) * u, cy + (y0 + y) * u, cx + (x0 + x + largura) * u, cy + (y0 + y + alto) * u],
            radius=raio * u, fill=cor)

    barra(0, 0, 96, altura, AREIA, 20)
    espessura = 76
    passo = (altura - espessura) / 4
    for i, comprimento in enumerate([392, 216, 304, 216, 392]):
        barra(150, i * passo, comprimento, espessura, CEU if i == 2 else AREIA, 18)
    return imagem.resize((lado, lado), Image.LANCZOS)


def montar():
    if DIST.exists():
        shutil.rmtree(DIST)
    (DIST / "icons").mkdir(parents=True)

    html = (SRC / "app.html").read_text(encoding="utf-8")
    partes = {
        "__FONTE_NUM__": fonte("big-shoulders/files/big-shoulders-latin-opsz-normal.woff2"),
        "__FONTE_TXT__": fonte("libre-franklin/files/libre-franklin-latin-wght-normal.woff2"),
        "__PLANO__": (SRC / "plano.js").read_text(encoding="utf-8").rstrip(),
        "__APP__": (SRC / "app.js").read_text(encoding="utf-8").rstrip(),
    }
    for marca, conteudo in partes.items():
        assert marca in html, marca
        html = html.replace(marca, conteudo)
    (DIST / "index.html").write_text(html, encoding="utf-8")

    for nome in ("sw.js", "manifest.webmanifest"):
        shutil.copy(SRC / nome, DIST / nome)
    (DIST / ".nojekyll").write_text("\n", encoding="utf-8")

    icone(512).save(DIST / "icons" / "icon-512.png")
    icone(192).save(DIST / "icons" / "icon-192.png")
    icone(180).save(DIST / "icons" / "apple-touch-icon.png")
    icone(512, escala=0.72).save(DIST / "icons" / "icon-maskable-512.png")

    print("dist/index.html:", len(html.encode("utf-8")), "bytes")


if __name__ == "__main__":
    montar()
