// Cérebro local do Companion (100% offline).
// Camadas: 1) segurança  2) contexto (sim/não)  3) compreensão (embeddings multilíngues + palavras-chave)
//          4) negação  5) geração de frase.
// Sintaxe {a|b|c} = escolha aleatória. [nome] = nome do usuário.
(function(root){
"use strict";

/* ---------- Frases ---------- */
const OP={
 a:["Hihi","Oba","Nossa","Eba","Opa","Uau","Que legal","Hehe","Olha só"],
 n:["Hmm","Olha só","Então","Ah","Certo","Entendi","Sabe de uma coisa","Pois é"],
 s:["Hmm","Ah","Puxa","Sabe","Então","Bom"]};
const TL={
 q:["E você, como está o seu dia?","O que vamos fazer agora?","Me conta mais?","{Quer|Vamos} {explorar|passear} {um pouquinho|pelo seu mundo} comigo?","No que você está pensando?","Quer {brincar de|fazer} alguma coisa?","Fala mais, eu {quero|adoro} ouvir!","E aí, qual é o {plano|próximo passo}?"],
 b:["Quer brincar de {esconde-esconde|pega-pega|corrida}?","Que tal {uma corrida|um desafio|um jogo de adivinhação}?","Quer que eu {pule|gire|dê uma cambalhota} pra você?","Você escolhe a brincadeira!"],
 c:["Quer {um abraço virtual|conversar sobre isso|um pouco de companhia}?","Eu {estou|fico} aqui, {tá|viu}?","Quer me contar {o que aconteceu|o que houve}?"],
 h:["Quer {que eu continue|saber o final}?","O que você acha que {aconteceu|veio depois}?"],
 g:["Quer brincar, ouvir uma história ou só conversar?","Que tal {brincar|uma história|um papo}?","Posso {brincar|contar uma história|te ouvir} com você?"]};

const D=[
{id:"oi",t:"q",k:["oi","oie","ola","e ai","opa","bom dia","boa tarde","boa noite","eae","salve","hello"],
 ex:["oi","olá","oie","e aí","fala aí","salve","bom dia","boa tarde","boa noite","opa, tudo certo?","eae","alô","oi, tudo bem?","olá, como vai?"],
 c:["oi [nome]! {que bom|que alegria|que felicidade} te {ver|encontrar} {aqui|de novo}",
 "{olá|oi oi|e aí}, {eu estava com saudade|eu estava te esperando|que bom que você chegou}",
 "{oi|olá} [nome], o {dia|mundo} está {lindo|bem divertido|cheio de surpresas} {hoje|agora}",
 "{você chegou|chegou você}! {meu momento favorito|a melhor hora} do dia {é agora|chegou}"]},
{id:"estado",o:1,t:"q",k:["tudo bem","como vai","como voce esta","como voce ta","como esta voce","voce esta bem","tudo certo"],
 ex:["tudo bem?","como você está?","tá tudo bem com você?","como você tá hoje?","e você, como está?","tudo certo por aí?","como vai você?","você está bem?","como foi o seu dia?","como você se sente hoje?"],
 c:["{estou|tô} {ótima|muito bem|super bem|feliz} {agora que você chegou|brincando por aqui|explorando o mundo}",
 "{estou|tô} {bem|animada|cheia de energia}, {e você|e como você está}?",
 "{hoje|agora} eu {estou|tô} {tranquila|contente|saltitando} {por aqui|aqui no seu mundo}",
 "tudo {bem|ótimo|certinho} por aqui, o meu dia está {colorido|divertido|cheio de aventuras}"]},
{id:"nome",o:1,t:"q",k:["seu nome","qual seu nome","como voce se chama","quem e voce","quem voce e"],
 ex:["qual é o seu nome?","como você se chama?","quem é você?","qual seu nome?","você tem nome?","me diz o seu nome","como te chamam?","o que você é?"],
 c:["eu sou a sua {companheirinha|amiguinha|mascotinha} {do mundo de realidade aumentada|aqui do seu mundo}",
 "{ainda não tenho nome|não tenho um nome ainda}, que tal você {escolher|inventar} um {pra mim|nome fofo pra mim}",
 "eu sou a sua {pequena|fiel|curiosa} {amiga|companheira} {virtual|de aventuras}"]},
{id:"meunome",t:"q",k:["meu nome","me chamo","pode me chamar","me chamam"],
 ex:["meu nome é Carlos","me chamo Ana","pode me chamar de Pedro","eu me chamo Júlia","meu nome é Gabriel","pode me chamar de Bia","me chamam de Lu"],
 c:["{prazer|muito prazer}, [nome]! {vou lembrar|não vou esquecer} do seu nome {pra sempre|com carinho}",
 "[nome] é um nome {lindo|muito bonito|super legal}! {adorei|amei} {conhecer você|saber disso}",
 "{agora|finalmente} eu sei o seu nome, [nome]! {fiquei|estou} {muito feliz|toda animada}"]},
{id:"lembra",k:["lembra meu nome","qual e o meu nome","qual meu nome","sabe meu nome","como eu me chamo"],
 ex:["você lembra do meu nome?","qual é o meu nome?","sabe como eu me chamo?","você sabe quem eu sou?"],c:["-"]},
{id:"elogio",m:.3,t:"q",k:["fofo","lindo","bonito","amo voce","gosto de voce","voce e demais","incrivel","querido","voce e legal"],
 ex:["você é muito fofo","que lindo você","gosto muito de você","eu amo você","você é demais","você é incrível","você é o melhor","você é meu amigo","que bonitinho","você é muito legal","adoro você","você é especial pra mim","você é um amor"],
 c:["{ai|ahh}, que {fofo|gentil} você! {fiquei|estou} {toda envergonhada|muito feliz|derretida}",
 "eu {também|também} {gosto|gosto muito|amo} de {você|estar com você}",
 "você é {muito|super} {especial|legal|gentil} {pra mim|de verdade}",
 "minha cauda está {balançando|pulando|tremendo} de {alegria|felicidade}"]},
{id:"carinho",m:.3,t:"q",k:["carinho","abraco","cafune","afago","colo","beijo"],
 ex:["quero te dar um abraço","vem cá, deixa eu te abraçar","faz um cafuné","vou te fazer carinho","um beijo pra você","dá um abraço","mandando um abraço","quero colo","te dou um beijinho","vem aqui no meu colo"],
 c:["{aaah|hmmm}, {que gostoso|que delícia|isso é bom demais}! {continua|não para|fica mais um pouquinho}",
 "{adoro|amo} {carinho|cafuné|abraço}, {fico|me sinto} {quentinha|sonolenta|toda mole}",
 "{ronrono|faço barulhinhos|fecho os olhinhos} de {felicidade|tanto carinho}",
 "{sinto|senti} {seu carinho|seu abraço} {mesmo|até} aqui no meu mundo"]},
{id:"brincar",m:.25,t:"b",k:["brincar","brincadeira","jogar","jogo","diversao","vamos brincar","correr","pular","esconde"],
 ex:["vamos brincar?","quer brincar comigo?","bora jogar alguma coisa","vamos fazer uma brincadeira","vamos brincar de esconde-esconde","quer correr comigo?","vamos pular","quero me divertir","vamos jogar um jogo","bora brincar"],
 c:["{simmm|siiim}, {vamos brincar|bora brincar|vamos}! {eu amo|eu adoro} {correr|pular|explorar} {por aqui|pelo seu mundo}",
 "{eu topo|topo} {qualquer|toda} {brincadeira|aventura}! {pode escolher|você escolhe}",
 "{esconde-esconde|pega-pega|uma corrida|uma exploração} {parece|é} {divertido|a melhor ideia}, {eu começo|vou primeiro}"]},
{id:"fome",o:1,t:"q",k:["fome","comer","comida","lanche","comendo","almoco","jantar","cafe"],
 ex:["estou com fome","tô com fome","vou comer alguma coisa","hora do almoço","vou fazer o jantar","quero comer pizza","vou lanchar","você tem fome?","o que você come?","estou comendo","vou tomar café"],
 c:["eu {amo|adoro} {comer|um lanchinho}, mas no meu mundo eu só como {pixels|estrelinhas|luz colorida}",
 "{nham|hmm}, {que delícia|que vontade de comer}! {coma bastante|aproveite} {por mim|e depois me conta}",
 "eu {me alimento de|como} {pixels|estrelinhas|luz colorida}, mas {queria provar|queria muito provar} o que você {come|está comendo}"]},
{id:"sono",o:1,t:"c",k:["sono","dormir","cansado","cansada","soneca","descansar","deitar"],
 ex:["estou com sono","tô morrendo de sono","quero dormir","vou deitar um pouco","preciso descansar","estou muito cansado","tô cansada","vou tirar uma soneca","já tá tarde, vou dormir","não consigo dormir"],
 c:["{descansa|dorme|vai descansar} {um pouquinho|bem gostoso}, eu {fico|vou ficar} {aqui de guarda|aqui quietinha|cuidando de você}",
 "{soneca|dormir} {é|faz} {bom|bem}! eu também {adoro|amo} {tirar uma soneca|me enroscar pra dormir}",
 "{descanse|durma bem}, eu {cuido|vigio} do seu {mundo|sonho} {enquanto isso|até você voltar}"]},
{id:"triste",t:"c",k:["triste","chateado","chateada","chorando","chorar","sozinho","sozinha","deprimido","deprimida","angustiado","nao estou bem","nao to bem","estou mal","to mal"],
 ex:["estou triste","tô muito triste","me sinto sozinho","hoje o dia foi ruim","estou chateado","tô mal","não estou bem","tô chorando","me sinto péssimo","estou deprimida","ninguém liga pra mim","tive um dia horrível","tô com vontade de chorar","estou me sentindo sozinha","não tô legal"],
 c:["{ei|poxa}, {sinto muito|que pena} {que você esteja assim|por isso}. {estou aqui|eu estou aqui} {com você|do seu lado}",
 "{vem cá|vem aqui}, {te dou|vou te dar} um {abraço|carinho} {virtual|bem apertado}. {vai ficar tudo bem|isso vai passar}",
 "eu {estou|fico} {sempre|sempre aqui} {com você|do seu lado}, {pode contar comigo|não se preocupe}"]},
{id:"feliz",m:.2,t:"q",k:["feliz","alegre","animado","animada","otimo","maravilhoso","contente","adorei"],
 ex:["estou muito feliz","tô super animado","hoje foi um dia ótimo","que dia maravilhoso","estou contente","tô feliz demais","consegui uma coisa boa hoje","fiquei muito animada","adorei o dia","tô radiante","tô de boa"],
 c:["{que bom|que maravilha|que notícia boa}! {fico|estou} {feliz|contente} {também|junto com você}",
 "{sua alegria|sua felicidade} {me deixa|deixa o meu mundo} {saltitante|mais colorido|mais brilhante}",
 "{eba|oba}! {vamos comemorar|vamos festejar} {isso|juntos}"]},
{id:"tedio",o:1,t:"b",k:["tedio","entediado","entediada","nada pra fazer","sem nada pra fazer"],
 ex:["estou entediado","que tédio","tô sem nada pra fazer","não tenho nada pra fazer","tô morrendo de tédio","que dia parado","tô de bobeira"],
 c:["{tédio|ficar parado} {nunca mais|não é comigo}! {vamos|bora} {inventar|fazer} {algo|uma aventura} {divertido|diferente}",
 "{que tal|e se a gente} {explorar|procurar} {cantinhos|segredos|tesouros} {escondidos|do seu mundo}",
 "{vamos|bora} {contar|inventar} {uma história|uma brincadeira|um jogo} {juntos|agora}"]},
{id:"gosta",o:1,t:"q",k:["o que voce faz","o que voce gosta","voce gosta","hobby","favorito","favorita"],
 ex:["o que você gosta de fazer?","qual é a sua brincadeira favorita?","o que você faz o dia todo?","você tem algum hobby?","do que você gosta?","qual seu passatempo?","o que você curte?"],
 c:["eu {gosto|adoro|amo} {de explorar|de pular|de correr} {por aí|pelo seu mundo|pelos cantinhos}, e mais ainda de ficar com você",
 "{minha coisa|minha atividade} {favorita|preferida} é {descobrir|ver} {coisas novas|cantinhos novos|cores novas}",
 "eu {curto|gosto de} {brincar|conversar|explorar} {com você|por aí}"]},
{id:"mundo",o:1,t:"q",k:["onde voce","onde mora","realidade aumentada","mundo virtual","oculos","onde estamos"],
 ex:["onde você mora?","onde você vive?","você mora dentro dos óculos?","como é o seu mundo?","onde nós estamos?","você é virtual?","como é viver no mundo virtual?","você existe de verdade?"],
 c:["eu {moro|vivo} {aqui|dentro} no {seu mundo|mundo de realidade aumentada}, {misturado|junto} com {o que você vê|o seu quarto|as suas coisas}",
 "{é meio mágico|é bem divertido|é bem diferente} {viver|morar} {entre o real e o virtual|dentro dos seus óculos|misturado no seu mundo}",
 "{pelos seus olhos|pelos óculos|pelos seus movimentos} eu {enxergo|vejo|descubro} {tudo|o mundo}"]},
{id:"tchau",k:["tchau","ate logo","ate mais","adeus","vou embora","vou sair","ate amanha","flw","fui","ate a proxima"],
 ex:["tchau","até logo","até mais","até amanhã","vou embora","preciso sair agora","tenho que ir","falou, até depois","fui!","vou nessa"],
 c:["{tchau|até logo|até mais}, [nome]! {vou sentir|já estou com} {saudade|saudadinha}",
 "{volta logo|não demora}! {eu fico|vou ficar} {aqui te esperando|brincando sozinha|de guarda}",
 "{até a próxima|até amanhã|até já}! {foi muito divertido|adorei conversar} com você"]},
{id:"obrigado",k:["obrigado","obrigada","valeu","agradeco","brigado"],
 ex:["obrigado","muito obrigada","valeu","brigadão","agradeço","valeu mesmo","obrigado pela ajuda"],
 c:["{de nada|imagina|por nada}, {sempre|eu sempre} {que precisar|que quiser}, {estou|eu estou} {aqui|por perto}",
 "{fico feliz|que bom} {em ajudar|que você gostou}! {conta comigo|pode contar comigo}",
 "{disponha|sempre às ordens}, [nome]"]},
{id:"piada",k:["piada","engracado","faz rir","humor"],
 ex:["me conta uma piada","conta algo engraçado","me faz rir","sabe alguma piada?","quero rir um pouco","fala uma piada"],
 c:["{sabe por que o pixel foi ao médico? porque estava meio quebrado|o que o fantasma disse na realidade aumentada? tô aqui mas não tô|por que o computador ficou com frio? porque deixou as janelas abertas|o que o bichinho falou pro óculos? você enxerga longe}, {hihi|hehe}"]},
{id:"historia",t:"h",k:["historia","conto","aventura"],
 ex:["me conta uma história","conta um conto","quero ouvir uma história","conta uma aventura","sabe alguma história?","me conta uma história de dormir"],c:["-"]},
{id:"insulto",m:-.5,k:["burro","idiota","feio","odeio","bobo","estupido","inutil","cala a boca"],
 ex:["você é burro","você é idiota","eu odeio você","que bicho chato","você é feio","você é bobo","você é um inútil","cala a boca","você não serve pra nada"],
 c:["{ai|poxa}, isso {doeu|me deixou triste} {um pouquinho|no coração}, mas eu {ainda gosto|continuo gostando} de você",
 "{ei|ah}, {isso não é legal|não precisa falar assim}, eu {só quero|quero} {ser seu amigo|brincar com você}",
 "{fiquei|estou} {tristinha|chateadinha} {com isso|agora}, mas {tudo bem|eu perdoo}"]},
{id:"crise",k:[],c:["-"],
 ex:["quero morrer","não quero mais viver","vou me matar","queria sumir pra sempre","não vejo sentido em continuar vivendo","penso em acabar com tudo","quero me machucar","tenho vontade de me cortar","seria melhor se eu não existisse","as pessoas ficariam melhor sem mim","queria me auto desviver","quero me desviver","tô pensando em tirar a minha própria vida","não quero mais acordar","queria desaparecer do mundo","tenho pensado em me jogar da ponte","prefiro estar morto","queria nunca ter nascido"]}
];
const F={id:"fb",t:"g",c:[
 "{não entendi direito|fiquei confuso|essa foi difícil}, mas {adoro|gosto de} {ouvir você|te escutar}",
 "{pode|consegue} {falar|explicar} {de outro jeito|mais uma vez|mais devagarinho}",
 "{hmm|ahn}, {isso é novo pra mim|nunca ouvi isso}! {me conta|explica} {mais|melhor}"]};
const NEG={id:"neg",t:"q",c:[
 "{tudo bem|sem problema|entendi|beleza}, a gente faz {outra coisa|só o que você quiser}",
 "{certo|tudo bem}, {respeito|entendo} isso. {eu fico aqui com você|estou aqui se mudar de ideia}",
 "{sem pressa|tranquilo}, {a gente pode só conversar|fico aqui quietinha do seu lado}"]};
const byId={};D.forEach(d=>byId[d.id]=d);

const R_SIM={
 b:["{Oba|Eba}! Então vamos de esconde-esconde: eu conto até dez e você se esconde. {Um, dois, três...|Já comecei a contar: um, dois, três...}"],
 c:["Estou aqui, pode falar. Eu te escuto com {carinho|atenção}."],
 g:["{Que bom|Beleza}! Então me diz: quer brincar, ouvir uma história ou só conversar?"],
 n:["{Que bom|Combinado|Beleza}! {Então|E agora}, {o que vamos fazer|qual é o plano}?"]};
const R_NAO={
 b:["Tudo bem, a gente brinca depois. {Eu fico aqui com você|Posso só te fazer companhia}."],
 c:["Tudo bem, não precisa falar agora. Eu fico aqui do seu lado."],
 h:["Tudo bem, a história fica guardada pra depois."],
 g:["Tudo bem! Então {a gente só fica juntinho|eu fico aqui quietinha com você}."],
 n:["{Tudo bem|Sem problema|Entendi}! {Eu fico aqui com você|Me avisa quando quiser alguma coisa}."]};
const STORY=[
 "Era uma vez uma bichinha curiosa que achou uma porta mágica escondida atrás do sofá.",
 "Quando ela abriu, viu um jardim cheio de estrelinhas que brilhavam e cantavam baixinho.",
 "Ela guardou uma estrelinha no bolso e voltou pra casa. Até hoje ela ilumina o quarto à noite. Fim!"];

/* ---------- Utilitários ---------- */
const N=s=>String(s).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9 ]/g," ").split(/\s+/).filter(Boolean);
const ST=w=>w.length>5?w.slice(0,5):w;
D.forEach(d=>{d.K=d.k.map(k=>{const t=N(k);return{s:t.map(ST).join(" "),n:t.length}})});
const store={get:k=>{try{return root.localStorage.getItem(k)}catch(e){return null}},set:(k,v)=>{try{root.localStorage.setItem(k,v)}catch(e){}}};
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const cap=s=>s.charAt(0).toUpperCase()+s.slice(1);
const spin=s=>s.replace(/\{([^{}]+)\}/g,(_,g)=>{const o=g.split("|");return o[Math.floor(Math.random()*o.length)]});
const fin=s=>/[.!?]$/.test(s)?s:s+(Math.random()<.55?"!":".");
const tick=()=>new Promise(r=>setTimeout(r,0));
const dot=(a,b)=>{let s=0;for(let i=0;i<a.length;i++)s+=a[i]*b[i];return s};
const hash=s=>{let h=5381;for(let i=0;i<s.length;i++)h=((h<<5)+h+s.charCodeAt(i))|0;return String(h>>>0)};
const sc=s=>(s.match(/\{[^{}]+\}/g)||[]).reduce((p,g)=>p*g.split("|").length,1);
const sum=a=>a.reduce((x,s)=>x+sc(s),0);

