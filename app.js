/* ============================================================
   Prisma — lógica da aplicação
   Rastreio de sinais de autismo · orientação, não diagnóstico

   REGRA CANÔNICA: este app NUNCA diagnostica. Ele estima uma
   faixa de sinais e sempre encaminha para avaliação profissional.
   Veja docs/CANON.md antes de alterar conteúdo/textos.
   ============================================================ */
(function(){
  "use strict";
  var root = document.documentElement;
  var stage = document.getElementById("stage");
  var boot = document.getElementById("boot");
  var bootMsg = document.getElementById("bootMsg");

  /* ---------- Instruments ---------- */
  var AGREE = [
    {label:"Concordo bastante", v:"as"},
    {label:"Concordo um pouco", v:"am"},
    {label:"Discordo um pouco", v:"dm"},
    {label:"Discordo bastante", v:"ds"}
  ];
  var YESNO = [ {label:"Sim", v:"sim"}, {label:"Não", v:"nao"} ];

  var ADULT = {
    key:"adult",
    title:"Adulto — sobre você",
    metaProfile:"Adulto (autoavaliação)",
    metaInstr:"AQ-10 (adultos)",
    scale:"agree",
    options:AGREE,
    source:"Baseado no AQ-10 (Allison, Auyeung & Baron-Cohen, 2012).",
    domains:{atencao:"Atenção & detalhes", foco:"Foco & flexibilidade", social:"Comunicação social", outro:"Entender o outro"},
    q:[
      {t:"Percebo com frequência sons pequenos que outras pessoas não notam.", d:"atencao", s:"agree"},
      {t:"Costumo prestar mais atenção no todo do que nos pequenos detalhes.", d:"atencao", s:"disagree"},
      {t:"Acho fácil fazer mais de uma coisa ao mesmo tempo.", d:"foco", s:"disagree"},
      {t:"Quando sou interrompido, consigo voltar rápido para o que estava fazendo.", d:"foco", s:"disagree"},
      {t:"Entendo facilmente o que a pessoa quer dizer nas entrelinhas.", d:"social", s:"disagree"},
      {t:"Percebo quando alguém que está me ouvindo começa a ficar entediado.", d:"social", s:"disagree"},
      {t:"Quando leio uma história, tenho dificuldade de entender as intenções dos personagens.", d:"outro", s:"agree"},
      {t:"Gosto de reunir informações sobre categorias de coisas (tipos de carro, de pássaro, de planta...).", d:"atencao", s:"agree"},
      {t:"Consigo entender o que alguém pensa ou sente só de olhar o rosto.", d:"social", s:"disagree"},
      {t:"Tenho dificuldade de entender as intenções das pessoas.", d:"outro", s:"agree"}
    ],
    bands:[
      {max:3, key:"calm", label:"Poucos sinais", color:"#5c8f77",
        blurb:"Suas respostas mostram poucos traços comumente associados ao autismo. Se ainda assim algo em você não bate, a sua percepção também importa — vale conversar com um profissional."},
      {max:5, key:"mid", label:"Alguns sinais", color:"#b3893c",
        blurb:"Você está numa faixa limítrofe: alguns traços aparecem. Não confirma nada, mas é um bom motivo para uma conversa com um profissional."},
      {max:10, key:"high", label:"Vários sinais", color:"#b56a54",
        blurb:"Suas respostas têm bastante em comum com as de pessoas autistas. Isto não é um diagnóstico — é um convite claro para buscar uma avaliação."}
    ],
    steps:[
      "Leve este resultado a um profissional: psiquiatra, neurologista ou psicólogo com experiência em autismo em adultos.",
      "No SUS, comece pela UBS e peça encaminhamento; o CAPS também acolhe.",
      "Traços da infância ajudam no diagnóstico — vale conversar com quem te conhece há muito tempo."
    ]
  };

  var CHILD = {
    key:"child",
    title:"Criança — 16 a 30 meses",
    metaProfile:"Criança — respondido por responsável",
    metaInstr:"M-CHAT-R/F (16–30 meses)",
    scale:"yesno",
    options:YESNO,
    source:"Adaptado do M-CHAT-R/F (Robins, Fein & Barton) para o protótipo. No app final entram os 20 itens oficiais validados em português (SBP).",
    domains:{apontar:"Apontar & mostrar", social:"Interação & contato", imaginar:"Faz de conta & imitação", sensorial:"Respostas sensoriais & motoras"},
    q:[
      {t:"Se você aponta para algo do outro lado do ambiente, a criança olha para lá?", d:"apontar", risk:"nao"},
      {t:"Você já se perguntou se a criança poderia ser surda?", d:"sensorial", risk:"sim"},
      {t:"A criança brinca de faz de conta? (ex.: fingir que fala ao telefone, cuidar de uma boneca)", d:"imaginar", risk:"nao"},
      {t:"A criança gosta de subir em coisas? (ex.: móveis, escadas)", d:"sensorial", risk:"nao"},
      {t:"A criança faz movimentos incomuns com os dedos perto dos olhos?", d:"sensorial", risk:"sim"},
      {t:"A criança aponta com um dedo para pedir algo ou pedir ajuda?", d:"apontar", risk:"nao"},
      {t:"A criança aponta com um dedo para mostrar algo que achou interessante?", d:"apontar", risk:"nao"},
      {t:"A criança se interessa por outras crianças?", d:"social", risk:"nao"},
      {t:"A criança traz objetos até você só para te mostrar?", d:"apontar", risk:"nao"},
      {t:"A criança responde quando você a chama pelo nome?", d:"social", risk:"nao"},
      {t:"Quando você sorri para a criança, ela sorri de volta?", d:"social", risk:"nao"},
      {t:"A criança se incomoda muito com barulhos do dia a dia? (ex.: aspirador, música alta)", d:"sensorial", risk:"sim"},
      {t:"A criança já anda sozinha?", d:"sensorial", risk:"nao"},
      {t:"A criança olha nos seus olhos quando você fala, brinca ou troca a roupa dela?", d:"social", risk:"nao"},
      {t:"A criança tenta imitar o que você faz? (ex.: dar tchau, bater palmas)", d:"imaginar", risk:"nao"},
      {t:"Se você vira a cabeça para olhar algo, a criança olha para o mesmo lugar?", d:"apontar", risk:"nao"},
      {t:"A criança tenta fazer você olhar para ela para chamar sua atenção?", d:"social", risk:"nao"},
      {t:"A criança entende quando você pede para ela fazer algo?", d:"social", risk:"nao"},
      {t:"Diante de algo novo, a criança olha para o seu rosto para ver a sua reação?", d:"social", risk:"nao"},
      {t:"A criança gosta de brincadeiras com movimento? (ex.: ser balançada no colo)", d:"sensorial", risk:"nao"}
    ],
    bands:[
      {max:2, key:"calm", label:"Baixo indício", color:"#5c8f77",
        blurb:"Poucos sinais nesta fase. Continue acompanhando o desenvolvimento e repita o rastreio mais para frente."},
      {max:7, key:"mid", label:"Indício moderado", color:"#b3893c",
        blurb:"Vale uma conversa com o pediatra e, provavelmente, a entrevista de seguimento do M-CHAT-R/F para confirmar os sinais."},
      {max:20, key:"high", label:"Indício alto", color:"#b56a54",
        blurb:"O recomendado é procurar avaliação especializada logo. Quanto antes o apoio começa, melhor — e isso não define limites para a criança."}
    ],
    steps:[
      "Leve este resultado ao pediatra e peça avaliação com neuropediatra ou psiquiatra infantil.",
      "No SUS: comece na UBS para encaminhamento; o CAPSi atende crianças e adolescentes.",
      "Sinais isolados não confirmam nada — o valor está no conjunto e na avaliação profissional."
    ]
  };

  // Aprofundamento do adulto: camuflagem (masking). Lançado a partir do resultado do AQ-10.
  var CATQ = {
    key:"catq",
    title:"Camuflagem — CAT-Q",
    metaProfile:"Adulto — camuflagem (masking)",
    metaInstr:"CAT-Q (camuflagem)",
    scale:"likert7",
    options:[
      {label:"Discordo totalmente", v:"1"},
      {label:"Discordo", v:"2"},
      {label:"Discordo um pouco", v:"3"},
      {label:"Neutro", v:"4"},
      {label:"Concordo um pouco", v:"5"},
      {label:"Concordo", v:"6"},
      {label:"Concordo totalmente", v:"7"}
    ],
    source:"Adaptado do CAT-Q (Hull et al., 2018) para o protótipo; redação oficial em português a validar.",
    domains:{comp:"Compensação", mask:"Máscara", assim:"Assimilação"},
    steps:[
      "Leve ESTE resultado junto com o do AQ-10 a um profissional — a combinação conta muito.",
      "Camuflar cansa: se você se reconhece aqui, cuidar do esgotamento e da ansiedade também importa.",
      "Diagnóstico tardio é comum em quem camufla bem (em especial mulheres) — buscar avaliação nunca é tarde."
    ],
    q:[
      {t:"Quando interajo com alguém, copio de propósito a linguagem corporal ou as expressões faciais da pessoa.", d:"comp"},
      {t:"Monitoro minha linguagem corporal e expressões faciais para parecer relaxado(a).", d:"mask"},
      {t:"Raramente sinto necessidade de \"fazer um teatro\" para atravessar uma situação social.", d:"assim", rev:true},
      {t:"Desenvolvi um \"roteiro\" para seguir em situações sociais.", d:"comp"},
      {t:"Repito frases que ouvi outras pessoas dizerem, exatamente do mesmo jeito que ouvi.", d:"comp"},
      {t:"Ajusto minha linguagem corporal e expressões faciais para parecer interessado(a) na pessoa com quem estou.", d:"mask"},
      {t:"Em situações sociais, sinto que estou \"atuando\" em vez de ser eu mesmo(a).", d:"assim"},
      {t:"Nas minhas interações, uso comportamentos que aprendi observando outras pessoas interagirem.", d:"comp"},
      {t:"Estou sempre pensando na impressão que causo nos outros.", d:"mask"},
      {t:"Preciso do apoio de outras pessoas para conseguir socializar.", d:"assim"},
      {t:"Ensaio minhas expressões faciais e linguagem corporal para garantir que pareçam naturais.", d:"comp"},
      {t:"Não sinto necessidade de fazer contato visual com os outros se não quiser.", d:"mask", rev:true},
      {t:"Tenho que me forçar a interagir com as pessoas quando estou em situações sociais.", d:"assim"},
      {t:"Já tentei melhorar meu entendimento de habilidades sociais observando outras pessoas.", d:"comp"},
      {t:"Monitoro minha linguagem corporal e expressões faciais para parecer interessado(a) na pessoa com quem estou.", d:"mask"},
      {t:"Em situações sociais, procuro formas de evitar interagir com os outros.", d:"assim"},
      {t:"Já pesquisei as \"regras\" das interações sociais para melhorar minhas próprias habilidades.", d:"comp"},
      {t:"Estou sempre atento(a) à impressão que causo nos outros.", d:"mask"},
      {t:"Sinto-me livre para ser eu mesmo(a) quando estou com outras pessoas.", d:"assim", rev:true},
      {t:"Aprendo como as pessoas usam o corpo e o rosto para interagir assistindo TV, filmes ou lendo ficção.", d:"comp"},
      {t:"Ajusto minha linguagem corporal e expressões faciais para parecer relaxado(a).", d:"mask"},
      {t:"Quando converso com outras pessoas, sinto que a conversa flui naturalmente.", d:"assim", rev:true},
      {t:"Passei tempo aprendendo habilidades sociais em séries e filmes, e tento usá-las nas minhas interações.", d:"comp"},
      {t:"Nas interações sociais, não presto atenção no que meu rosto ou meu corpo estão fazendo.", d:"mask", rev:true},
      {t:"Em situações sociais, sinto que estou fingindo ser \"normal\".", d:"assim"}
    ]
  };

  var INSTR = {adult:ADULT, child:CHILD, catq:CATQ};

  /* ---------- State ---------- */
  var st = {screen:"welcome", profile:null, i:0, raw:[], aq:null};
  function inst(){ return INSTR[st.profile]; }

  function scored(item, v){
    if(!v) return false;
    if(inst().scale==="agree"){
      var isAgree = (v==="as"||v==="am");
      return item.s==="agree" ? isAgree : !isAgree;
    }
    return v===item.risk;
  }
  function compute(){
    var q = inst().q, total=0, dom={};
    Object.keys(inst().domains).forEach(function(k){ dom[k]={c:0,n:0}; });
    q.forEach(function(item,idx){
      dom[item.d].n++;
      if(scored(item, st.raw[idx])){ total++; dom[item.d].c++; }
    });
    var band = inst().bands.find(function(b){ return total<=b.max; });
    return {total:total, n:q.length, band:band, dom:dom};
  }
  function ratioColor(r){ return r<0.34 ? "#5c8f77" : (r<0.67 ? "#b3893c" : "#b56a54"); }
  function catqScore(){
    var comp=0,mask=0,assim=0;
    CATQ.q.forEach(function(it,idx){
      var v=parseInt(st.raw[idx]||"4",10);
      if(it.rev) v=8-v;
      if(it.d==="comp") comp+=v; else if(it.d==="mask") mask+=v; else assim+=v;
    });
    var total=comp+mask+assim;
    return {comp:comp,mask:mask,assim:assim,total:total,compMax:63,maskMax:56,assimMax:56,camouflaging:total>=100};
  }
  function esc(s){ return String(s).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];}); }
  function today(){
    try{ return new Date().toLocaleDateString("pt-BR",{day:"2-digit",month:"long",year:"numeric"}); }
    catch(e){ return new Date().toLocaleDateString("pt-BR"); }
  }

  var PARTNERS = '<div class="partners"><b>Prisma</b><span class="sep">·</span> uma plataforma '+
    '<b>IDASAM</b> <span class="sep">·</span> em parceria com a <b>MAZARI CORP.</b></div>';

  /* ---------- Screens ---------- */
  function screenWelcome(){
    return '<div class="fade hero">'+
      '<p class="eyebrow" style="margin-bottom:14px">Orientação, não diagnóstico</p>'+
      '<h1>Entenda possíveis sinais de autismo, sem pressa nem julgamento.</h1>'+
      '<p class="lede">Algumas perguntas cuidadosas, uma tela de cada vez. No fim, você recebe um mapa dos sinais e o caminho para uma avaliação de verdade.</p>'+
      '<div class="facts">'+
        fact("Isto não confirma autismo.","Nenhum questionário diagnostica. Só uma avaliação profissional confirma ou descarta.")+
        fact("Perguntas com base científica.","Usamos instrumentos validados: AQ-10 (adultos) e M-CHAT-R/F (crianças).")+
        fact("Fica só no seu aparelho.","Nada é enviado. Você responde sem pressa, sem cadastro e sem julgamento.")+
      '</div>'+
      '<button class="btn" data-a="start">Começar &nbsp;→</button>'+
      PARTNERS+
    '</div>';
  }
  function fact(b,s){
    return '<div class="fact"><span class="dot" aria-hidden="true"></span><div><b>'+esc(b)+'</b><br><span>'+esc(s)+'</span></div></div>';
  }

  function screenProfile(){
    return '<div class="fade">'+
      '<p class="eyebrow">Passo 1 de 3</p>'+
      '<h2 style="font-size:1.7rem;margin:10px 0 6px">Quem vai responder?</h2>'+
      '<p class="lede" style="margin-bottom:22px">Escolha o perfil para que as perguntas certas apareçam.</p>'+
      '<div class="choices">'+
        choice("adult","🧭","Sou um adulto explorando a mim mesmo","10 perguntas sobre como você percebe o mundo e as pessoas.")+
        choice("child","🧸","Avalio meu filho ou filha","Para crianças de 16 a 30 meses. Você responde sobre o comportamento dela.")+
      '</div>'+
      '<div style="margin-top:22px"><button class="btn ghost small" data-a="home">← Voltar</button></div>'+
    '</div>';
  }
  function choice(p,ic,h,s){
    return '<button class="choice" data-a="profile" data-p="'+p+'"><span class="ic" aria-hidden="true">'+ic+
      '</span><span><h3>'+esc(h)+'</h3><small>'+esc(s)+'</small></span></button>';
  }

  function screenIntro(){
    if(st.profile==="catq"){
      return '<div class="fade">'+
        '<p class="eyebrow">Aprofundamento · Camuflagem</p>'+
        '<h2 style="font-size:1.7rem;margin:10px 0 14px">Sobre a camuflagem</h2>'+
        '<div class="card">'+
          '<p style="margin-bottom:14px">Camuflagem (<em>masking</em>) é o esforço de "disfarçar" traços autistas para se encaixar — copiar gestos, ensaiar falas, forçar contato visual. É cansativo e muito comum em quem recebe diagnóstico tarde.</p>'+
          '<ul style="margin:0;padding-left:20px;color:var(--ink-soft);line-height:1.9">'+
            '<li>São 25 frases, com uma escala de 7 pontos.</li>'+
            '<li>Responda pensando em como você é na maior parte do tempo.</li>'+
            '<li>Cerca de 5 minutos. Sem pressa, dá pra voltar.</li>'+
          '</ul>'+
          '<div class="note">'+esc(CATQ.source)+'</div>'+
        '</div>'+
        '<div class="row" style="margin-top:20px">'+
          '<button class="btn ghost small" data-a="catqBack">← Voltar</button>'+
          '<button class="btn" data-a="begin" style="flex:1">Começar</button>'+
        '</div>'+
      '</div>';
    }
    var it=inst();
    var perProfile = st.profile==="adult"
      ? "Para cada frase, diga o quanto ela combina com você. Não existe resposta certa ou errada — só o que é verdadeiro para você."
      : "Responda pensando no comportamento habitual da criança. Se ela faz às vezes, considere se é comum no dia a dia.";
    return '<div class="fade">'+
      '<p class="eyebrow">Passo 2 de 3 · '+esc(it.title)+'</p>'+
      '<h2 style="font-size:1.7rem;margin:10px 0 14px">Antes de começar</h2>'+
      '<div class="card">'+
        '<p style="margin-bottom:14px">'+esc(perProfile)+'</p>'+
        '<ul style="margin:0;padding-left:20px;color:var(--ink-soft);line-height:1.9">'+
          '<li>Uma pergunta por tela. Sem tempo, sem pressa.</li>'+
          '<li>Você pode voltar e mudar qualquer resposta.</li>'+
          '<li>São '+it.q.length+' perguntas — cerca de '+(st.profile==="adult"?"3":"5")+' minutos.</li>'+
        '</ul>'+
        '<div class="note">'+esc(it.source)+'</div>'+
      '</div>'+
      '<div class="row" style="margin-top:20px">'+
        '<button class="btn ghost small" data-a="profileBack">← Trocar perfil</button>'+
        '<button class="btn" data-a="begin" style="flex:1">Começar as perguntas</button>'+
      '</div>'+
    '</div>';
  }

  function screenQuiz(){
    var it=inst(), item=it.q[st.i], v=st.raw[st.i];
    var pct=Math.round((st.i)/it.q.length*100);
    var opts=it.options.map(function(o){
      var on=(v===o.v);
      return '<button class="opt" data-a="answer" data-v="'+o.v+'" aria-pressed="'+(on?"true":"false")+'">'+
        '<span class="tick" aria-hidden="true"></span><span>'+esc(o.label)+'</span></button>';
    }).join("");
    return '<div class="fade">'+
      '<div class="qhead"><span class="qdomain">'+esc(it.domains[item.d])+'</span>'+
        '<span class="qmeta">Pergunta '+(st.i+1)+' de '+it.q.length+'</span></div>'+
      '<div class="progress"><i style="width:'+pct+'%"></i></div>'+
      '<p class="qtext">'+esc(item.t)+'</p>'+
      '<div class="opts">'+opts+'</div>'+
      '<div class="qnav">'+
        '<button class="btn ghost small" data-a="prev">← Voltar</button>'+
        '<button class="btn grow" data-a="next" '+(v?"":"disabled")+'>'+
          (st.i===it.q.length-1?"Ver meu resultado":"Continuar")+'</button>'+
      '</div>'+
    '</div>';
  }

  function screenResult(){
    if(st.profile==="catq") return screenResultCatq();
    var it=inst(), r=compute(), b=r.band;
    var maprows=Object.keys(it.domains).map(function(k){
      var d=r.dom[k], ratio=d.n?d.c/d.n:0, w=Math.max(ratio*100, d.c>0?8:2);
      return '<div class="maprow"><div class="ml"><span>'+esc(it.domains[k])+'</span>'+
        '<span>'+d.c+' de '+d.n+'</span></div>'+
        '<div class="track"><i style="width:'+w+'%;background:'+ratioColor(ratio)+'"></i></div></div>';
    }).join("");
    var steps=it.steps.map(function(s,idx){
      return '<div class="s"><span class="n">'+(idx+1)+'</span><span>'+esc(s)+'</span></div>';
    }).join("");
    return '<div class="fade">'+
      '<p class="eyebrow">Seu resultado · '+esc(it.title)+'</p>'+
      '<h2 style="font-size:1.7rem;margin:10px 0 16px">'+esc(b.label)+'</h2>'+
      '<div class="band" style="background:color-mix(in srgb,'+b.color+' 12%,var(--surface))">'+
        '<span class="glow" style="background:'+b.color+'"></span>'+
        '<div><span class="score">'+r.total+' <small style="display:inline;font-size:.9rem;text-transform:none;letter-spacing:0;font-weight:400;color:var(--ink-soft)">de '+r.n+' sinais</small></span>'+
        '<small style="margin-top:4px">'+esc(b.label)+'</small></div>'+
      '</div>'+
      '<p class="lede" style="margin:16px 0 6px">'+esc(b.blurb)+'</p>'+
      '<h3 style="font-size:1.05rem;margin:26px 0 4px">Mapa por área</h3>'+
      '<p style="font-size:.9rem;color:var(--ink-soft);margin-bottom:4px">Onde os sinais apareceram. Barras mais cheias pedem mais atenção — não são notas.</p>'+
      '<div class="map">'+maprows+'</div>'+
      '<h3 style="font-size:1.05rem;margin:24px 0 12px">Próximos passos</h3>'+
      '<div class="steps">'+steps+'</div>'+
      '<button class="btn" style="margin-top:20px" data-a="download">⬇︎ &nbsp;Baixar resultado (PDF)</button>'+
      (st.profile==="adult" ? DEEPEN : "")+
      '<div class="telemed">'+
        '<span class="tic" aria-hidden="true">🩺</span>'+
        '<div><h3>Atendimento com profissionais <span class="badge">Em breve</span></h3>'+
        '<p>Em breve o Prisma vai oferecer atendimento imediato via telemedicina, com profissionais capacitados e direcionados para o seu caso — uma experiência ainda mais completa.</p></div>'+
      '</div>'+
      '<p class="disclaimer"><b>Importante:</b> Prisma é uma ferramenta de orientação, não um diagnóstico. Só uma avaliação profissional pode confirmar ou descartar o autismo. Suas respostas ficaram apenas neste aparelho.</p>'+
      '<div class="row" style="margin-top:20px">'+
        '<button class="btn ghost small" data-a="home">Início</button>'+
        '<button class="btn ghost small" data-a="restart">Refazer</button>'+
      '</div>'+
      '<p class="src">'+esc(it.source)+'</p>'+
      PARTNERS+
    '</div>';
  }

  var DEEPEN = '<div class="telemed" style="border-style:solid;border-color:var(--primary-soft)">'+
    '<span class="tic" aria-hidden="true">🎭</span>'+
    '<div><h3>Aprofundar: você se camufla?</h3>'+
    '<p>O AQ-10 mede sinais aparentes. Muita gente — em especial quem foi diagnosticada tarde — "disfarça" (camuflagem), e isso esconde os sinais. Este passo de 25 perguntas mostra o quanto.</p>'+
    '<button class="btn small" style="margin-top:12px" data-a="deepen-catq">Fazer o teste de camuflagem →</button></div>'+
  '</div>';

  function screenResultCatq(){
    var cs=catqScore();
    var col = cs.camouflaging ? "var(--mid)" : "var(--calm)";
    var subs=[
      {k:"Compensação", v:cs.comp, m:cs.compMax, tip:"aprende e aplica estratégias sociais (observar, ensaiar, roteirizar)"},
      {k:"Máscara", v:cs.mask, m:cs.maskMax, tip:"monitora e ajusta corpo e expressão para parecer natural ou interessado(a)"},
      {k:"Assimilação", v:cs.assim, m:cs.assimMax, tip:"se força a agir \"normal\" e a se encaixar, muitas vezes com custo"}
    ];
    var top=subs.slice().sort(function(a,b){return (b.v/b.m)-(a.v/a.m);})[0];
    var bars=subs.map(function(s){
      var w=Math.max(Math.round(s.v/s.m*100),4);
      return '<div class="maprow"><div class="ml"><span>'+s.k+'</span><span>'+s.v+' / '+s.m+'</span></div>'+
        '<div class="track"><i style="width:'+w+'%;background:var(--primary)"></i></div></div>';
    }).join("");
    var steps=CATQ.steps.map(function(s,idx){ return '<div class="s"><span class="n">'+(idx+1)+'</span><span>'+esc(s)+'</span></div>'; }).join("");
    var insight="";
    if(st.aq && st.aq.total<6 && cs.camouflaging){
      insight='<div class="note" style="border-left-color:var(--mid)"><b>Um padrão importante:</b> no AQ-10 apareceram poucos sinais aparentes, mas aqui a camuflagem é alta. Esse é justamente o perfil que costuma passar despercebido e receber diagnóstico tardio (comum em mulheres e adultos). Vale levar os <b>dois</b> resultados a um profissional.</div>';
    }
    var headline = cs.camouflaging ? "Você provavelmente se camufla" : "Pouca camuflagem";
    var blurb = cs.camouflaging
      ? ("Sua pontuação indica que você camufla traços autistas com frequência. Predomina a "+top.k.toLowerCase()+": você "+top.tip+".")
      : "Sua pontuação indica pouca camuflagem de traços autistas.";
    return '<div class="fade">'+
      '<p class="eyebrow">Seu resultado · Camuflagem (CAT-Q)</p>'+
      '<h2 style="font-size:1.7rem;margin:10px 0 16px">'+esc(headline)+'</h2>'+
      '<div class="band" style="background:color-mix(in srgb,'+col+' 12%,var(--surface))">'+
        '<span class="glow" style="background:'+col+'"></span>'+
        '<div><span class="score">'+cs.total+' <small style="display:inline;font-size:.9rem;text-transform:none;letter-spacing:0;font-weight:400;color:var(--ink-soft)">de 175 · limiar 100</small></span>'+
        '<small style="margin-top:4px">'+(cs.camouflaging?"Acima do limiar":"Abaixo do limiar")+'</small></div>'+
      '</div>'+
      '<p class="lede" style="margin:16px 0 6px">'+esc(blurb)+'</p>'+
      '<h3 style="font-size:1.05rem;margin:26px 0 4px">Como você se camufla</h3>'+
      '<p style="font-size:.9rem;color:var(--ink-soft);margin-bottom:4px">As três formas de camuflagem. Barras mais cheias = mais presente.</p>'+
      '<div class="map">'+bars+'</div>'+
      insight+
      '<h3 style="font-size:1.05rem;margin:24px 0 12px">Próximos passos</h3>'+
      '<div class="steps">'+steps+'</div>'+
      '<button class="btn" style="margin-top:20px" data-a="download">⬇︎ &nbsp;Baixar resultado completo (PDF)</button>'+
      '<p class="disclaimer"><b>Importante:</b> camuflagem não é diagnóstico. O CAT-Q descreve o quanto você disfarça traços — a confirmação de autismo só vem de avaliação profissional. Suas respostas ficaram apenas neste aparelho.</p>'+
      '<div class="row" style="margin-top:20px">'+
        '<button class="btn ghost small" data-a="catqBack">← Meu resultado do AQ-10</button>'+
        '<button class="btn ghost small" data-a="restart">Refazer</button>'+
      '</div>'+
      '<p class="src">'+esc(CATQ.source)+'</p>'+
      PARTNERS+
    '</div>';
  }

  var SCREENS={welcome:screenWelcome, profile:screenProfile, intro:screenIntro, quiz:screenQuiz, result:screenResult};
  function render(){
    stage.innerHTML = SCREENS[st.screen]();
    if(st.screen!=="quiz"){ try{ window.scrollTo(0,0); }catch(e){} }
  }

  /* ---------- Letterhead / PDF ---------- */
  function buildLetterhead(){
    if(st.profile==="catq") return buildLetterheadCatq();
    var it=inst(), r=compute(), b=r.band;
    var maprows=Object.keys(it.domains).map(function(k){
      var d=r.dom[k], ratio=d.n?d.c/d.n:0, w=Math.max(ratio*100, d.c>0?8:3);
      return '<tr><td class="area">'+esc(it.domains[k])+'</td>'+
        '<td class="bar"><div class="lh-bar"><i style="width:'+w+'%;background:'+ratioColor(ratio)+'"></i></div></td>'+
        '<td class="num">'+d.c+'/'+d.n+'</td></tr>';
    }).join("");
    var steps=it.steps.map(function(s){ return '<li>'+esc(s)+'</li>'; }).join("");
    var date=today();
    return '<div class="docmodal" id="docmodal" role="dialog" aria-label="Relatório para baixar">'+
      '<div class="docwrap">'+
      '<section id="letterhead">'+
        '<div class="lh-pad">'+
          '<div class="lh-brand"><span class="lh-mark" aria-hidden="true"></span>'+
            '<span class="nm">Prisma</span>'+
            '<span class="tg">Relatório de rastreio</span></div>'+
          '<div class="lh-rule" aria-hidden="true"></div>'+
          '<h1>Resultado do rastreio de sinais</h1>'+
          '<p class="lh-sub">Instrumento de orientação — não constitui diagnóstico.</p>'+
          '<div class="lh-meta">'+
            '<div><div class="k">Data</div><div class="v">'+esc(date)+'</div></div>'+
            '<div><div class="k">Perfil</div><div class="v">'+esc(it.metaProfile)+'</div></div>'+
            '<div><div class="k">Instrumento</div><div class="v">'+esc(it.metaInstr)+'</div></div>'+
          '</div>'+
          '<div class="lh-result" style="border-left-color:'+b.color+'">'+
            '<span class="lbl">'+esc(b.label)+'</span>'+
            '<span class="sc"><b>'+r.total+' / '+r.n+'</b><span>sinais</span></span>'+
          '</div>'+
          '<p class="lh-blurb">'+esc(b.blurb)+'</p>'+
          '<h2>Mapa por área</h2>'+
          '<table class="lh-map"><tbody>'+maprows+'</tbody></table>'+
          '<h2>Próximos passos</h2>'+
          '<ul class="lh-steps">'+steps+'</ul>'+
          '<div class="lh-warn"><b>Aviso:</b> Este documento é um instrumento de rastreio (orientação) e não constitui diagnóstico. Somente uma avaliação profissional pode confirmar ou descartar o Transtorno do Espectro Autista (TEA). '+esc(it.source)+'</div>'+
          '<p class="lh-telemed">🩺 Em breve: atendimento imediato via telemedicina com profissionais capacitados, direto pelo Prisma.</p>'+
        '</div>'+
        '<div class="lh-foot">'+
          '<div class="credit"><b>Prisma</b> — uma plataforma <b>IDASAM</b>, desenvolvida em parceria com a <b>MAZARI CORP.</b></div>'+
          '<div class="gen">Gerado em '+esc(date)+' · sem validade diagnóstica</div>'+
        '</div>'+
      '</section>'+
      '</div>'+
      '<div class="docbar">'+
        '<button class="btn ghost" data-a="closedoc">Fechar</button>'+
        '<button class="btn" data-a="print">⬇︎ Salvar como PDF</button>'+
      '</div>'+
    '</div>';
  }
  function buildLetterheadCatq(){
    var cs=catqScore(), date=today(), aq=st.aq;
    var subrows=[
      {k:"Compensação", v:cs.comp, m:cs.compMax},
      {k:"Máscara", v:cs.mask, m:cs.maskMax},
      {k:"Assimilação", v:cs.assim, m:cs.assimMax}
    ].map(function(s){
      var w=Math.max(Math.round(s.v/s.m*100),3);
      return '<tr><td class="area">'+s.k+'</td><td class="bar"><div class="lh-bar"><i style="width:'+w+'%;background:#3a7d74"></i></div></td><td class="num">'+s.v+'/'+s.m+'</td></tr>';
    }).join("");
    var steps=CATQ.steps.map(function(s){ return '<li>'+esc(s)+'</li>'; }).join("");
    var camColor = cs.camouflaging ? "#b3893c" : "#5c8f77";
    var aqBlock = aq ? ('<div class="lh-result" style="border-left-color:'+aq.band.color+'"><span class="lbl">AQ-10 · '+esc(aq.band.label)+'</span><span class="sc"><b>'+aq.total+' / '+aq.n+'</b><span>sinais</span></span></div>') : "";
    var insight = (aq && aq.total<6 && cs.camouflaging) ? '<div class="lh-warn"><b>Padrão de atenção:</b> poucos sinais aparentes no AQ-10 + camuflagem alta no CAT-Q — perfil frequentemente associado a diagnóstico tardio. Recomenda-se avaliação profissional com os dois resultados.</div>' : "";
    return '<div class="docmodal" id="docmodal" role="dialog" aria-label="Relatório para baixar">'+
      '<div class="docwrap"><section id="letterhead"><div class="lh-pad">'+
        '<div class="lh-brand"><span class="lh-mark" aria-hidden="true"></span><span class="nm">Prisma</span><span class="tg">Rastreio + camuflagem</span></div>'+
        '<div class="lh-rule" aria-hidden="true"></div>'+
        '<h1>Rastreio de sinais e camuflagem</h1>'+
        '<p class="lh-sub">Instrumentos de orientação — não constituem diagnóstico.</p>'+
        '<div class="lh-meta">'+
          '<div><div class="k">Data</div><div class="v">'+esc(date)+'</div></div>'+
          '<div><div class="k">Perfil</div><div class="v">Adulto (autoavaliação)</div></div>'+
          '<div><div class="k">Instrumentos</div><div class="v">AQ-10 + CAT-Q</div></div>'+
        '</div>'+
        aqBlock+
        '<div class="lh-result" style="border-left-color:'+camColor+'"><span class="lbl">Camuflagem (CAT-Q)</span><span class="sc"><b>'+cs.total+' / 175</b><span>'+(cs.camouflaging?"acima do limiar 100":"abaixo do limiar 100")+'</span></span></div>'+
        '<h2>Formas de camuflagem</h2>'+
        '<table class="lh-map"><tbody>'+subrows+'</tbody></table>'+
        insight+
        '<h2>Próximos passos</h2>'+
        '<ul class="lh-steps">'+steps+'</ul>'+
        '<div class="lh-warn"><b>Aviso:</b> rastreio e camuflagem são orientação, não diagnóstico. Somente avaliação profissional confirma ou descarta o TEA. '+esc(CATQ.source)+'</div>'+
        '<p class="lh-telemed">🩺 Em breve: atendimento imediato via telemedicina com profissionais capacitados, direto pelo Prisma.</p>'+
      '</div>'+
      '<div class="lh-foot"><div class="credit"><b>Prisma</b> — uma plataforma <b>IDASAM</b>, desenvolvida em parceria com a <b>MAZARI CORP.</b></div><div class="gen">Gerado em '+esc(date)+' · sem validade diagnóstica</div></div>'+
      '</section></div>'+
      '<div class="docbar"><button class="btn ghost" data-a="closedoc">Fechar</button><button class="btn" data-a="print">⬇︎ Salvar como PDF</button></div>'+
    '</div>';
  }
  function openDoc(){
    closeDoc();
    var wrap=document.createElement("div");
    wrap.innerHTML=buildLetterhead();
    document.body.appendChild(wrap.firstChild);
    document.body.style.overflow="hidden";
  }
  function closeDoc(){
    var m=document.getElementById("docmodal");
    if(m) m.remove();
    document.body.style.overflow="";
  }

  /* ---------- Boot / spinner ---------- */
  function showBoot(msg){ if(bootMsg) bootMsg.innerHTML=msg; boot.classList.remove("hide"); }
  function hideBoot(){ boot.classList.add("hide"); }

  /* ---------- Events ---------- */
  document.addEventListener("click", function(e){
    var el=e.target.closest("[data-a]"); if(!el) return;
    var a=el.getAttribute("data-a");
    if(a==="download"){
      showBoot("Preparando seu documento…");
      setTimeout(function(){ hideBoot(); openDoc(); }, 550);
      return;
    }
    if(a==="print"){ window.print(); return; }
    if(a==="closedoc"){ closeDoc(); return; }
    // navigation actions
    if(a==="start"){ st.screen="profile"; }
    else if(a==="home"){ st.screen="welcome"; st.profile=null; st.i=0; st.raw=[]; st.aq=null; }
    else if(a==="profile"){ st.profile=el.getAttribute("data-p"); st.screen="intro"; }
    else if(a==="profileBack"){ st.screen="profile"; st.profile=null; }
    else if(a==="begin"){ st.i=0; st.raw=[]; st.screen="quiz"; }
    else if(a==="answer"){ st.raw[st.i]=el.getAttribute("data-v"); render(); return; }
    else if(a==="prev"){ if(st.i>0){ st.i--; } else { st.screen="intro"; } }
    else if(a==="next"){ if(!st.raw[st.i]) return; if(st.i<inst().q.length-1){ st.i++; } else { if(st.profile==="adult"){ st.aq=compute(); st.aq.raw=st.raw.slice(); } st.screen="result"; } }
    else if(a==="deepen-catq"){ st.profile="catq"; st.i=0; st.raw=[]; st.screen="intro"; }
    else if(a==="catqBack"){ st.profile="adult"; st.raw=(st.aq&&st.aq.raw)?st.aq.raw.slice():[]; st.screen="result"; }
    else if(a==="restart"){ st.i=0; st.raw=[]; st.screen="quiz"; }
    else return;
    render();
  });
  document.addEventListener("keydown", function(e){
    if(e.key==="Escape"){ if(document.getElementById("docmodal")) closeDoc(); if(document.getElementById("bk")) closeSettings(); }
  });

  /* ---------- Settings sheet ---------- */
  var gear=document.getElementById("gear");
  function prefState(){ return {rm:root.classList.contains("pref-rm"), lg:root.classList.contains("pref-lg")}; }
  function openSettings(){
    var p=prefState();
    var back=document.createElement("div"); back.className="backdrop"; back.id="bk";
    var panel=document.createElement("div"); panel.className="panel"; panel.setAttribute("role","dialog"); panel.setAttribute("aria-label","Ajustes sensoriais");
    panel.innerHTML=
      '<h3>Ajustes sensoriais</h3>'+
      '<p style="color:var(--ink-soft);font-size:.9rem;margin-bottom:8px">Deixe a experiência do seu jeito.</p>'+
      toggle("rm","Reduzir movimento","Desliga animações e transições.",p.rm)+
      toggle("lg","Texto maior","Aumenta o tamanho das letras.",p.lg)+
      '<button class="btn" data-a="closeset" style="margin-top:18px">Pronto</button>';
    document.body.appendChild(back); document.body.appendChild(panel);
    back.addEventListener("click", closeSettings);
    panel.addEventListener("click", function(e){
      if(e.target.closest('[data-a="closeset"]')){ closeSettings(); return; }
      var t=e.target.closest("[data-t]"); if(!t) return;
      var key=t.getAttribute("data-t"), cls=key==="rm"?"pref-rm":"pref-lg";
      var on=root.classList.toggle(cls);
      try{ localStorage.setItem("prisma_"+key, on?"1":"0"); }catch(err){}
      t.querySelector(".sw").setAttribute("aria-checked", on?"true":"false");
    });
  }
  function toggle(k,h,s,on){
    return '<div class="toggle" data-t="'+k+'"><div><b>'+h+'</b><br><small>'+s+'</small></div>'+
      '<span class="sw" role="switch" aria-checked="'+(on?"true":"false")+'" aria-label="'+h+'"></span></div>';
  }
  function closeSettings(){ var b=document.getElementById("bk"), p=document.querySelector(".panel"); if(b)b.remove(); if(p)p.remove(); }
  if(gear) gear.addEventListener("click", openSettings);

  /* restore saved sensory prefs */
  try{
    if(localStorage.getItem("prisma_rm")==="1") root.classList.add("pref-rm");
    if(localStorage.getItem("prisma_lg")==="1") root.classList.add("pref-lg");
  }catch(err){}

  /* ---------- Init ---------- */
  render();
  window.addEventListener("load", function(){ setTimeout(hideBoot, 500); });
  // fallback if 'load' already fired
  setTimeout(hideBoot, 1600);
})();
