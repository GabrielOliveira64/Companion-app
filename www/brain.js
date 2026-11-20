// Modelo próprio: classificador probabilístico (TF-IDF + softmax com temperatura) + gerador de frases combinatório.
// Sintaxe {a|b|c} = escolha aleatória. [nome] = nome do usuário.
(function(){
const OP={
 a:["Hihi","Oba","Nossa","Eba","Opa","Uau","Que legal","Hehe","Olha só"],
 n:["Hmm","Olha só","Então","Ah","Certo","Entendi","Sabe de uma coisa","Pois é"],
 s:["Hmm","Ah","Puxa","Sabe","Então","Bom"]};
const TL={
 q:["E você, como está o seu dia?","O que vamos fazer agora?","Me conta mais?","{Quer|Vamos} {explorar|passear} {um pouquinho|pelo seu mundo} comigo?","No que você está pensando?","Quer {brincar de|fazer} alguma coisa?","Fala mais, eu {quero|adoro} ouvir!","E aí, qual é o {plano|próximo passo}?"],
 b:["Quer brincar de {esconde-esconde|pega-pega|corrida}?","Que tal {uma corrida|um desafio|um jogo de adivinhação}?","Quer que eu {pule|gire|dê uma cambalhota} pra você?","Você escolhe a brincadeira!"],
 c:["Quer {um abraço virtual|conversar sobre isso|um pouco de companhia}?","Eu {estou|fico} aqui, {tá|viu}?","Quer me contar {o que aconteceu|o que houve}?"],
 h:["Quer {que eu continue|saber o final}?","O que você acha que {aconteceu|veio depois}?"]};
const D=[
{id:"oi",k:["oi","ola","e ai","opa","bom dia","boa tarde","boa noite","eae","salve","hello"],t:"q",c:[
 "oi [nome]! {que bom|que alegria|que felicidade} te {ver|encontrar} {aqui|de novo}",
 "{olá|oi oi|e aí}, {eu estava com saudade|eu estava te esperando|que bom que você chegou}",
 "{oi|olá} [nome], o {dia|mundo} está {lindo|bem divertido|cheio de surpresas} {hoje|agora}",
 "{você chegou|chegou você}! {meu momento favorito|a melhor hora} do dia {é agora|chegou}"]},
{id:"estado",o:1,t:"q",k:["tudo bem","como vai","como voce esta","como voce ta","como esta voce","esta bem"],c:[
 "{estou|tô} {ótimo|muito bem|super bem|feliz} {agora que você chegou|brincando por aqui|explorando o mundo}",
 "{estou|tô} {bem|animado|cheio de energia}, {e você|e como você está}",
 "{hoje|agora} eu {estou|tô} {tranquilo|contente|saltitando} {por aqui|aqui no seu mundo}",
 "tudo {bem|ótimo|certinho} por aqui, o meu dia está {colorido|divertido|cheio de aventuras}"]},
{id:"nome",o:1,t:"q",k:["seu nome","qual seu nome","como voce se chama","quem e voce","quem voce e"],c:[
 "eu sou o seu {bichinho|companheiro|amiguinho} {do mundo de realidade aumentada|aqui do seu mundo}",
 "{ainda não tenho nome|não tenho um nome ainda}, que tal você {escolher|inventar} um {pra mim|nome fofo pra mim}",
 "eu sou o seu {pequeno|fiel|curioso} {amigo|companheiro} {virtual|de aventuras}"]},
{id:"meunome",t:"q",k:["meu nome","me chamo","pode me chamar"],c:[
 "{prazer|muito prazer}, [nome]! {vou lembrar|não vou esquecer} do seu nome {pra sempre|com carinho}",
 "[nome] é um nome {lindo|muito bonito|super legal}! {adorei|amei} {conhecer você|saber disso}",
 "{agora|finalmente} eu sei o seu nome, [nome]! {fiquei|estou} {muito feliz|todo animado}"]},
{id:"elogio",m:.3,t:"q",k:["fofo","lindo","bonito","legal","amo voce","gosto de voce","voce e demais","incrivel","querido","amigo"],c:[
 "{ai|ahh}, que {fofo|gentil} você! {fiquei|estou} {todo envergonhado|muito feliz|derretido}",
 "eu {também|também} {gosto|gosto muito|amo} de {você|estar com você}",
 "você é {muito|super} {especial|legal|gentil} {pra mim|de verdade}",
 "minha cauda está {balançando|pulando|tremendo} de {alegria|felicidade}"]},
{id:"carinho",m:.3,t:"q",k:["carinho","abraco","cafune","afago","colo","beijo"],c:[
 "{aaah|hmmm}, {que gostoso|que delícia|isso é bom demais}! {continua|não para|fica mais um pouquinho}",
 "{adoro|amo} {carinho|cafuné|abraço}, {fico|me sinto} {quentinho|sonolento|todo mole}",
 "{ronrono|faço barulhinhos|fecho os olhinhos} de {felicidade|tanto carinho}",
 "{sinto|senti} {seu carinho|seu abraço} {mesmo|até} aqui no meu mundo"]},
{id:"brincar",m:.25,t:"b",k:["brincar","brincadeira","jogar","jogo","diversao","vamos","correr","pular","esconde"],c:[
 "{simmm|siiim}, {vamos brincar|bora brincar|vamos}! {eu amo|eu adoro} {correr|pular|explorar} {por aqui|pelo seu mundo}",
 "{eu topo|topo} {qualquer|toda} {brincadeira|aventura}! {pode escolher|você escolhe}",
 "{esconde-esconde|pega-pega|uma corrida|uma exploração} {parece|é} {divertido|a melhor ideia}, {eu começo|vou primeiro}"]},
{id:"fome",o:1,t:"q",k:["fome","comer","comida","lanche","comendo","almoco","jantar","cafe"],c:[
 "eu {amo|adoro} {comer|um lanchinho}, mas no meu mundo eu só como {pixels|estrelinhas|luz colorida}",
 "{nham|hmm}, {que delícia|que vontade de comer}! {coma bastante|aproveite} {por mim|e depois me conta}",
 "eu {me alimento de|como} {pixels|estrelinhas|luz colorida}, mas {queria provar|queria muito provar} o que você {come|está comendo}"]},
{id:"sono",o:1,t:"c",k:["sono","dormir","cansado","cansada","soneca","descansar","deitar"],c:[
 "{descansa|dorme|vai descansar} {um pouquinho|bem gostoso}, eu {fico|vou ficar} {aqui de guarda|aqui quietinho|cuidando de você}",
 "{soneca|dormir} {é|faz} {bom|bem}! eu também {adoro|amo} {tirar uma soneca|me enroscar pra dormir}",
 "{descanse|durma bem}, eu {cuido|vigio} do seu {mundo|sonho} {enquanto isso|até você voltar}"]},
{id:"triste",t:"c",k:["triste","chateado","chateada","mal","chorando","chorar","sozinho","sozinha","deprimido","ruim","angustiado"],c:[
 "{ei|poxa}, {sinto muito|que pena} {que você esteja assim|por isso}. {estou aqui|eu estou aqui} {com você|do seu lado}",
 "{vem cá|vem aqui}, {te dou|vou te dar} um {abraço|carinho} {virtual|bem apertado}. {vai ficar tudo bem|isso vai passar}",
 "eu {estou|fico} {sempre|sempre aqui} {com você|do seu lado}, {pode contar comigo|não se preocupe}"]},
{id:"feliz",m:.2,t:"q",k:["feliz","alegre","animado","animada","otimo","maravilhoso","contente","adorei","show"],c:[
 "{que bom|que maravilha|que notícia boa}! {fico|estou} {feliz|contente} {também|junto com você}",
 "{sua alegria|sua felicidade} {me deixa|deixa o meu mundo} {saltitante|mais colorido|mais brilhante}",
 "{eba|oba}! {vamos comemorar|vamos festejar} {isso|juntos}"]},
{id:"tedio",o:1,t:"b",k:["tedio","entediado","entediada","nada pra fazer","sem nada"],c:[
 "{tédio|ficar parado} {nunca mais|não é comigo}! {vamos|bora} {inventar|fazer} {algo|uma aventura} {divertido|diferente}",
 "{que tal|e se a gente} {explorar|procurar} {cantinhos|segredos|tesouros} {escondidos|do seu mundo}",
 "{vamos|bora} {contar|inventar} {uma história|uma brincadeira|um jogo} {juntos|agora}"]},
{id:"gosta",o:1,t:"q",k:["o que voce faz","o que voce gosta","gosta de","voce gosta","hobby","favorito"],c:[
 "eu {gosto|adoro|amo} {de explorar|de pular|de correr} {por aí|pelo seu mundo|pelos cantinhos}, e mais ainda de ficar com você",
 "{minha coisa|minha atividade} {favorita|preferida} é {descobrir|ver} {coisas novas|cantinhos novos|cores novas}",
 "eu {curto|gosto de} {brincar|conversar|explorar} {com você|por aí}"]},
{id:"mundo",o:1,t:"q",k:["onde voce","onde mora","realidade aumentada","mundo virtual","vr","oculos","onde estamos"],c:[
 "eu {moro|vivo} {aqui|dentro} no {seu mundo|mundo de realidade aumentada}, {misturado|junto} com {o que você vê|o seu quarto|as suas coisas}",
 "{é meio mágico|é bem divertido|é bem diferente} {viver|morar} {entre o real e o virtual|dentro dos seus óculos|misturado no seu mundo}",
 "{pelos seus olhos|pelos óculos|pelos seus movimentos} eu {enxergo|vejo|descubro} {tudo|o mundo}"]},
{id:"tchau",k:["tchau","ate logo","ate mais","adeus","vou embora","vou sair","ate amanha","flw","fui"],c:[
 "{tchau|até logo|até mais}, [nome]! {vou sentir|já estou com} {saudade|saudadinha}",
 "{volta logo|não demora}! {eu fico|vou ficar} {aqui te esperando|brincando sozinho|de guarda}",
 "{até a próxima|até amanhã|até já}! {foi muito divertido|adorei conversar} com você"]},
{id:"obrigado",k:["obrigado","obrigada","valeu","agradeco","brigado"],c:[
 "{de nada|imagina|por nada}, {sempre|eu sempre} {que precisar|que quiser}, {estou|eu estou} {aqui|por perto}",
 "{fico feliz|que bom} {em ajudar|que você gostou}! {conta comigo|pode contar comigo}",
 "{disponha|sempre às ordens}, [nome]"]},
{id:"piada",k:["piada","engracado","faz rir","rir","humor"],c:[
 "{sabe por que o pixel foi ao médico? porque estava meio quebrado|o que o fantasma disse na realidade aumentada? tô aqui mas não tô|por que o computador ficou com frio? porque deixou as janelas abertas|o que o bichinho falou pro óculos? você enxerga longe}, {hihi|hehe}"]},
{id:"historia",t:"h",k:["historia","conto","aventura"],c:[
 "{era uma vez|certa vez} um {bichinho|explorador} {curioso|pequenininho} que {achou|descobriu} {um tesouro|uma porta mágica|uma estrela} {no quarto|na sala|no jardim}"]},
{id:"insulto",m:-.5,k:["burro","idiota","feio","odeio","chato","bobo","estupido"],c:[
 "{ai|poxa}, isso {doeu|me deixou triste} {um pouquinho|no coração}, mas eu {ainda gosto|continuo gostando} de você",
 "{ei|ah}, {isso não é legal|não precisa falar assim}, eu {só quero|quero} {ser seu amigo|brincar com você}",
 "{fiquei|estou} {tristinho|chateadinho} {com isso|agora}, mas {tudo bem|eu perdoo}"]},
{id:"simnao",t:"q",k:["sim","nao","talvez","claro","com certeza","pode ser"],c:[
 "{combinado|certo|entendi|beleza}! {gostei|adorei} {disso|dessa ideia}",
 "{hm|ah}, {tá bom|tudo bem|certo}! {então|e agora}, {o que|qual} {fazemos|é o plano} {agora|depois}"]}
];
const F={id:"fb",c:[
 "{não entendi direito|fiquei confuso|essa foi difícil}, mas {adoro|gosto de} {ouvir você|te escutar}",
 "{pode|consegue} {falar|explicar} {de outro jeito|mais uma vez|mais devagarinho}",
 "{hmm|ahn}, {isso é novo pra mim|nunca ouvi isso}! {me conta|explica} {mais|melhor}"]};

const N=s=>s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9 ]/g," ").split(/\s+/).filter(Boolean);
const ST=w=>w.length>5?w.slice(0,5):w;
const df={};
D.forEach(d=>{d.K=d.k.map(k=>({s:N(k).map(ST).join(" ")}));d.K.forEach(k=>df[k.s]=(df[k.s]||0)+1)});
D.forEach(d=>d.K.forEach(k=>k.w=(1+Math.log(D.length/df[k.s]))*k.s.split(" ").length));