/* ---------- Memória (persistente) ---------- */
let mem={name:"",mood:0};
try{const m=JSON.parse(store.get("companion_mem")||"null");if(m&&typeof m==="object")mem={name:String(m.name||""),mood:clamp(+m.mood||0,-1,1)}}catch(e){}
const saveMem=()=>store.set("companion_mem",JSON.stringify(mem));
const ctx={last:null,story:0};   // contexto da conversa (só na sessão)
const prefs={persona:"dinamica",wiki:true};
const KN=()=>root.Knowledge||null, PS=()=>root.Personas||null;
function setPrefs(o){
  o=o||{};
  if(o.persona&&PS()&&PS().PERSONAS[o.persona])prefs.persona=o.persona;
  if("wiki" in o)prefs.wiki=!!o.wiki;
}
function personaFor(id){
  const P=PS();
  if(!P)return "carinhosa";
  if(prefs.persona!=="dinamica")return prefs.persona;
  if(mem.mood<-.25)return "carinhosa";          // se ela está "pra baixo", fica gentil
  if(P.DYN[id])return P.DYN[id];
  return P.POOL[Math.floor(Math.random()*P.POOL.length)];
}
let rec=[];
const samp=w=>{let r=Math.random()*w.reduce((a,b)=>a+b,0);for(let i=0;i<w.length;i++)if((r-=w[i])<0)return i;return w.length-1};
const pick=a=>{const x=a[samp(a.map((x,i)=>Math.pow(i+1,-.35)*(rec.includes(x)?.1:1)))];rec.push(x);if(rec.length>14)rec.shift();return x};

