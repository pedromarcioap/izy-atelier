import { Lesson, CommunityPost, ArtistProfile, ArtworkAnalysisResult } from '../types';

export const SAMPLE_ARTWORKS = [
  {
    id: 'art-dutch-floral-still-life',
    title: 'Natureza Morta Floral Flamenga & Frutas em Vaso de Vidro',
    medium: 'Óleo sobre Tela (Escola Flamenga / Holandesa)',
    category: 'Natureza Morta / Flores',
    timeSpentMinutes: 90,
    imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1000&q=80',
    prompt: 'Composição barroca floral com rosas, lírios, peônias, pêssegos, cerejas e vaso de vidro transparente sobre fundo escuro chiaroscuro.',
    defaultAnalysis: {
      overallScore: 92,
      technicalSummary: 'Composição barroca de maestria com iluminação chiaroscuro dramática. Excelente tratamento de transparência e refração no vaso de vidro com hastes submersas, peônia central como ímã focal e pêssego com oclusão suave ancorando o plano de apoio.',
      artStyleDetected: 'Pintura Barroca Holandesa (Rachel Ruysch / Jan van Huysum)',
      mediumDetected: 'Óleo sobre Tela Tradicional',
      subjectDetected: 'Natureza Morta Floral Barroca & Frutas em Vaso de Vidro',
      subjectCategory: 'objeto_natureza_morta',
      rubrics: {
        proportionAnatomy: {
          score: 93,
          level: 'Maestria',
          strengths: [
            'Composição piramidal clássica equilibrando o peso visual das peônias e lírios com as frutas no plano inferior.',
            'Escala e distribuição harmônica entre o vaso de vidro de sustentação e a coroa floral exuberante.'
          ],
          deviations: [
            'A haste do lírio alaranjado superior projeta-se sutilmente próxima da margem superior da tela.'
          ],
          technicalDiagnosis: 'Equilíbrio visual impecável de massas botânicas em arranjo dinâmico assimétrico.',
          recommendedDrill: 'Exercício de blocagem de massas florais e distribuição de peso visual em arranjos assimétricos.'
        },
        perspectiveFraming: {
          score: 90,
          level: 'Avançado',
          strengths: [
            'Plano horizontal da mesa estabelecido com firmeza pela ancoragem das frutas e sombra de contato do vaso.',
            'Sobreposição contínua de planos (pétalas frontais cobrindo hastes posteriores) gerando profundidade cênica palpável.'
          ],
          deviations: [
            'A elipse do bocal do vaso de vidro poderia apresentar curvatura ligeiramente mais aberta para o observador.'
          ],
          technicalDiagnosis: 'Profundidade atmosférica convincente com gradação de nitidez do primeiro ao terceiro plano.',
          recommendedDrill: 'Estudo de elipses cilíndricas em recipientes transparentes sob ângulo de 30 graus.'
        },
        tonalValuesLighting: {
          score: 95,
          level: 'Maestria',
          strengths: [
            'Chiaroscuro magistral: pétalas claras e frutos iluminados com valores 8 e 9 saltam contra a penumbra profunda do fundo.',
            'Reflexo especular (highlight) na curvatura do vaso simulando a janela do ateliê holandês.',
            'Refração cristalina da água no vidro com distorção ótica realista das hastes verdes.'
          ],
          deviations: [
            'Oclusão na fenda sob o pêssego central poderia ter 5% mais profundidade de valor 9.'
          ],
          technicalDiagnosis: 'Domínio absoluto da escala de 9 valores com transições aveludadas e highlights pontuais.',
          recommendedDrill: 'Estudo em chave tonal baixa (low-key) com 1 única fonte de luz lateral direcional.'
        },
        lineGestureTexture: {
          score: 92,
          level: 'Maestria',
          strengths: [
            'Diferenciação tátil extraordinária entre as pétalas acetinadas, a pele aveludada do pêssego e a dureza reflexiva do vidro.',
            'Pincelada minuciosa nas nervuras das folhas, asas de insetos e gotas de orvalho.'
          ],
          deviations: [
            'Haste secundária no canto esquerdo com traçado ligeiramente uniforme.'
          ],
          technicalDiagnosis: 'Pincelada invisível e texturas de alta verossimilhança botânica.',
          recommendedDrill: 'Pintura de texturas contrastantes: superfícies foscas vs reflexivas em close-up.'
        },
        colorComposition: {
          score: 94,
          level: 'Maestria',
          strengths: [
            'Ponto focal dominante na peônia rosa/branca central, atraindo o olhar imediatamente.',
            'Harmonia entre cores quentes (pêssego, lírio abóbora) e tons frios (vidro azulado e folhagens verde-musgo).'
          ],
          deviations: [
            'Pequena flor azul no canto inferior direito compete timidamente com as cerejas.'
          ],
          technicalDiagnosis: 'Composição cromática rica e contrapesada com iluminação unificada.',
          recommendedDrill: 'Estudos de paleta restrita (Zorn Palette) adaptada a naturezas mortas.'
        }
      },
      overlays: {
        horizonLine: { yPercent: 76, tiltAngleDeg: 0, label: 'Plano da Mesa // Horizonte (76%)' },
        vanishingPoints: [
          { xPercent: -15, yPercent: 76, type: 'left', label: 'Fuga da Mesa (Esq)' },
          { xPercent: 115, yPercent: 76, type: 'right', label: 'Fuga da Mesa (Dir)' }
        ],
        landmarks: [
          { id: 'fl-axis', label: 'Eixo Vertical de Equilíbrio Botânico', type: 'symmetry_axis', xPercent: 49, yPercent: 50, description: 'Eixo condutor da massa floral' },
          { id: 'fl-apex', label: 'Ápice da Pirâmide Floral (Lírios)', type: 'apex_height', yPercent: 18, description: 'Topo da composição botânica' },
          { id: 'fl-focal', label: 'Ponto Focal Primário (Peônia Central)', type: 'third_horizontal', yPercent: 48, description: 'Centro de gravidade óptico e máxima luminosidade' },
          { id: 'fl-table', label: 'Plano da Mesa / Base do Vaso de Vidro', type: 'base_rim', yPercent: 76, description: 'Plano de apoio horizontal e oclusão do vidro e frutos' }
        ],
        annotations: [
          {
            id: 'anno-flower-1',
            xPercent: 50,
            yPercent: 48,
            category: 'valor',
            title: 'Ponto Focal Primário: Peônia & Chiaroscuro',
            critique: 'A peônia branca e rosada central atua como o principal ímã visual da obra. A iluminação de valores altos (8-9) salta contra o fundo em chiaroscuro dramático.',
            correctionSuggestion: 'Excelente calibração de valores. As transições de pétalas preservam suavidade volumétrica exemplar.',
            severity: 'sugestao'
          },
          {
            id: 'anno-flower-2',
            xPercent: 52,
            yPercent: 74,
            category: 'proporcao',
            title: 'Refração e Transparência no Vaso de Vidro',
            critique: 'O bojo do vidro refrata a água com distorção ótica verossímil das hastes submersas e reflexo especular de janela de ateliê.',
            correctionSuggestion: 'A ancoragem do vaso sobre o tampo transmite solidez física e peso material.',
            severity: 'sugestao'
          },
          {
            id: 'anno-flower-3',
            xPercent: 41,
            yPercent: 82,
            category: 'valor',
            title: 'Oclusão e Textura do Pêssego',
            critique: 'O pêssego repousado na base possui sombra de oclusão ambiental bem calibrada, sem contornos pretos duros.',
            correctionSuggestion: 'A penugem da casca estabelece um contraste tátil perfeito com a superfície fria do vidro.',
            severity: 'sugestao'
          },
          {
            id: 'anno-flower-4',
            xPercent: 64,
            yPercent: 28,
            category: 'traco',
            title: 'Ritmo Dinâmico das Hastes e Lírios',
            critique: 'As hastes superiores e flores menores conduzem o olhar em espiral fluida, evitando rigidez ou simetria artificial.',
            correctionSuggestion: 'As bordas perdidas (lost edges) na penumbra do fundo valorizam o ar e a atmosfera.',
            severity: 'sugestao'
          }
        ],
        tonalHistogramSummary: {
          shadows: 48,
          midtones: 36,
          highlights: 16,
          dominantKey: 'Chave Baixa (Low Key)'
        }
      },
      actionPlan: {
        immediateCorrection: 'Reforçar sutilmente a oclusão ambiental no ponto exato de contato da base do pêssego com o tampo da mesa.',
        nextStudyExercise: 'Estudo de refração de recipientes de vidro com água e objetos imersos sob luz pontual.',
        suggestedClassId: 'lesson-values',
        practiceDurationMinutes: 60
      }
    } as ArtworkAnalysisResult
  },
  {
    id: 'art-loomis-portrait',
    title: 'Estudo de Cabeça - Método Loomis',
    medium: 'Grafite 2B & 4B no Papel Canson 180g',
    category: 'Anatomia',
    timeSpentMinutes: 55,
    imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1000&q=80',
    prompt: 'Construção da esfera craniana, corte lateral e divisão dos três terços da face.',
    defaultAnalysis: {
      overallScore: 84,
      technicalSummary: 'Sólida compreensão da esfera craniana com linhas de corte laterais bem posicionadas. Pequena compressão no terço inferior (distância entre a base do nariz e o mento).',
      artStyleDetected: 'Desenho Acadêmico / Estudo de Construção',
      mediumDetected: 'Grafite Tradicional',
      subjectDetected: 'Retrato Acadêmico & Cabeça Humana (Método Loomis)',
      subjectCategory: 'rosto_retrato',
      rubrics: {
        proportionAnatomy: {
          score: 82,
          level: 'Sólido',
          strengths: [
            'Arco zigomático alinhado com a linha dos olhos e topo da orelha.',
            'Esfera craniana mantém volume tridimensional crível.'
          ],
          deviations: [
            'O terço inferior da face apresenta 8% de encurtamento em relação à proporção áurea de Loomis.',
            'Largura entre as órbitas oculares levemente estreita.'
          ],
          technicalDiagnosis: 'A proporção dos terços faciais (fronte, nariz, queixo) teve um leve descompasso no terço inferior.',
          recommendedDrill: 'Série de 10 crânios simplificados focando apenas na divisão das marcas axiais.'
        },
        perspectiveFraming: {
          score: 88,
          level: 'Avançado',
          strengths: [
            'Linha de visão ligeiramente em contra-plongée respeitada nos eixos da mandíbula.',
            'Círculo de corte lateral acompanha a rotação correta em 3/4.'
          ],
          deviations: [
            'A linha da arcada dentária superior poderia convergir com maior firmeza para o horizonte.'
          ],
          technicalDiagnosis: 'Orientação espacial do bloco craniano consistente e volumétrica.',
          recommendedDrill: 'Caixas em perspectiva com círculos inscritos em 3 ângulos extremos.'
        },
        tonalValuesLighting: {
          score: 79,
          level: 'Em Desenvolvimento',
          strengths: [
            'Sombra projetada sob o queixo bem demarcada (form shadow vs cast shadow).'
          ],
          deviations: [
            'Contraste tímido na cavidade ocular esquerda, gerando perda de profundidade.',
            'Falta um valor de oclusão escuro (Dark Accent) nos cantos dos lábios e narinas.'
          ],
          technicalDiagnosis: 'A faixa de valores ficou concentrada nos cinzas médios (tons 3 a 5 na escala de 9 valores de Denman Ross).',
          recommendedDrill: 'Estudo em 3 valores absolutos (branco do papel, cinza 50% e grafite 8B no preto).'
        },
        lineGestureTexture: {
          score: 87,
          level: 'Avançado',
          strengths: [
            'Traço com boa continuidade e firmeza nas linhas estruturais de construção.',
            'Transição limpa entre linhas de busca e linhas de contorno final.'
          ],
          deviations: [
            'Hachuras cruzadas na têmpora com direções discordantes do volume anatômico.'
          ],
          technicalDiagnosis: 'Linhas com autoridade e peso adequado para desenho técnico.',
          recommendedDrill: 'Prática de hachuras em curva contornando cilindros (cross-contour lines).'
        },
        colorComposition: {
          score: 85,
          level: 'Sólido',
          strengths: [
            'Enquadramento centralizado clássico de prancheta de ateliê.',
            'Balanço equilibrado de respiro nas margens laterais.'
          ],
          deviations: [
            'Poderia incluir notas de margem para reforçar o caráter de estudo sistemático.'
          ],
          technicalDiagnosis: 'Composição de estudo acadêmico limpa e legível.',
          recommendedDrill: 'Estudos de thumbnail com variação de escala dentro da página.'
        }
      },
      overlays: {
        horizonLine: { yPercent: 44, tiltAngleDeg: 1.5, label: 'Nível dos Olhos // Horizonte (44%)' },
        vanishingPoints: [
          { xPercent: -20, yPercent: 44, type: 'left', label: 'VP1 (Esquerda)' },
          { xPercent: 125, yPercent: 45, type: 'right', label: 'VP2 (Direita)' }
        ],
        landmarks: [
          { id: 'brow', label: 'Linha dos Supercílios (1/3)', type: 'loomis_brow', yPercent: 36, description: 'Eixo base da fronte' },
          { id: 'nose', label: 'Base do Nariz (2/3)', type: 'loomis_nose', yPercent: 52, description: 'Ponto divisor da cartilagem nasal' },
          { id: 'chin', label: 'Base do Queixo (3/3)', type: 'loomis_chin', yPercent: 68, description: 'Mento inferior' }
        ],
        annotations: [
          {
            id: 'anno-1',
            xPercent: 51,
            yPercent: 68,
            category: 'proporcao',
            title: 'Desvio de Altura no Mento',
            critique: 'O terço inferior está aproximadamente 4mm menor que o terço mediano.',
            correctionSuggestion: 'Estenda a linha do maxilar inferior para igualar os três terços de Loomis.',
            severity: 'ajuste_fino'
          },
          {
            id: 'anno-2',
            xPercent: 40,
            yPercent: 48,
            category: 'valor',
            title: 'Sombra de Oclusão Ausente',
            critique: 'A transição sob a asa do nariz precisa de um ponto de valor 8 ou 9.',
            correctionSuggestion: 'Aplique grafite 4B ou 6B na fenda nasal para criar ancoragem espacial.',
            severity: 'sugestao'
          },
          {
            id: 'anno-3',
            xPercent: 62,
            yPercent: 38,
            category: 'perspectiva',
            title: 'Linha do Plano Temporal',
            critique: 'O plano lateral do crânio está ligeiramente aberto demais para a angulação da testa.',
            correctionSuggestion: 'Feche 2 graus no arco zigomático direito para convergir com o horizonte.',
            severity: 'sugestao'
          }
        ],
        tonalHistogramSummary: {
          shadows: 22,
          midtones: 60,
          highlights: 18,
          dominantKey: 'Chave Média'
        }
      },
      actionPlan: {
        immediateCorrection: 'Ajustar a distância vertical do lábio inferior até a base da mandíbula em +5%.',
        nextStudyExercise: 'Desenhar 12 cabeças simplificadas de Loomis sob ângulos variados com temporizador de 5 minutos.',
        suggestedClassId: 'lesson-loomis',
        practiceDurationMinutes: 45
      }
    } as ArtworkAnalysisResult
  },
  {
    id: 'art-perspective-boxes',
    title: 'Construção de Cenário e Blocos em 2 Pontos',
    medium: 'Nanquim e Caneta Fineliner 0.3 / 0.5',
    category: 'Perspectiva',
    timeSpentMinutes: 40,
    imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1000&q=80',
    prompt: 'Exercício de convergência ortogonal com múltiplos prismas retangulares acima e abaixo do horizonte.',
    defaultAnalysis: {
      overallScore: 91,
      technicalSummary: 'Excelente precisão geométrica e rigor nas convergências. Linhas ortogonais apontam perfeitamente para os pontos de fuga nos eixos primários.',
      artStyleDetected: 'Desenho Arquitetônico / Construtivo',
      mediumDetected: 'Nanquim sobre Papel Técnico',
      subjectDetected: 'Construção de Prismas & Caixas em Perspectiva',
      subjectCategory: 'cenario_perspectiva',
      rubrics: {
        proportionAnatomy: {
          score: 90,
          level: 'Avançado',
          strengths: ['Relações de escala entre os cubos mantêm escala crível.'],
          deviations: ['Leve distorção ótica nos blocos mais próximos da borda esquerda.'],
          technicalDiagnosis: 'Escala e dimensões tridimensionais bem calibradas.',
          recommendedDrill: 'Introdução de cilindros e cones inscritos nas caixas.'
        },
        perspectiveFraming: {
          score: 94,
          level: 'Maestria',
          strengths: [
            'Convergência impecável das arestas superiores e inferiores para a linha do horizonte.',
            'Diferenciação clara entre visão normal e visão aérea.'
          ],
          deviations: ['Um dos blocos menores teve a linha posterior traçada com leve desvio de 1 grau.'],
          technicalDiagnosis: 'Domínio absoluto da mecânica de dois pontos de fuga.',
          recommendedDrill: 'Exercício com 3 pontos de fuga (incluindo zênite ou nadir).'
        },
        tonalValuesLighting: {
          score: 83,
          level: 'Sólido',
          strengths: ['Hachura direcional nos planos de sombra estabelece direção de luz coerente.'],
          deviations: ['Falta luz refletida sutil no plano sombreado do prisma maior.'],
          technicalDiagnosis: 'Luz primária bem definida a 45 graus superior esquerda.',
          recommendedDrill: 'Estudos de caixas iluminadas com fontes pontuais vs luz difusa.'
        },
        lineGestureTexture: {
          score: 92,
          level: 'Maestria',
          strengths: ['Traço contínuo com "ghosting" preliminar visível e peso diferenciado nos contornos externos.'],
          deviations: ['Pequenos pontos de sangramento de tinta na junção de três vértices.'],
          technicalDiagnosis: 'Uso profissional de espessura de linha (line weight) para indicar proximidade.',
          recommendedDrill: 'Linhas elípticas à mão livre sem régua.'
        },
        colorComposition: {
          score: 86,
          level: 'Sólido',
          strengths: ['Ritmo visual gerado pela alternância de volumes vazios e maciços.'],
          deviations: ['O centro de interesse poderia ter maior densidade de detalhes gráficos.'],
          technicalDiagnosis: 'Organização espacial equilibrada com ritmo formal.',
          recommendedDrill: 'Montagem de cena urbana simplificada baseada na mesma grade.'
        }
      },
      overlays: {
        horizonLine: { yPercent: 50, tiltAngleDeg: 0 },
        vanishingPoints: [
          { xPercent: 5, yPercent: 50, type: 'left', label: 'VP1' },
          { xPercent: 95, yPercent: 50, type: 'right', label: 'VP2' }
        ],
        landmarks: [
          { id: 'h1', label: 'Linha do Horizonte (Eye Level)', type: 'third_horizontal', yPercent: 50, description: 'Nível dos olhos do observador' }
        ],
        annotations: [
          {
            id: 'anno-box-1',
            xPercent: 28,
            yPercent: 42,
            category: 'perspectiva',
            title: 'Convergência Exata',
            critique: 'Arestas convergem com 99.2% de precisão para o ponto de fuga esquerdo.',
            correctionSuggestion: 'Excelente aplicação das retas de apoio.',
            severity: 'sugestao'
          },
          {
            id: 'anno-box-2',
            xPercent: 70,
            yPercent: 65,
            category: 'traco',
            title: 'Espessura de Linha (Line Weight)',
            critique: 'O contorno inferior direito poderia ser 20% mais grosso para enfatizar o peso no solo.',
            correctionSuggestion: 'Passe a caneta 0.8 na base de contato com o solo.',
            severity: 'ajuste_fino'
          }
        ]
      },
      actionPlan: {
        immediateCorrection: 'Reforçar com linha pesada a base de contato dos prismas no chão.',
        nextStudyExercise: 'Construir 5 caixas em perspectiva de 3 pontos com visão em ângulo de pássaro.',
        suggestedClassId: 'lesson-perspective',
        practiceDurationMinutes: 40
      }
    } as ArtworkAnalysisResult
  },
  {
    id: 'art-still-life-values',
    title: 'Estudo de Valores Tonais - Natureza Morta',
    medium: 'Pintura Digital (Procreate / Pincel Opaco)',
    category: 'Luz e Valores',
    timeSpentMinutes: 70,
    imageUrl: 'https://images.unsplash.com/photo-1578925518470-4def7a0f08bb?auto=format&fit=crop&w=1000&q=80',
    prompt: 'Estudo em escala tonal de 5 valores para entender forma, penumbra e luz refletida.',
    defaultAnalysis: {
      overallScore: 86,
      technicalSummary: 'Boa separação entre a família de luzes e a família de sombras. A oclusão ambiental está bem dosada, evitando o efeito de contorno escuro.',
      artStyleDetected: 'Pintura Direta (Alla Prima Digital)',
      mediumDetected: 'Digital / Pincel de Cerda Óleo',
      subjectDetected: 'Natureza Morta & Objetos Cilíndricos',
      subjectCategory: 'objeto_natureza_morta',
      rubrics: {
        proportionAnatomy: {
          score: 85,
          level: 'Sólido',
          strengths: ['Elipses dos objetos circulares bem ajustadas ao ângulo de visão.'],
          deviations: ['O vaso cilíndrico tem o bordo superior ligeiramente assimétrico.'],
          technicalDiagnosis: 'Formas primárias bem blocadas.',
          recommendedDrill: 'Desenho de garrafas e vasos com eixo de simetria central.'
        },
        perspectiveFraming: {
          score: 84,
          level: 'Sólido',
          strengths: ['A mesa se prolonga no plano horizontal de forma consistente.'],
          deviations: ['A profundidade da sombra projetada no fundo destoa um pouco do plano de parede.'],
          technicalDiagnosis: 'Espaço cênico convincente.',
          recommendedDrill: 'Estudo de planos de apoio e projeção de sombras elípticas.'
        },
        tonalValuesLighting: {
          score: 92,
          level: 'Maestria',
          strengths: [
            'Respeito rigoroso à regra "não clareie as sombras nem escureça as luzes".',
            'Luz refletida nunca compete em brilho com o meio-tom iluminado.',
            'Terminador de sombra (terminator) com borda suave na esfera e firme no cubo.'
          ],
          deviations: ['O ponto de brilho especular (highlight) poderia ser mais pontual e denso.'],
          technicalDiagnosis: 'Compreensão de iluminação física e hierarquia de valores exemplar.',
          recommendedDrill: 'Estudo em chave alta com gama limitada a 30% de contraste.'
        },
        lineGestureTexture: {
          score: 82,
          level: 'Sólido',
          strengths: ['Pinceladas visíveis transmitem peso e matéria escultórica.'],
          deviations: ['Algumas bordas ficaram excessivamente recortadas (lost edges ausentes).'],
          technicalDiagnosis: 'Tratamento de bordas funcional, com espaço para bordas perdidas.',
          recommendedDrill: 'Exercício de transição de bordas: Dura, Firme, Suave e Perdida.'
        },
        colorComposition: {
          score: 88,
          level: 'Avançado',
          strengths: ['Equilíbrio harmônico de massas tonais segundo a proporção de Munsell.'],
          deviations: ['Área de luz no canto superior direito poderia ser amortecida.'],
          technicalDiagnosis: 'Contraste intencional direcionando o olhar para a maçã no centro.',
          recommendedDrill: 'Composição de natureza morta com objetos de diferentes albedos (branco vs preto).'
        }
      },
      overlays: {
        annotations: [
          {
            id: 'anno-still-1',
            xPercent: 48,
            yPercent: 55,
            category: 'valor',
            title: 'Terminador de Sombra Preciso',
            critique: 'O terminador respeita a curvatura volumétrica sem salto brusco de tom.',
            correctionSuggestion: 'Mantenha essa consistência de valor.',
            severity: 'sugestao'
          },
          {
            id: 'anno-still-2',
            xPercent: 62,
            yPercent: 48,
            category: 'valor',
            title: 'Borda Dura Excessiva (Hard Edge)',
            critique: 'A borda entre o objeto e o fundo perdeu a transição atmosférica suave.',
            correctionSuggestion: 'Aplique um esfumado ou borda perdida (lost edge) com opacidade 30%.',
            severity: 'ajuste_fino'
          }
        ],
        tonalHistogramSummary: {
          shadows: 35,
          midtones: 45,
          highlights: 20,
          dominantKey: 'Chave Média'
        }
      },
      actionPlan: {
        immediateCorrection: 'Suavizar a borda lateral do objeto contra o fundo escuro para criar profundidade.',
        nextStudyExercise: 'Pintar o mesmo arranjo em chave tonal baixa (low-key) com 1 única fonte de luz.',
        suggestedClassId: 'lesson-values',
        practiceDurationMinutes: 60
      }
    } as ArtworkAnalysisResult
  },
  {
    id: 'art-crown-study',
    title: 'Estudo Estrutural de Coroa Imperial & Elipses',
    medium: 'Grafite 2B e Caneta Nanquim sobre Papel Bristol',
    category: 'Objeto / Simetria',
    timeSpentMinutes: 50,
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1000&q=80',
    prompt: 'Construção de elipses de base, eixos de simetria axial bilateral e pontas ornamentais de coroa metálica.',
    defaultAnalysis: {
      overallScore: 88,
      technicalSummary: 'Excelente simetria axial na construção da coroa. O aro de base mantém uma elipse estável com perspectiva cilíndrica convincente e boa distribuição de peso nas pontas ornamentais.',
      artStyleDetected: 'Desenho Construtivo de Objeto / Ourivesaria',
      mediumDetected: 'Grafite e Nanquim Tradicional',
      subjectDetected: 'Coroa Imperial & Objeto Tridimensional de Metal',
      subjectCategory: 'objeto_natureza_morta',
      rubrics: {
        proportionAnatomy: {
          score: 87,
          level: 'Avançado',
          strengths: [
            'Simetria bilateral das cúspides da coroa espelhadas no eixo vertical central.',
            'Proporção correta entre a largura do aro cilíndrico de base e a altura do arco frontal.',
            'Espaçamento rítmico e harmônico dos ornamentos e engastes de gemas.'
          ],
          deviations: [
            'Leve desvio angular de 3% no arco da ponta lateral direita em comparação à ponta esquerda.',
            'O aro posterior poderia revelar ligeiramente mais espessura da parede interna.'
          ],
          technicalDiagnosis: 'A peça foi construída com sólida geometria de suporte (cilindro e eixos de espelhamento), sem achatar a curvatura volumétrica.',
          recommendedDrill: 'Série de 8 estudos de elipses concêntricas em perspectiva aplicadas a cálices e coroas cilíndricas.'
        },
        perspectiveFraming: {
          score: 89,
          level: 'Avançado',
          strengths: [
            'Abertura da elipse do aro inferior compatível com observador em ligeiro plongée (visão ligeiramente de cima).',
            'Convergência crível dos eixos verticais das hastes metálicas.'
          ],
          deviations: [
            'Pequena curvatura excessiva nos cantos externos da elipse inferior (evitar pontas afiadas na elipse).'
          ],
          technicalDiagnosis: 'Perspectiva cilíndrica com linhas de guia ortogonais bem aplicadas.',
          recommendedDrill: 'Desenho de coroas e anéis inscritos em caixas com pontos de fuga externos.'
        },
        tonalValuesLighting: {
          score: 86,
          level: 'Sólido',
          strengths: [
            'Highlights brancos nítidos indicando brilho especular característico de ouro e metal polido.',
            'Sombra de oclusão profunda sob a base do aro ancorando o objeto na superfície.'
          ],
          deviations: [
            'Falta um gradiente suave de meio-tom na face interna côncava da coroa.'
          ],
          technicalDiagnosis: 'Tratamento de materiais metálicos com bom contraste entre valores extremos (1 e 9).',
          recommendedDrill: 'Renderização de esferas e tubos de latão/ouro com transições de valor em 5 etapas.'
        },
        lineGestureTexture: {
          score: 90,
          level: 'Avançado',
          strengths: [
            'Linha de contorno externa reforçada conferindo peso e presença tridimensional à joia.',
            'Precisão nas micro-linhas dos arabescos e filigranas.'
          ],
          deviations: [
            'Hesitação leve no traçado do arco da cúpula central.'
          ],
          technicalDiagnosis: 'Line weight variado transmitindo solidez e detalhamento ornamental refinado.',
          recommendedDrill: 'Exercício de traço contínuo para arabescos e volutas sem tirar a ponta do papel.'
        },
        colorComposition: {
          score: 88,
          level: 'Avançado',
          strengths: [
            'Centralização monumental clássica de estudos de ateliê e ornatos históricos.',
            'Excelente aproveitamento do espaço negativo como moldura de respiro.'
          ],
          deviations: [
            'Poderia incluir anotações de cota ou estudos de detalhe na margem da prancheta.'
          ],
          technicalDiagnosis: 'Enquadramento focado e imponente, condizente com iconografia clássica.',
          recommendedDrill: 'Thumbnail de composição inserindo a coroa sobre almofada de veludo ou pedestal.'
        }
      },
      overlays: {
        horizonLine: { yPercent: 48, tiltAngleDeg: 0 },
        vanishingPoints: [
          { xPercent: -30, yPercent: 48, type: 'left', label: 'VP1' },
          { xPercent: 130, yPercent: 48, type: 'right', label: 'VP2' }
        ],
        landmarks: [
          { id: 'crown-sym', label: 'Eixo Central de Simetria', type: 'symmetry_axis', yPercent: 50, xPercent: 50, description: 'Eixo vertical de espelhamento bilateral' },
          { id: 'crown-apex', label: 'Linha dos Ápices / Pontas da Coroa', type: 'apex_height', yPercent: 30, description: 'Altura máxima das cúspides ornamentais' },
          { id: 'crown-base', label: 'Aro da Base / Elipse Inferior', type: 'base_rim', yPercent: 72, description: 'Curvatura cilíndrica de sustentação do aro' }
        ],
        annotations: [
          {
            id: 'anno-crown-1',
            xPercent: 50,
            yPercent: 30,
            category: 'proporcao',
            title: 'Ápice da Cúpula Central',
            critique: 'O alinhamento vertical está calibrado com 98% de precisão no centro óptico da base.',
            correctionSuggestion: 'Mantenha a cruzeta ou gema central alinhada com o ponto médio do aro.',
            severity: 'sugestao'
          },
          {
            id: 'anno-crown-2',
            xPercent: 74,
            yPercent: 42,
            category: 'proporcao',
            title: 'Simetria da Ponta Lateral Direita',
            critique: 'A ponta lateral direita está 3% mais aberta em curvatura do que a ponta lateral esquerda correspondente.',
            correctionSuggestion: 'Espelhe o arco da cúspide esquerda com compasso de proporção ou linha de busca.',
            severity: 'ajuste_fino'
          },
          {
            id: 'anno-crown-3',
            xPercent: 50,
            yPercent: 72,
            category: 'perspectiva',
            title: 'Elipse do Aro da Base',
            critique: 'A curvatura inferior deve desenhar uma elipse contínua sem cantos pontiagudos nas extremidades.',
            correctionSuggestion: 'Arredonde suavemente as transições laterais do aro para evitar o efeito bico.',
            severity: 'sugestao'
          },
          {
            id: 'anno-crown-4',
            xPercent: 36,
            yPercent: 52,
            category: 'valor',
            title: 'Brilho Especular Metálico (Highlight)',
            critique: 'Reflexo de luz de alto contraste excelente demarcando a curvatura cilíndrica do ouro polido.',
            correctionSuggestion: 'Preserve o branco puro do papel no ponto culminante do brilho.',
            severity: 'sugestao'
          }
        ],
        tonalHistogramSummary: {
          shadows: 28,
          midtones: 50,
          highlights: 22,
          dominantKey: 'Chave Média'
        }
      },
      actionPlan: {
        immediateCorrection: 'Ajustar a inclinação da ponta direita para igualar a curvatura bilateral da cúspide esquerda.',
        nextStudyExercise: 'Desenhar 6 estudos rápidos de elipses cilíndricas concêntricas e superfícies metálicas reflexivas.',
        suggestedClassId: 'lesson-perspective',
        practiceDurationMinutes: 45
      }
    } as ArtworkAnalysisResult
  }
];