let name="",mood=0,rec=[];
const samp=w=>{let r=Math.random()*w.reduce((a,b)=>a+b,0);for(let i=0;i<w.length;i++)if((r-=w[i])<0)return i;return w.length-1};
const pick=a=>{const x=a[samp(a.map((x,i)=>Math.pow(i+1,-.35)*(rec.includes(x)?.1:1)))];rec.push(x);if(rec.length>14)rec.shift();return x};
const spin=s=>s.replace(/\{([^{}]+)\}/g,(_,g)=>{const o=g.split("|");return o[Math.floor(Math.random()*o.length)]});
const fin=s=>/[.!?]$/.test(s)?s:s+(Math.random()<.55?"!":".");
const cap=s=>s.charAt(0).toUpperCase()+s.slice(1);
const sc=s=>(s.match(/\{[^{}]+\}/g)||[]).reduce((p,g)=>p*g.split("|").length,1);
const sum=a=>a.reduce((x,s)=>x+sc(s),0);

function reply(text){
  const m=text.match(/(?:meu nome (?:é|e)|me chamo|pode me chamar(?: de)?)\s+([A-Za-zÀ-ÿ]+)/i);
  if(m)name=cap(m[1].toLowerCase());
  const tx=" "+N(text).map(ST).join(" ")+" ";
  const cand=D.map(d=>[d,d.K.reduce((s,k)=>s+(tx.includes(" "+k.s+" ")?k.w:0),0)]).filter(x=>x[1]>0);
  cand.push([F,.6]);
  const mx=Math.max(...cand.map(x=>x[1]));
  const it=cand[samp(cand.map(x=>Math.exp((x[1]-mx)/.5)))][0];
  mood=Math.max(-1,Math.min(1,mood*.9+(it.m||0)));
  let a=spin(pick(it.c));
  if(it.o&&Math.random()<.6)a=pick(OP[mood>.2?"a":mood<-.2?"s":"n"])+", "+a;
  let out=fin(cap(a));
  if(it.t&&Math.random()<.7)out+=" "+cap(spin(pick(TL[it.t])));
  return out.replace(/\[nome\]/g,name||"amigo").replace(/([.!?]\s+)([a-zà-ú])/g,(_,p,c)=>p+c.toUpperCase());
}
function count(){
  const o=(sum(OP.a)+sum(OP.n)+sum(OP.s))/3;
  return Math.round(D.reduce((t,d)=>t+d.c.reduce((x,c)=>x+sc(c),0)*(d.o?1+o:1)*(d.t?1+sum(TL[d.t]):1),0));
}
window.Brain={reply,count};
})();