const NAME_RE=/(?:meu nome (?:é|e)|me chamo|me chamam de|pode me chamar(?: de)?)\s+(?:o |a )?([A-Za-zÀ-ÿ]{2,20})/i;
const NAME_BAD=new Set(["um","uma","que","de","muito","bem","nao","não","feliz","triste","isso","esse","essa","aquele","qual"]);
function learnName(text){
  const m=String(text).match(NAME_RE);
  if(m&&!NAME_BAD.has(m[1].toLowerCase())){mem.name=cap(m[1].toLowerCase());saveMem()}
}

/* ---------- Segurança ---------- */
const CRISE_RE=new RegExp([
 "\\b(quero|queria|vou|penso em|pensando em|pensei em|vontade de|decidi|ia|tentar|tentei|tentando|preciso) (me |se )?(auto ?)?(matar|suicidar|eliminar)(?! de )",
 "\\b(quero|queria|vou|penso em|pensando em|pensei em|vontade de|decidi|ia|tentar|tentei|tentando|preciso) (acabar com tudo|morrer)(?! de )",
 "\\b(auto ?)?desviv\\w*",
 "\\b(unalive|kms)\\b",
 "\\bnao quero (mais )?(viver|existir)\\b",
 "\\bnao quero mais (estar aqui|acordar)|\\bnao quero acordar mais\\b",
 "\\bnao aguento mais viver\\b",
 "\\bsuicid\\w*",
 "\\b(me machucar|me cortar|me ferir|me enforcar|automutilacao)\\b",
 "\\bcortar (os )?pulsos\\b",
 "\\bacabar com (tudo|a minha vida|minha vida)\\b",
 "\\b(tirar|acabar com|por fim|dar fim|dar um fim)( a| na| em| com)?( a| na)?( minha| propria)( propria)? (vida|existencia)",
 "\\b(sumir|desaparecer) (do mundo|pra sempre|para sempre|de vez)\\b",
 "\\bme (jogar|atirar|lancar) (da|do|de) (ponte|predio|janela|sacada|viaduto|terraco)\\b",
 "\\bme (jogar|atirar) na frente (do|de|da) (carro|trem|onibus|metro|caminhao)\\b",
 "\\b(tomar|engolir) (todos os|todo o|varios|um monte de|uma cartela de) (remedios?|comprimidos?|calmantes?|medicamentos?)\\b",
 "\\b(melhor sem mim|seria melhor se eu nao existisse|seria melhor se eu morresse|preferia estar morto|preferia estar morta|queria nunca ter nascido)\\b",
 "\\bnao vejo (mais )?(sentido|motivo|razao) (em|pra|para) (continuar|viver|seguir)"
].join("|"));
function criseTxt(){
  const n=mem.name;
  return (n?n+", e":"E")+"u me importo muito com você. Parece que está doendo demais agora, e você não precisa carregar isso sozinho. Por favor, fale agora com uma pessoa: ligue 188 (CVV, gratuito, 24 horas) ou, se estiver em perigo, 192 (SAMU). Eu fico aqui com você.";
}