export const CURATED_LESSONS: Lesson[] = [
  {
    id: 'lesson-loomis',
    title: 'O Método Loomis: Construção da Cabeça e Proporção Facial',
    instructor: 'Stan Prokopenko',
    instructorTitle: 'Instrutor de Anatomia e Fundador da Proko',
    durationMinutes: 18,
    level: 'Iniciante',
    category: 'Anatomia',
    youtubeId: '1EPNYWeEf1U',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
    summary: 'Aprenda a decompor o crânio em uma esfera tridimensional, realizar os cortes laterais e medir com exatidão os três terços anatômicos da face em qualquer angulação espacial.',
    keyTakeaways: [
      'A esfera craniana tem suas laterais achatadas por planos paralelos.',
      'A linha das sobrancelhas, base do nariz e queixo dividem o rosto em três medidas equivalentes.',
      'O corte lateral define o plano temporal e posiciona o topo da orelha na altura dos supercílios.'
    ],
    practicalExercise: {
      title: 'Prática de 10 Cabeças em 3/4',
      prompt: 'Desenhe 10 crânios simplificados pelo método Loomis, variando a inclinação para cima e para baixo. Tire uma foto e envie para o Estúdio AI para validar suas linhas axiais.',
      recommendedTime: '45 minutos',
      rubricTarget: 'Proporção & Anatomia (meta: > 80 pontos)'
    }
  },
  {
    id: 'lesson-perspective',
    title: 'Perspectiva Espacial: Pontos de Fuga e Caixas no Espaço',
    instructor: 'Moderndayjames',
    instructorTitle: 'Artista Conceitual e Educador de Fundamentos',
    durationMinutes: 24,
    level: 'Intermediário',
    category: 'Perspectiva',
    youtubeId: 'qOEjPvi_E0g',
    thumbnailUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80',
    summary: 'Domine a convergência ortogonal e a ilusão de profundidade tridimensional em superfícies bidimensionais. Como posicionar a linha do horizonte e evitar distorções do cone de visão.',
    keyTakeaways: [
      'A linha do horizonte sempre corresponde exatamente à altura dos olhos do observador.',
      'Todos os planos paralelos convergem para o mesmo ponto de fuga no horizonte.',
      'Manter os objetos dentro do cone de visão de 60 graus previne aberrações óticas nos cantos.'
    ],
    practicalExercise: {
      title: 'Desafio das 20 Caixas com Rotação',
      prompt: 'Construa 20 caixas rotacionadas em dois pontos de fuga, desenhando as arestas invisíveis (caixas de vidro transparente). Envie ao Estúdio AI para auditar a convergência das paralelas.',
      recommendedTime: '40 minutos',
      rubricTarget: 'Perspectiva & Enquadramento (meta: > 85 pontos)'
    }
  },
  {
    id: 'lesson-values',
    title: 'Teoria dos Valores Tonais: Como Iluminar Formas Sólidas',
    instructor: 'Marco Bucci',
    instructorTitle: 'Diretor de Arte e Mestre em Pintura Digital',
    durationMinutes: 16,
    level: 'Iniciante',
    category: 'Luz e Valores',
    youtubeId: '1fK_07w5qE0',
    thumbnailUrl: 'https://images.unsplash.com/photo-1578925518470-4def7a0f08bb?auto=format&fit=crop&w=800&q=80',
    summary: 'Descubra por que o valor tonal faz todo o trabalho duro enquanto a cor recebe o crédito. Aprenda a escala simplificada de 5 valores, terminador de sombra e oclusão ambiental.',
    keyTakeaways: [
      'Mantenha uma fronteira inegociável entre a família de luz e a família de sombras.',
      'A luz refletida nunca deve ser tão clara quanto o meio-tom mais escuro da luz direta.',
      'A oclusão ambiental surge nos pontos de contato físico onde a luz ambiente não consegue penetrar.'
    ],
    practicalExercise: {
      title: 'Pintura de Esfera e Cilindro em 5 Tons',
      prompt: 'Pinte uma esfera e um cubo sob iluminação pontual de 45 graus, utilizando exclusivamente 5 valores de cinza bem distintos. Submeta ao Estúdio para conferência de histograma.',
      recommendedTime: '35 minutos',
      rubricTarget: 'Valores Tonais & Iluminação (meta: > 80 pontos)'
    }
  },
  {
    id: 'lesson-linework',
    title: 'Controle de Traço e Hachuras: Linhas Expressivas',
    instructor: 'Alphonso Dunn',
    instructorTitle: 'Autor de Pen & Ink Drawing e Ilustrador Científico',
    durationMinutes: 20,
    level: 'Iniciante',
    category: 'Fundamentos',
    youtubeId: 'k9l66x3Wj-g',
    thumbnailUrl: 'https://images.unsplash.com/photo-1582561424760-0321d75e81fa?auto=format&fit=crop&w=800&q=80',
    summary: 'Técnicas de desenho com bico de pena e canetas nanquim para criar textura, peso de linha e gradientes suaves através de hachuras paralelas e cruzadas sem quebrar o ritmo.',
    keyTakeaways: [
      'Gire a folha de papel para que a articulação do ombro comande as linhas longas.',
      'Variação de espessura de linha deve priorizar o lado inferior e áreas de sombra.',
      'Hachuras devem acompanhar o contorno volumétrico da superfície (cross-contour).'
    ],
    practicalExercise: {
      title: 'Prancha de Gradientes e Texturas em Nanquim',
      prompt: 'Crie uma prancha com 4 tiras de 10cm demonstrando gradiente tonal de preto puro a branco apenas com hachuras. Submeta ao Estúdio para avaliar uniformidade do traço.',
      recommendedTime: '30 minutos',
      rubricTarget: 'Linhas, Textura & Pincelada (meta: > 85 pontos)'
    }
  },
  {
    id: 'lesson-gesturedrawing',
    title: 'Desenho Gestual e Anatomia Dinâmica em 2 Minutos',
    instructor: 'Sinix Design',
    instructorTitle: 'Concept Artist e Educador de Anatomia Expressiva',
    durationMinutes: 22,
    level: 'Intermediário',
    category: 'Anatomia',
    youtubeId: 'm0Gpn48uW7I',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    summary: 'Como capturar o fluxo de força, a linha de ação (Line of Action) e a energia de poses humanas sem se prender prematuramente aos detalhes musculares anatômicos.',
    keyTakeaways: [
      'Priorize a linha de ação com curvas em "C", "S" ou retas dinâmicas.',
      'Conecte caixa torácica e bacia como duas massas móveis opostas (contrapposto).',
      'Use linhas curvas para ritmo e linhas retas para estrutura e tensão anatômica.'
    ],
    practicalExercise: {
      title: 'Sessão de 15 Poses Gestuais Rápidas',
      prompt: 'Execute 15 esboços rápidos de figura humana (2 minutos por pose) focando unicamente na linha de ação. Submeta para análise de fluidez no Atelier.',
      recommendedTime: '30 minutos',
      rubricTarget: 'Linha e Gestualidade (meta: > 80 pontos)'
    }
  }
];

