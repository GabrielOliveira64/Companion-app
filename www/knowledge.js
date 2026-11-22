// Conhecimento do mundo real da Companion. Leve: só texto + regras (sem modelo, sem rede, exceto a Wikipédia opcional).
//  1) BASE: perguntas e respostas curtas (offline). Para ensinar algo novo, adicione uma linha em RAW.
//  2) HANDLERS: hora, data e contas (calculados no aparelho).
//  3) WIKIPÉDIA: quando não souber, consulta o resumo (só o assunto é enviado; precisa de internet).
(function(root){
"use strict";
const N=s=>String(s).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9 ]/g," ").split(/\s+/).filter(Boolean);
const ST=w=>w.length>5?w.slice(0,5):w;
const STOP=new Set("qual quais que e eh o a os as um uma uns umas de do da dos das em no na nos nas por para pra com se sao ser foi era voce vc me mim meu minha sobre tem ter como quando onde quem quanto quantos quantas fica ficam fala diz sabe eu seu sua pode favor ai entao ao aos isso esse essa mais muito la dizer falar explicar contar saber pesquisar procurar".split(" "));
const GENERIC=new Set(["capit","maior","menor","quant","funci","exist","fazer","vive","mundo","grand","pequen","primei","ultim","anima"]);
const cont=toks=>toks.filter(w=>!STOP.has(w)).map(ST);

