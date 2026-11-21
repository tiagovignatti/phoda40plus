/* ──────────────────────────────────────────────────────────────────
   PLANO: tudo o que o app mostra sai deste bloco.
   Para mudar um treino ou uma fase, edite aqui e publique de novo.
   - Datas no formato AAAA-MM-DD.
   - Em cada item, "de" e "ate" são os minutos do treino.
   - "nucleo: true" marca o bloco que não pode faltar (a lombada clara).
   ────────────────────────────────────────────────────────────────── */
const PLANO = {
  nome: "Phoda 40+",

  /* 0 = domingo … 6 = sábado. Dia sem entrada é descanso. */
  semana: { 1: "A", 3: "B", 4: "FUT", 5: "C" },

  treinos: {
    A: {
      letra: "A",
      titulo: "Joelho unilateral e quadril",
      contexto: "Perna descansada do fim de semana. É o dia mais pesado.",
      blocos: [
        { nome: "Aquecimento", slots: [
          { de: 0, ate: 3, nome: "Bicicleta leve", dose: ["3 min"],
            como: "Sem resistência. É para aquecer, não para cansar.",
            porque: "É o dia de maior carga no tendão. Não entre frio." },
          { de: 3, ate: 6, nome: "Abdominal", dose: ["2 séries"],
            como: "Leve e curto.",
            porque: "Tronco pré-fatigado atrapalha o agachamento unilateral que vem depois." },
          { de: 6, ate: 8, nome: "Mobilidade dinâmica", dose: ["10 por lado"],
            como: "Balanço de perna para a frente e para trás, balanço lateral e flexão ativa de joelho: calcanhar em direção ao glúteo, sem usar a mão.",
            porque: "Mobilidade ativa aquece sem tracionar o tendão. O balanço lateral abre o quadril para o passe de chapa." }
        ]},
        { nome: "Joelho", nucleo: true, slots: [
          { de: 8, ate: 11, nome: "Spanish squat isométrico", dose: ["2×45s"],
            como: "Faixa grossa atrás dos joelhos, presa num poste. Sente para trás contra a faixa, tronco vertical, joelho a 60–70°. Sem faixa, faça parede-sentado.",
            porque: "Aquece o tendão e prepara para a carga que vem a seguir." },
          { de: 11, ate: 16, nome: "Saltos e aterrissagem", dose: ["4–6 séries"], escada: true,
            como: "Séries curtas, com qualidade. Aterrisse macio, trave a posição e só então repita.",
            porque: "No futevôlei quase tudo acontece sobre uma perna de apoio. Salto se treina com a perna fresca, antes da carga pesada." },
          { de: 16, ate: 30, nome: "Agachamento ou leg press unilateral", dose: ["4×8"], nota: "tempo lento",
            como: "3\u00A0s para descer, 1\u00A0s de pausa, 3\u00A0s para subir. As duas últimas repetições têm que ser difíceis.",
            porque: "O trabalho unilateral expõe o déficit da perna esquerda que o bilateral esconde." },
          { de: 30, ate: 38, nome: "Afundo lateral lento", dose: ["3×8"], nota: "por lado",
            como: "Passo largo para o lado, quadril para trás, desça em 3\u00A0s. A profundidade cresce aos poucos.",
            porque: "A defesa na areia é afundo em todas as direções. De quebra, carrega os adutores." }
        ]},
        { nome: "Quadril", slots: [
          { de: 38, ate: 43, nome: "Terra romeno unilateral", dose: ["3×8"],
            como: "Coluna neutra, quadril para trás, joelho de apoio levemente flexionado.",
            porque: "Equilibra a frente da coxa com a de trás e treina o apoio numa perna só." },
          { de: 43, ate: 47, nome: "Ponte, abdução e Copenhagen", dose: ["2×12", "2×15", "2×20s"],
            rotulos: ["Ponte", "Abdução", "Copenhagen curto, por lado"],
            como: "Copenhagen curto: prancha lateral com o joelho de cima apoiado no banco.",
            porque: "Quadril fraco joga carga no joelho. O Copenhagen fortalece os adutores, que o chute e o passe de chapa cobram." }
        ]}
      ]
    },

    B: {
      letra: "B",
      titulo: "Joelho em manutenção e puxar",
      contexto: "Véspera de futevôlei. Dia leve para as pernas, de propósito.",
      blocos: [
        { nome: "Joelho", nucleo: true, slots: [
          { de: 0, ate: 3, nome: "Bicicleta leve", dose: ["3 min"],
            como: "Sem resistência.",
            porque: "Sair da cadeira antes de puxar peso." },
          { de: 3, ate: 6, nome: "Parede-sentado", dose: ["2×45s"],
            como: "Costas inteiras na parede, joelho a cerca de 60°, só o peso do corpo.",
            porque: "Só manutenção, sem progressão. A carga do joelho vive nos treinos A e C." }
        ]},
        { nome: "Puxar e ombro", slots: [
          { de: 6, ate: 9, nome: "Rotação externa + full-can", dose: ["2×12"], nota: "cada",
            como: "Elástico leve, cotovelo junto ao corpo na rotação. No full-can, polegar para cima e braço 30° à frente.",
            porque: "Preparação obrigatória: hoje tem movimento acima da cabeça." },
          { de: 9, ate: 21, nome: "Remada curvada", dose: ["3×10"],
            como: "Coluna neutra e retração deliberada das escápulas no topo.",
            porque: "O antídoto mais direto das horas sentado." },
          { de: 21, ate: 31, nome: "Puxada alta", dose: ["3×10"],
            como: "Pegada neutra se o ombro reclamar da pronada." },
          { de: 31, ate: 39, nome: "Desenvolvimento com halteres", dose: ["3×10"],
            como: "Só progride se estiver 100% indolor. Amplitude parcial, se necessário." },
          { de: 39, ate: 44, nome: "Bíceps + face pull", dose: ["3×12", "2×15"],
            rotulos: ["Bíceps", "Face pull"],
            como: "No face pull, cotovelos altos e pausa curta no fim do movimento.",
            porque: "Face pull duas vezes na semana não é demais." }
        ]},
        { nome: "Tronco", slots: [
          { de: 44, ate: 47, nome: "Pallof press + mobilidade torácica", dose: ["3×10", "1 min"],
            rotulos: ["Pallof press", "Mobilidade torácica"],
            porque: "Anti-rotação é a base de qualquer giro de tronco, do chute ao forehand." }
        ]}
      ]
    },

    C: {
      letra: "C",
      titulo: "Leg press lento e empurrar",
      contexto: "Dia seguinte ao futevôlei. Leia o joelho antes de escolher a carga.",
      blocos: [
        { nome: "Joelho", nucleo: true, slots: [
          { de: 0, ate: 3, nome: "Bicicleta leve", dose: ["3 min"],
            como: "Sem resistência.",
            porque: "Você chegou de horas sentado e o joelho está frio." },
          { de: 3, ate: 6, nome: "Parede-sentado ou Spanish squat", dose: ["2×45s"],
            como: "Joelho a cerca de 60°. Difícil, mas tolerável.",
            porque: "Aquece o tendão antes do leg press." },
          { de: 6, ate: 19, nome: "Leg press tempo lento", dose: ["4×8–10"],
            regra: "Joelho acordou em 4–5 de 10 depois do futevôlei? Repita a carga da semana passada.",
            como: "3\u00A0s para descer, 1\u00A0s de pausa, 3\u00A0s para subir. As duas últimas repetições têm que ser difíceis.",
            porque: "É a carga lenta que mantém o tendão forte." },
          { de: 19, ate: 26, nome: "Stiff / terra romeno", dose: ["3×10"],
            como: "Coluna neutra, quadril para trás, barra rente às pernas.",
            porque: "O posterior de coxa equilibra a coxa e poupa o tendão do quadríceps." }
        ]},
        { nome: "Empurrar", slots: [
          { de: 26, ate: 29, nome: "Rotação externa + face pull", dose: ["2×12", "2×15"],
            rotulos: ["Rotação externa", "Face pull, leve"],
            porque: "Preparação de ombro colada no exercício que carrega o ombro." },
          { de: 29, ate: 39, nome: "Supino com halteres", dose: ["3×8–10"],
            como: "Escápulas encaixadas, desça com controle.",
            porque: "Halteres em vez de barra: o ombro escolhe a trajetória." }
        ]},
        { nome: "Fechamento", slots: [
          { de: 39, ate: 45, nome: "Tríceps corda + panturrilha unilateral", dose: ["3×12", "3×10–12"],
            rotulos: ["Tríceps corda", "Panturrilha unilateral, lenta"],
            regra: "Panturrilha moída da areia? Faça 2 séries em vez de 3.",
            como: "Bi-set: alterne os dois, três voltas. Na panturrilha, joelho estendido, suba e desça devagar.",
            porque: "Areia e pé descalço jogam carga na panturrilha e no tendão de Aquiles." }
        ]}
      ]
    }
  },

  futevolei: {
    hora: "8:30",
    titulo: "Futevôlei",
    resumo: "Na areia, uma vez por semana, por enquanto.",
    notas: [
      "Na sexta de manhã, leia o joelho antes do treino C.",
      "Fique em uma vez por semana por 4 a 6 semanas antes de pensar em aumentar.",
      "A quarta é leve para as pernas justamente para você chegar inteiro aqui."
    ]
  },

  /* Escada de saltos do treino A. "previsto" é só previsão: sobe quem passou limpo. */
  escada: [
    { nome: "Pogo no lugar", previsto: "2026-11-23" },
    { nome: "Salto com aterrissagem travada em dois pés", previsto: "2026-12-07" },
    { nome: "Salto numa perna só, aterrissagem travada", previsto: "2026-12-14" },
    { nome: "Salto lateral de uma perna para a outra", previsto: "2026-12-21" }
  ],

  semaforo: {
    titulo: "Leitura do joelho, 24\u00A0h depois",
    faixas: [
      { cor: "verde", faixa: "0–3", nome: "Progredir", texto: "Dor tolerável e, na manhã seguinte, igual ou melhor. Aumente carga, amplitude ou volume." },
      { cor: "amarelo", faixa: "4–5", nome: "Manter", texto: "Dor presente, mas sob controle, e de volta ao normal em 24\u00A0h. Repita a mesma carga." },
      { cor: "vermelho", faixa: "6+", nome: "Recuar", texto: "Dor forte ou piora que passa de 24\u00A0h. Volte à carga da semana anterior." }
    ]
  },

  /* Linha do tempo. Fase sem datas ("aberta: true") aparece como “a definir”. */
  objetivos: [
    { id: "joelho", nome: "Recuperação do joelho", inicio: "2026-08-24", fim: "2026-11-15",
      resumo: "Carga lenta e progressiva até a dor sumir e a força voltar.",
      marcos: [ { data: "2026-10-13", texto: "Sem dor desde meados de outubro." } ] },
    { id: "futevolei", nome: "Iniciando no futevôlei", inicio: "2026-11-19", fim: "2027-01-31",
      resumo: "Quintas às 8:30, uma vez por semana. O joelho passou limpo na aula experimental.",
      criterio: "Seis quintas sem reação no joelho no dia seguinte. Aí decidimos se sobe para duas vezes por semana." },
    { id: "elasticidade", nome: "Elasticidade", inicio: "2026-11-23", fim: "2026-12-27", escada: true,
      resumo: "Saltos e aterrissagem às segundas, um degrau por semana.",
      criterio: "20 saltos submáximos e 30\u00A0s de deslocamento lateral sem dor, nem na hora nem 24\u00A0h depois." },
    { id: "tenis", nome: "Volta ao tênis", aberta: true,
      resumo: "Mais adiante em 2027. A definir." }
  ]
};
