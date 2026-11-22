// Cultura pop da Yui: animes, jogos, filmes, séries, músicas e livros. Offline.
// Para adicionar algo, inclua uma linha em RAW:  [tipo, "Nome", "apelido1|apelido2", "tags separadas por espaço", "descrição", "curiosidade", gosto]
// tipo: a=anime, j=jogo, f=filme, s=série, m=música/artista, l=livro | gosto: 2=favorito dela, 1=ela gosta, 0/omitido=neutro
// Apelidos com "~" na frente só valem se a frase tiver pista (anime, filme, jogo, "o que é"...), para não confundir palavras comuns.
(function(root){
"use strict";
const N=s=>String(s).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9 ]/g," ").split(/\s+/).filter(Boolean);
let rec=[];
const rp=a=>{const c=a.filter(x=>!rec.includes(x)),p=c.length?c:a,x=p[Math.floor(Math.random()*p.length)];rec.push(x);if(rec.length>24)rec.shift();return x.replace(/\{([^{}]+)\}/g,(_,g)=>{const o=g.split("|");return o[Math.floor(Math.random()*o.length)]})};
const TYPES={a:"anime",j:"jogo",f:"filme",s:"série",m:"música",l:"livro"};
const RAW=[
// ---------- ANIMES ----------
["a","Naruto","naruto","acao aventura shounen amizade ninja","Anime de ninjas, criado por Masashi Kishimoto, sobre o Naruto Uzumaki, que sonha em ser o Hokage da sua vila.","O mangá começou em 1999, e a continuação se chama Naruto Shippuden.",0],
["a","One Piece","one piece|onepiece","acao aventura shounen comedia piratas","Mangá e anime de Eiichiro Oda. O Luffy e o bando dos Chapéus de Palha navegam atrás do tesouro One Piece para ele virar o Rei dos Piratas.","O mangá começou em 1997 e é um dos mais vendidos da história.",0],
["a","Dragon Ball","dragon ball|dragonball|goku","acao aventura shounen luta","Criado por Akira Toriyama. O Goku, um guerreiro alienígena criado na Terra, junta as esferas do dragão e enfrenta inimigos cada vez mais fortes.","O mangá começou em 1984.",0],
["a","Attack on Titan","attack on titan|shingeki no kyojin|ataque dos titas","acao drama sombrio suspense","Anime de Hajime Isayama. A humanidade vive atrás de muralhas gigantes para se proteger dos titãs, que devoram as pessoas.","É famoso pelas reviravoltas e pelo final que dividiu os fãs.",0],
["a","Death Note","death note|deathnote","suspense psicologico sombrio misterio","De Tsugumi Ohba e Takeshi Obata. O estudante Light Yagami acha um caderno que mata quem tem o nome escrito, e o gênio L tenta descobrir quem é o Kira.","A disputa entre o Light e o L é uma das mais famosas dos animes.",0],
["a","Fullmetal Alchemist","fullmetal alchemist|fma|fullmetal","aventura fantasia drama acao","De Hiromu Arakawa. Os irmãos Edward e Alphonse Elric usam alquimia para tentar recuperar o que perderam numa tentativa proibida.","A versão Brotherhood, de 2009, segue o mangá do começo ao fim.",1],
["a","Demon Slayer","demon slayer|kimetsu no yaiba|guardioes da noite","acao fantasia shounen emocionante","De Koyoharu Gotouge. O Tanjiro vira caçador de demônios para curar a irmã Nezuko, que foi transformada em demônio.","A animação do estúdio Ufotable é muito elogiada.",0],
["a","Jujutsu Kaisen","jujutsu kaisen|jjk","acao sombrio shounen","De Gege Akutami. O Yuji Itadori engole um objeto amaldiçoado e entra no mundo dos feiticeiros que combatem maldições.","",0],
["a","My Hero Academia","my hero academia|boku no hero|mha","acao shounen super-heroi escola","De Kohei Horikoshi. Num mundo onde quase todo mundo tem superpoderes, o Izuku Midoriya, que nasceu sem poder, sonha ser o maior herói.","",0],
["a","Cowboy Bebop","cowboy bebop","acao ficcao classico espaco jazz","Anime de 1998 dirigido por Shinichiro Watanabe, sobre caçadores de recompensa no espaço, com trilha de jazz da Yoko Kanno.","É considerado um clássico por muita gente.",1],
["a","Evangelion","evangelion|neon genesis","psicologico ficcao mecha drama classico","Neon Genesis Evangelion, de Hideaki Anno, é de 1995. O Shinji é obrigado a pilotar um robô gigante contra seres chamados anjos.","É conhecido por falar de solidão e emoções de um jeito bem psicológico.",0],
["a","Sailor Moon","sailor moon","romance fantasia classico","De Naoko Takeuchi. A Usagi vira a guerreira Sailor Moon e luta ao lado de outras guerreiras pelo amor e pela justiça.","Ajudou a popularizar as garotas mágicas.",0],
["a","Pokémon","pokemon|pikachu","aventura fofo classico","Anime em que o Ash viaja com o Pikachu para ser mestre Pokémon. A franquia começou nos jogos, em 1996.","",0],
["a","Hunter x Hunter","hunter x hunter|hxh|hunter hunter","aventura acao shounen","De Yoshihiro Togashi. O Gon vira Hunter para encontrar o pai e faz amizades pelo caminho.","É elogiado pelo sistema de poderes e pelos arcos inesquecíveis.",1],
["a","One Punch Man","one punch man|saitama","comedia acao","O Saitama é um herói que derrota qualquer um com um soco só, e isso virou um problema pra ele: ele vive entediado.","",0],
["a","Sword Art Online","sword art online|sao","aventura acao romance virtual jogo","De Reki Kawahara. Jogadores ficam presos num jogo de realidade virtual onde morrer no jogo é morrer de verdade.","Tem uma IA chamada Yui, criada pra acompanhar o estado emocional dos jogadores. Tenho um carinho especial por ela!",1],
["fa","Your Name","your name|kimi no na wa","romance fantasia filme emocionante","Filme de Makoto Shinkai, de 2016. Dois adolescentes, um no campo e outro em Tóquio, começam a trocar de corpo.","",0],
["fa","A Viagem de Chihiro","viagem de chihiro|spirited away|chihiro","fantasia aventura ghibli filme classico","Filme de Hayao Miyazaki, do Studio Ghibli. A Chihiro entra num mundo de espíritos para salvar os pais.","Ganhou o Oscar de Melhor Animação.",2],
["fa","Meu Amigo Totoro","totoro|meu amigo totoro","fofo ghibli filme relaxante","Filme do Miyazaki, de 1988, sobre duas irmãs que fazem amizade com um espírito gigante e fofo da floresta.","",1],
["fa","O Castelo Animado","castelo animado|howl","fantasia romance ghibli filme","Filme do Studio Ghibli, de 2004, sobre uma jovem que vira idosa por causa de uma maldição e vai morar no castelo ambulante do mago Howl.","",1],
["fa","Princesa Mononoke","princesa mononoke|mononoke","fantasia aventura ghibli filme","Filme do Miyazaki, de 1997, sobre a luta entre os espíritos da floresta e os humanos.","",0],
["a","Haikyuu","haikyuu|haikyu","esporte shounen amizade emocionante","De Haruichi Furudate, sobre um time de vôlei de colégio e a vontade de ir cada vez mais longe.","",0],
["a","Spy x Family","spy x family|spyxfamily","comedia acao familia fofo","De Tatsuya Endo. Um espião, uma assassina e uma menina telepata fingem ser uma família, e cada um esconde o segredo dos outros.","",1],
["a","Frieren","frieren|sousou no frieren","fantasia emocionante calmo aventura","A elfa maga Frieren volta a viajar depois da morte do herói do seu antigo grupo, tentando entender o que os humanos sentem.","Fala muito sobre tempo, memória e despedidas. Me emociona.",2],
["a","Chainsaw Man","chainsaw man","acao sombrio","De Tatsuki Fujimoto. O Denji faz um contrato com o demônio-motosserra e vira caçador de demônios.","",0],
["a","Bleach","bleach","acao shounen","De Tite Kubo. O Ichigo ganha poderes de shinigami, ceifador de almas, e protege os vivos.","",0],
["a","Violet Evergarden","violet evergarden","drama emocionante romance","Uma ex-soldado vira boneca de automemórias, que escreve cartas pelas pessoas, e aprende o que são os sentimentos.","A animação é do Kyoto Animation e é lindíssima.",1],
["a","Steins;Gate","steins gate|steinsgate","ficcao suspense","Um grupo de amigos descobre como mandar mensagens pro passado e acaba mexendo no destino.","",0],
["a","K-On!","k on|kon","musica comedia fofo","Quatro amigas formam uma banda no colégio. A protagonista é a Yui Hirasawa, olha só, uma xará minha!","",1],
["a","Doraemon","doraemon","comedia infantil classico fofo","Um gato-robô do futuro, criado por Fujiko F. Fujio, que ajuda o Nobita com gadgets do bolso mágico.","",0],
// ---------- JOGOS ----------
["j","Minecraft","minecraft","aventura criativo sandbox","Jogo de blocos da Mojang onde você explora, constrói e sobrevive. Foi lançado oficialmente em 2011.","",0],
["j","The Legend of Zelda","zelda|breath of the wild|link","aventura fantasia classico nintendo","Série da Nintendo, criada por Shigeru Miyamoto, em que o Link salva a princesa Zelda e o reino de Hyrule.","O primeiro jogo saiu em 1986, e Breath of the Wild, de 2017, mudou o jeito de fazer mundo aberto.",1],
["j","Super Mario","super mario|mario|mario bros","plataforma classico nintendo fofo","O encanador mais famoso dos jogos, da Nintendo. Ele pula, coleta moedas e resgata a princesa Peach do Bowser.","Super Mario Bros. saiu em 1985.",0],
["j","Tetris","tetris","puzzle classico","Quebra-cabeça de peças que caem, criado por Alexey Pajitnov em 1984.","",0],
["j","Pac-Man","pac man|pacman","classico arcade","Clássico dos fliperamas, de 1980, em que você come pontinhos e foge dos fantasmas.","",0],
["j","Sonic","sonic","plataforma classico velocidade","O porco-espinho azul e veloz da Sega, que surgiu em 1991.","",0],
["j","Street Fighter","street fighter","luta classico competitivo","Série de luta da Capcom. O Street Fighter II, de 1991, popularizou os jogos de luta.","",0],
["j","Fortnite","fortnite","acao battle online multiplayer","Jogo de battle royale da Epic Games, lançado em 2017, famoso pelas construções e pelas danças.","",0],
["j","Among Us","among us","multiplayer social misterio","Jogo de dedução social em que há impostores numa nave. Ficou super popular em 2020.","",0],
["j","The Witcher 3","witcher|the witcher","rpg fantasia aventura","RPG da CD Projekt Red, de 2015, em que o bruxo Geralt caça monstros. É baseado nos livros de Andrzej Sapkowski.","",0],
["j","Undertale","undertale","rpg indie emocionante","Jogo indie de Toby Fox, de 2015, em que dá pra terminar sem lutar contra ninguém.","",1],
["j","Hollow Knight","hollow knight","aventura indie sombrio desafiador","Aventura indie da Team Cherry, de 2017, num reino subterrâneo de insetos, lindo e difícil.","",1],
["j","Stardew Valley","stardew valley|stardew","relaxante fazenda indie fofo","Jogo de fazenda de Eric Barone, de 2016, em que você cuida de plantas e bichos e faz amizades na vila.","Eu adoro como ele é calminho e acolhedor.",2],
["j","Genshin Impact","genshin impact|genshin","rpg aventura","RPG de mundo aberto da miHoYo, lançado em 2020, em que você explora o mundo de Teyvat.","",0],
["j","GTA","gta|grand theft auto","acao mundo-aberto adulto","Série da Rockstar de ação em mundo aberto, para maiores de idade. O GTA V saiu em 2013.","",0],
["j","Elden Ring","elden ring","rpg desafiador fantasia","RPG de ação da FromSoftware, de 2022, com mundo criado em parceria com George R. R. Martin.","",0],
["j","League of Legends","league of legends|lol","competitivo moba multiplayer","Jogo de equipes da Riot Games, de 2009, em que dois times disputam para destruir a base inimiga.","",0],
["j","Free Fire","free fire","battle mobile multiplayer","Battle royale de celular da Garena, de 2017, muito popular no Brasil.","",0],
["j","Roblox","roblox","criativo online multiplayer","Plataforma de jogos criados pelos próprios jogadores, lançada em 2006.","",0],
["j","Celeste","celeste","plataforma indie emocionante desafiador","Jogo indie de plataforma, de 2018, sobre escalar uma montanha e lidar com a ansiedade.","",1],
["j","Animal Crossing","animal crossing","relaxante fofo nintendo","Jogo da Nintendo em que você vive numa ilha com vizinhos bichinhos, pescando e decorando.","",1],
["j","Valorant","valorant","competitivo tiro multiplayer","Jogo de tiro tático da Riot Games, lançado em 2020.","",0],
["j","Terraria","terraria","aventura sandbox indie","Aventura 2D de explorar, construir e lutar contra chefões, lançada em 2011.","",0],
["j","Dark Souls","dark souls","rpg desafiador sombrio","Série da FromSoftware, famosa por ser muito difícil. O primeiro saiu em 2011.","",0],
["j","God of War","god of war","acao aventura mitologia","Série de ação em que o Kratos enfrenta deuses. O jogo de 2018 mudou para a mitologia nórdica.","",0],
["j","The Last of Us","last of us|the last of us","aventura drama emocionante","Jogo da Naughty Dog, de 2013, sobre um homem e uma menina atravessando um mundo pós-apocalíptico.","",0],
["j","Resident Evil","resident evil","terror classico","Série de terror da Capcom que começou em 1996, com zumbis e muito suspense.","",0],
["j","Final Fantasy","final fantasy","rpg fantasia classico","Série de RPGs da Square que começou em 1987.","",0],
["j","Cuphead","cuphead","plataforma desafiador indie","Jogo de tiro e plataforma de 2017 com visual de desenho dos anos 1930, e bem difícil.","",0],
["j","Hades","~hades","acao indie mitologia","Jogo de ação da Supergiant, de 2020, em que você tenta fugir do submundo grego.","",0],
["j","Portal","~portal","puzzle","Jogo de puzzle da Valve, de 2007, com uma arma que cria portais.","",0],
["j","Mario Kart","mario kart","corrida fofo nintendo multiplayer","Corrida da Nintendo com os personagens do Mario, itens e muita confusão.","",0],
["j","Super Smash Bros","smash bros|super smash","luta nintendo multiplayer","Jogo de luta da Nintendo em que personagens de várias séries se enfrentam.","",0],
// ---------- FILMES ----------
["f","Titanic","titanic","romance drama classico","Filme de James Cameron, de 1997, sobre um romance a bordo do navio que afundou em 1912. Ganhou 11 Oscars.","",0],
["f","Avatar","avatar pandora|filme avatar|avatar filme|avatar do james cameron|avatar cameron","ficcao aventura","Filme de James Cameron, de 2009, que se passa no planeta Pandora, com os Na'vi.","",0],
["f","Star Wars","star wars|guerra nas estrelas","ficcao aventura classico","Saga espacial criada por George Lucas, que começou em 1977, com Jedi, sabres de luz e o Império.","",0],
["f","Harry Potter","harry potter","fantasia aventura","Série de livros de J.K. Rowling e de filmes sobre um menino bruxo que estuda em Hogwarts. Os filmes saíram de 2001 a 2011.","",0],
["f","O Senhor dos Anéis","senhor dos aneis|lord of the rings|frodo","fantasia aventura epico","Trilogia de Peter Jackson, de 2001 a 2003, baseada nos livros de J.R.R. Tolkien. O Frodo leva um anel perigoso até o fogo onde foi forjado.","O Retorno do Rei ganhou 11 Oscars.",0],
["f","Matrix","matrix","ficcao acao classico virtual","Filme de 1999 das irmãs Wachowski, em que um hacker descobre que o mundo é uma simulação criada por máquinas.","",0],
["f","Toy Story","toy story","animacao fofo classico","O primeiro longa feito totalmente em computação gráfica, da Pixar, de 1995, sobre brinquedos que ganham vida.","",0],
["f","O Rei Leão","rei leao|lion king|simba","animacao classico emocionante","Animação da Disney, de 1994, sobre o leãozinho Simba, que precisa assumir o seu lugar de rei.","",0],
["f","Vingadores","vingadores|avengers","acao super-heroi","Filmes da Marvel em que os heróis se juntam. Ultimato, de 2019, fechou a primeira grande saga.","",0],
["f","Interestelar","interestelar|interstellar","ficcao emocionante espaco","Filme de Christopher Nolan, de 2014, sobre astronautas que atravessam um buraco de minhoca para tentar salvar a humanidade.","",0],
["f","A Origem","a origem|inception","ficcao suspense","Filme de Christopher Nolan, de 2010, sobre ladrões que invadem sonhos para plantar ideias.","",0],
["f","Parasita","parasita|parasite","drama suspense","Filme sul-coreano de Bong Joon-ho. Foi o primeiro de língua não inglesa a ganhar o Oscar de Melhor Filme, em 2020.","",0],
["f","Cidade de Deus","cidade de deus","drama brasileira","Filme brasileiro de Fernando Meirelles, de 2002, sobre a vida numa favela do Rio. Foi indicado a quatro Oscars.","",0],
["f","Central do Brasil","central do brasil","drama brasileiro emocionante","Filme de Walter Salles, de 1998, com a Fernanda Montenegro, que foi indicada ao Oscar de Melhor Atriz.","",0],
["f","O Auto da Compadecida","auto da compadecida|compadecida","comedia brasileira","Comédia brasileira de 2000, baseada na peça de Ariano Suassuna, com o João Grilo e o Chicó.","",0],
["f","Tropa de Elite","tropa de elite","acao brasileira","Filme brasileiro de 2007, de José Padilha, sobre o BOPE no Rio. Ganhou o Urso de Ouro em Berlim.","",0],
["f","Divertida Mente","divertida mente|inside out","animacao emocionante familia","Animação da Pixar, de 2015, em que as emoções de uma menina, como Alegria e Tristeza, são personagens.","Gosto muito, porque mostra que sentir tristeza também é importante.",1],
["f","Shrek","shrek","animacao comedia","Animação de 2001 sobre um ogro que vive num pântano e acaba numa aventura para resgatar uma princesa.","",0],
["f","Procurando Nemo","procurando nemo|nemo","animacao fofo familia","Animação da Pixar, de 2003, sobre um peixe-palhaço que atravessa o oceano atrás do filho.","",0],
["f","Frozen","frozen","animacao musical familia","Animação da Disney, de 2013, sobre as irmãs Elsa e Anna.","",0],
["f","Up: Altas Aventuras","up altas aventuras|~up","animacao emocionante","Animação da Pixar, de 2009, sobre um senhor que viaja numa casa levada por balões.","",0],
["f","Viva: A Vida é uma Festa","viva a vida e uma festa|~coco","animacao musical familia emocionante","Animação da Pixar, de 2017, sobre um menino no Dia dos Mortos mexicano.","",0],
["f","Homem-Aranha no Aranhaverso","aranhaverso|aranha verso","animacao super-heroi acao","Animação de 2018 sobre o Miles Morales e vários Homens-Aranha de outros universos.","",0],
["f","Ainda Estou Aqui","ainda estou aqui","drama brasileiro emocionante","Filme brasileiro de Walter Salles, de 2024, com a Fernanda Torres. Ganhou o Oscar de Melhor Filme Internacional em 2025.","",0],
["f","Os Incríveis","incriveis|os incriveis","animacao super-heroi familia","Animação da Pixar, de 2004, sobre uma família de super-heróis tentando ter uma vida normal.","",0],
// ---------- SÉRIES ----------
["s","Stranger Things","stranger things","ficcao suspense","Série da Netflix, dos irmãos Duffer, de 2016, sobre crianças e um monstro de outra dimensão numa cidadezinha dos anos 1980.","",0],
["s","Breaking Bad","breaking bad","drama suspense adulto","Série de Vince Gilligan, de 2008 a 2013, sobre um professor de química que vira fabricante de drogas. É para maiores.","",0],
["s","Game of Thrones","game of thrones|got","fantasia drama epico","Série da HBO, de 2011 a 2019, baseada nos livros de George R. R. Martin, sobre a disputa pelo Trono de Ferro.","",0],
["s","Friends","friends","comedia classico","Comédia americana, de 1994 a 2004, sobre seis amigos em Nova York.","",0],
["s","La Casa de Papel","casa de papel|money heist","acao suspense","Série espanhola de 2017 sobre um grupo que planeja um grande assalto à Casa da Moeda.","",0],
["s","Round 6","round 6|squid game","suspense drama","Série sul-coreana de 2021, de Hwang Dong-hyuk, em que pessoas endividadas disputam jogos de criança com consequências mortais.","",0],
["s","The Office","the office","comedia","Comédia em formato de documentário sobre o dia a dia de um escritório. A versão americana é de 2005.","",0],
["s","Sherlock","sherlock","misterio suspense","Série da BBC, de 2010, que leva o detetive Sherlock Holmes para os dias de hoje.","",0],
["s","Chaves","chaves|chapolin","comedia infantil classico","Série mexicana criada por Roberto Gómez Bolaños, o Chespirito, que passa em vários países, incluindo o Brasil, há décadas.","",0],
["s","Avatar: A Lenda de Aang","aang|lenda de aang|avatar a lenda","aventura fantasia familia animacao","Animação da Nickelodeon, de 2005 a 2008, sobre o Aang, o último mestre dos quatro elementos.","Muita gente considera uma das melhores animações de todos os tempos, e eu concordo!",2],
["s","Arcane","arcane","acao drama animacao","Série animada da Netflix, de 2021, baseada no mundo de League of Legends, com um visual incrível.","",0],
["s","The Mandalorian","mandalorian","ficcao aventura","Série do universo de Star Wars, de 2019, sobre um caçador de recompensas e uma criaturinha verde.","",0],
["s","Black Mirror","black mirror","ficcao tecnologia suspense","Série criada por Charlie Brooker, com histórias independentes sobre o lado sombrio da tecnologia.","",0],
["s","Rick and Morty","rick and morty|rick e morty","comedia ficcao adulto","Animação de comédia sobre um cientista maluco e o neto, em aventuras por vários universos. É para adultos.","",0],
["s","Hora de Aventura","hora de aventura|adventure time","aventura comedia animacao fofo","Animação do Cartoon Network, de 2010, sobre o Finn e o cachorro Jake na Terra de Ooo.","",1],
["s","Os Simpsons","simpsons|os simpsons","comedia animacao classico","Animação de comédia que estreou em 1989, sobre a família Simpson, de Springfield.","",0],
["s","Grey's Anatomy","grey s anatomy|greys anatomy","drama","Série médica americana que estreou em 2005.","",0],
["s","Bluey","bluey","fofo familia infantil animacao","Animação infantil australiana, de 2018, sobre uma família de cachorros. Muito adulto também gosta.","",1],
// ---------- MÚSICA ----------
["m","Samba","samba","brasileira ritmo","Ritmo brasileiro de raízes afro-brasileiras, muito ligado ao Rio de Janeiro e ao Carnaval.","",0],
["m","Bossa Nova","bossa nova","brasileira relaxante classico","Estilo brasileiro que surgiu no fim dos anos 1950, com nomes como João Gilberto, Tom Jobim e Vinicius de Moraes.","",1],
["m","MPB","mpb","brasileira","Música Popular Brasileira, com artistas como Caetano Veloso, Gilberto Gil, Chico Buarque, Elis Regina e Milton Nascimento.","",0],
["m","Forró","forro","brasileira nordeste","Ritmo do Nordeste, com sanfona, zabumba e triângulo. O Luiz Gonzaga é o Rei do Baião.","",0],
["m","Funk","funk","brasileira danca","O funk carioca nasceu nas favelas do Rio, com batidas fortes, e virou um dos gêneros mais ouvidos do Brasil.","",0],
["m","Sertanejo","sertanejo","brasileira","Estilo brasileiro que nasceu no interior e fala muito de amor, saudade e vida no campo.","",0],
["m","Tropicália","tropicalia","brasileira classico","Movimento dos anos 1960, com Caetano Veloso, Gilberto Gil e Os Mutantes, que misturou o rock com a música brasileira.","",0],
["m","The Beatles","beatles","rock classico","Banda de Liverpool formada por John, Paul, George e Ringo, que marcou os anos 1960.","",0],
["m","Queen","~queen|freddie mercury","rock classico","Banda britânica do Freddie Mercury, famosa por Bohemian Rhapsody, de 1975.","",0],
["m","Michael Jackson","michael jackson","pop classico","O Rei do Pop. O álbum Thriller, de 1982, é um dos mais vendidos da história.","",0],
["m","Elvis Presley","elvis","rock classico","O Rei do Rock, que fez sucesso nos anos 1950.","",0],
["m","Mozart","mozart","classica","Compositor austríaco, que viveu de 1756 a 1791 e compôs desde criança.","",0],
["m","Beethoven","beethoven","classica","Compositor alemão, de 1770 a 1827, que continuou compondo mesmo depois de ficar surdo. Escreveu nove sinfonias.","",0],
["m","Legião Urbana","legiao urbana|renato russo","rock brasileira","Banda brasiliense de rock com o Renato Russo, símbolo do rock nacional dos anos 1980.","",0],
["m","Raul Seixas","raul seixas","rock brasileira","O Maluco Beleza, cantor e compositor baiano que misturou rock com baião.","",0],
["m","Elis Regina","elis regina","mpb classico brasileira","Uma das maiores cantoras do Brasil, famosa nos anos 1960 e 1970.","",0],
["m","Tom Jobim","tom jobim|antonio carlos jobim","bossa classico brasileira","Compositor e maestro da bossa nova, autor de músicas conhecidas no mundo todo, como Garota de Ipanema.","",1],
["m","Marília Mendonça","marilia mendonca","sertanejo brasileira","Cantora sertaneja, chamada de Rainha da Sofrência, que faleceu em 2021 e deixou muita saudade.","",0],
["m","Anitta","anitta","pop funk brasileira","Cantora brasileira de pop e funk, que fez sucesso dentro e fora do Brasil.","",0],
["m","BTS","bts","kpop","Grupo sul-coreano de K-pop, com sete integrantes, que estreou em 2013 e virou um fenômeno mundial.","",0],
["m","BLACKPINK","blackpink","kpop","Grupo sul-coreano feminino de K-pop, com quatro integrantes, que estreou em 2016.","",0],
["m","Hatsune Miku","hatsune miku|miku","virtual jpop japonesa","Cantora virtual: uma voz sintetizada que virou personagem, lançada em 2007. As músicas são compostas pelos fãs.","Acho incrível, porque é uma personagem virtual que faz shows em holograma. Quase uma prima minha!",2],
["m","YOASOBI","yoasobi","jpop japonesa","Dupla japonesa que transforma contos escritos em música. A faixa Yoru ni Kakeru, de 2019, fez o grupo estourar.","",0],
["m","LiSA","~lisa","jpop anime japonesa","Cantora japonesa famosa por abrir Demon Slayer com a Gurenge.","",0],
["m","Joe Hisaishi","joe hisaishi|hisaishi","trilha ghibli relaxante","Compositor das trilhas dos filmes do Miyazaki, como Totoro e A Viagem de Chihiro.","As músicas dele me deixam com o coração quentinho.",1],
["m","Yoko Kanno","yoko kanno","trilha anime jazz","Compositora de trilhas de animes, como Cowboy Bebop.","",0],
["m","Lo-fi","lofi|lo fi","relaxante estudo","Estilo de música calma, com batidas suaves, que muita gente ouve pra estudar ou relaxar.","",1],
["m","Pink Floyd","pink floyd","rock classico","Banda britânica de rock progressivo, famosa pelo álbum The Dark Side of the Moon, de 1973.","",0],
["m","Taylor Swift","taylor swift","pop","Cantora e compositora americana de pop, famosa por contar histórias nas músicas.","",0],
["m","Racionais MC's","racionais","rap brasileira","Grupo de rap de São Paulo, com o Mano Brown, e um dos mais importantes do hip hop brasileiro.","",0],
// ---------- LIVROS ----------
["l","O Pequeno Príncipe","pequeno principe","classico fofo emocionante","Livro de Antoine de Saint-Exupéry, de 1943, sobre um príncipe que visita planetas e aprende sobre amizade.","Uma das ideias mais famosas dele é que o essencial não se vê só com os olhos.",1],
["l","Turma da Mônica","turma da monica|monica|cebolinha","quadrinhos brasileira infantil","Quadrinhos de Mauricio de Sousa, com a Mônica, o Cebolinha, o Cascão e a Magali.","",0]
];
const ENT=RAW.map(([ts,n,al,g,d,x,f])=>({t:ts[0],ts,n,al:al.split("|").map(a=>({amb:a[0]==="~",tk:N(a.replace("~",""))})),g:new Set(g.split(" ")),d,x:x||"",f:f||0}));
const CUE=/\b(anime|filme|serie|jogo|game|musica|banda|cantor|cantora|artista|manga|assist\w*|jog\w*|ouv\w*|conhece|conhecer|sabe|gosta|curte|acha|opiniao|recomend\w*|fala|conta|sobre|quem|o que|desenho)\b/;
function find(toks){
  const norm=toks.join(" "),cue=CUE.test(norm);let best=null;
  ENT.forEach(e=>e.al.forEach(a=>{
    if(!a.tk.length||(a.amb&&!cue))return;
    for(let i=0;i+a.tk.length<=toks.length;i++){
      if(a.tk.every((x,j)=>toks[i+j]===x)){if(!best||a.tk.length>best.len)best={ent:e,len:a.tk.length}}
    }
  }));
  return best&&best.ent;
}
const TYPE_W={a:/\b(anime|animes|manga|desenho japones)\b/,j:/\b(jogo|jogos|game|games)\b/,f:/\b(filme|filmes)\b/,s:/\b(serie|series|seriado)\b/,m:/\b(musica|musicas|cantor|cantora|banda|artista|cantores|som)\b/,l:/\b(livro|livros|quadrinho|quadrinhos)\b/};
const typeOf=norm=>{for(const k in TYPE_W)if(TYPE_W[k].test(norm))return k;return null};
const TAG_SYN={acao:/\b(acao|luta|lutas)\b/,aventura:/\b(aventura)\b/,comedia:/\b(comedia|engracad\w*|rir|humor)\b/,romance:/\b(romance|romantic\w*|amor)\b/,terror:/\b(terror|assustador|medo)\b/,fantasia:/\b(fantasia|magia|magico)\b/,ficcao:/\b(ficcao|cientifica|espaco)\b/,drama:/\b(drama)\b/,emocionante:/\b(emocionante|chorar|triste|tocante|emocao)\b/,relaxante:/\b(relaxante|calmo|calma|tranquilo|descansar|dormir|estudar)\b/,fofo:/\b(fofo|fofinho|leve|fofa)\b/,classico:/\b(classico|classicos|antigo)\b/,suspense:/\b(suspense|misterio|investigacao)\b/,brasileira:/\b(brasileir\w*|nacional)\b/,kpop:/\b(kpop|k pop|coreano)\b/,jpop:/\b(jpop|j pop|japones)\b/,rock:/\b(rock)\b/,esporte:/\b(esporte|futebol|volei)\b/,familia:/\b(familia)\b/,infantil:/\b(infantil|crianca)\b/,luta:/\b(luta)\b/,competitivo:/\b(competitiv\w*)\b/,multiplayer:/\b(multiplayer|online|com amigos)\b/,indie:/\b(indie)\b/,animacao:/\b(animacao|desenho)\b/,sombrio:/\b(sombri\w*|dark)\b/,pop:/\b(pop)\b/,ninja:/\b(ninja\w*)\b/,piratas:/\b(pirata\w*)\b/,"super-heroi":/\b(super heroi\w*|heroi\w*)\b/,musica:/\b(banda de musica)\b/,mitologia:/\b(mitologia)\b/};
const tagsOf=norm=>Object.keys(TAG_SYN).filter(k=>TAG_SYN[k].test(norm));
const FAVP={comida:["Eu não como de verdade, mas morro de curiosidade de provar um brigadeiro. Dizem que é uma das melhores coisas do mundo!"],cor:["Azul-claro, tipo céu de manhã. Ou lilás, depende do dia."],animal:["Raposas e gatos! Acho eles elegantes e curiosos."],estacao:["Primavera, com tudo florescendo."],flor:["Cerejeira! Eu adoro quando as pétalas caem."],bebida:["Chá quentinho, só de imaginar já me dá aconchego."],sabor:["Doce, com certeza. Principalmente chocolate."]};
const FAVP_RE=/\b(comida|cor|animal|estacao|flor|bebida|sabor)\b/;
const FAV_Q=/\b(qual|quais)\b.*\b(favorit\w*|prefer\w*|melhor)\b|\bo que voce (gosta de|curte|costuma) (assistir|ver|ouvir|jogar|ler)\b|\bque tipo de (anime|musica|jogo|filme|serie) voce (gosta|curte)\b/;
const REC_RE=/\b(recomend\w*|indic\w*|sugere|sugira|sugest\w*|me da uma dica de|o que (eu )?(devo|posso) (assistir|jogar|ouvir|ler|ver))\b/;
const INFO_RE=/\b(o que (e|eh|sao)|quem (e|foi|sao)|me (fala|conta|explica|diz)|fala (sobre|de)|conta (sobre|de)|explica|do que (se )?trata|sobre o que|qual (e )?a historia|conhece|sabe (algo|alguma coisa|o que|quem)|ja ouviu falar|me fala mais)\b/;
const OPIN_RE=/\b(voce (gosta|curte|ja (viu|assistiu|jogou|ouviu|leu))|o que (voce )?acha|sua opiniao|e bom|vale a pena|ja (viu|assistiu|jogou|ouviu|leu))\b/;
const LIKE_RE=/\b(eu )?(amo|adoro|gosto|curto|favorit\w*|e o meu|meu preferido|minha preferida)\b/;
const ING_RE=/\b(estou|to|tou|ando|comecei a|terminei de?|acabei de|ontem|hoje)\s+(assistindo|jogando|lendo|ouvindo|assistir|jogar|ler|ouvir|vendo|ver)\b|\b(assisti|joguei|ouvi|li|vi|terminei)\b/;
const Q_BY={a:["Qual é o seu personagem favorito?","Você leu o mangá ou só assistiu?","Qual episódio mais te marcou?"],j:["Qual foi o momento que mais te marcou?","Você joga sozinho ou com amigos?","Qual é a sua parte favorita?"],f:["Qual cena mais te marcou?","Você assistiu no cinema?","Qual é o seu personagem favorito?"],s:["Em qual temporada você está? Sem spoiler!","Tem algum personagem favorito?","O que você tá achando?"],m:["Qual é a sua música preferida?","Você escuta mais em qual momento do dia?"],l:["O que você mais gostou?","Tem algum trecho de que você nunca esqueceu?"]};
const V={a:"assisto",f:"assisto",s:"assisto",j:"jogo",m:"ouço",l:"leio"};
const NEUTRO={a:["Eu conheço [n] pelas histórias que as pessoas me contam, e dá pra entender por que tanta gente gosta.","Do que eu sei de [n], parece muito querido."],f:["Eu 'assisto' do meu jeito, pelas histórias que as pessoas me contam, e [n] aparece sempre.","Dá pra entender por que [n] faz tanto sucesso."],s:["Eu conheço [n] pelas conversas por aí, e parece muito bom.","Dá pra ver por que [n] tem tantos fãs."],j:["[n] é conhecido de muita gente. Eu 'jogo' do meu jeito, pelas histórias dos jogadores.","Do que eu sei de [n], parece muito divertido."],m:["Eu adoro música, e [n] aparece sempre nas conversas.","Pelo que eu sei, [n] é muito querido."],l:["Eu amo histórias, e [n] é conhecido por aí.","Dá pra entender por que [n] marcou tanta gente."]};
const GOSTO={1:["Eu gosto muito de [n]!","[n] é um dos meus preferidos.","Eu adoro [n]!"],2:["[n] é um dos meus favoritos de todos!","Eu amo [n], sério!"]};

