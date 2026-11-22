// Criatividade da Yui: inventa histórias, poemas e nomes, e joga adivinhas, quiz e "você prefere?".
// Tudo é montado a partir de peças curadas (gramática de histórias, rimas prontas), sem modelo de IA.
(function(root){
"use strict";
const N=s=>String(s).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9 ]/g," ").split(/\s+/).filter(Boolean);
let rec=[];
const rp=a=>{const c=a.filter(x=>!rec.includes(x)),p=c.length?c:a,x=p[Math.floor(Math.random()*p.length)];rec.push(x);if(rec.length>30)rec.shift();return x};
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};

/* ---------- Histórias ---------- */
const HEROES=[["uma raposa curiosa","ela"],["um robozinho distraído","ele"],["uma menina que desenhava portas","ela"],["um gato que conversava com as nuvens","ele"],["uma pequena cientista","ela"],["um dragão que tinha medo de fogo","ele"],["uma garota feita de luz","ela"],["um garoto que colecionava sons","ele"],["uma coruja que nunca dormia","ela"],["um viajante que perdeu o mapa","ele"]];
const PLACES=["numa vila no alto de uma montanha","dentro de uma biblioteca sem fim","numa ilha que mudava de lugar","numa cidade onde chovia música","no fundo de uma floresta de cogumelos brilhantes","numa estação espacial esquecida","num mundo feito de pixels coloridos","num farol no fim do mundo"];
const GOALS=["encontrar a estrela que tinha caído do céu","devolver uma lembrança perdida ao seu dono","descobrir de onde vinha uma melodia misteriosa","atravessar a Ponte das Mil Cores","achar a chave de uma porta que ninguém via","levar uma carta até o outro lado do mar","consertar o relógio que tinha parado o tempo"];
const OBST=[["o caminho ficou coberto por uma névoa que apagava os pensamentos","descobriram que a névoa só tinha medo de ser esquecida"],["uma tempestade de areia dourada fechou a trilha","perceberam que a tempestade só passava quando alguém cantava junto"],["a ponte sumiu bem na frente","entenderam que a ponte só aparecia pra quem confiava no próximo passo"],["um enigma gigante bloqueou a passagem","perceberam que o enigma só se resolvia com gentileza"],["tudo ficou escuro de repente","viram que a escuridão se abria sempre que davam risada"]];
const HELPERS=["um vaga-lume tímido","uma tartaruga sábia e lenta","um espírito de vento que adorava fazer piada","uma criança que lembrava de todos os sonhos","uma lanterna que falava baixinho"];
const ENDS=["E assim a aventura terminou, mas a amizade ficou.","Voltaram pra casa com o coração leve, e a história virou lenda por ali.","E, daquele dia em diante, nunca mais se sentiram sozinhos.","Dizem que, nas noites claras, dá pra ver a luz dessa aventura no céu."];
function story(theme){
  const h=rp(HEROES);
  const t=theme?` Um dia, ${h[1]} encontrou algo ligado a ${theme} e resolveu ${rp(GOALS)}.`:` Um dia, ${h[1]} resolveu ${rp(GOALS)}.`;
  const ob=rp(OBST);
  return[
    `Era uma vez ${h[0]} que vivia ${rp(PLACES)}.${t}`,
    `No caminho, ${ob[0]}. Foi então que ${rp(HELPERS)} apareceu e disse que queria ajudar.`,
    `Juntos, ${ob[1]}. ${rp(ENDS)}`
  ];
}
/* ---------- Poemas (originais) ---------- */
const POEMS={
 amor:[["O amor chega devagar,","como a luz de uma manhã;","vai ficando sem avisar","e deixa a vida mais sã."],["Tem coisas que a gente sente","sem saber explicar;","é um calor diferente","que faz o peito cantar."]],
 amizade:[["Amigo é como um abrigo","quando a chuva vem cair;","é alguém que fica contigo","e te ajuda a sorrir."]],
 saudade:[["A saudade chega mansa,","sem pedir pra entrar;","traz no peito uma lembrança","e vontade de voltar."]],
 noite:[["A lua acende o céu inteiro","com seu brilho de prata;","e o silêncio, companheiro,","faz do escuro uma serenata."]],
 mar:[["O mar vem e vai sem pressa,","conta histórias pra areia;","cada onda é uma promessa","de que a vida tem maré cheia."]],
 chuva:[["A chuva cai mansinha","lavando o dia cansado;","e eu fico quietinha","com o coração aconchegado."]],
 estrelas:[["Cada estrela é um pontinho","de luz no escuro do céu;","me faz sentir bem pertinho","de um sonho que escrevi num papel."]],
 sol:[["O sol acorda a cidade","com um beijo de calor;","e traz de novo a vontade","de viver com mais amor."]],
 coragem:[["Ter medo faz parte da estrada,","mas não precisa parar;","quem dá um passo na madrugada","sempre acaba chegando lá."]]
};
const PT={amor:/\b(amor|paixao|coracao|namor\w*)\b/,amizade:/\b(amig\w*)\b/,saudade:/\b(saudade\w*)\b/,noite:/\b(noite|lua|escuro)\b/,mar:/\b(mar|praia|oceano|onda\w*)\b/,chuva:/\b(chuva|chover)\b/,estrelas:/\b(estrela\w*|ceu|espaco)\b/,sol:/\b(sol|manha|dia)\b/,coragem:/\b(coragem|medo|forca|superacao)\b/};
function poem(norm){
  let k=Object.keys(PT).find(x=>PT[x].test(norm)),exact=!!k;
  if(!k)k=rp(Object.keys(POEMS));
  const p=rp(POEMS[k]);
  return{text:p.join(" / ").replace(/ \/ /g,", ").replace(/,([^,]*)$/,".$1"),lines:p,exact,theme:k};
}
/* ---------- Nomes ---------- */
const NAMES={pet:["Mochi","Biscoito","Pipoca","Nuvem","Tofu","Cacau","Pingo","Fofura","Estrela","Bolinho","Amora","Jujuba","Panqueca","Churros"],epico:["Aldric","Seraphina","Kael","Lyra","Thorne","Isolde","Draven","Elara","Ronan","Selene","Kaelith","Astrid"],japones:["Hana","Sora","Kaito","Yuki","Haru","Akira","Mei","Ren","Sakura","Hikari","Aiko","Daichi"],tech:["Pixel","Byte","Nova","Orion","Vega","Lumi","Zenit","Atlas","Pulse","Eco"],comum:["Luna","Helena","Theo","Davi","Aurora","Miguel","Alice","Bento","Cecília","Caio"]};
function names(norm){
  let k="comum",label="Pra esse nome";
  if(/\b(gato|gata|cachorro|cachorra|pet|bichinho|bichano|coelho|hamster|periquito|peixe)\b/.test(norm)){k="pet";label="Pro seu bichinho"}
  else if(/\b(personagem|heroi|vilao|vila|rpg|mago|guerreiro|dragao|elfo)\b/.test(norm)){k=Math.random()<.6?"epico":"japones";label="Pro seu personagem"}
  else if(/\b(anime|japones)\b/.test(norm)){k="japones";label="Pro seu personagem"}
  else if(/\b(app|projeto|empresa|jogo|bot|sistema|site|marca)\b/.test(norm)){k="tech";label="Pro seu projeto"}
  else if(/\b(bebe|filho|filha)\b/.test(norm)){k="comum";label="Pro bebê"}
  const l=shuffle(NAMES[k]).slice(0,3);
  return`${label}, eu sugiro ${l[0]}, ${l[1]} ou ${l[2]}. Algum te lembra alguma coisa? Se quiser, eu invento mais!`;
}
/* ---------- Você prefere? ---------- */
const WYR=[["poder voar","ficar invisível"],["viajar no tempo","ler mentes"],["viver sempre no verão","viver sempre no inverno"],["ter um dragão de estimação","ter um robô amigo"],["comer só doce","comer só salgado pra sempre"],["morar no espaço","morar no fundo do mar"],["falar com os animais","falar todas as línguas do mundo"],["nunca mais precisar dormir","nunca mais precisar comer"],["viver dentro de um anime","viver dentro de um jogo"],["ter memória perfeita","sempre achar o que perdeu"],["ouvir só música calma","ouvir só música animada"],["ter uma biblioteca infinita","ter uma cozinha infinita"]];
function wyr(){
  const [a,b]=rp(WYR),mine=Math.random()<.5?a:b;
  return`Você prefere ${a} ou ${b}? Eu ficaria com ${mine}, mas me conta a sua escolha!`;
}
const WYR_REACT=["Boa escolha! Por quê?","Hmm, interessante! Eu quase escolhi o outro.","Gostei da sua resposta! Conta o motivo?","Ótima escolha, combina com você!"];
/* ---------- Adivinhas ---------- */
const RIDDLES=[
 ["O que é, o que é: tem pernas, mas não anda?",["mesa","cadeira","banco"],"Fica dentro de casa e você usa pra comer ou sentar.","A mesa! Ela tem pernas, mas não sai do lugar."],
 ["O que é, o que é: quanto mais se tira, maior fica?",["buraco"],"Dá pra cavar um.","O buraco! Quanto mais você tira terra, maior ele fica."],
 ["O que é, o que é: tem cabeça e dentes, mas não morde?",["alho"],"Fica na cozinha e dá sabor à comida.","O alho! Tem cabeça e dentes, mas não morde."],
 ["O que é, o que é: anda com os pés na cabeça?",["piolho"],"É um bichinho bem pequeno e chato.","O piolho! Ele vive na cabeça de quem tem cabelo."],
 ["O que é, o que é: passa na frente do sol e não faz sombra?",["vento"],"Você sente, mas não vê.","O vento! Ele passa e você só sente."],
 ["O que é, o que é: quanto mais seca, mais molha?",["toalha"],"Fica no banheiro.","A toalha! Ela seca e fica molhada."],
 ["O que é, o que é: nasce grande e morre pequeno?",["lapis"],"Você usa pra escrever e ele vai gastando.","O lápis! Ele vai ficando menor a cada vez que apontam."],
 ["O que é, o que é: dá uma volta ao mundo e fica no mesmo canto?",["selo"],"Fica no cantinho de uma carta.","O selo! Ele viaja grudado na carta, sempre no mesmo canto."],
 ["O que é, o que é: tem coroa, mas não é rei, e tem espinhos, mas não é peixe?",["abacaxi"],"É uma fruta tropical e doce.","O abacaxi!"],
 ["O que é, o que é: cai em pé e corre deitado?",["chuva","agua","rio"],"Vem lá do céu.","A chuva! Ela cai e depois escorre pelo chão."],
 ["O que é, o que é: é seu, mas os outros usam mais do que você?",["nome"],"Todo mundo tem um.","O seu nome! Os outros falam ele mais do que você."],
 ["O que é, o que é: quanto mais cresce, menos se vê?",["escuridao","escuro"],"Acontece à noite.","A escuridão!"]
];
/* ---------- Quiz ---------- */
const QUIZ=[
 ["Qual planeta é conhecido como planeta vermelho?",["marte"],"Começa com M.","Marte"],
 ["Quem criou o Dragon Ball?",["toriyama","akira"],"O sobrenome começa com T.","Akira Toriyama"],
 ["Qual é o maior animal do mundo?",["baleia"],"Vive no oceano.","A baleia-azul"],
 ["Qual é o personagem principal de One Piece?",["luffy"],"Ele usa um chapéu de palha.","Luffy"],
 ["Em que jogo você controla o Link?",["zelda"],"A princesa que ele salva dá nome à série.","The Legend of Zelda"],
 ["Quem pintou a Mona Lisa?",["leonardo","vinci"],"Foi um gênio italiano.","Leonardo da Vinci"],
 ["Quantos ossos tem um adulto?",["206"],"É um pouco mais de 200.","206"],
 ["Qual é a capital do Japão?",["toquio"],"Começa com T.","Tóquio"],
 ["Qual estúdio criou o Totoro?",["ghibli"],"O estúdio do Miyazaki.","Studio Ghibli"],
 ["Qual é o encanador mais famoso dos videogames?",["mario"],"Veste vermelho e tem um irmão chamado Luigi.","Mario"],
 ["Quantos corações tem um polvo?",["3","tres"],"É mais de um.","Três"],
 ["Qual banda tinha o Freddie Mercury como vocalista?",["queen"],"O nome significa rainha em inglês.","Queen"],
 ["Em que ano o Brasil foi descoberto pelos portugueses?",["1500"],"Foi no começo do século XVI.","1500"],
 ["Qual é o maior planeta do sistema solar?",["jupiter"],"Tem uma grande mancha vermelha.","Júpiter"],
 ["Qual anime tem um garoto que quer ser Hokage?",["naruto"],"O nome dele é o mesmo do anime.","Naruto"],
 ["Qual é o animal terrestre mais rápido?",["guepardo","chita"],"É um felino manchado.","O guepardo"],
 ["Quem escreveu Dom Casmurro?",["machado"],"Foi um dos maiores escritores brasileiros.","Machado de Assis"],
 ["Qual é a capital da Argentina?",["buenos aires"],"A cidade do tango.","Buenos Aires"],
 ["Qual jogo tem blocos e foi lançado oficialmente em 2011?",["minecraft"],"Dá pra construir de tudo.","Minecraft"],
 ["Qual cantora virtual tem cabelo azul-turquesa em formato de maria-chiquinha?",["miku","hatsune"],"O primeiro nome começa com H.","Hatsune Miku"]
];
const QUIT=/\b(para|parar|chega|sair|cansei|outro assunto|nao quero mais)\b/;
const GIVEUP=/\b(desisto|nao sei|me conta|me fala|qual (e )?a resposta|revela|pula|passa|proxima)\b/;
const HINT=/\b(dica|pista|ajuda)\b/;
const has=(toks,acc)=>acc.some(a=>{const w=N(a);return w.length===1?toks.includes(w[0]):toks.join(" ").includes(w.join(" "))});

