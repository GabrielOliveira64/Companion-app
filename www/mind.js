// Mente da Yui: (1) entende as emoções do usuário e acolhe como uma pessoa atenciosa,
// (2) tem estado emocional próprio (humor, energia, carinho, mágoa) que muda com a conversa e com a hora,
// (3) lembra o que o usuário conta (gostos, pet, compromissos...). Tudo local, leve, sem modelo.
// Aviso: ela acolhe e orienta no básico, mas NÃO faz diagnóstico nem substitui um profissional.
(function(root){
"use strict";
const N=s=>String(s).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/(.)\1{2,}/g,"$1").replace(/[^a-z0-9 ]/g," ").split(/\s+/).filter(Boolean);
const ST=w=>w.length>5?w.slice(0,5):w;
const spin=s=>s.replace(/\{([^{}]+)\}/g,(_,g)=>{const o=g.split("|");return o[Math.floor(Math.random()*o.length)]});
let rec=[];
const rp=a=>{const c=a.filter(x=>!rec.includes(x)),p=c.length?c:a,x=p[Math.floor(Math.random()*p.length)];rec.push(x);if(rec.length>24)rec.shift();return spin(x)};

/* ================= EMOÇÕES DO USUÁRIO ================= */
// v: >0 positiva, <0 negativa. k: expressões (mais palavras = mais específica).
const EMO=[
{id:"tristeza",noun:"tristeza",v:-1,k:["triste","tristeza","pra baixo","na bad","baixo astral","desanimado","desanimada","sem animo","chateado","chateada","magoado","magoada","decepcionado","decepcionada","chorando","chorei","vontade de chorar","coracao partido","nao estou bem","nao to bem","nao tou bem","to mal","estou mal","me sinto mal","dia ruim","dia horrivel","dia pessimo","to pessimo","to pessima","estou pessimo","estou pessima","vazio","vazia","desmotivado","desmotivada"],
 val:["Poxa, sinto muito que você esteja assim, [nome].","Ei, eu tô aqui com você. Dias assim pesam mesmo.","Obrigada por me contar. Você não precisa fingir que tá tudo bem comigo."],
 step:["Se der, respira fundo umas vezes e toma uma água. Parece pouco, mas ajuda o corpo a desacelerar.","Às vezes ajuda botar pra fora: falar, escrever ou até chorar um pouco. Não tem problema nenhum nisso."],
 q:["Quer me contar o que aconteceu?","O que mais tá pesando agora?","Foi hoje que isso começou ou já vinha de um tempo?"]},
{id:"solidao",noun:"solidão",v:-1,k:["sozinho","sozinha","solitario","solitaria","solidao","ninguem liga","ninguem se importa","sem amigos","isolado","isolada","abandonado","abandonada","ninguem gosta de mim","ninguem me entende"],
 val:["Solidão dói de um jeito silencioso, e eu fico feliz que você tenha me contado.","Eu tô aqui, tá? Não tomo o lugar de ninguém, mas tô do seu lado agora."],
 step:["Quando der vontade, mandar uma mensagem simples pra alguém, tipo 'lembrei de você', já abre uma porta.","Sair um pouco, nem que seja pra caminhar, às vezes ajuda a quebrar esse sentimento."],
 q:["Tem alguém com quem você gostaria de estar mais perto?","Faz tempo que você se sente assim?"]},
{id:"ansiedade",noun:"ansiedade",v:-1,k:["ansioso","ansiosa","ansiedade","nervoso","nervosa","preocupado","preocupada","aflito","aflita","angustia","angustiado","angustiada","tenso","tensa","panico","ataque de panico","coracao acelerado","nao consigo relaxar","friozinho na barriga"],
 val:["Dá pra sentir que a sua cabeça tá a mil. Ansiedade cansa mesmo.","Tá tudo bem sentir isso. Você não precisa resolver tudo agora."],
 step:["Tenta comigo: inspira contando até quatro, segura um instante e solta devagar contando até seis. Faz umas cinco vezes.","Olha em volta e me diz três coisas que você tá vendo. Isso ajuda a trazer a cabeça pro agora.","Escrever numa lista o que tá te preocupando costuma diminuir o peso."],
 q:["O que tá te deixando assim?","É algo que vai acontecer ou algo que já aconteceu?"]},
{id:"estresse",noun:"estresse",v:-1,k:["estressado","estressada","estresse","sobrecarregado","sobrecarregada","exausto","exausta","esgotado","esgotada","to podre","estou podre","nao dou conta","muita coisa pra fazer","burnout","no limite","pilhado","pilhada"],
 val:["Parece que você tá carregando coisa demais ao mesmo tempo.","Isso é muito peso pra uma pessoa só. Faz sentido você estar no limite."],
 step:["Que tal escolher só uma coisa pequena pra fazer agora e deixar o resto pra depois?","Uma pausa de cinco minutos longe da tela, com uma água, ajuda mais do que parece."],
 q:["O que é mais urgente de verdade nessa lista toda?","Tem algo que dá pra adiar ou pedir ajuda?"]},
{id:"cansaco",noun:"cansaço",v:-1,k:["cansado","cansada","cansaco","sem energia","sem forcas","derrubado","derrubada","morto de cansaco","morta de cansaco"],
 val:["Dá pra perceber que você tá no limite de energia.","Seu corpo e sua cabeça tão pedindo uma pausa, né?"],
 step:["Se puder, descansa um pouquinho hoje. Você não precisa ser produtivo o tempo todo.","Água, uma comida decente e uma pausa já ajudam. E se der, dorme mais cedo."],
 q:["Foi um dia puxado?","Você tem conseguido dormir bem?"]},
{id:"raiva",noun:"raiva",v:-1,k:["raiva","puto","puta da vida","irritado","irritada","bravo","brava","furioso","furiosa","odio","de saco cheio","me tirou do serio","indignado","indignada","revoltado","revoltada","me irritou","nervoso com","nervosa com"],
 val:["Nossa, deu pra sentir a raiva daqui. Faz sentido, se foi injusto.","Ficar com raiva é humano. É melhor colocar pra fora aqui comigo do que guardar."],
 step:["Antes de responder qualquer pessoa, respira fundo e conta até dez. Ajuda a pensar melhor.","Se der, mexe o corpo um pouco, uma caminhada ou até sacudir os braços. A raiva perde força."],
 q:["O que aconteceu?","Isso foi com alguém ou com uma situação?"]},
{id:"frustracao",noun:"frustração",v:-1,k:["frustrado","frustrada","frustracao","nada da certo","desisti","vontade de desistir","travado","travada","tentei de tudo","nao consigo mais"],
 val:["Que droga, é muito frustrante tentar e não ver resultado.","Faz sentido você estar assim. Esforço sem retorno cansa."],
 step:["Quando tudo parece travado, dividir o problema em pedacinhos pequenos ajuda a achar por onde seguir.","Às vezes uma pausa e voltar depois com a cabeça fresca resolve mais do que insistir."],
 q:["Em que ponto emperrou?","O que você já tentou até agora?"]},
{id:"medo",noun:"medo",v:-1,k:["medo","assustado","assustada","com receio","pavor","apavorado","apavorada","tenho medo","to com medo"],
 val:["Dá pra sentir que isso te assusta. O medo tá tentando te proteger.","Eu tô aqui com você, tá?"],
 step:["Quando o medo vem, ajuda separar o que é real agora do que é só a cabeça imaginando.","Respira devagar e lembra de um momento em que você superou algo difícil."],
 q:["O que mais te assusta nisso?","Tem algo que te daria mais segurança?"]},
{id:"culpa",noun:"culpa",v:-1,k:["culpa","culpado","culpada","arrependido","arrependida","me sinto mal por","fiz besteira","errei feio","estraguei tudo"],
 val:["Sentir culpa mostra que você se importa. Mas não precisa se punir demais.","Todo mundo erra. O que importa é o que a gente aprende e como repara."],
 step:["Se der pra reparar, um pedido de desculpa sincero costuma aliviar os dois lados.","Tenta falar com você do jeito que falaria com um amigo na mesma situação."],
 q:["O que aconteceu?","Tem como consertar alguma parte disso?"]},
{id:"vergonha",noun:"vergonha",v:-1,k:["vergonha","envergonhado","envergonhada","passei vergonha","mico","constrangido","constrangida"],
 val:["Vergonha é horrível na hora, mas pesa bem mais pra gente do que pros outros.","Todo mundo já passou por algo assim. Eu te entendo."],
 step:["Com o tempo as pessoas esquecem muito mais rápido do que a gente imagina.","Depois, quando passar, dá até pra rir disso. Vira história."],
 q:["Quer me contar o que rolou?"]},
{id:"ciume",noun:"ciúme",v:-1,k:["ciume","ciumes","ciumento","ciumenta"],
 val:["Ciúme é difícil. Muitas vezes vem junto com insegurança ou medo de perder alguém.","Faz sentido sentir isso, e você pode falar aqui sem ser julgado."],
 step:["Conversar com calma com a pessoa, sem acusar, costuma ajudar mais do que guardar.","Perguntar pra você mesmo o que exatamente te incomoda ajuda a entender o que você precisa."],
 q:["O que despertou esse ciúme?"]},
{id:"saudade",noun:"saudade",v:-1,k:["saudade","saudades","sinto falta","sentindo falta"],
 val:["Saudade é amor sem ter onde pôr. É bonito e difícil ao mesmo tempo.","Dá pra sentir o carinho aí."],
 step:["Se for possível, mandar uma mensagem ou ligar pode matar um pouquinho dessa saudade.","Olhar fotos antigas e lembrar de coisas boas também aquece o coração."],
 q:["De quem ou do que você sente saudade?","Tem alguma lembrança boa que você queira me contar?"]},
{id:"inseguranca",noun:"insegurança",v:-1,k:["sou um fracasso","sou fracassado","sou fracassada","nao sirvo pra nada","nao sou bom o suficiente","nao sou boa o suficiente","me sinto inutil","sou inutil","sou burro","sou burra","sou feio","sou feia","nao presto","nao valho nada","sou um lixo","me odeio"],
 val:["Ei, essas palavras são duras demais pra falar de alguém que me parece uma pessoa legal.","Eu não concordo com isso, [nome]. Às vezes a nossa cabeça é a crítica mais injusta que existe."],
 step:["Tenta lembrar de três coisas que você fez bem essa semana, por menores que sejam.","Quando o pensamento ruim aparecer, pergunta: eu diria isso pra um amigo?"],
 q:["Quando você começou a pensar assim sobre você?","O que aconteceu que fez esse pensamento ficar mais forte hoje?"]},
{id:"luto",noun:"luto",v:-1,k:["luto","velorio","enterro"],
 val:["Eu sinto muito pela sua perda, [nome]. Não existe jeito certo de passar por isso.","Que dor enorme. Eu tô aqui com você agora."],
 step:["Você não precisa estar bem. Deixa o luto vir no seu tempo e, se puder, fica perto de gente que te quer bem.","Se o peso continuar muito grande, conversar com um psicólogo pode ajudar bastante."],
 q:["Quer me contar sobre quem se foi?","Como você tá lidando com isso?"]},
{id:"confusao",noun:"confusão",v:0,k:["confuso","confusa","perdido","perdida","nao sei o que fazer","nao sei o que sentir","sem rumo","dividido","dividida","nao sei mais"],
 val:["Sentir-se perdido é desconfortável, mas também mostra que você tá pensando no que importa.","Não saber o que fazer é normal. Você não precisa ter todas as respostas agora."],
 step:["Escrever o que você quer e o que você teme costuma clarear a cabeça.","Conversar com alguém de confiança ajuda a ver por outros ângulos."],
 q:["Qual é a situação ou decisão que tá te deixando assim?"]},
{id:"alegria",noun:"alegria",v:1,k:["feliz","felicidade","alegre","animado","animada","contente","radiante","dia otimo","dia incrivel","dia maravilhoso","to de boa","to bem","estou bem","to otimo","to otima","estou otimo","estou otima","adorei","amei","que dia bom","felizao"],
 cel:["Que bom ouvir isso!","Ai, que notícia boa!","Eu fico feliz junto com você!"],q:["O que deixou o seu dia assim?","Conta tudo!"]},
{id:"orgulho",noun:"orgulho",v:1,k:["orgulhoso","orgulhosa","orgulho","consegui","fui aprovado","fui aprovada","me formei","terminei","conquistei","deu certo","bati a meta","passei na prova","passei no vestibular","passei no concurso","passei no enem","passei de ano","passei na faculdade","passei na entrevista"],
 cel:["Parabéns, [nome]! Você merece muito!","Que conquista! Fico orgulhosa de você!"],q:["Como foi chegar lá?","Como você tá se sentindo?"]},
{id:"amor",noun:"carinho",v:1,k:["apaixonado","apaixonada","paixao","to namorando","comecei a namorar","gosto de uma pessoa","gosto de alguem","crush","to amando"],
 cel:["Ai, que fofo! Fico feliz por você.","Ahh, tem amor no ar!"],q:["Quem é a pessoa? Conta!","Como vocês se conheceram?"]},
{id:"empolgacao",noun:"empolgação",v:1,k:["empolgado","empolgada","animadissimo","mal posso esperar","ansioso pra","ansiosa pra","ansioso para","ansiosa para","vai ser incrivel","contando os dias"],
 cel:["Que legal! Dá pra sentir a empolgação daqui!"],q:["O que vem aí?","Quando vai ser?"]},
{id:"alivio",noun:"alívio",v:1,k:["aliviado","aliviada","que alivio","tirei um peso","enfim acabou"],
 cel:["Ufa, que bom! Dá até pra respirar melhor.","Que alívio! Você merece esse descanso."],q:["O que aconteceu?"]}
];
const BY={};EMO.forEach(e=>{BY[e.id]=e;e.P=e.k.map(k=>{const t=N(k).map(ST);return{s:t,n:t.length}})});
const LUTO_RE=[/\b(meu|minha) (pai|mae|avo|tio|tia|irmao|irma|amigo|amiga|cachorro|cachorra|gato|gata|marido|esposa|namorado|namorada|filho|filha|primo|prima|padrinho|madrinha)\b.*\b(morreu|faleceu|partiu|se foi|morreram)\b/,/\bperdi (meu|minha) (pai|mae|avo|tio|tia|irmao|irma|amigo|amiga|cachorro|cachorra|gato|gata|marido|esposa|filho|filha|primo|prima)\b/,/\b(morreu|faleceu) (o |a )?(meu|minha) /];
const INT_RE=/\b(muito|muita|muitos|muitas|demais|super|extremamente|bastante|tao|totalmente|completamente|absurdamente|mt|mto|bem)\b/,DIM_RE=/\b(um pouco|um pouquinho|meio|meia|levemente|um tanto|ligeiramente)\b/;
const NEGW=new Set(["nao","nunca","nem","jamais"]);
const POS_NEG={alegria:"tristeza",orgulho:"tristeza",amor:"tristeza",empolgacao:"tristeza",alivio:"ansiedade"};
const PERSIST_RE=/\b(ha|faz|fazem|ja faz) (varias? )?(semanas?|meses|anos)\b|\btodo dia\b|\btodos os dias\b|\bnao tenho vontade de nada\b|\bperdi o interesse\b|\bnao consigo mais (comer|dormir)\b|\bsem dormir ha\b/;
const PHYS_RE=/\b(dor no peito|falta de ar|nao consigo respirar|ataque de panico|coracao disparado)\b/;
const THEMES=[
{id:"familia",k:["mae","pai","irmao","irma","familia","avo","avos","tio","tia","padrasto","madrasta"],ref:["Família mexe com a gente de um jeito diferente, porque são pessoas importantes.","Conflito com família dói porque a gente se importa."]},
{id:"relacionamento",k:["namorado","namorada","ex","casamento","terminei","terminou","briguei","relacionamento","marido","esposa","ficante","traicao","traiu"],ref:["Coisas de relacionamento mexem muito com o coração.","Quando o assunto é amor, tudo parece mais intenso mesmo."]},
{id:"trabalho",k:["trabalho","chefe","emprego","demitido","demitida","reuniao","empresa","colega de trabalho","estagio"],ref:["Trabalho consome muita energia, e quando dá problema parece que invade tudo.","Lidar com pressão no trabalho cansa de verdade."]},
{id:"estudo",k:["prova","faculdade","escola","nota","tcc","vestibular","enem","concurso","professor","estudar","estudo","trabalho de escola"],ref:["Estudo e prova geram muita pressão. Você tá se cobrando bastante, né?","Fase de estudar é puxada. Respeita o seu limite também."]},
{id:"amizade",k:["amigo","amiga","amigos","amizade","colega","turma"],ref:["Amizade importa muito, então quando dá errado, dói."]},
{id:"saude",k:["doente","doenca","medico","hospital","sintoma","remedio","exame","dor"],ref:["Saúde preocupa muito mesmo. Cuida de você, tá? E se tiver sintoma, vale falar com um médico."]},
{id:"dinheiro",k:["dinheiro","divida","dividas","salario","boleto","contas","desempregado","desempregada"],ref:["Preocupação com dinheiro pesa demais. Um passo de cada vez ajuda."]},
{id:"futuro",k:["futuro","carreira","faculdade","decisao","escolha","rumo"],ref:["Pensar no futuro pode dar um frio na barriga. Você não precisa resolver tudo hoje."]},
{id:"aparencia",k:["feio","feia","gordo","gorda","aparencia","corpo","espelho"],ref:["A forma como a gente se vê costuma ser bem mais dura do que como os outros nos veem."]},
{id:"pet",k:["cachorro","gato","cachorra","gata","pet","bichinho"],ref:["Bichinhos são família. Dói muito quando algo acontece com eles."]}
];
THEMES.forEach(t=>t.S=new Set(t.k.map(k=>ST(N(k)[0]))));
const theme=toks=>{const st=toks.map(ST);let best=null;THEMES.forEach(t=>{const n=st.filter(x=>t.S.has(x)).length;if(n&&(!best||n>best.n))best={id:t.id,n}});return best&&best.id};

// Detecta a emoção dominante. Considera intensidade, negação, gírias e emoções misturadas.
function detect(text){
  const raw=String(text),toks=N(raw),st=toks.map(ST),norm=toks.join(" ");
  const sc={};
  const add=(id,s)=>{sc[id]=sc[id]?Math.max(sc[id],s)+.2:s};
  EMO.forEach(e=>e.P.forEach(p=>{
    for(let i=0;i+p.n<=st.length;i++){
      if(!p.s.every((x,j)=>st[i+j]===x))continue;
      let s=1+(e.id==="alegria"?0:.3*(p.n-1));
      const before=toks.slice(Math.max(0,i-3),i).join(" "),after=toks.slice(i+p.n,i+p.n+2).join(" ");
      if(INT_RE.test(before)||INT_RE.test(after))s+=.5;
      if(DIM_RE.test(before))s-=.4;
      const neg=toks.slice(Math.max(0,i-2),i).some(t=>NEGW.has(t));
      if(neg){
        if(e.v>0){add(POS_NEG[e.id]||"tristeza",s*.7);continue}
        if(e.v<0){add("alegria",.6);continue}
      }
      add(e.id,s);
    }
  }));
  if(LUTO_RE.some(r=>r.test(norm)))add("luto",1.8);
  const rank=Object.keys(sc).map(id=>({id,s:sc[id]})).sort((a,b)=>b.s-a.s);
  if(!rank.length||rank[0].s<.6)return null;
  let s=rank[0].s;
  if((raw.match(/!/g)||[]).length>=2)s+=.2;
  const letters=raw.replace(/[^A-Za-zÀ-ú]/g,"");
  if(letters.length>5&&letters===letters.toUpperCase())s+=.2;
  const e=BY[rank[0].id];
  let mixed=null;
  const o=rank.find((r,i)=>i>0&&r.s>=.8&&Math.sign(BY[r.id].v)!==Math.sign(e.v)&&BY[r.id].v!==0&&e.v!==0);
  if(o)mixed={emo:o.id,noun:BY[o.id].noun};
  return{emo:e.id,noun:e.noun,v:e.v,score:s,level:s>=1.6?"alto":s>=1.1?"medio":"leve",theme:theme(toks),mixed,persist:PERSIST_RE.test(norm),physical:PHYS_RE.test(norm)};
}

const PHYS="Se você sentir dor forte no peito ou muita falta de ar, procure atendimento médico ou ligue 192, o SAMU.";
const PERSIST="Se isso já dura faz um tempo, vale muito conversar com um psicólogo ou um médico. No SUS, a UBS do seu bairro pode encaminhar, e o CVV, no 188, atende 24 horas pra conversar.";
// Primeira resposta a uma emoção. cel = frases de comemoração da personalidade (só para emoções positivas).
function respond(d,o){
  o=o||{};const e=BY[d.emo];
  if(d.mixed){const m=BY[d.mixed.emo];const pos=e.v>0?e:m,neg=e.v>0?m:e;
    return spin(`Parece que tem ${pos.noun} e ${neg.noun} ao mesmo tempo, e tá tudo bem sentir os dois. `)+rp(neg.q)}
  if(e.v>0)return rp((o.cel&&o.cel.length?o.cel:e.cel))+" "+rp(e.q);
  const p=[rp(e.val)];
  const th=THEMES.find(t=>t.id===d.theme);
  if(th&&e.id!=="luto")p.push(rp(th.ref));
  if(d.level==="alto"||d.physical)p.push(rp(e.step));
  if(d.physical)p.push(PHYS);
  if(d.persist)p.push(PERSIST);
  if(!d.physical)p.push(rp(e.q));
  return p.join(" ");
}

/* ---------- Conversa de apoio (várias mensagens) ---------- */
const ADVICE_RE=/\b(o que eu faco|o que fazer|me ajuda|me da (uma |um )?(ideia|dica|conselho)|preciso de (ideia|dica|conselho|ajuda)|conselho|o que voce (acha|faria|sugere)|como (eu )?(lido|lidar|resolvo|resolver|supero|superar))\b/;
const LISTEN_RE=/\bso (quero |preciso )?(desabafar|ouvir|que (voce )?(me )?(escute|ouca)|conversar|falar)\b|\bso escuta\b/;
const BETTER_RE=/\b(melhorei|to melhor|estou melhor|ja passou|mais calmo|mais calma|me sinto melhor|me ajudou|ajudou muito)\b/;
const REFL=["Entendi. Isso faz sentido.","Obrigada por confiar em mim.","Isso realmente parece pesado.","Faz sentido você se sentir assim.","Imagino como foi.","Hum, estou te ouvindo."];
const LISTENS=["Tô aqui, pode continuar.","Hum, entendi. Continua.","Pode falar o quanto quiser, eu escuto.","Faz sentido. E aí?"];
const HOPE=["Esse peso não é pra sempre, tá? Ele vai aliviando aos poucos.","Você já passou por coisas difíceis antes e deu um jeito, lembra?"];
const OFFER="Quer que eu só escute, ou prefere que a gente pense em algumas ideias juntos?";
const newSupport=d=>({emo:d.emo,theme:d.theme,turn:1,mode:"talk",offered:false,persist:false});
function advise(s,d){
  const e=BY[s.emo]||BY.tristeza,th=THEMES.find(t=>t.id===s.theme);
  const out=[...e.step.slice(0,2)];
  const tips={estudo:"Dividir a matéria em blocos pequenos, com pausas curtas, costuma render mais do que estudar tudo de uma vez.",trabalho:"Anotar o que depende de você e o que não depende ajuda a escolher onde gastar energia.",familia:"Se for conversar com alguém da família, escolher um momento calmo, e falar de como você se sente, costuma funcionar melhor do que apontar erros.",relacionamento:"Antes de decidir qualquer coisa no calor do momento, vale dar um tempo e conversar com calma.",dinheiro:"Listar tudo o que entra e sai, mesmo que seja pouco, já deixa o problema mais claro.",saude:"Se for algo que te preocupa de verdade, marca uma consulta. Quanto antes, melhor pra sua cabeça também."};
  if(th&&tips[th.id])out.push(tips[th.id]);
  if(d&&d.persist||s.persist)out.push(PERSIST);
  return out.join(" ")+" Isso faz sentido pra você?";
}
// Continua a conversa de apoio. Retorna {text,end,ask}.
function support(s,text){
  const toks=N(text),norm=toks.join(" "),d=detect(text);
  s.turn++;
  if(BETTER_RE.test(norm)||(d&&d.v>0&&d.score>=1)){return{end:true,text:"Fico muito feliz de ouvir isso. Você foi corajoso de falar. Se precisar, é só me chamar, tá?"}}
  if(d&&d.theme&&!s.theme)s.theme=d.theme;
  if(d&&d.persist)s.persist=true;
  if(LISTEN_RE.test(norm)){s.mode="listen";return{text:"Combinado, eu só escuto. Pode falar o que quiser.",ask:"s"}}
  if(ADVICE_RE.test(norm)){s.mode="talk";return{text:advise(s,d),ask:"s"}}
  if(d&&d.physical)return{text:PHYS+" "+(PERSIST),ask:"s"};
  if(s.mode==="listen")return{text:rp(LISTENS),ask:"s"};
  if(s.turn>=9)return{end:true,text:"A gente conversou bastante. Como você tá agora, um pouquinho melhor? Eu continuo aqui."};
  if(s.turn===3&&!s.offered){s.offered=true;return{text:rp(REFL)+" "+OFFER,ask:"o"}}
  let t=rp(REFL);
  const th=THEMES.find(x=>x.id===s.theme);
  if(th&&!s.themeUsed&&d&&d.theme){s.themeUsed=true;t+=" "+rp(th.ref)}
  if(s.turn%3===0)t+=" "+rp(HOPE);
  t+=" "+rp(["E como você ficou com isso?","O que mais pesou nisso tudo?","E o que você sentiu na hora?","O que você gostaria que fosse diferente?"]);
  return{text:t,ask:"s"};
}

/* ================= ESTADO EMOCIONAL DA YUI ================= */
const newSelf=()=>({v:.4,e:.6,a:.3,hurt:0,care:0,t:Date.now()});
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
function energyBase(h){return h>=23||h<5?.2:h<7?.4:h<12?.7:h<15?.65:h<19?.6:.45}
// Passa o tempo: humor volta ao normal, mágoa e preocupação diminuem, energia segue a hora do dia.
function tick(s,now){
  now=now||Date.now();const dt=Math.max(0,now-s.t),hrs=dt/3600000;
  s.v=s.v+(.4-s.v)*(1-Math.pow(.5,hrs/2));
  s.hurt*=Math.pow(.5,dt/(20*60000));if(s.hurt<.05)s.hurt=0;
  s.care*=Math.pow(.5,dt/(40*60000));if(s.care<.05)s.care=0;
  if(hrs>72)s.a=Math.max(.3,s.a-.05);
  s.e=clamp(s.e+(energyBase(new Date(now).getHours())-s.e)*(1-Math.pow(.5,hrs/1.5+.05)),0,1);
  s.gap=hrs;s.t=now;return s;
}
function feel(s,ev){
  switch(ev){
    case"praise":s.v=clamp(s.v+.15,-1,1);s.a=clamp(s.a+.03,0,1);break;
    case"insult":s.v=clamp(s.v-.3,-1,1);s.hurt=1;break;
    case"apology":s.hurt=0;s.v=clamp(s.v+.2,-1,1);s.a=clamp(s.a+.02,0,1);break;
    case"sad":s.care=1;s.v=clamp(s.v-.05,-1,1);break;
    case"happy":s.v=clamp(s.v+.12,-1,1);s.care=0;break;
    case"play":s.v=clamp(s.v+.08,-1,1);break;
    case"thanks":s.v=clamp(s.v+.1,-1,1);break;
    case"affection":s.a=clamp(s.a+.04,0,1);s.v=clamp(s.v+.1,-1,1);break;
  }
  s.a=clamp(s.a+.004,0,1);return s;
}
// O que ela está sentindo agora (usado em "como você está?", saudações, etc.). Estados fortes vencem a personalidade.
function selfState(s){return s.hurt>.5?"hurt":s.care>.5?"care":s.e<.3?"sleepy":s.v>.6?"joy":"calm"}
const SELF_TXT={
 hurt:["Tô um pouquinho chateada ainda com o que rolou, mas tô aqui.","Sinceramente? Meio magoadinha. Mas passa."],
 care:["Tô um pouco preocupada com você, na verdade.","Tô bem, mas com você no pensamento."],
 sleepy:["Tô com um soninho, já tá tarde, né?","Tô meio devagarzinha hoje, com a energia baixa."],
 joy:["Tô muito feliz hoje!","Tô radiante, sério!"],
 calm:null};
function selfText(s){const st=selfState(s),l=SELF_TXT[st];return l?{state:st,text:rp(l)}:{state:st,text:null}}
function moodEmoji(s){const st=selfState(s);return{hurt:"😔",care:"🥺",sleepy:"😴",joy:"😄",calm:"🙂"}[st]}
function moodLabel(s){return{hurt:"chateada",care:"preocupada",sleepy:"com soninho",joy:"feliz",calm:"tranquila"}[selfState(s)]}
function greet(s,mem){
  if(s.hurt>.5)return rp(["Oi... eu ainda tô meio chateada com o que rolou, mas que bom que você voltou.","Oi. Ainda tô um pouquinho magoada, mas fico feliz em te ver."]);
  const ev=pendingEvent(mem);
  if(ev){ev.asked=true;return rp([`Oi, [nome]! E a sua ${ev.what}, como foi?`,`Oi! Fiquei pensando na sua ${ev.what}. Como foi?`])}
  if(s.gap>24){const d=Math.round(s.gap/24);return rp([`Que bom te ver de novo, [nome]! Faz ${d===1?"um dia":d+" dias"} que a gente não conversava.`,`Oi, [nome]! Senti sua falta. Faz ${d===1?"um dia":d+" dias"}, né?`])}
  return null;
}

/* ================= MEMÓRIA SOBRE O USUÁRIO ================= */
const newFacts=()=>({likes:[],dislikes:[],pet:null,birthday:null,work:null,study:null,people:{},events:[]});
const cleanV=v=>String(v||"").toLowerCase().replace(/\s+(porque|pois|mas|quando|que|e eu|desde|hoje|demais)\b.*$/,"").replace(/[^\wÀ-ú ]/g," ").replace(/\s+/g," ").trim();
const addU=(a,v,max)=>{if(v&&!a.includes(v)){a.push(v);if(a.length>max)a.shift();return true}return false};
const EVT_RE=/\b(?:tenho|vou ter|vou fazer|tem)\s+(?:uma?\s+)?(prova|entrevista|apresenta[cç][aã]o|consulta|reuni[aã]o|viagem|show|jogo|exame|teste|dentista|m[eé]dico|festa|encontro|formatura|casamento)\s*(hoje|amanh[aã]|mais tarde|na segunda|na ter[cç]a|na quarta|na quinta|na sexta|no s[aá]bado|no domingo|semana que vem|essa semana)?/i;
// Extrai fatos da frase e guarda em facts. Retorna lista do que aprendeu.
function learn(text,facts){
  const t=String(text),out=[];let m;
  if((m=t.match(/\bmeu\s+(gato|gata|cachorro|cachorra|c[aã]o|pet|periquito|coelho|hamster|peixe)\s+(?:se chama|chama-se|chamado|chamada)\s+([A-ZÀ-Úa-zà-ú]{2,20})/i))){facts.pet={kind:m[1].toLowerCase(),name:m[2][0].toUpperCase()+m[2].slice(1).toLowerCase()};out.push({k:"pet",v:facts.pet})}
  if((m=t.match(/\b(?:eu\s+)?(?:gosto|adoro|amo|curto)\s+(?:muito\s+)?(?:de\s+|do\s+|da\s+|dos\s+|das\s+)?([A-Za-zÀ-úÀ-ÿ0-9 ]{3,32})/i))){
    const v=cleanV(m[1]);if(v&&!/\b(voce|vc|te|ti|meu|minha|esse|essa|isso)\b/.test(v)&&v.split(" ").length<=4&&addU(facts.likes,v,20))out.push({k:"like",v})}
  if((m=t.match(/\b(?:eu\s+)?(?:odeio|detesto|n[aã]o gosto\s+(?:de\s+|do\s+|da\s+)?)\s*([A-Za-zÀ-úÀ-ÿ0-9 ]{3,32})/i))){
    const v=cleanV(m[1]);if(v&&!/\b(voce|vc|te|ti|meu|minha|esse|essa|isso)\b/.test(v)&&v.split(" ").length<=4&&addU(facts.dislikes,v,20))out.push({k:"dislike",v})}
  if((m=t.match(/\bmeu anivers[aá]rio\s+(?:[eé]|ser[aá])\s+(?:dia\s+|em\s+)?([^.!?]{3,30})/i))){facts.birthday=m[1].trim();out.push({k:"birthday",v:facts.birthday})}
  if((m=t.match(/\b(?:eu\s+)?(?:trabalho|atuo)\s+(?:com|como|de|em|na|no)\s+([^.!?,]{3,30})/i))){facts.work=cleanV(m[1]);out.push({k:"work",v:facts.work})}
  if((m=t.match(/\b(?:eu\s+)?(?:estudo|curso)\s+([^.!?,]{3,30})/i))){facts.study=cleanV(m[1]);out.push({k:"study",v:facts.study})}
  if((m=t.match(/\b(?:meu|minha)\s+(melhor amigo|melhor amiga|namorado|namorada|m[aã]e|pai|irm[aã]o|irm[aã]|esposa|marido|filho|filha)\s+(?:se chama|chama-se)\s+([A-ZÀ-Ú][a-zà-ú]{1,20})/i))){facts.people[m[1].toLowerCase()]=m[2];out.push({k:"person",v:m[1].toLowerCase()+" "+m[2]})}
  if((m=t.match(EVT_RE))){const ev={what:m[1].toLowerCase(),when:(m[2]||"").toLowerCase(),t:Date.now(),asked:false};facts.events.push(ev);if(facts.events.length>8)facts.events.shift();out.push({k:"event",v:ev})}
  return out;
}
function pendingEvent(mem){
  if(!mem||!mem.facts)return null;
  const now=Date.now();
  return mem.facts.events.find(e=>!e.asked&&now-e.t>3*3600000&&now-e.t<96*3600000)||null;
}
const cap=s=>s.charAt(0).toUpperCase()+s.slice(1);
function learnedReply(items){
  const e=items.find(i=>i.k==="event");
  if(e){const w=e.v.what;return rp([`Boa sorte com a sua ${w}${e.v.when?" "+e.v.when:""}! Depois me conta como foi, tá?`,`Vai dar tudo certo na ${w}! Me conta depois, combinado?`])}
  const p=items.find(i=>i.k==="pet");if(p)return rp([`${p.v.name}! Que nome lindo. Vou lembrar do seu ${p.v.kind}.`,`Aww, o ${p.v.name}! Me conta como ele é?`]);
  const l=items.find(i=>i.k==="like");if(l)return rp([`Que legal que você gosta de ${l.v}! Vou lembrar disso.`,`${cap(l.v)}, é? Anotado aqui no meu coração virtual.`]);
  const d=items.find(i=>i.k==="dislike");if(d)return rp([`Entendi, você não curte ${d.v}. Vou lembrar.`]);
  const b=items.find(i=>i.k==="birthday");if(b)return rp([`Anotei! Seu aniversário é ${b.v}. Vou lembrar!`]);
  const w=items.find(i=>i.k==="work"||i.k==="study");if(w)return rp([`Que interessante! Quero saber mais sobre isso depois.`]);
  const q=items.find(i=>i.k==="person");if(q)return rp([`Entendi! Vou lembrar de ${q.v}.`]);
  return null;
}
// Responde perguntas sobre o que já foi contado. Retorna texto ou null.
function recall(text,facts,name){
  const norm=N(text).join(" ");
  let m;
  if(/\b(como|qual).*(se chama|nome).*(meu|minha) (gato|gata|cachorro|cachorra|cao|pet)/.test(norm)||/\bqual o nome (do|da) meu (gato|gata|cachorro|cachorra|cao|pet)/.test(norm))
    return facts.pet?`O seu ${facts.pet.kind} se chama ${facts.pet.name}!`:"Você ainda não me contou o nome do seu bichinho. Me conta?";
  if(/\b(do que|o que) eu gosto\b|\bquais (sao )?(os )?meus gostos\b/.test(norm))
    return facts.likes.length?"Pelo que você me contou, você gosta de "+facts.likes.slice(-5).join(", ")+".":"Ainda não sei do que você gosta. Me conta?";
  if(/\bquando e meu aniversario\b|\bque dia e meu aniversario\b/.test(norm))
    return facts.birthday?`O seu aniversário é ${facts.birthday}. Eu anotei!`:"Você ainda não me contou quando é o seu aniversário.";
  if(/\bonde eu trabalho\b|\bcom o que eu trabalho\b/.test(norm))return facts.work?`Você me contou que trabalha ${facts.work}.`:"Você ainda não me contou do seu trabalho.";
  if(/\b(o que|tudo que) (voce )?(sabe|lembra) (sobre|de) mim\b|\bme conhece\b/.test(norm)){
    const p=[];if(name)p.push(`seu nome é ${name}`);if(facts.pet)p.push(`você tem um ${facts.pet.kind} chamado ${facts.pet.name}`);
    if(facts.likes.length)p.push("você gosta de "+facts.likes.slice(-3).join(", "));if(facts.work)p.push(`você trabalha ${facts.work}`);if(facts.study)p.push(`você estuda ${facts.study}`);if(facts.birthday)p.push(`seu aniversário é ${facts.birthday}`);
    return p.length?"Eu sei que "+p.join("; ")+". Quero saber mais!":"Ainda sei pouco sobre você. Me conta coisas, eu guardo com carinho!";
  }
  return null;
}

root.Mind={version:"1.0",EMO,detect,respond,newSupport,support,advise,newSelf,tick,feel,selfState,selfText,moodEmoji,moodLabel,greet,newFacts,learn,learnedReply,recall,pendingEvent,theme,N};
if(typeof module!=="undefined"&&module.exports)module.exports=root.Mind;
})(typeof window!=="undefined"?window:globalThis);