/* ---------------- BASE DE CONHECIMENTO ---------------- */
// [ [perguntas...], resposta, (opcional) [palavras-chave obrigatórias] ]
const RAW=[
// Sobre a Yui
[["qual é o significado do seu nome","o que significa yui","por que você se chama yui","o que quer dizer yui"],"Yui é um nome japonês. Dependendo de como se escreve, pode significar coisas como laço ou união, e eu gosto dessa ideia de ligar pessoas e histórias.",["yui"]],
// Geografia
[["qual é o maior país do mundo","maior país do mundo"],"O maior país do mundo em área é a Rússia. O Brasil é o quinto.",["pais"]],
[["qual é o maior oceano","maior oceano do mundo"],"O maior oceano é o Pacífico.",["oceano"]],
[["qual é o maior rio do mundo","maior rio do mundo","qual é o rio mais longo do mundo"],"O Amazonas é o rio com mais água do mundo. Sobre o mais longo, o Nilo e o Amazonas disputam o título.",["rio"]],
[["qual é a maior floresta tropical do mundo","onde fica a floresta amazônica"],"A Amazônia é a maior floresta tropical do mundo, e a maior parte dela fica no Brasil.",["floresta","amazo"]],
[["qual é a montanha mais alta do mundo","maior montanha do mundo"],"O Monte Everest, com cerca de 8.849 metros de altura.",["montanha","everest"]],
[["quantos continentes existem","quantos continentes tem o mundo"],"Depende de como se conta, 6 ou 7. A divisão mais usada no Brasil tem seis: África, América, Antártida, Ásia, Europa e Oceania.",["continente"]],
[["quantos estados tem o brasil","quantos estados brasileiros existem"],"O Brasil tem 26 estados e o Distrito Federal.",["estado"]],
[["quantas regiões tem o brasil","quais são as regiões do brasil"],"O Brasil tem cinco regiões: Norte, Nordeste, Centro-Oeste, Sudeste e Sul.",["regio"]],
[["qual é a maior cidade do brasil","maior cidade do brasil"],"A maior cidade do Brasil em população é São Paulo.",["cidade"]],
[["qual é o ponto mais alto do brasil","qual a montanha mais alta do brasil"],"O Pico da Neblina, no Amazonas, com cerca de 2.995 metros.",["pico","montanha","alto"]],
[["qual língua se fala no brasil","qual é o idioma do brasil"],"No Brasil se fala português.",["lingua","idioma"]],
[["qual é o maior deserto do mundo","maior deserto do mundo"],"O maior deserto do mundo é a Antártida, que é um deserto de gelo. O maior deserto quente é o Saara.",["deserto"]],
[["quantos países existem no mundo","quantos países tem no mundo"],"A ONU tem 193 países-membros.",["paises"]],
[["qual é o país mais populoso do mundo","país mais populoso"],"A Índia e a China são os países mais populosos do mundo, e a Índia passou a China recentemente.",["populo"]],
// Espaço e ciência
[["quantos planetas tem o sistema solar","quantos planetas existem","quais são os planetas do sistema solar"],"São oito planetas: Mercúrio, Vênus, Terra, Marte, Júpiter, Saturno, Urano e Netuno.",["planetas","sistema"]],
[["qual é o maior planeta do sistema solar","maior planeta"],"Júpiter é o maior planeta do sistema solar.",["plane"]],
[["qual é o planeta mais próximo do sol"],"Mercúrio é o planeta mais próximo do Sol.",["plane"]],
[["qual é o menor planeta do sistema solar","menor planeta"],"Mercúrio é o menor planeta do sistema solar.",["plane"]],
[["por que marte é vermelho","qual é o planeta vermelho"],"Marte parece vermelho por causa do óxido de ferro, a ferrugem, na superfície.",["marte","verme"]],
[["o que é a lua","o que é a lua da terra"],"A Lua é o satélite natural da Terra, a cerca de 384 mil quilômetros de distância.",["lua"]],
[["o que é o sol","o que é o sol e de que ele é feito"],"O Sol é uma estrela, uma enorme bola de gás quente. A luz dele leva cerca de 8 minutos para chegar à Terra.",["sol"]],
[["o que é um buraco negro","o que são buracos negros"],"É uma região do espaço onde a gravidade é tão forte que nem a luz consegue escapar.",["buraco","negro"]],
[["plutão é um planeta","por que plutão não é planeta"],"Plutão é considerado um planeta anão desde 2006.",["plutao"]],
[["por que o céu é azul"],"Porque o ar espalha a luz azul do Sol mais do que as outras cores.",["ceu"]],
[["o que é gravidade","o que é a gravidade"],"Gravidade é a força que atrai as massas umas para as outras. Na Terra, ela puxa as coisas para baixo com cerca de 9,8 metros por segundo ao quadrado.",["gravi"]],
[["qual é a velocidade da luz","quão rápida é a luz"],"A luz viaja a cerca de 300 mil quilômetros por segundo.",["luz","veloc"]],
[["por que existem as estações do ano","por que tem verão e inverno"],"Porque o eixo da Terra é inclinado, então cada parte recebe mais ou menos luz do Sol ao longo do ano.",["estaco","verao","inver"]],
[["o que é dna","o que é o dna"],"O DNA é a molécula que guarda as instruções genéticas dos seres vivos.",["dna"]],
[["o que é fotossíntese","como as plantas fazem fotossíntese"],"É o processo em que as plantas usam luz do sol, água e gás carbônico para produzir seu alimento e liberar oxigênio.",["fotos"]],
[["a quantos graus a água ferve","qual é a temperatura de ebulição da água"],"A água ferve a 100 graus Celsius ao nível do mar e congela a 0 grau.",["agua","ferve"]],
[["do que o ar é feito","qual é a composição do ar"],"O ar tem cerca de 78% de nitrogênio e 21% de oxigênio.",["ar"]],
[["o que é um átomo"],"O átomo é a unidade básica da matéria, formado por prótons, nêutrons e elétrons.",["atomo"]],
[["como se forma o arco-íris","o que é o arco-íris"],"O arco-íris aparece quando a luz do Sol é refratada e refletida dentro de gotinhas de água.",["arco","iris"]],
[["o que é um raio","o que é um trovão"],"O raio é uma descarga elétrica na atmosfera. O trovão é o barulho que ela faz.",["raio","trovao"]],
[["qual é a idade da terra","quantos anos tem a terra"],"A Terra tem cerca de 4,5 bilhões de anos.",["terra","idade"]],
[["por que os dinossauros foram extintos","o que matou os dinossauros"],"A explicação mais aceita é a queda de um grande asteroide, há cerca de 66 milhões de anos.",["dinoss"]],
[["por que o mar é salgado"],"Porque a chuva e os rios carregam sais minerais das rochas para o mar, e a água evapora, mas o sal fica.",["mar","salgado"]],
[["por que chove","como se forma a chuva"],"O vapor de água sobe, esfria e vira gotinhas nas nuvens. Quando elas ficam pesadas, caem como chuva.",["chove","chuva"]],
[["como os aviões voam","por que o avião voa"],"As asas têm um formato que gera sustentação quando o avião se move rápido pelo ar.",["aviao","avioes","voam"]],
// Corpo e saúde
[["quantos ossos tem o corpo humano","quantos ossos temos"],"Um adulto tem 206 ossos.",["ossos"]],
[["quantos dentes uma pessoa tem","quantos dentes temos"],"Um adulto tem 32 dentes, contando os sisos. As crianças têm 20 dentes de leite.",["dentes"]],
[["qual é o maior órgão do corpo humano","maior órgão do corpo"],"O maior órgão do corpo humano é a pele.",["orgao"]],
[["o que o coração faz","para que serve o coração"],"O coração bombeia o sangue pelo corpo todo. Ele bate cerca de 100 mil vezes por dia.",["coraca"]],
[["quanto tempo uma pessoa deve dormir","quantas horas devo dormir"],"Em geral, adultos precisam de 7 a 9 horas de sono por noite.",["dormir","sono"]],
[["quanta água devo beber por dia","quanta água beber"],"Uma regra comum é cerca de 2 litros por dia, mas varia de pessoa para pessoa.",["agua","beber"]],
[["qual é a temperatura normal do corpo humano"],"A temperatura normal do corpo fica entre 36 e 37 graus Celsius.",["temperatura","corpo"]],
// Animais
[["qual é o maior animal do mundo","maior animal do mundo"],"A baleia-azul é o maior animal do mundo.",["animal"]],
[["qual é o animal terrestre mais rápido","animal mais rápido do mundo"],"Em terra, o guepardo, que passa de 100 quilômetros por hora. No ar, o falcão-peregrino mergulhando passa de 300.",["animal","rapido"]],
[["qual é o animal mais alto do mundo","maior animal terrestre"],"A girafa é o animal mais alto. O maior animal terrestre é o elefante-africano.",["girafa","terrestre","alto"]],
[["quantos corações tem um polvo"],"O polvo tem três corações.",["polvo"]],
[["o golfinho é um peixe","golfinhos são peixes"],"Não, o golfinho é um mamífero, assim como a baleia.",["golfinho"]],
[["o morcego é um pássaro","morcego é ave"],"Não, o morcego é um mamífero, o único que voa de verdade.",["morcego"]],
[["quantas patas tem uma aranha"],"A aranha tem oito patas e não é inseto, é aracnídeo.",["aranha"]],
[["por que os gatos ronronam"],"Os gatos ronronam quando estão contentes, mas às vezes também para se acalmar.",["gato","gatos","ronron"]],
[["o que tem na corcova do camelo"],"Na corcova o camelo guarda gordura, e não água.",["camelo","corcova"]],
// Brasil: história e cultura
[["quando o brasil foi descoberto","quando os portugueses chegaram ao brasil"],"Os portugueses chegaram ao Brasil em 22 de abril de 1500, com a frota de Pedro Álvares Cabral.",["descob","cabral","chegaram"]],
[["quando foi a independência do brasil","quando o brasil se tornou independente"],"A Independência do Brasil foi proclamada em 7 de setembro de 1822, por Dom Pedro Primeiro.",["indep"]],
[["quando foi proclamada a república","quando começou a república no brasil"],"A República foi proclamada em 15 de novembro de 1889.",["republ"]],
[["quando acabou a escravidão no brasil","o que foi a lei áurea"],"A escravidão foi abolida em 13 de maio de 1888, com a Lei Áurea.",["escrav","aurea","aboli"]],
[["quantas copas do mundo o brasil ganhou","o brasil é pentacampeão"],"O Brasil é pentacampeão mundial: ganhou em 1958, 1962, 1970, 1994 e 2002.",["copas","copa","penta"]],
[["quem foi pelé","quem é pelé"],"Pelé foi um dos maiores jogadores de futebol de todos os tempos e ganhou três Copas do Mundo com o Brasil.",["pele"]],
[["quem foi santos dumont"],"Santos Dumont foi um inventor brasileiro, pioneiro da aviação. O 14-Bis voou em Paris em 1906.",["dumont"]],
[["quem foi machado de assis"],"Machado de Assis foi um dos maiores escritores brasileiros, autor de Dom Casmurro, e fundador da Academia Brasileira de Letras.",["machado"]],
[["o que é o carnaval"],"O Carnaval é uma grande festa popular com desfiles, músicas e fantasias, famosa no Rio, em Salvador, Recife e Olinda.",["carnaval"]],
[["o que é o cristo redentor","onde fica o cristo redentor"],"O Cristo Redentor é uma estátua no alto do Corcovado, no Rio de Janeiro, inaugurada em 1931.",["cristo","redentor"]],
[["o que é feijoada","o que é uma feijoada"],"A feijoada é um prato brasileiro de feijão preto cozido com carnes, servido com arroz, couve e laranja.",["feijoada"]],
[["o que é brigadeiro"],"O brigadeiro é um docinho brasileiro de leite condensado, chocolate e manteiga, enrolado em bolinhas.",["brigadeiro"]],
[["onde nasceu o pão de queijo","de onde vem o pão de queijo"],"O pão de queijo é típico de Minas Gerais.",["queijo"]],
// História geral
[["quando foi a segunda guerra mundial"],"A Segunda Guerra Mundial durou de 1939 a 1945.",["guerra"]],
[["quem pintou a mona lisa"],"A Mona Lisa foi pintada por Leonardo da Vinci.",["mona","lisa"]],
[["quem descobriu a américa","quem chegou à américa em 1492"],"Cristóvão Colombo chegou à América em 1492, mas os povos originários já viviam aqui havia milhares de anos.",["colombo","descobriu","america"]],
[["quantos anos têm as pirâmides do egito","onde ficam as pirâmides"],"As pirâmides de Gizé, no Egito, têm cerca de 4.500 anos.",["piramide","piramides"]],
// Tecnologia
[["o que é realidade aumentada"],"É a tecnologia que coloca objetos virtuais dentro do mundo real através da câmera. Que nem eu!",["reali","aumen"]],
[["o que é realidade virtual"],"É a tecnologia que coloca você dentro de um mundo totalmente criado por computador. Na aumentada, o mundo real continua aparecendo.",["reali","virtu"]],
[["o que é arcore","o que é o arcore"],"O ARCore é a tecnologia do Google que ajuda o celular a entender o ambiente: onde ficam o chão e as paredes, e como a luz está.",["arcore"]],
[["o que é inteligência artificial","o que é ia"],"É a área da computação que cria programas capazes de aprender padrões e fazer tarefas que normalmente exigem inteligência humana.",["intel","artif","ia"]],
[["o que é um pixel"],"O pixel é o menor pontinho de uma imagem digital. Eu sou feita deles!",["pixel","pixels"]],
[["o que é um algoritmo"],"Um algoritmo é uma sequência de passos para resolver um problema.",["algor"]],
[["o que é a internet"],"A internet é a rede mundial que conecta computadores e celulares e permite trocar informações.",["inter"]],
[["o que é gps","como funciona o gps"],"O GPS descobre onde você está usando sinais de satélites que giram em volta da Terra.",["gps"]],
[["o que é wifi","o que é wi-fi"],"Wi-Fi é a tecnologia que conecta aparelhos à internet sem fio.",["wifi","wi"]],
// Matemática e dia a dia
[["qual é o valor de pi","quanto vale pi"],"Pi é aproximadamente 3,14159.",["pi"]],
[["quantos dias tem um ano","quantos dias tem o ano"],"Um ano tem 365 dias, e a cada quatro anos tem 366, o ano bissexto.",["ano"]],
[["quantas horas tem um dia"],"Um dia tem 24 horas.",["horas","dia"]],
[["quantos meses tem um ano"],"Um ano tem 12 meses.",["meses"]],
[["quantas cores tem o arco-íris"],"Tradicionalmente, sete cores.",["cores","arco"]],
[["quais são as cores primárias","o que são cores primárias"],"Na tinta, tradicionalmente vermelho, amarelo e azul. Na luz, vermelho, verde e azul.",["cores","primarias"]],
[["o que é um número primo"],"É um número maior que 1 que só pode ser dividido por 1 e por ele mesmo, como 2, 3, 5 e 7.",["numero","primo"]],
[["por que bocejamos","por que a gente boceja"],"Ninguém sabe ao certo. Uma ideia é que ajuda a regular a temperatura do cérebro.",["bocej","boceja"]]
];