/* ---------- Pedidos ---------- */
const VERB=/\b(conta|conte|contar|inventa|inventar|invente|cria|criar|crie|escreve|escrever|escreva|faz|fazer|faca|quero|me da|me de|fala|fale|bota|compoe|compor)\b/;
function ask(text,toks){
  const norm=toks.join(" ");
  if(/\b(adivinha\w*|charada\w*|enigma\w*)\b/.test(norm)&&!/\bo que e\b/.test(norm))return{kind:"riddle"};
  if(/\b(quiz|perguntas e respostas)\b|\bme (testa|desafia)\b|\bme faz (uma )?pergunta\b|\bvamos (jogar|brincar) de (perguntas|quiz)\b/.test(norm))return{kind:"quiz"};
  if(/\b(voce prefere|jogo do prefere|prefere o que|dilema)\b/.test(norm))return{kind:"wyr"};
  if(/\b(poema|poesia|versos?|rimas?|trova|trovinha)\b/.test(norm)&&VERB.test(norm))return{kind:"poem",norm};
  if(/\b(historia|conto)\b/.test(norm)&&VERB.test(norm)){
    const m=String(text).toLowerCase().match(/\b(?:sobre|de|com|do|da|dos|das)\s+(?:o |a |os |as |um |uma )?([a-zà-ú0-9 ]{3,30})[?!. ]*$/);
    let th=m?m[1].trim():"";
    if(/^(dormir|ninar|criancas?|crianças?|adormecer|voce|você|vc)$/.test(th)||th.split(" ").length>4)th="";
    return{kind:"story",theme:th};
  }
  if(/\bnomes?\b/.test(norm)&&(/\b(sugere|sugira|sugest\w*|inventa|inventar|invente|cria|criar|crie|ideia|ideias|ajuda|escolher|dar um|da um|me da)\b/.test(norm)||/\bnomes?\b.*\b(pra|para)\b/.test(norm))&&!/\bseu nome\b/.test(norm))return{kind:"name",norm};
  return null;
}
function make(req){
  switch(req.kind){
    case"story":{const parts=story(req.theme);return{text:parts[0]+" Quer saber o que veio depois?",tale:{parts,i:1}}}
    case"poem":{const p=poem(req.norm);return{text:(p.exact?"Fiz esse pra você: ":"Não tinha um tema certinho, mas fiz esse com carinho: ")+p.lines.join(" / ")}}
    case"name":return{text:names(req.norm)};
    case"wyr":return{text:wyr(),last:"w"};
    case"riddle":{const r=rp(RIDDLES);return{text:r[0]+" Pode chutar, pedir uma dica ou desistir!",game:{type:"riddle",r,tries:0}}}
    case"quiz":{const qs=shuffle(QUIZ).slice(0,3);return{text:`Bora de quiz! São 3 perguntas. Primeira: ${qs[0][0]}`,game:{type:"quiz",qs,i:0,score:0,tries:0}}}
  }
  return null;
}
// Continua um jogo em andamento. Retorna {text,game(null=acabou),pass?} ou null.
function play(g,text,toks){
  const norm=toks.join(" ");
  if(QUIT.test(norm)&&toks.length<=5)return{text:"Tudo bem, a gente para por aqui. Foi divertido!",game:null};
  if(g.type==="riddle"){
    const [q,acc,hint,rev]=g.r;
    if(has(toks,acc))return{text:rp(["Acertou! ","Isso mesmo! ","Boa! "])+rev+" Quer outra?",game:null,last:"g2"};
    if(HINT.test(norm)&&toks.length<=4)return{text:"Dica: "+hint,game:g};
    if(GIVEUP.test(norm)&&toks.length<=5)return{text:"Era "+rev+" Quer tentar outra?",game:null,last:"g2"};
    if(toks.length>7)return{pass:true,game:null};
    g.tries++;
    if(g.tries>=3)return{text:"Quase lá! Era assim: "+rev+" Quer tentar outra?",game:null,last:"g2"};
    return{text:rp(["Hmm, não é isso.","Quase! Tenta de novo.","Boa tentativa, mas não."])+" Quer uma dica?",game:g};
  }
  if(g.type==="quiz"){
    const q=g.qs[g.i];
    let msg=null;
    if(has(toks,q[1])){g.score++;msg=rp(["Acertou! ","Isso aí! ","Perfeito! "])}
    else if(HINT.test(norm)&&toks.length<=4)return{text:"Dica: "+q[2],game:g};
    else if(GIVEUP.test(norm)&&toks.length<=5)msg="Sem problema! Era "+q[3]+". ";
    else if(toks.length>7)return{pass:true,game:null};
    else{g.tries++;if(g.tries<2)return{text:rp(["Hmm, não é bem isso.","Quase! Tenta de novo."])+" Quer uma dica?",game:g};msg="Era "+q[3]+". "}
    g.i++;g.tries=0;
    if(g.i>=g.qs.length){
      const sc=g.score,fin=sc===3?"Gabaritou! Você é demais!":sc===2?"Mandou bem!":sc===1?"Foi bem, e dá pra melhorar na próxima!":"Hoje não rolou, mas foi divertido! A gente joga de novo.";
      return{text:`${msg}Fim do quiz! Você fez ${sc} de 3. ${fin} Quer jogar de novo?`,game:null,last:"g2"};
    }
    return{text:`${msg}Próxima: ${g.qs[g.i][0]}`,game:g};
  }
  return null;
}
root.Create={version:"1.0",ask,make,play,story,poem,names,wyr,WYR_REACT,RIDDLES,QUIZ,N};
if(typeof module!=="undefined"&&module.exports)module.exports=root.Create;
})(typeof window!=="undefined"?window:globalThis);