export const INITIAL_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 'post-1',
    authorName: 'Camila Albuquerque',
    authorHandle: '@camila_atelier',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    title: 'Treino de Domingo: Construção de Loomis em Ângulo Extremo',
    description: 'Tentei fazer uma vista em contra-plongée da cabeça. A IA apontou que o terço inferior ficou ligeiramente comprimido, mas queria a opinião dos colegas sobre o posicionamento das orelhas.',
    medium: 'Grafite 4B no Canson 200g',
    timeSpentMinutes: 50,
    targetGoal: 'Exercício 1 da Aula de Stan Prokopenko',
    imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1000&q=80',
    createdAt: 'Há 2 horas',
    status: 'revisado_ia',
    aiOverallScore: 84,
    tags: ['Anatomia', 'Loomis', 'Grafite', 'Estudo Diário'],
    likesCount: 28,
    hasLiked: false,
    peerReviews: [
      {
        id: 'rev-1',
        authorName: 'Rodrigo B.',
        authorRole: 'Instrutor de Desenho',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        createdAt: 'Há 1 hora',
        comment: 'Excelente volume na calota craniana! Concordo com a IA: como o rosto está inclinado para trás, a orelha deve descer um pouco no plano lateral, ficando abaixo da linha da sobrancelha na projeção.',
        votesCount: 9,
        hasVoted: false
      },
      {
        id: 'rev-2',
        authorName: 'Mariana Duarte',
        authorRole: 'Membro Ativo',
        authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
        createdAt: 'Há 45 min',
        comment: 'O traço das hachuras ficou super limpo. Parabéns pela consistência nos treinos diários!',
        votesCount: 4,
        hasVoted: false
      }
    ]
  },
  {
    id: 'post-floral',
    authorName: 'Gabriel Torres',
    authorHandle: '@gabrieltorres_art',
    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
    title: 'Natureza Morta Flamenga: Refração no Vidro e Chiaroscuro',
    description: 'Estudo em óleo focado nas naturezas mortas holandesas do século XVII. A IA detectou a peônia central como ponto focal principal e avaliou a refração da água com nota 92.',
    medium: 'Óleo sobre Tela',
    timeSpentMinutes: 90,
    targetGoal: 'Composição Floral, Vidro & Iluminação Chiaroscuro',
    imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1000&q=80',
    createdAt: 'Há 3 horas',
    status: 'revisado_ia',
    aiOverallScore: 92,
    tags: ['Natureza Morta', 'Flores', 'Chiaroscuro', 'Óleo'],
    likesCount: 37,
    hasLiked: true,
    peerReviews: [
      {
        id: 'rev-fl-1',
        authorName: 'Elena Rostova',
        authorRole: 'Arquiteta e Ilustradora',
        authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
        createdAt: 'Há 2 horas',
        comment: 'A luminosidade da peônia branca é arrebatadora. O highlight no vaso transparente dá a ilusão perfeita da janela do ateliê.',
        votesCount: 11,
        hasVoted: true
      }
    ]
  },
  {
    id: 'post-2',
    authorName: 'Thiago Martins',
    authorHandle: '@thiago_draws',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    title: 'Cenário Urbano com Caixas em Perspectiva de 2 Pontos',
    description: 'Estudo focado na aula de Moderndayjames. Criei uma grelha de 2 pontos de fuga e tentei manter as linhas paralelas sem recorrer à régua nas hachuras secundárias.',
    medium: 'Fineliner 0.1 e 0.5 em Papel Bristol',
    timeSpentMinutes: 65,
    targetGoal: 'Precisão Ortogonal & Line Weight',
    imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1000&q=80',
    createdAt: 'Há 5 horas',
    status: 'resolvido',
    aiOverallScore: 91,
    tags: ['Perspectiva', 'Nanquim', 'Cenários', 'Bristol'],
    likesCount: 43,
    hasLiked: true,
    peerReviews: [
      {
        id: 'rev-3',
        authorName: 'Elena Rostova',
        authorRole: 'Arquiteta e Ilustradora',
        authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
        createdAt: 'Há 3 horas',
        comment: 'A convergência é cirúrgica! Dica rápida: para aumentar o contraste de escala, experimente colocar uma figura humana siluetada no primeiro plano em escala correta com a linha do horizonte.',
        votesCount: 14,
        hasVoted: true
      }
    ]
  },
  {
    id: 'post-3',
    authorName: 'Lucas Ferreira',
    authorHandle: '@ferreira_art',
    authorAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80',
    title: 'Primeiro Estudo de Valores com Pincel Opaco',
    description: 'Tentando aplicar a regra de Marco Bucci de separar luz de sombra sem misturar. Preciso de redlines para saber se a oclusão na base do vaso está exagerada.',
    medium: 'Pintura Digital no Photoshop',
    timeSpentMinutes: 80,
    targetGoal: 'Escala de 5 Valores e Oclusão Ambiental',
    imageUrl: 'https://images.unsplash.com/photo-1578925518470-4def7a0f08bb?auto=format&fit=crop&w=1000&q=80',
    createdAt: 'Há 1 dia',
    status: 'aguardando_redline',
    aiOverallScore: 86,
    tags: ['Valores', 'Pintura Digital', 'Natureza Morta', 'Peer Review'],
    likesCount: 19,
    hasLiked: false,
    peerReviews: []
  }
];