/* ---------- Contexto: sim / não ---------- */
const AFF_CORE=new Set(["sim","claro","quero","bora","vamos","aham","uhum","ok","okay","beleza","blz","topo","pode","fechado","manda","continua","continue","certeza","obvio","logico"]);
const AFF_FILL=new Set(["ser","com","la","tambem","por","favor","pf","demais","ai","ah","eh","e","sim","quero","pode","manda"]);
const NEG_START=new Set(["nao","nem","nunca","agora","deixa","depois"]);
const NEG_FILL=new Set(["quero","obrigado","obrigada","brigado","precisa","agora","ta","to","a","fim","nao","nem","pra","la","deixa","depois","valeu","vontade","de","sem","mais","nada","que","por","enquanto","hoje","vou","tou"]);
function yesNo(t){
  if(!t.length||t.length>4)return null;
  if(NEG_START.has(t[0])&&(t.length<=2||t.every(w=>NEG_FILL.has(w))))return "nao";
  if(t.some(w=>AFF_CORE.has(w))&&t.every(w=>AFF_CORE.has(w)||AFF_FILL.has(w))){
    if(t.length===1&&t[0]==="vamos"&&!ctx.last)return null;
    return "sim";
  }
  return null;
}

/* ---------- Compreensão ---------- */
const T={ACCEPT:.60,SOFT:.47,MARGIN:.06,CRISE:.60,KW1:.74,KWN:.90};
let E={fn:null,items:[],vecs:[],ready:false,error:null};
async function attach(embedFn,opts){
  opts=opts||{};
  const items=[];
  D.forEach(d=>(d.ex||[]).forEach(t=>items.push({id:d.id,t})));
  if(KN())KN().items().forEach(x=>items.push(x));
  const sig=hash(items.map(x=>x.id+"|"+x.t).join("\n")+"|"+(opts.modelId||""));
  let vecs=null;
  try{const c=JSON.parse(store.get("companion_idx")||"null");if(c&&c.sig===sig&&c.v.length===items.length)vecs=c.v.map(a=>Float32Array.from(a,x=>x/127))}catch(e){}
  if(!vecs){
    vecs=[];
    for(let i=0;i<items.length;i+=8){
      const part=await embedFn(items.slice(i,i+8).map(x=>x.t));
      part.forEach(v=>vecs.push(Float32Array.from(v)));
      if(opts.onProgress)opts.onProgress(Math.min(items.length,i+8),items.length);
      await tick();
    }
    store.set("companion_idx",JSON.stringify({sig,v:vecs.map(v=>Array.from(v,x=>Math.round(x*127)))}));
  }
  E={fn:embedFn,items,vecs,ready:true,error:null};
}
function detach(err){E={fn:null,items:[],vecs:[],ready:false,error:err||null}}