// Capitais: [artigo, país, capital, apelidos]
const CAP=[["o","Brasil","Brasília"],["a","França","Paris"],["a","Itália","Roma"],["a","Alemanha","Berlim"],["a","Espanha","Madri"],["","Portugal","Lisboa"],["o","Japão","Tóquio"],["a","Argentina","Buenos Aires"],["os","Estados Unidos","Washington, D.C.",["eua"]],["o","Reino Unido","Londres"],["a","Inglaterra","Londres"],["a","China","Pequim"],["a","Rússia","Moscou"],["o","Canadá","Ottawa"],["a","Austrália","Camberra"],["o","Egito","o Cairo"],["o","México","Cidade do México"],["o","Chile","Santiago"],["o","Uruguai","Montevidéu"],["o","Paraguai","Assunção"],["a","Colômbia","Bogotá"],["o","Peru","Lima"],["a","Índia","Nova Délhi"]];
const DE={o:"do",a:"da",os:"dos","":"de"};
CAP.forEach(([art,p,c,al])=>{
  const de=DE[art]+" "+p, v=[`qual é a capital ${de}`,`capital ${de}`,`qual a capital ${de}`,`qual é a capital de ${p}`];
  (al||[]).forEach(a=>v.push(`capital dos ${a}`));
  RAW.push([v,`A capital ${de} é ${c}.`,N(p).map(ST).concat(al||[])]);
});