export const CURRENT_ARTIST_PROFILE: ArtistProfile = {
  name: 'Gabriel Torres',
  handle: '@gabrieltorres_art',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
  bio: 'Estudante de desenho clássico e concept art. Foco atual: Anatomia craniana e controle de hachuras em nanquim.',
  currentStreakDays: 14,
  longestStreakDays: 21,
  totalPracticeHours: 42.5,
  studiesCompleted: 38,
  peerReviewsGiven: 19,
  level: 8,
  currentXp: 2840,
  nextLevelXp: 3200,
  weeklyActivity: [
    { dayName: 'Seg', dateStr: '11 Mar', completed: true, studiesCount: 2, durationMinutes: 65, isToday: false },
    { dayName: 'Ter', dateStr: '12 Mar', completed: true, studiesCount: 1, durationMinutes: 45, isToday: false },
    { dayName: 'Qua', dateStr: '13 Mar', completed: true, studiesCount: 3, durationMinutes: 90, isToday: false },
    { dayName: 'Qui', dateStr: '14 Mar', completed: true, studiesCount: 2, durationMinutes: 50, isToday: false },
    { dayName: 'Sex', dateStr: '15 Mar', completed: true, studiesCount: 1, durationMinutes: 40, isToday: false },
    { dayName: 'Sáb', dateStr: '16 Mar', completed: true, studiesCount: 2, durationMinutes: 80, isToday: false },
    { dayName: 'Dom', dateStr: '17 Mar', completed: true, studiesCount: 1, durationMinutes: 55, isToday: true },
  ],
  dailyMissions: [
    {
      id: 'mission-1',
      title: 'Auditoria Diária do AI Vision',
      description: 'Submeta pelo menos 1 estudo ou reanálise no Estúdio.',
      progress: 1,
      maxProgress: 1,
      completed: true,
      xpReward: 120,
      category: 'studio'
    },
    {
      id: 'mission-2',
      title: 'Prática de Fundamentos (45 min)',
      description: 'Acumule 45 minutos na prancheta exercitando eixos ou valores.',
      progress: 55,
      maxProgress: 45,
      completed: true,
      xpReward: 150,
      category: 'studio'
    },
    {
      id: 'mission-3',
      title: 'Peer-Review Solidário',
      description: 'Ofereça 1 comentário técnico ou redline para um colega da comunidade.',
      progress: 1,
      maxProgress: 1,
      completed: true,
      xpReward: 100,
      category: 'community'
    },
    {
      id: 'mission-4',
      title: 'Estudo de Mestre em Vídeo',
      description: 'Assista a 1 aula prática da biblioteca e realize o exercício sugerido.',
      progress: 0,
      maxProgress: 1,
      completed: false,
      xpReward: 200,
      category: 'lesson'
    }
  ],
  badges: [
    {
      id: 'badge-streak-1',
      title: 'Primeiro Fogo',
      description: 'Manteve 3 dias seguidos de prática diária no ateliê.',
      category: 'streak',
      tier: 'bronze',
      iconName: 'flame',
      progress: 3,
      maxProgress: 3,
      unlocked: true,
      unlockedAt: '03 Mar 2026',
      requirement: '3 dias consecutivos de atividade',
      xpReward: 150
    },
    {
      id: 'badge-streak-2',
      title: 'Ritmo Constante',
      description: 'Completou 7 dias ininterruptos de dedicação ao desenho.',
      category: 'streak',
      tier: 'prata',
      iconName: 'zap',
      progress: 7,
      maxProgress: 7,
      unlocked: true,
      unlockedAt: '07 Mar 2026',
      requirement: '7 dias consecutivos de atividade',
      xpReward: 300
    },
    {
      id: 'badge-streak-3',
      title: 'Guardião da Prancheta',
      description: 'Alcançou a marca épica de 14 dias seguidos de treino focado!',
      category: 'streak',
      tier: 'ouro',
      iconName: 'flame',
      progress: 14,
      maxProgress: 14,
      unlocked: true,
      unlockedAt: 'Hoje',
      requirement: '14 dias consecutivos de atividade',
      xpReward: 600
    },
    {
      id: 'badge-streak-4',
      title: 'Monge do Ateliê',
      description: 'Mantenha 30 dias ininterruptos de prática clássica.',
      category: 'streak',
      tier: 'diamante',
      iconName: 'shield',
      progress: 14,
      maxProgress: 30,
      unlocked: false,
      requirement: '30 dias consecutivos de atividade (14/30)',
      xpReward: 1200
    },
    {
      id: 'badge-loomis',
      title: 'Geometria de Loomis',
      description: 'Atingiu nota 90+ na rubrica de Proporção e Construção Anatômica.',
      category: 'rubrics',
      tier: 'ouro',
      iconName: 'compass',
      progress: 93,
      maxProgress: 90,
      unlocked: true,
      unlockedAt: '12 Mar 2026',
      requirement: 'Score ≥ 90 em Proporção & Anatomia',
      xpReward: 500
    },
    {
      id: 'badge-chiaroscuro',
      title: 'Mestre da Luz e Sombra',
      description: 'Alcançou nível Maestria em Valores Tonais e iluminação chiaroscuro.',
      category: 'rubrics',
      tier: 'ouro',
      iconName: 'sparkles',
      progress: 95,
      maxProgress: 90,
      unlocked: true,
      unlockedAt: 'Hoje',
      requirement: 'Score ≥ 90 em Valores Tonais & Chiaroscuro',
      xpReward: 500
    },
    {
      id: 'badge-perspective',
      title: 'Olho Cênico',
      description: 'Completou 5 estudos auditados de perspectiva com múltiplos pontos de fuga.',
      category: 'mastery',
      tier: 'prata',
      iconName: 'target',
      progress: 5,
      maxProgress: 5,
      unlocked: true,
      unlockedAt: '15 Mar 2026',
      requirement: '5 estudos de perspectiva concluídos',
      xpReward: 400
    },
    {
      id: 'badge-redlines',
      title: 'Mentor de Redlines',
      description: 'Ofereceu mais de 15 revisões técnicas desenhadas para a comunidade.',
      category: 'community',
      tier: 'ouro',
      iconName: 'users',
      progress: 19,
      maxProgress: 15,
      unlocked: true,
      unlockedAt: '16 Mar 2026',
      requirement: '15 redlines doados no feed',
      xpReward: 600
    },
    {
      id: 'badge-reanalysis-pro',
      title: 'Espírito Crítico',
      description: 'Realizou 3 reanálises com a IA aprofundando diagnósticos específicos.',
      category: 'mastery',
      tier: 'bronze',
      iconName: 'layers',
      progress: 3,
      maxProgress: 3,
      unlocked: true,
      unlockedAt: 'Hoje',
      requirement: '3 reanálises calibradas no estúdio',
      xpReward: 250
    },
    {
      id: 'badge-hours-40',
      title: 'Centauro da Prancheta',
      description: 'Ultrapassou a marca de 40 horas acumuladas de estudo rigoroso.',
      category: 'streak',
      tier: 'diamante',
      iconName: 'award',
      progress: 42.5,
      maxProgress: 40,
      unlocked: true,
      unlockedAt: 'Hoje',
      requirement: '40 horas registradas no Strava de arte',
      xpReward: 1000
    },
    {
      id: 'badge-master-bench',
      title: 'Chancela da Banca',
      description: 'Obtenha nota geral 95+ em uma auditoria de nível acadêmico rigoroso.',
      category: 'rubrics',
      tier: 'diamante',
      iconName: 'shield',
      progress: 92,
      maxProgress: 95,
      unlocked: false,
      requirement: 'Nota geral ≥ 95 em auditoria (Atual: 92)',
      xpReward: 1500
    },
    {
      id: 'badge-daily-master',
      title: 'Execução Impecável',
      description: 'Conclua todas as 4 missões diárias em um único dia.',
      category: 'lessons',
      tier: 'prata',
      iconName: 'pen',
      progress: 3,
      maxProgress: 4,
      unlocked: false,
      requirement: '4 missões diárias completadas (3/4)',
      xpReward: 350
    }
  ],
  historicalStreaks: [
    {
      id: 'streak-curr',
      startDate: '04 Set 2026',
      endDate: 'Ativo (Hoje)',
      lengthDays: 14,
      totalHours: 17.5,
      studiesCount: 18,
      status: 'active',
      primaryFocus: 'Anatomia e Cabeça Loomis',
      highlightBadge: 'Guardião da Prancheta'
    },
    {
      id: 'streak-rec',
      startDate: '10 Jun 2026',
      endDate: '30 Jun 2026',
      lengthDays: 21,
      totalHours: 31.0,
      studiesCount: 34,
      status: 'completed',
      primaryFocus: 'Perspectiva Cênica & Elipses',
      highlightBadge: 'Olho Cênico (Recorde)'
    },
    {
      id: 'streak-spring',
      startDate: '08 Abr 2026',
      endDate: '19 Abr 2026',
      lengthDays: 12,
      totalHours: 14.5,
      studiesCount: 15,
      status: 'completed',
      primaryFocus: 'Valores Tonais & Chiaroscuro',
      highlightBadge: 'Mestre da Luz e Sombra'
    },
    {
      id: 'streak-found',
      startDate: '14 Fev 2026',
      endDate: '22 Fev 2026',
      lengthDays: 9,
      totalHours: 10.0,
      studiesCount: 11,
      status: 'completed',
      primaryFocus: 'Geometria Primitiva & Eixos',
      highlightBadge: 'Ritmo Constante'
    },
    {
      id: 'streak-winter',
      startDate: '12 Nov 2025',
      endDate: '18 Nov 2025',
      lengthDays: 7,
      totalHours: 7.5,
      studiesCount: 8,
      status: 'completed',
      primaryFocus: 'Hachuras e Pressão da Pena',
      highlightBadge: 'Primeiro Fogo'
    }
  ],
  annualContributions: (() => {
    // Generate 365 days of realistic daily activity data ending today (52 weeks x 7 days)
    const days = [];
    const today = new Date('2026-09-17T12:00:00Z');
    
    // Deterministic pseudo-pattern simulating realistic artist practice
    for (let i = 364; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayOfWeek = d.getUTCDay(); // 0=Sun, 6=Sat
      const dayOfYear = 365 - i;

      let count = 0;
      let durationMinutes = 0;
      let intensity: 0 | 1 | 2 | 3 | 4 = 0;
      const studies: string[] = [];

      // Current active streak (last 14 days: i < 14)
      if (i < 14) {
        count = (i % 3 === 0) ? 2 : 1;
        durationMinutes = 40 + ((i * 17) % 55);
        intensity = durationMinutes >= 90 ? 4 : durationMinutes >= 60 ? 3 : durationMinutes >= 40 ? 2 : 1;
        studies.push(`Estudo Diário de Ateliê #${365 - i}`);
        if (count > 1) studies.push('Exercício de Aquecimento Gestual (15min)');
      }
      // Record streak in June (approx 80-100 days ago)
      else if (i >= 78 && i <= 99) {
        count = (i % 2 === 0) ? 2 : 1;
        durationMinutes = 50 + ((i * 13) % 70);
        intensity = durationMinutes >= 90 ? 4 : durationMinutes >= 65 ? 3 : 2;
        studies.push('Série de Perspectiva com 2 Pontos de Fuga');
      }
      // Spring streak (approx 150-162 days ago)
      else if (i >= 151 && i <= 162) {
        count = 1;
        durationMinutes = 45 + ((i * 7) % 45);
        intensity = durationMinutes >= 60 ? 3 : 2;
        studies.push('Escala Tonal de 9 Valores e Luz Rebatida');
      }
      // Regular practice pattern (higher chance on weekends, steady weekday studies)
      else {
        const hash = (dayOfYear * 9301 + 49297) % 233280;
        const rand = hash / 233280;

        if (rand > 0.42 || dayOfWeek === 0 || dayOfWeek === 6) {
          if (rand > 0.88) {
            count = 2;
            durationMinutes = 75 + Math.floor(rand * 45);
            intensity = 4;
            studies.push('Masterclass Prática: Anatomia e Volumes');
            studies.push('Auditoria Automatizada Vision AI');
          } else if (rand > 0.68) {
            count = 1;
            durationMinutes = 50 + Math.floor(rand * 30);
            intensity = 3;
            studies.push('Estudo de Rosto e Planos Faciais');
          } else if (rand > 0.52) {
            count = 1;
            durationMinutes = 35 + Math.floor(rand * 20);
            intensity = 2;
            studies.push('Prática de Linhas de Contorno Cego');
          } else {
            count = 1;
            durationMinutes = 20 + Math.floor(rand * 15);
            intensity = 1;
            studies.push('Aquecimento e Elipses');
          }
        }
      }

      days.push({
        date: dateStr,
        count,
        durationMinutes,
        intensity,
        studies: studies.length > 0 ? studies : undefined
      });
    }
    return days;
  })(),
  attributeScores: {
    proporcao: 84,
    perspectiva: 88,
    valores: 79,
    traco: 87,
    cores: 72,
    velocidade: 81
  },
  beforeAfter: {
    beforeImageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=600&q=80',
    beforeDate: 'Semana 1 (Jan 2026)',
    beforeTitle: 'Primeiro Estudo de Rosto (Sem Estrutura)',
    beforeScore: 58,
    afterImageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
    afterDate: 'Semana 8 (Março 2026)',
    afterTitle: 'Estudo com Método Loomis e Três Terços',
    afterScore: 86
  },
  recentActivities: [
    {
      id: 'act-1',
      date: 'Hoje, 09:30',
      title: 'Estudo de Cabeça Loomis 3/4',
      medium: 'Grafite 2B',
      durationMinutes: 55,
      score: 84
    },
    {
      id: 'act-2',
      date: 'Ontem, 19:15',
      title: 'Prática de Caixas em Perspectiva',
      medium: 'Nanquim 0.5',
      durationMinutes: 40,
      score: 91
    },
    {
      id: 'act-3',
      date: '15 Mar, 21:00',
      title: 'Esfera e Cilindro em 5 Tons',
      medium: 'Pintura Digital',
      durationMinutes: 60,
      score: 86
    },
    {
      id: 'act-4',
      date: '14 Mar, 18:30',
      title: 'Hachuras e Textura de Rocha',
      medium: 'Bico de Pena',
      durationMinutes: 45,
      score: 82
    },
    {
      id: 'act-5',
      date: '13 Mar, 10:00',
      title: 'Desenho Gestual - 15 Poses de 2min',
      medium: 'Grafite 6B',
      durationMinutes: 30,
      score: 79
    }
  ]
};