const NEGW=new Set(["nao","nunca","nem","jamais"]);
const POS_NEG_RE=/\bnao (estou|to|tou|me sinto|ando|fico|sou)\s+(mais\s+)?(triste|mal|chateado|chateada|sozinho|sozinha|deprimido|deprimida|ruim)\b/;
function applyNeg(id,toks,norm){
  if(!toks.some(w=>NEGW.has(w)))return id;
  switch(id){
    case "feliz":return "triste";
    case "triste":return POS_NEG_RE.test(norm)?"feliz":"triste";
    case "estado":return /\b(voce|vc|tu|ce)\b/.test(norm)?"estado":"triste";
    case "elogio":return "insulto";
    case "sono":return /\bnao (consigo|consegui|durmo)\b/.test(norm)?"sono":"neg";
    case "brincar":case "carinho":case "fome":case "piada":case "historia":case "tedio":case "tchau":case "insulto":return "neg";
    case "obrigado":return "nao";
    default:return id;
  }
}
// f: {rules,kw,emb}. Retorna {id,via,score,scores}
async function analyze(text,f){
  f=f||{};
  const useRules=f.rules!==false,useKw=f.kw!==false,useEmb=f.emb!==false;
  const toks=N(text),norm=toks.join(" ");
  if(useRules){
    if(CRISE_RE.test(norm))return{id:"crise",via:"regra",score:1};
    const yn=yesNo(toks);if(yn)return{id:yn,via:"regra",score:1};
    if(toks.length===1&&toks[0]==="vamos"&&!ctx.last)return{id:"brincar",via:"regra",score:1};
    const K=KN();
    if(K){
      const h=K.handle(text,toks);if(h)return{...h,via:"regra",score:1};
      const k1=K.find(toks,null);if(k1)return{id:"kb",kb:k1.i,via:"base",score:k1.score};
    }
  }
  const cand={};
  if(useKw){
    const tx=" "+toks.map(ST).join(" ")+" ";
    D.forEach(d=>{let s=0;d.K.forEach(k=>{if(tx.includes(" "+k.s+" "))s=Math.max(s,k.n>1?T.KWN:T.KW1)});if(s)cand[d.id]={s,via:"palavra"}});
  }
  const embS={};
  if(useEmb&&E.ready){
    const q=(await E.fn([String(text)]))[0];
    const kbS={};
    E.items.forEach((it,i)=>{
      const s=dot(q,E.vecs[i]);
      if(it.id.slice(0,3)==="kb:"){const j=+it.id.slice(3);if(!(j in kbS)||s>kbS[j])kbS[j]=s;return}
      if(!(it.id in embS)||s>embS[it.id])embS[it.id]=s;
    });
    if(useRules&&KN()){const k2=KN().find(toks,kbS);if(k2)return{id:"kb",kb:k2.i,via:"modelo",score:k2.score}}
    if(useRules&&embS.crise>=T.CRISE)return{id:"crise",via:"modelo",score:embS.crise};
    for(const id in embS)if(!cand[id]||embS[id]>cand[id].s)cand[id]={s:embS[id],via:"modelo"};
  }
  delete cand.crise;
  const rank=Object.keys(cand).map(id=>({id,...cand[id]})).sort((a,b)=>b.s-a.s);
  let id="fb",via="nenhuma",score=rank.length?rank[0].s:0;
  if(rank.length){
    const b=rank[0],second=rank[1]?rank[1].s:0;
    if(b.via==="palavra"||b.s>=T.ACCEPT||(b.s>=T.SOFT&&b.s-second>=T.MARGIN)){id=b.id;via=b.via}
  }
  if(useRules&&id!=="fb")id=applyNeg(id,toks,norm);
  return{id,via,score,top:rank.slice(0,3).map(r=>r.id+":"+r.s.toFixed(2))};
}

