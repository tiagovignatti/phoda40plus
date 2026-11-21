(function () {
  'use strict';

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var esc = function (s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  };
  var maiuscula = function (s) { return s.charAt(0).toUpperCase() + s.slice(1); };
  /* “3 min” vira número grande com a unidade pequena ao lado. */
  var doseHTML = function (d) {
    var i = d.indexOf(' ');
    return i < 0 ? esc(d) : esc(d.slice(0, i)) + '<i>' + esc(d.slice(i + 1)) + '</i>';
  };

  var DOW = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
  var DOW_L = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
  var MES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  var MES_L = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
  var ORDEM = [1, 2, 3, 4, 5, 6, 0];
  var DIA_MS = 864e5;

  var meiaNoite = function (d) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()); };
  var dia = function (iso) { var p = iso.split('-').map(Number); return new Date(p[0], p[1] - 1, p[2]); };
  var dif = function (a, b) { return Math.round((meiaNoite(a) - meiaNoite(b)) / DIA_MS); };
  var mais = function (d, n) { return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n); };
  var curta = function (d) { return d.getDate() + ' ' + MES[d.getMonth()]; };
  var longa = function (d) { return d.getDate() + ' de ' + MES_L[d.getMonth()]; };

  var estado = { aba: 'treino', hoje: meiaNoite(new Date()), dow: new Date().getDay() };
  var tela = $('#tela');

  /* ───────── Treino ───────── */

  function totalDe(t) {
    var b = t.blocos[t.blocos.length - 1];
    return b.slots[b.slots.length - 1].ate;
  }

  function rotuloDoDia(d) {
    var c = PLANO.semana[d];
    if (!c) return DOW_L[d] + ', descanso';
    if (c === 'FUT') return DOW_L[d] + ', futevôlei';
    return DOW_L[d] + ', treino ' + c;
  }

  function telaTreino() {
    var hojeDow = estado.hoje.getDay();
    var sel = estado.dow;
    var eHoje = sel === hojeDow;
    var cod = PLANO.semana[sel];

    var h = '<header class="topo"><p class="linha-data"><span>' +
      esc(maiuscula(eHoje ? DOW_L[sel] + ', ' + longa(estado.hoje) : DOW_L[sel])) + '</span>' +
      (eHoje ? '<span class="hoje">hoje</span>' : '') + '</p>' +
      '<div class="semana" role="group" aria-label="Dias da semana">';
    ORDEM.forEach(function (d) {
      var c = PLANO.semana[d];
      var texto = c ? (c === 'FUT' ? 'Fut' : c) : '·';
      h += '<button class="dia' + (c ? '' : ' folga') + (d === hojeDow ? ' e-hoje' : '') + '" data-dow="' + d +
        '" aria-pressed="' + (d === sel) + '" aria-label="' + esc(rotuloDoDia(d)) + (d === hojeDow ? ', hoje' : '') + '">' +
        '<span class="dow" aria-hidden="true">' + DOW[d] + '</span><span class="cod num" aria-hidden="true">' + texto + '</span></button>';
    });
    h += '</div></header>';

    if (!cod) h += telaDescanso(sel, eHoje);
    else if (cod === 'FUT') h += telaFutevolei();
    else h += telaRegua(PLANO.treinos[cod]);
    return h;
  }

  function telaRegua(t) {
    var total = totalDe(t);
    var h = '<section aria-label="Treino ' + esc(t.letra) + '">' +
      '<div class="cab"><h1>Treino ' + esc(t.letra) + '</h1>' +
      '<p class="total">' + total + '<small>min</small></p></div>' +
      '<p class="sub">' + esc(t.titulo) + '</p>' +
      (t.contexto ? '<p class="contexto">' + esc(t.contexto) + '</p>' : '') +
      '<ol class="regua">';
    t.blocos.forEach(function (b, bi) {
      h += '<li class="bloco' + (b.nucleo ? ' nucleo' : '') + '"><div class="lombada"><span>' + esc(b.nome) + '</span></div><ol>';
      b.slots.forEach(function (s, si) {
        var m = s.ate - s.de;
        var linhas = m >= 12 ? 4 : m >= 8 ? 3 : m >= 5 ? 2 : 0;
        h += '<li><button class="item" style="--m:' + m + '" data-treino="' + esc(t.letra) + '" data-b="' + bi + '" data-s="' + si + '" aria-haspopup="dialog">' +
          '<span class="t" aria-hidden="true">' + s.de + '</span>' +
          '<span class="corpo"><span class="nome">' + esc(s.nome) + '</span>' +
          (linhas && s.como ? '<span class="dica" style="--l:' + linhas + '">' + esc(s.como) + '</span>' : '') + '</span>' +
          '<span class="dose' + (s.dose.length > 1 ? ' varias' : '') + (s.dose.length > 2 ? ' tres' : '') + '">' +
          s.dose.map(function (d) { return '<span>' + doseHTML(d) + '</span>'; }).join('') +
          (s.nota ? '<small>' + esc(s.nota) + '</small>' : '') + '</span>' +
          '<span class="sr">, minutos ' + s.de + ' a ' + s.ate + '</span></button></li>';
      });
      h += '</ol></li>';
    });
    h += '</ol><p class="fim"><span></span><span class="t">' + total + '</span><span class="txt">fim</span></p>' +
      '<p class="toque">Toque em um exercício para ver como fazer e por quê.</p></section>';
    return h;
  }

  function telaFutevolei() {
    var f = PLANO.futevolei;
    return '<section class="avulso" aria-label="' + esc(f.titulo) + '"><h1 class="num">' + esc(f.titulo) + '</h1>' +
      '<p class="hora num">' + esc(f.hora) + '<small>' + esc(f.resumo) + '</small></p>' +
      '<ul class="notas">' + f.notas.map(function (n) { return '<li>' + esc(n) + '</li>'; }).join('') + '</ul></section>' +
      semaforo();
  }

  function proximaSessao(d) {
    for (var i = 1; i <= 7; i++) {
      var k = (d + i) % 7;
      if (PLANO.semana[k]) return k;
    }
    return null;
  }

  function telaDescanso(sel, eHoje) {
    var k = proximaSessao(sel);
    var h = '<section class="avulso" aria-label="Descanso"><h1 class="num">Descanso</h1>' +
      '<p class="sub">' + (eHoje ? 'Hoje não tem treino.' : maiuscula(DOW_L[sel]) + ' não tem treino.') + '</p>' +
      '<p class="contexto">O tendão se adapta no intervalo entre as cargas. Dormir bem conta como treino.</p>';
    if (k !== null) {
      var c = PLANO.semana[k];
      h += '<button class="proximo" data-ir="' + k + '"><span>A seguir, ' + DOW_L[k] + '</span>' +
        '<span class="num">' + (c === 'FUT' ? esc(PLANO.futevolei.titulo) : 'Treino ' + esc(c)) + '</span></button>';
    }
    return h + '</section>';
  }

  /* ───────── Objetivo ───────── */

  function situacao(o) {
    if (o.aberta || !o.inicio) return { tipo: 'aberta', texto: 'A definir' };
    var ini = dia(o.inicio), fim = dia(o.fim), h = estado.hoje;
    if (h > fim) return { tipo: 'feito', texto: 'Concluído' };
    if (h < ini) {
      var n = dif(ini, h);
      return { tipo: 'futuro', texto: n === 1 ? 'Começa amanhã' : 'Começa em ' + n + ' dias, ' + DOW_L[ini.getDay()] };
    }
    var sem = Math.floor(dif(h, ini) / 7) + 1;
    var tot = Math.ceil((dif(fim, ini) + 1) / 7);
    return { tipo: 'agora-f', texto: 'Em curso, semana ' + sem + ' de ' + tot };
  }

  function janela() {
    var datas = [];
    PLANO.objetivos.forEach(function (o) { if (o.inicio) { datas.push(dia(o.inicio)); datas.push(dia(o.fim)); } });
    datas.push(estado.hoje);
    var min = new Date(Math.min.apply(null, datas)), max = new Date(Math.max.apply(null, datas));
    var temAberta = PLANO.objetivos.some(function (o) { return o.aberta; });
    var ini = new Date(min.getFullYear(), min.getMonth(), 1);
    var fim = new Date(max.getFullYear(), max.getMonth() + (temAberta ? 3 : 1), 1);
    return { ini: ini, fim: fim, dias: dif(fim, ini), max: max };
  }

  function telaObjetivo() {
    var j = janela();
    var pct = function (d) { return Math.max(0, Math.min(100, dif(d, j.ini) / j.dias * 100)); };
    var f2 = function (n) { return n.toFixed(2); };
    var hojePct = pct(estado.hoje);

    var emCurso = PLANO.objetivos.filter(function (o) { return situacao(o).tipo === 'agora-f'; });
    var futuras = PLANO.objetivos.filter(function (o) { return situacao(o).tipo === 'futuro'; });
    var h = '<section class="agora" aria-label="Fase atual">';
    if (emCurso.length) {
      h += '<p class="rot">Agora</p>' + emCurso.map(function (o) { return '<h1>' + esc(o.nome) + '</h1>'; }).join('') +
        '<p class="resumo">' + esc(emCurso[0].resumo) + '</p>';
    } else if (futuras.length) {
      h += '<p class="rot">A seguir</p><h1>' + esc(futuras[0].nome) + '</h1><p class="resumo">' + esc(futuras[0].resumo) + '</p>';
    } else {
      h += '<p class="rot">Agora</p><h1>Sem fase em curso</h1><p class="resumo">Defina a próxima fase no plano.</p>';
    }
    h += '</section>';

    var meses = [];
    for (var m = new Date(j.ini); m < j.fim; m = new Date(m.getFullYear(), m.getMonth() + 1, 1)) meses.push(m);

    h += '<section class="tempo" aria-label="Linha do tempo"><div class="eixo" aria-hidden="true">';
    meses.forEach(function (d, i) {
      var comAno = i === 0 || d.getMonth() === 0;
      h += '<span class="mes" style="left:' + f2(pct(d)) + '%">' + MES[d.getMonth()] + (comAno ? ' ' + String(d.getFullYear()).slice(2) : '') + '</span>';
    });
    h += '<span class="aqui' + (hojePct < 8 ? ' esq' : hojePct > 92 ? ' dir' : '') + '" style="left:' + f2(hojePct) + '%">hoje, ' + curta(estado.hoje) + '</span></div><ol>';

    PLANO.objetivos.forEach(function (o) {
      var s = situacao(o);
      var ini, fim, esq, larg, cheio = '';
      if (s.tipo === 'aberta') {
        esq = Math.min(92, pct(mais(j.max, 21))); larg = 100 - esq;
      } else {
        ini = dia(o.inicio); fim = dia(o.fim);
        esq = pct(ini); larg = Math.max(1.2, pct(mais(fim, 1)) - esq);
        if (s.tipo === 'agora-f') {
          var p = (dif(estado.hoje, ini) + 1) / (dif(fim, ini) + 1) * 100;
          cheio = '<span class="cheio" style="width:' + f2(p) + '%"></span>';
        }
      }
      var marcos = '';
      (o.marcos || []).forEach(function (mk) {
        var p = (dif(dia(mk.data), ini)) / (dif(fim, ini) + 1) * 100;
        marcos += '<span class="marco" style="left:' + f2(p) + '%"></span>';
      });
      h += '<li><button class="fase ' + s.tipo + '" data-fase="' + esc(o.id) + '" aria-haspopup="dialog">' +
        '<span class="f-cab"><span class="f-nome">' + esc(o.nome) + '</span><span class="f-datas">' +
        (s.tipo === 'aberta' ? '2027' : curta(ini) + ' – ' + curta(fim)) + '</span></span>' +
        '<span class="trilha" aria-hidden="true">' +
        meses.slice(1).map(function (d) { return '<span class="tick" style="left:' + f2(pct(d)) + '%"></span>'; }).join('') +
        '<span class="barra" style="left:' + f2(esq) + '%;width:' + f2(larg) + '%">' + cheio + marcos + '</span>' +
        '<span class="agulha" style="left:' + f2(hojePct) + '%"></span></span>' +
        '<span class="f-estado">' + esc(s.texto) + '</span>' +
        (s.tipo === 'agora-f' && o.criterio ? '<span class="f-crit">Para avançar: ' + esc(o.criterio) + '</span>' : '') +
        '</button></li>';
    });
    h += '</ol></section>' + semaforo();
    return h;
  }

  function semaforo() {
    var s = PLANO.semaforo;
    return '<section class="semaforo"><h2>' + esc(s.titulo) + '</h2><ol>' + s.faixas.map(function (f) {
      return '<li><span class="luz ' + esc(f.cor) + '" aria-hidden="true"></span><span class="faixa num">' + esc(f.faixa) + '</span>' +
        '<span class="s-txt"><b>' + esc(f.nome) + '.</b> ' + esc(f.texto) + '</span></li>';
    }).join('') + '</ol></section>';
  }

  /* ───────── Folha de detalhe ───────── */

  function escadaHTML() {
    var atual = -1;
    PLANO.escada.forEach(function (p, i) { if (estado.hoje >= dia(p.previsto)) atual = i; });
    return '<h3>Escada de saltos</h3><ol class="escada">' + PLANO.escada.map(function (p, i) {
      var d = dia(p.previsto);
      return '<li' + (i === atual ? ' class="atual"' : '') + '><span class="n num">' + (i + 1) + '</span><span>' +
        '<span class="e-nome">' + esc(p.nome) + '</span><span class="e-data">' +
        (i === atual ? 'Previsto para agora' : 'A partir de ' + longa(d)) + '</span></span></li>';
    }).join('') + '</ol><p class="miudo">As datas são previsão. Só sobe de degrau quem passou limpo no dia seguinte.</p>';
  }

  function folhaItem(t, s) {
    var h = '<h2 class="num" id="folha-titulo">' + esc(s.nome) + '</h2>' +
      '<p class="onde">Treino ' + esc(t.letra) + ', do minuto ' + s.de + ' ao ' + s.ate + '</p>';
    if (s.dose.length === 1) {
      h += '<p class="unica num">' + doseHTML(s.dose[0]) + (s.nota ? '<small>' + esc(s.nota) + '</small>' : '') + '</p>';
    } else {
      h += '<dl class="doses">' + s.dose.map(function (d, i) {
        return '<div><dt>' + esc((s.rotulos && s.rotulos[i]) || '') + '</dt><dd>' + doseHTML(d) + '</dd></div>';
      }).join('') + '</dl>';
    }
    if (s.regra) h += '<p class="regra">' + esc(s.regra) + '</p>';
    if (s.como) h += '<h3>Como fazer</h3><p>' + esc(s.como) + '</p>';
    if (s.escada) h += escadaHTML();
    if (s.porque) h += '<h3>Por quê</h3><p>' + esc(s.porque) + '</p>';
    return h;
  }

  function folhaFase(o) {
    var s = situacao(o);
    var h = '<h2 class="num" id="folha-titulo">' + esc(o.nome) + '</h2>';
    if (s.tipo === 'aberta') {
      h += '<p class="onde">Sem datas ainda.</p>';
    } else {
      var ini = dia(o.inicio), fim = dia(o.fim);
      var mesmoAno = ini.getFullYear() === fim.getFullYear();
      h += '<p class="onde">' + longa(ini) + (mesmoAno ? '' : ' de ' + ini.getFullYear()) + ' a ' + longa(fim) + ' de ' + fim.getFullYear() +
        '. ' + esc(s.texto) + '.</p>';
    }
    h += '<p class="corrido">' + esc(o.resumo) + '</p>';
    (o.marcos || []).forEach(function (mk) { h += '<p class="regra">' + esc(mk.texto) + '</p>'; });
    if (o.criterio) h += '<h3>Para avançar</h3><p>' + esc(o.criterio) + '</p>';
    if (o.escada) h += escadaHTML();
    return h;
  }

  var folha = $('.folha'), fundo = $('.fundo'), conteudo = $('.conteudo', folha);
  var ultimoFoco = null, relogioFechar = null;
  var semMovimento = function () { return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; };

  function abrir(html) {
    clearTimeout(relogioFechar);
    conteudo.innerHTML = html;
    ultimoFoco = document.activeElement;
    folha.hidden = false; fundo.hidden = false;
    folha.style.transform = ''; folha.style.transition = '';
    folha.scrollTop = 0;
    document.documentElement.classList.add('travado');
    void folha.offsetHeight;
    folha.classList.add('on'); fundo.classList.add('on');
    try { folha.focus({ preventScroll: true }); } catch (_) { folha.focus(); }
  }

  function fechar() {
    if (folha.hidden) return;
    folha.style.transition = ''; folha.style.transform = '';
    folha.classList.remove('on'); fundo.classList.remove('on');
    document.documentElement.classList.remove('travado');
    var some = function () { folha.hidden = true; fundo.hidden = true; };
    clearTimeout(relogioFechar);
    if (semMovimento()) some(); else relogioFechar = setTimeout(some, 320);
    if (ultimoFoco && document.contains(ultimoFoco)) {
      try { ultimoFoco.focus({ preventScroll: true }); } catch (_) { /* sem foco */ }
    }
  }

  /* Arrastar a folha para baixo fecha, como numa folha nativa. */
  var y0 = null, dy = 0, arrastando = false;
  folha.addEventListener('touchstart', function (e) {
    y0 = folha.scrollTop <= 0 ? e.touches[0].clientY : null; dy = 0; arrastando = false;
  }, { passive: true });
  folha.addEventListener('touchmove', function (e) {
    if (y0 === null) return;
    dy = e.touches[0].clientY - y0;
    if (!arrastando) {
      if (dy > 6 && folha.scrollTop <= 0) { arrastando = true; folha.style.transition = 'none'; }
      else { if (dy < -6) y0 = null; return; }
    }
    e.preventDefault();
    folha.style.transform = 'translateY(' + Math.max(0, dy) + 'px)';
  }, { passive: false });
  folha.addEventListener('touchend', function () {
    if (arrastando) {
      folha.style.transition = '';
      if (dy > 110) fechar(); else folha.style.transform = '';
    }
    arrastando = false; y0 = null;
  });

  /* ───────── Desenho e eventos ───────── */

  function desenhar() {
    tela.innerHTML = estado.aba === 'objetivo' ? telaObjetivo() : telaTreino();
    var abas = document.querySelectorAll('.aba');
    for (var i = 0; i < abas.length; i++) {
      if (abas[i].dataset.aba === estado.aba) abas[i].setAttribute('aria-current', 'page');
      else abas[i].removeAttribute('aria-current');
    }
  }

  document.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('button') : null;
    if (!b) return;
    if (b.dataset.aba) {
      if (estado.aba !== b.dataset.aba) { estado.aba = b.dataset.aba; desenhar(); }
      window.scrollTo(0, 0);
    } else if (b.dataset.dow !== undefined) {
      estado.dow = +b.dataset.dow; desenhar();
      var alvo = tela.querySelector('.dia[aria-pressed="true"]');
      if (alvo) { try { alvo.focus({ preventScroll: true }); } catch (_) { /* sem foco */ } }
    } else if (b.dataset.ir !== undefined) {
      estado.dow = +b.dataset.ir; desenhar(); window.scrollTo(0, 0);
    } else if (b.classList.contains('item')) {
      var t = PLANO.treinos[b.dataset.treino];
      abrir(folhaItem(t, t.blocos[+b.dataset.b].slots[+b.dataset.s]));
    } else if (b.dataset.fase) {
      var o = PLANO.objetivos.filter(function (x) { return x.id === b.dataset.fase; })[0];
      if (o) abrir(folhaFase(o));
    } else if (b.classList.contains('fechar')) {
      fechar();
    }
  });
  fundo.addEventListener('click', fechar);
  document.addEventListener('keydown', function (e) {
    if (folha.hidden) return;
    if (e.key === 'Escape') { e.preventDefault(); fechar(); }
    else if (e.key === 'Tab') { e.preventDefault(); $('.fechar', folha).focus(); }
  });

  /* O app fica aberto por dias na tela de início: confere a data ao voltar. */
  function conferirData() {
    var agora = meiaNoite(new Date());
    if (+agora === +estado.hoje) return;
    var estavaHoje = estado.dow === estado.hoje.getDay();
    estado.hoje = agora;
    if (estavaHoje) estado.dow = agora.getDay();
    if (folha.hidden) desenhar();
  }
  document.addEventListener('visibilitychange', function () { if (!document.hidden) conferirData(); });
  window.addEventListener('pageshow', conferirData);
  setInterval(conferirData, 60000);

  desenhar();

  /* Offline e atualização. Fora de http(s), ou num quadro isolado, simplesmente não registra. */
  try {
    if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
      var aviso = $('.aviso');
      navigator.serviceWorker.addEventListener('message', function (e) {
        if (e.data && e.data.tipo === 'versao-nova') aviso.hidden = false;
      });
      $('button', aviso).addEventListener('click', function () { location.reload(); });
      var perguntar = function () {
        var w = navigator.serviceWorker.controller;
        if (w) w.postMessage({ tipo: 'ha-novidade' });
      };
      window.addEventListener('load', function () {
        navigator.serviceWorker.register('./sw.js').catch(function () { /* segue sem offline */ });
        perguntar();
        setTimeout(perguntar, 4000);
      });
    }
  } catch (_) { /* segue sem offline */ }
})();