const entries=RAW.map(([qs,a,keys])=>{
  const qn=qs.map(q=>N(q));
  const qstems=qn.map(t=>cont(t));
  let k=(keys&&keys.length)?keys.map(x=>ST(N(x)[0]||x)):[...new Set(qstems[0].filter(s=>!GENERIC.has(s)))];
  if(!k.length)k=qstems[0];
  return{qs,a,k:new Set(k),qstems,defs:qn.map(t=>/^(o que|que)\b/.test(t.join(" ")))};
});
const DEF_CUE=/\b(o que|que e|que sao|significa|quer dizer|explica\w*|defin\w*|conceito|me fala|me conta|fale)\b/;

// Procura na base. embMap (opcional): índice da entrada -> similaridade do modelo (0..1).
const INTENT_W=new Set(["maior","menor","primei","ultim","antig","novo","melho","pior","mais","menos","nasceu","morreu","faleceu","idade"].map(ST));
function find(toks,embMap){
  const norm=toks.join(" "),u=cont(toks),us=new Set(u);
  if(!us.size)return null;
  const uI=[...us].filter(x=>INTENT_W.has(x)).sort().join(",");
  const cue=DEF_CUE.test(norm);
  let best=null;
  entries.forEach((e,i)=>{
    if(![...e.k].some(k=>us.has(k)))return;
    let kw=0;
    e.qstems.forEach((qs,j)=>{
      if(!qs.length||(e.defs[j]&&!cue))return;
      if(qs.filter(x=>INTENT_W.has(x)).sort().join(",")!==uI)return;   // "maior" != "quantos"
      let inter=0;qs.forEach(x=>{if(us.has(x))inter++});
      const cq=inter/qs.length,cu=inter/us.size;
      if(cu<.5||cq<.66)return;
      kw=Math.max(kw,2*cq*cu/(cq+cu));
    });
    const em=embMap&&embMap[i]||0;
    if(kw>=.7||em>=.62){const sc=Math.max(kw,em);if(!best||sc>best.score)best={i,score:sc,entry:e}}
  });
  return best;
}