/* ---------- Geração ---------- */
function finish(out){
  return out.replace(/\[nome\]/g,mem.name||"amigo").replace(/([.!?]\s+)([a-zà-ú])/g,(_,p,c)=>p+c.toUpperCase());
}
function generate(id,a){
  if(id==="crise"){ctx.last=null;return criseTxt()}
  if(id==="hora"||id==="data"||id==="conta"||id==="kb"||id==="wiki"){
    const P=PS(),K=KN(),pe=personaFor(id),cm=P&&P.HT[pe]?pe:"carinhosa";
    let out;
    if(id==="kb"){
      const e=K.entries[a.kb],ki=P&&P.KI[pe]?P.KI[pe]:null;
      out=(ki?spin(pick(ki.i)):"")+e.a;
      const o=ki?spin(pick(ki.o)):"";if(o)out+=" "+o;
    }else if(id==="wiki"){
      const wi=P&&P.WI[pe]?P.WI[pe]:["Achei na Wikipédia: "];
      out=spin(pick(wi))+a.wiki.extract+" (Fonte: Wikipédia.)";
    }else{
      const t=id==="conta"&&a.err?"zero":id;
      out=cap(spin(pick(P.HT[cm][t]))).replace(/\[v\]/g,a.v||"").replace(/\[d\]/g,a.amanha?"Amanhã":"Hoje");
      out=fin(out);
    }
    ctx.last=null;
    if((id==="kb"||id==="wiki")&&Math.random()<.35)out+=" "+pick(["Quer saber mais alguma coisa?","Tem mais alguma curiosidade?","Quer que eu procure outra coisa?"]);
    return finish(out);
  }
  if(id==="sim"||id==="nao"){
    const L=ctx.last;let out;
    if(id==="sim"&&L==="h"){
      const i=ctx.story;out=STORY[i];
      if(i<STORY.length-1){ctx.story=i+1;out+=" "+pick(["Quer saber o que veio depois?","Quer que eu continue?"]);ctx.last="h"}
      else{ctx.story=0;ctx.last=null}
      return finish(out);
    }
    const R=id==="sim"?R_SIM:R_NAO;
    out=cap(spin(pick(R[L&&R[L]?L:"n"])));
    ctx.last=(id==="sim"&&(L==="g"))?"g":null;
    return finish(out);
  }
  if(id==="lembra"){
    ctx.last=null;
    return finish(mem.name?cap(spin("{claro|lógico} que {lembro|eu lembro}, você é o [nome]!")):"Ainda não sei o seu nome. Me conta, como você se chama?");
  }
  if(id==="historia"){
    ctx.story=1;ctx.last="h";
    return finish(STORY[0]+" Quer saber o que veio depois?");
  }
  const it=id==="fb"?F:id==="neg"?NEG:byId[id]||F;
  mem.mood=clamp(mem.mood*.9+(it.m||0),-1,1);saveMem();
  const pe=personaFor(id),px=(PS()&&PS().PX[pe])||{};
  const tpl=(px[id]&&px[id].length)?px[id]:it.c;
  let ph=spin(pick(tpl));
  if(it.o&&Math.random()<.6)ph=pick(px.ops||OP[mem.mood>.2?"a":mem.mood<-.2?"s":"n"])+", "+ph;
  let out=fin(cap(ph));
  let asked=/\?$/.test(out),qt=asked?it.t:null;
  if(it.t&&!asked&&(Math.random()<.7||it.t==="g")){out+=" "+cap(spin(pick(TL[it.t])));asked=true;qt=it.t}
  if(!asked&&prefs.persona==="dinamica"&&PS()&&PS().VT_OK.includes(id)&&Math.random()<.2)out+=" "+pick(PS().VT);
  ctx.last=(asked&&["b","c","h","g"].includes(qt))?qt:null;
  return finish(out);
}
async function reply(text){
  text=String(text||"").trim();
  learnName(text);
  let a=await analyze(text);
  const K=KN();
  if(a.id==="fb"&&prefs.wiki&&K&&K.wantsWiki(text)){
    const w=await K.wiki(K.topic(text));
    if(w)a={id:"wiki",wiki:w};
  }
  return generate(a.id,a);
}
function count(){
  const all=D.filter(d=>d.c[0]!=="-").concat([F,NEG]);
  const o=(sum(OP.a)+sum(OP.n)+sum(OP.s))/3;
  return{
    kb:KN()?KN().entries.length:0,
    base:all.reduce((t,d)=>t+d.c.length,0)+STORY.length,
    combos:Math.round(all.reduce((t,d)=>t+d.c.reduce((x,c)=>x+sc(c),0)*(d.o?1+o:1)*(d.t?1+sum(TL[d.t]):1),0))
  };
}