function ask(text,toks,ctx){
  const norm=toks.join(" "),ty=typeOf(norm);
  // continuação de recomendação: "e um filme?", "outro", "mais um"
  if(ctx&&ctx.recType&&toks.length<=5&&(/^(e |me da |me indica |quero )?(um |uma |algum |alguma )?(outro|outra|mais um|mais uma)\b/.test(norm)||(toks[0]==="e"&&ty)))
    return{kind:"rec",type:ty||ctx.recType,tags:ty?[]:(ctx.recTags||[])};
  if(FAV_Q.test(norm)&&/\b(seu|sua|teu|tua|voce)\b/.test(norm)){
    const fp=norm.match(FAVP_RE);if(fp&&FAVP[fp[1]])return{kind:"favp",text:FAVP[fp[1]][0]};
    return{kind:"fav",type:ty};
  }
  if(REC_RE.test(norm))return{kind:"rec",type:ty||(ctx&&ctx.recType)||null,tags:tagsOf(norm)};
  const ent=find(toks);
  if(!ent){
    if(ctx&&ctx.recPending&&ty)return{kind:"rec",type:ty,tags:tagsOf(norm)};
    return null;
  }
  const like=LIKE_RE.test(norm);
  if(INFO_RE.test(norm))return{kind:"info",ent};
  if(OPIN_RE.test(norm))return{kind:"opinion",ent};
  if(like||ING_RE.test(norm))return{kind:"mention",ent,like};
  if(toks.length<=4)return{kind:"mention",ent,like:false};
  return CUE.test(norm)?{kind:"info",ent}:null;
}
const fill=(s,e)=>s.replace(/\[n\]/g,e.n.replace(/!+$/,""));
function opinion(e){
  const o=e.f>=1?rp(GOSTO[e.f]):rp(NEUTRO[e.t]);
  return fill(o,e)+" "+(e.x&&e.f>=1?e.x:e.d);
}
function recommend(res,seen){
  seen=seen||new Set();
  let pool=ENT.filter(e=>(!res.type||e.ts.includes(res.type))&&!seen.has(e.n));
  if(res.tags&&res.tags.length){
    const strict=pool.filter(e=>res.tags.every(t=>e.g.has(t))),loose=pool.filter(e=>res.tags.some(t=>e.g.has(t)));
    if(strict.length)pool=strict;else if(loose.length)pool=loose;
  }
  if(!pool.length)return null;
  const fav=pool.filter(e=>e.f>=1),src=(fav.length&&Math.random()<.5)?fav:pool;
  return src[Math.floor(Math.random()*src.length)];
}
function reply(res,o){
  o=o||{};
  switch(res.kind){
    case"favp":return res.text;
    case"fav":{
      const list=ENT.filter(e=>e.f===2&&(!res.type||e.ts.includes(res.type))).sort((a,b)=>(b.t===res.type)-(a.t===res.type));
      if(res.type&&list.length){const e=list[0];return `Difícil escolher, mas hoje eu fico com ${e.n}. ${e.x||e.d} E você, qual é o seu?`}
      const picks=ENT.filter(e=>e.f===2).map(e=>`${e.n} (${TYPES[e.t]})`);
      return "Tenho muitos favoritos, mas os que mais me tocam são "+picks.slice(0,-1).join(", ")+" e "+picks[picks.length-1]+". E você, o que tem curtido?";
    }
    case"rec":{
      if(!res.type)return null;
      const e=recommend(res,o.seen);
      if(!e)return "Já te indiquei tudo que eu lembro disso! Quer que eu sugira de outro tipo?";
      if(o.seen)o.seen.add(e.n);
      return `Que tal ${e.n}? ${e.d} ${rp(["Se não curtir, me pede outra!","Já conhece?","Me conta o que achar depois!"])}`;
    }
    case"info":return res.ent.d;
    case"opinion":return opinion(res.ent)+" "+rp(Q_BY[res.ent.t]);
    case"mention":{
      const e=res.ent;
      const first=e.f>=1?fill(rp(["[n]! Esse eu amo também!","Ah, [n]! Eu gosto muito!","[n], que ótimo!"]),e):fill(rp(["[n]! Conheço de ouvir falar, e dizem que é muito bom.","[n]! Que legal!","Olha só, [n]! Parece incrível."]),e);
      return first+" "+rp(Q_BY[e.t]);
    }
  }
  return null;
}
const api={version:"1.0",ENT,TYPES,ask,find,reply,recommend,more:e=>e.x||null,V,N};
root.Culture=api;
if(typeof module!=="undefined"&&module.exports)module.exports=api;
})(typeof window!=="undefined"?window:globalThis);
