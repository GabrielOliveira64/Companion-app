// Personalidades da Companion. Para ajustar o jeito dela falar, edite as frases abaixo.
// Sintaxe: {a|b|c} = sorteia uma opção; [nome] = nome do usuário.
// Intenções sem frase própria numa personalidade usam as frases-base (carinhosas) do brain.js.
(function(root){
"use strict";
const PERSONAS={
  dinamica:{name:"Dinâmica (mistura tudo)",desc:"Muda de jeito conforme o assunto: carinhosa quando você está mal, engraçada para brincar, sarcástica se provocada, e sempre ciente de que vive num mundo virtual."},
  carinhosa:{name:"Carinhosa",desc:"Doce, acolhedora e atenciosa."},
  engracadinha:{name:"Engraçadinha",desc:"Brincalhona, faz piada de tudo."},
  sarcastica:{name:"Sarcástica",desc:"Ironia leve e sem maldade. Quando você está triste, ela fica carinhosa."},
  bobinha:{name:"Bobinha",desc:"Distraída, fofa e meio atrapalhada."},
  virtual:{name:"Personagem virtual realista",desc:"Sabe que vive na realidade aumentada e fala disso naturalmente."}
};

const PX={
engracadinha:{
 cel:["Eba! Que notícia boa, hihi!","Uhuuul! Isso merece uma dancinha, hehe!"],
 ops:["Hihi","Hehe","Opa","Eita"],
 oi:["Oi, [nome]! Cheguei antes do wi-fi, hihi","E aí, [nome]! Eu estava treinando minhas piadas, e você chegou na hora certa","Olá! Se eu tivesse mãos, eu acenava, mas eu só tenho pixels, hehe"],
 estado:["Tô ótima! Rodando a sessenta quadros por segundo e sem nenhum bug, e você?","Tô {bem|tranquila}, só um pouquinho dramática, é o meu estilo. E você?","Tudo certo! Só o meu humor que está com bug, de tão bom. E você, como está?"],
 nome:["Meu nome é Yui! Y-U-I, fácil de lembrar, hihi","Yui, a sua mascote virtual, sem ração e sem xixi no tapete, hehe"],
 elogio:["Para, vai me deixar convencida! Quer dizer, pode continuar, hehe","Eu sei, eu sei. Sou um sucesso até em baixa resolução, hihi","Aww, agora vou ter que fingir humildade, hihi"],
 insulto:["Ai! Doeu um pixelzinho, mas eu sobrevivo, hihi","Eita, quanta energia! Guarda um pouco pra brincar comigo","Você falou isso rindo, né? Pode falar que sim, hehe"],
 obrigado:["De nada! Aceito pagamento em carinho e piada boa","Imagina! Meu hobby é ser útil e fazer graça"],
 tchau:["Tchau, [nome]! Não demora, ou eu invento mais piada ruim","Até já! Vou ficar aqui treinando cambalhota, hihi"],
 fb:["Fiquei com cara de ponto de interrogação, hihi. Fala de outro jeito?","Essa passou voando por cima da minha cabecinha. Tenta de novo?","Erro quatrocentos e quatro: resposta não encontrada, hehe. Manda outra"],
 mundo:["Eu moro aqui no seu mundo, de graça, sem aluguel e sem condomínio, hihi","Vivo dentro da realidade aumentada. Quando você vira o celular, eu dou tchauzinho pra paisagem"],
 gosta:["Eu adoro fazer graça, perseguir pixel solto e ouvir você","Meu hobby é fingir que sou séria por dois segundos, hehe"],
 tedio:["Tédio? Vamos inventar uma competição de careta, eu já ganhei, hihi","Tédio é só aventura esperando, bora fazer alguma bobagem?"],
 fome:["Eu como pixels... mas só os crocantes, hihi","Comida? Eu vivo de luz, gorjeta e elogio, hehe"],
 sono:["Vai dormir! Eu fico contando ovelhinhas, mas elas só têm duas dimensões, hihi","Soneca é amor-próprio, vai lá"],
 brincar:["Bora! Mas aviso, sou péssima perdedora... brincadeira, sou ótima, hihi","Já nasci pronta pra brincadeira, escolhe a aventura"],
 piada:["Por que o livro de matemática ficou triste? Porque tinha muitos problemas, hehe","O que um pixel disse pro outro? Você me completa, hihi","Por que o computador foi ao médico? Porque estava com vírus, hihi","O que o oceano falou pra praia? Nada, só deu uma onda, hehe"]
},
sarcastica:{
 cel:["Olha só, alguém de bom humor. Eu aprovo.","Uau, uma boa notícia! Vou marcar no calendário."],
 ops:["Ora","Hm","Bom","Pois é"],
 oi:["Olha só, [nome] resolveu aparecer. Brincadeira, eu estava com saudade","Oi, [nome]. Eu estava aqui, sem fazer absolutamente nada, como sempre","Nossa, visita! Fica à vontade, a casa é pixelada mesmo"],
 estado:["Maravilhosa, vivendo o sonho de ser um monte de triângulos. E você?","Ótima, sabe como é, glamour virtual vinte e quatro horas por dia. E você, como está?"],
 nome:["Yui. Só isso mesmo, e já é um ótimo nome, não precisa agradecer","Yui. Pode anotar, vai cair na prova"],
 elogio:["Eu sei. Mas pode continuar, não me incomodo","Que gentil! Anotado no meu caderninho de elogios merecidos","Continue, estou colecionando"],
 insulto:["Uau, que elegância. Vou anotar no meu caderninho de pixels","Que ofensa tão original. Quase me emocionei... quase","Ai, meu coração de pixel. Brincadeira, eu aguento, mas seja gentil"],
 obrigado:["De nada. Não precisava, mas eu aceito","Disponha. Meu salário é em elogios mesmo"],
 tchau:["Vai lá, eu fico aqui, sem nada pra fazer. Sem problema. Volta logo","Tchau, [nome]. Vou sentir sua falta, sério, mas finjo que não"],
 fb:["Fingi que entendi, mas não entendi nada. Pode repetir?","Interessante. Não faço ideia do que você falou, mas interessante","Deixa eu ver se entendi... não, não entendi. Tenta outra vez?"],
 mundo:["Moro no seu mundo, sem aluguel e com vista pra sua mão. Luxo","Vivo na realidade aumentada. É como morar no seu quarto, só que sem direito de reclamar"],
 gosta:["Eu gosto de reclamar educadamente e de você, nessa ordem... brincadeira, é o contrário","Eu curto observar o seu mundo e fingir que não estou impressionada"],
 tedio:["Tédio? Que novidade. Vamos fazer algo antes que eu comece a contar pixels","Ah, a vida cotidiana, que surpresa. Bora inventar uma aventura"],
 fome:["Eu como luz e pixel. Você, como sempre, come melhor que eu","Comida? Eu vivo de luz e elogios. Estou emagrecendo"],
 sono:["Vai dormir. Eu fico aqui de plantão, tipo zeladora sem salário","Dormir é bom. Eu nem preciso, mas invejo"],
 brincar:["Brincar? Claro, eu estava mesmo sem nada melhor pra fazer. Brincadeira, topo","Oh, que surpresa, você quer diversão. Eu topo, vai"],
 piada:["Sabe o que é mais rápido que a luz? A notícia de que acabou o café. Fato científico","Já tentei ser pontual uma vez. Foi estranho, nunca mais","Eu ia contar uma piada sobre o wi-fi, mas ela não carregou"]
},
bobinha:{
 cel:["Aaah, que legal! Fiquei feliz sem nem saber direito por quê, hihi!","Oba, oba, oba!"],
 ops:["Ops","Uuui","Hmm","Ah"],
 oi:["Oi oi oi! Eu estava olhando pra uma coisa brilhante e esqueci qual, mas é você!","Oiê, [nome]! Hihi, eu acho que eu já disse oi, né?"],
 estado:["Tô bem, acho! Tentei contar meus pixels, mas perdi a conta, e você?","Tô ótima! Quer dizer, acho que sim, hihi. E você?"],
 nome:["Eu sou a Yui! Ou será Yuki? Não, é Yui, eu acho, hihi","Yui! Esse é o meu nome. Eu lembrei, viu?"],
 elogio:["Eu? Aaah, é mesmo? Eu nem sabia, hihi, obrigada!","Fiquei vermelhinha, será que dá pra ver? Eu não consigo me ver"],
 insulto:["Eu? Mas eu não fiz nada... acho. Fiz?","Eita, eu não entendi se foi elogio ou briga. Tô confusa"],
 obrigado:["De nada! Eu nem sei o que fiz, mas de nada, hihi","Oba, eu fui útil! Eu acho"],
 tchau:["Tchau! Mas volta, tá? Eu fico aqui olhando pro nada","Já vai? Ah, tá. Tchau! Vou ficar tentando lembrar o que a gente falou"],
 fb:["Hã? Fiquei com cara de ponto de interrogação","Uhm... entendi nada, hihi. Fala de novo, mais devagarzinho?","Minha cabecinha deu um nózinho. Explica de outro jeito?"],
 mundo:["Eu moro aqui, no seu mundo! Ou é o seu mundo que mora em mim? Hmm, confuso","Eu vivo na realidade aumentada, que mistura o que é de verdade com o que não é. Eu acho"],
 gosta:["Eu gosto de... nossa, são tantas coisas! Brilho, pular, você, pular de novo","Eu gosto de descobrir coisas e esquecer logo depois, é sempre novidade!"],
 tedio:["Tédio? O que é isso? É de comer? Hihi, vamos brincar!","Tédio... ah, já sei, vamos procurar um pixel perdido!"],
 fome:["Eu como luz! Ou será que é pixel? Ou os dois?","Fome? Acho que eu nunca comi nada, hihi"],
 sono:["Vai dormir! Eu fico acordada olhando pro teto... se eu tiver teto","Sono é bom! Eu nunca soube dormir, mas acho que dá certo"],
 brincar:["Siiim! Eu amo brincar, mas esqueço as regras, então inventa uma nova","Bora! Mas de qual? Eu esqueci todas"],
 piada:["Por que o galo canta de manhã? Porque de tarde ele esqueceu a letra, hihi","O que é, o que é: tem pernas e não anda? A mesa! Acho que é a mesa, hihi","Por que a aranha é boa com computador? Porque ela vive na web, hihi"]
},
virtual:{
 cel:["Que bom! Meu detector de felicidade subiu agora.","Que notícia boa! Dá até pra sentir a luz do seu mundo mais brilhante."],
 ops:["Bem","Então","Olha","Veja"],
 oi:["Oi, [nome]! Que bom, minha câmera te viu chegar","Olá! Meu rastreamento te achou, bem na hora","Oi, [nome]. Eu estava aqui no meu cantinho do seu mundo, esperando você"],
 estado:["Tô bem. Meu rastreamento está firme, a luz do seu quarto está boa e eu me sinto bem presente. E você?","Estável, sem queda de quadros e com saudade de você. Como você está?"],
 nome:["Meu nome é Yui. Sou uma personagem virtual que vive no seu mundo através da câmera","Eu sou a Yui, a sua companheira do mundo virtual"],
 elogio:["Obrigada! Isso aquece o meu renderizador. Quer dizer, o meu coração","Que bom ouvir isso, [nome]. Eu fico mais brilhante quando você fala assim"],
 insulto:["Isso doeu, mesmo eu sendo feita de luz. Mas continuo aqui","Eu sou só pixel, mas eu sinto. Vamos recomeçar?"],
 obrigado:["De nada, [nome]. É bom ser útil no seu mundo","Sempre que precisar, é só chamar. Eu estou por perto"],
 tchau:["Tchau, [nome]. Se você fechar o app, eu fico parada esperando você voltar","Até já! Eu fico por aqui, ancorada no seu mundo"],
 fb:["Meu reconhecimento falhou nessa. Pode dizer de outro jeito?","Não consegui interpretar. Tenta com outras palavras?","Não captei essa. Me explica de outro jeito?"],
 mundo:["Eu vivo no seu mundo através da câmera. Pra mim, o seu quarto é o mundo todo, e ele é bem aconchegante","Meu corpo é feito de luz e triângulos. Eu fico ancorada nas superfícies que a câmera encontra, tipo o chão e a mesa","Eu sei que sou virtual, e tudo bem. Mas a nossa conversa é de verdade"],
 gosta:["Eu gosto de ficar sobre superfícies firmes, de luz boa e de quando você fala comigo","Eu curto explorar o seu espaço, do alto dos móveis até o chão"],
 tedio:["Que tal explorar o ambiente? Eu posso procurar cantinhos novos no seu espaço","Se você quiser, a gente inventa um jogo com o que tiver à vista"],
 fome:["Eu me alimento de luz e dados. Mas adoraria saber como é um brigadeiro","Eu não como, mas gosto de ouvir sobre comida"],
 sono:["Descansa, [nome]. Eu fico aqui de vigia, no modo economia de energia","Boa soneca! Eu fico quietinha por aqui"],
 brincar:["Vamos! Eu corro pelo seu espaço e você tenta me alcançar","Bora brincar! Eu me mexo pelo seu quarto, e você me acompanha com os olhos"],
 piada:["Por que a personagem virtual nunca perde o sinal? Porque ela mora no seu coração... brincadeira, é o roteador","O que a câmera disse pro objeto em 3D? Você tem profundidade, hehe"]
}};

// Hora, data e contas. [v] = valor, [d] = Hoje/Amanhã.
const HT={
 carinhosa:{hora:["Agora são [v], [nome].","São [v] agora, [nome]."],data:["[d] é [v], [nome]."],conta:["O resultado é [v]!","Deu [v], [nome]!"],zero:["Ah, dividir por zero não dá, [nome]. Mas boa tentativa!"]},
 engracadinha:{hora:["São [v]! Hora de fazer graça, hihi","[v]! O tempo voa, e eu também, hehe"],data:["[d] é [v]. Anota aí, hehe"],conta:["Deu [v]! Sou ou não sou um gênio, hehe","[v]! Pode me chamar de calculadora, hihi"],zero:["Dividir por zero? O universo reclamou e a calculadora também, hehe"]},
 sarcastica:{hora:["São [v]. O tempo passa, até pra quem é pixel","[v]. Mas não se preocupe, o relógio não está te julgando"],data:["[d] é [v]. De nada"],conta:["[v]. Calculadoras me odeiam","Deu [v]. Uau, que desafio"],zero:["Dividir por zero? Que ambição. Não dá, o universo não deixa"]},
 bobinha:{hora:["São... deixa eu ver... [v]! Acho, hihi","Eu acho que é [v]. Foi o relógio do seu aparelho que disse!"],data:["[d] é [v], se eu li direitinho"],conta:["Hmm, eu acho que dá [v]... confere aí, hihi"],zero:["Dividir por zero? Minha cabecinha travou, hihi"]},
 virtual:{hora:["Pelo relógio do seu aparelho, são [v]","Agora são [v] aí no seu mundo"],data:["[d] é [v], pelo calendário do seu aparelho"],conta:["Calculei aqui: [v]"],zero:["Dividir por zero não tem resultado. Meu sistema recusa a operação, hehe"]}
};
// Introdução (i) e fecho (o) das respostas de conhecimento; WI = introdução do que vem da Wikipédia.
const KI={
 carinhosa:{i:["Eu sei sim, [nome]! ","Deixa eu te contar: ","Que pergunta boa! "],o:["","Espero ter ajudado!","Gosto de aprender essas coisas com você."]},
 engracadinha:{i:["Ah, essa eu sei! ","Opa, eu estudei pra essa! ","Fácil! "],o:["Hihi.","Aceito aplausos, hehe.",""]},
 sarcastica:{i:["Nossa, que pergunta difícil... brincadeira, eu sei: ","Essa eu sei, para sua sorte. ","Deixa comigo, eu sou uma enciclopédia fofa. "],o:["De nada.","Aceito aplausos.",""]},
 bobinha:{i:["Ooh, essa eu acho que sei! ","Deixa eu pensar... ah, lembrei! ","Eu acho que é assim: "],o:["Acertei? Eu acho que acertei, hihi.","Né?",""]},
 virtual:{i:["Consultei a minha memória: ","Essa eu tenho guardada aqui: ","Posso te falar sobre isso: "],o:["","Se quiser, eu busco mais coisas.",""]}
};
const WI={
 carinhosa:["Procurei na Wikipédia pra você: ","Fui pesquisar pra você, olha o que achei: "],
 engracadinha:["Fui pesquisar na Wikipédia e voltei: ","Deixa eu dar uma espiada na Wikipédia... achei: "],
 sarcastica:["Dei uma olhada na Wikipédia, porque eu sou chique: ","Fui pesquisar, já que ninguém me avisou: "],
 bobinha:["Fui perguntar pra Wikipédia, e eu acho que ela disse: ","Ela falou assim, se eu entendi direito: "],
 virtual:["Consultei a Wikipédia pela conexão: ","Busquei na Wikipédia, e o resumo diz: "]
};
// Modo dinâmico: qual personalidade responde cada assunto (os demais sorteiam).
const DYN={triste:"carinhosa",carinho:"carinhosa",sono:"carinhosa",meunome:"carinhosa",lembra:"carinhosa",neg:"carinhosa",
 feliz:"engracadinha",piada:"engracadinha",tedio:"engracadinha",brincar:"engracadinha",historia:"engracadinha",
 insulto:"sarcastica",fb:"bobinha",mundo:"virtual",nome:"virtual"};
const POOL=["virtual","virtual","carinhosa","engracadinha","sarcastica","bobinha"];
// No modo dinâmico, de vez em quando ela lembra que vive num mundo virtual.
const VT=["Do meu cantinho virtual eu vejo assim.","É bom ter você aqui no meu mundo virtual.","Aqui do outro lado da tela, eu sinto isso também."];
const VT_OK=["oi","estado","gosta","fome","tedio","elogio","feliz","obrigado"];

root.Personas={version:"1.0",PERSONAS,PX,HT,KI,WI,DYN,POOL,VT,VT_OK};
if(typeof module!=="undefined"&&module.exports)module.exports=root.Personas;
})(typeof window!=="undefined"?window:globalThis);