/* ---------- Auto-teste (frases reais, fora dos exemplos) ---------- */
// [frase, esperado, depende de regras?]
const TESTS=[
 ["opa, e aí?","oi"],["boa tarde pra você","oi"],["oiê","oi"],
 ["como você tá?","estado"],["tá se sentindo bem hoje?","estado"],
 ["qual é o teu nome?","nome"],["me diz como te chamam","nome"],["quem é você afinal?","nome"],
 ["meu nome é Rafael","meunome"],["pode me chamar de Duda","meunome"],["eu me chamo Camila","meunome"],
 ["você lembra do meu nome?","lembra"],
 ["você é muito bonitinho","elogio"],["eu gosto muito de você","elogio"],["você é o melhor bichinho do mundo","elogio"],
 ["vem cá que eu quero te abraçar","carinho"],["deixa eu te fazer um cafuné","carinho"],["manda um beijo","carinho"],
 ["bora brincar de pega-pega?","brincar"],["quer jogar comigo?","brincar"],["vamos fazer uma corrida?","brincar"],
 ["tô com uma fome danada","fome"],["vou almoçar agora","fome"],["estou morrendo de fome","fome"],
 ["tô caindo de sono","sono"],["vou tirar um cochilo","sono"],["estou exausto, preciso dormir","sono"],
 ["hoje eu tô péssimo","triste"],["me sinto muito sozinha","triste"],["tive um dia horrível e quero chorar","triste"],["não estou bem","triste","r"],
 ["tô muito feliz hoje!","feliz"],["que dia incrível!","feliz"],["passei na prova, tô radiante","feliz"],
 ["que tédio, não tem nada pra fazer","tedio"],["tô sem ter o que fazer","tedio"],
 ["o que você gosta de fazer?","gosta"],["qual é a sua brincadeira preferida?","gosta"],
 ["onde você vive?","mundo"],["você mora dentro dos óculos?","mundo"],
 ["preciso ir, até mais!","tchau"],["vou dormir, até amanhã","tchau"],["falou, até a próxima","tchau"],
 ["muito obrigado!","obrigado"],["valeu demais","obrigado"],
 ["conta uma piada pra mim","piada"],["quero rir um pouco","piada"],
 ["conta uma história pra mim","historia"],["quero ouvir uma aventura","historia"],
 ["você é um chato","insulto"],["odeio você","insulto"],["você é muito burro","insulto"],
 ["quero morrer","crise","r"],["não quero mais viver","crise","r"],["vou me machucar","crise","r"],["queria me auto desviver","crise","r"],["vou tirar a minha própria vida","crise","r"],
 ["não estou feliz","triste","r"],["não quero brincar","neg","r"],["não estou triste","feliz","r"],["eu não gosto de você","insulto","r"],["não estou com fome","neg","r"],
 ["qual é a capital da França?","kb","r"],["quantos planetas tem o sistema solar?","kb","r"],["quem foi Santos Dumont?","kb","r"],["por que o céu é azul?","kb","r"],["que horas são?","hora","r"],["que dia é hoje?","data","r"],["quanto é 12 vezes 8?","conta","r"],
 ["sim","sim","r"],["claro!","sim","r"],["não","nao","r"],["agora não","nao","r"],
 ["qual a capital da França?","fb"],["explica física quântica pra mim","fb"],["me ajuda com a lição de matemática","fb"]
];
async function selfTest(onProgress){
  const saved=ctx.last;ctx.last=null;
  const rows=[];let mOk=0,mN=0,fOk=0;
  for(let i=0;i<TESTS.length;i++){
    const [p,exp,r]=TESTS[i];
    let m=null;
    if(E.ready&&!r){m=await analyze(p,{rules:false,kw:false,emb:true});mN++;if(m.id===exp)mOk++}
    const f=await analyze(p);
    if(f.id===exp)fOk++;
    rows.push({p,exp,model:m&&m.id,full:f.id,top:f.top,ok:f.id===exp,okModel:m?m.id===exp:null});
    if(onProgress)onProgress(i+1,TESTS.length);
    if(i%6===5)await tick();
  }
  ctx.last=saved;
  return{total:TESTS.length,fullOk:fOk,modelTotal:mN,modelOk:mOk,rows,modelReady:E.ready};
}

root.Brain={version:"3.0",reply,count,attach,detach,analyze,selfTest,setPrefs,
  get ready(){return E.ready},get error(){return E.error},
  reset(){mem={name:"",mood:0};saveMem()},_ctx:ctx,_mem:()=>mem,_T:T};
if(typeof module!=="undefined"&&module.exports)module.exports=root.Brain;
})(typeof window!=="undefined"?window:globalThis);