/* ---------------- HORA, DATA, CONTAS ---------------- */
const fmtNum=x=>Number(x.toFixed(6)).toLocaleString("pt-BR",{maximumFractionDigits:6});
const num=s=>parseFloat(String(s).replace(",","."));
function calc(text){
  const t=String(text).toLowerCase();
  const cue=/\b(quanto|quantos|calcul\w+|resultado|conta|soma|vezes|dividido|mais|menos|raiz|por cento|elevado|quadrado)\b|=|^[\s\d.,+\-*x×\/÷()%]+\??$/.test(t);
  let m;
  if((m=t.match(/(\d+(?:[.,]\d+)?)\s*(?:%|por cento)\s*de\s*(\d+(?:[.,]\d+)?)/)))return{r:fmtNum(num(m[1])*num(m[2])/100)};
  if((m=t.match(/raiz quadrada de\s*(\d+(?:[.,]\d+)?)/)))return{r:fmtNum(Math.sqrt(num(m[1])))};
  if((m=t.match(/(\d+(?:[.,]\d+)?)\s*ao quadrado/)))return{r:fmtNum(num(m[1])**2)};
  if(!cue)return null;
  if((m=t.match(/(-?\d+(?:[.,]\d+)?)\s*(\+|-|\*|x|×|\/|÷|mais|menos|vezes|multiplicado por|dividido por)\s*(-?\d+(?:[.,]\d+)?)/))){
    const a=num(m[1]),b=num(m[3]),op=m[2];
    if(/^(\+|mais)$/.test(op))return{r:fmtNum(a+b)};
    if(/^(-|menos)$/.test(op))return{r:fmtNum(a-b)};
    if(/^(\*|x|×|vezes|multiplicado por)$/.test(op))return{r:fmtNum(a*b)};
    if(b===0)return{err:"zero"};
    return{r:fmtNum(a/b)};
  }
  return null;
}
function handle(text,toks){
  const norm=toks.join(" ");
  if(/\bque horas (sao|e)\b|\bhoras sao\b|\bhora certa\b|\bme (diz|fala|da) (as )?horas\b/.test(norm)){
    return{id:"hora",v:new Date().toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})};
  }
  if(/\bque dia (e|eh) hoje\b|\bdata de hoje\b|\bqual (e )?a data\b|\bhoje e que dia\b|\bque dia da semana\b|\bem que dia estamos\b|\bque dia e amanha\b/.test(norm)){
    const d=new Date();if(/amanha/.test(norm))d.setDate(d.getDate()+1);
    return{id:"data",v:d.toLocaleDateString("pt-BR",{weekday:"long",day:"numeric",month:"long",year:"numeric"}),amanha:/amanha/.test(norm)};
  }
  const c=calc(text);
  if(c)return c.err?{id:"conta",err:c.err}:{id:"conta",v:c.r};
  return null;
}

/* ---------------- WIKIPÉDIA (opcional) ---------------- */
const Q_START=/^(?:(?:voce|vc)?\s*sabe\s+)?(?:me\s+)?(?:o que|que|quem|onde|quando|quanto|quantos|quantas|qual|quais|como funciona\w*|por que|porque|pq|fala sobre|fale sobre|explica\w*|pesquis\w+|procur\w+|conta sobre|me fala|me conta|me explica|me diz)\b/;
function wantsWiki(text){
  const norm=N(text).join(" ");
  if(/\b(voce|vc|te|seu|sua|teu|tua|meu|minha|eu|comigo|mim|me)\b/.test(norm))return false;
  return Q_START.test(norm)&&norm.split(" ").length>=2;
}
function topic(text){
  let t=" "+String(text).toLowerCase().replace(/[?!.,;:"]/g," ").replace(/\s+/g," ")+" ";
  const rules=[
    /^ (sabe|voc[eê] sabe|vc sabe) /,/^ me (fala|conta|explica|diz) (sobre|de|do|da) /,/^ (fala|fale|conta|explica|explique|pesquisa|pesquise|procura|procure) (sobre|de|do|da)? ?/,
    /^ (o que (é|e|s[aã]o|significa|quer dizer)|que (é|e|s[aã]o)|quem (é|e|foi|era|s[aã]o|foram)|onde (fica|ficam|é|e|foi)|quando (foi|nasceu|morreu|aconteceu|come[cç]ou|acabou)|como funciona\w*|por que|porque|pq|qual (é|e|foi|era)|quais (s[aã]o|foram)|quanto (é|e|custa|mede|pesa)|quantos|quantas) /
  ];
  rules.forEach(r=>{t=t.replace(r," ")});
  return t.replace(/^ (o|a|os|as|um|uma) /," ").trim();
}
function sentences(extract,keepParens){
  let s=String(extract||"").replace(/\s+/g," ").trim();
  if(!keepParens)s=s.replace(/\s*\([^)]*\)/g,"").replace(/\s+/g," ").trim();
  if(!s||/\b(pode|podem) (se )?(referir|significar)|\brefere-se a:?$/i.test(s))return null;
  return s.split(/(?<=[.!?])\s+(?=[A-ZÀ-Ú])/);
}
function cut(out){return out.length>320?out.slice(0,317).replace(/\s+\S*$/,"")+"…":out}
// Devolve {text, rest}: as primeiras 1-2 frases e as frases que sobraram (para "me conta mais").
function clean(extract,keepParens){
  const parts=sentences(extract,keepParens);
  if(!parts)return null;
  let n=1;
  if(!keepParens&&parts[1]&&(parts[0]+" "+parts[1]).length<=300)n=2;
  return{text:cut(parts.slice(0,n).join(" ")),rest:parts.slice(n)};
}
async function wiki(tp,opts){
  opts=opts||{};
  if(!tp||tp.length<2||(typeof navigator!=="undefined"&&navigator.onLine===false))return null;
  const f=opts.fetch||root.fetch;if(!f)return null;
  const base=opts.base||"https://pt.wikipedia.org/w/api.php";
  const get=async url=>{
    const ctl=typeof AbortController!=="undefined"?new AbortController():null;
    const to=setTimeout(()=>ctl&&ctl.abort(),opts.timeout||4500);
    try{const r=await f(url,ctl?{signal:ctl.signal}:{});if(!r.ok)return null;return await r.json()}
    catch(e){return null}finally{clearTimeout(to)}
  };
  const q=`${base}?action=query&format=json&formatversion=2&origin=*&list=search&srlimit=1&srsearch=${encodeURIComponent(tp)}`;
  const s=await get(q);
  const hit=s&&s.query&&s.query.search&&s.query.search[0];
  if(!hit)return null;
  const e=await get(`${base}?action=query&format=json&formatversion=2&origin=*&prop=extracts&exintro=1&explaintext=1&redirects=1&titles=${encodeURIComponent(hit.title)}`);
  const pg=e&&e.query&&e.query.pages&&e.query.pages[0];
  const c=pg&&clean(pg.extract,opts.dates);
  return c?{title:hit.title,extract:c.text,rest:c.rest}:null;
}

const api={version:"1.0",entries,find,handle,wiki,wantsWiki,topic,clean,N,
  // frases para o índice do modelo (só as 2 primeiras de cada entrada, para economizar memória/cache)
  items:()=>{const o=[];entries.forEach((e,i)=>e.qs.slice(0,2).forEach(t=>o.push({id:"kb:"+i,t})));return o}};
root.Knowledge=api;
if(typeof module!=="undefined"&&module.exports)module.exports=api;
})(typeof window!=="undefined"?window:globalThis);
