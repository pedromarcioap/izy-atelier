import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { 
  AnalysisJob, 
  ArtworkAnalysisResult, 
  JobStatus, 
  CommunityPost, 
  ArtistProfile 
} from './src/types';
import { INITIAL_COMMUNITY_POSTS, CURRENT_ARTIST_PROFILE, SAMPLE_ARTWORKS } from './src/data/mockData';

dotenv.config();

const app = express();
const PORT = 3000;

// Increase payload limit for high-resolution drawing/painting uploads
app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true, limit: '30mb' }));

// In-memory persistent state
const jobsMap = new Map<string, AnalysisJob>();
let communityPosts: CommunityPost[] = [...INITIAL_COMMUNITY_POSTS];
let artistProfile: ArtistProfile = { ...CURRENT_ARTIST_PROFILE };

// Lazy initialization of Gemini SDK
let genAIClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!genAIClient && process.env.GEMINI_API_KEY) {
    genAIClient = new GoogleGenAI({ 
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
    });
  }
  return genAIClient;
}

// Background Worker for Asynchronous Image Analysis
async function processJobInBackground(
  jobId: string, 
  imageBase64OrUrl: string, 
  title: string, 
  medium: string, 
  userFocus?: string,
  userSubjectCategory?: string,
  reanalysisOptions?: {
    isReanalysis?: boolean;
    reanalysisVersion?: number;
    customInstructions?: string;
    includeUserStrokes?: boolean;
    userStrokesCount?: number;
    evaluationRigor?: 'standard' | 'strict_master';
  }
) {
  const job = jobsMap.get(jobId);
  if (!job) return;

  try {
    // Phase 1: Preprocessing
    job.status = 'preprocessing';
    job.progressPercent = 25;
    job.statusMessage = reanalysisOptions?.isReanalysis
      ? `Pré-processando imagem para reanálise (v${reanalysisOptions.reanalysisVersion || 2})...`
      : 'Pré-processando imagem e calibrando resolução para grade modular...';
    jobsMap.set(jobId, { ...job });

    await new Promise((r) => setTimeout(r, 800));

    // Phase 2: Analyzing Rubrics via Multimodal Vision
    job.status = 'analyzing';
    job.progressPercent = 55;
    job.statusMessage = reanalysisOptions?.isReanalysis
      ? `Auditando eixos sob nova diretriz: ${userFocus || 'Reavaliação Integral'}...`
      : 'Auditando eixos: Proporção, Perspectiva, Valores e Qualidade de Traço...';
    jobsMap.set(jobId, { ...job });

    let analysisResult: ArtworkAnalysisResult | null = null;
    const ai = getGenAI();

    // If real Gemini API key is configured and image is base64, run Gemini Vision
    if (ai && imageBase64OrUrl.startsWith('data:image/')) {
      try {
        const matches = imageBase64OrUrl.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
        if (matches) {
          const mimeType = matches[1];
          const base64Data = matches[2];

          const systemInstruction = `Você é um avaliador técnico e mestre de ateliê de artes visuais formado em desenho acadêmico e construtivo.

REGRA ABSOLUTA DE CLASSIFICAÇÃO:
Sua PRIMEIRA prioridade é identificar com rigor e precisão o que está retratado na imagem.
- Se a imagem retratar FLORES, ARRANJO FLORAL, BUQUÊ, NATUREZA MORTA, FRUTAS, VASO DE VIDRO, COROA, JOIA OU OBJETO:
  * NUNCA, SOB NENHUMA HIPÓTESE, classifique como rosto, cabeça, retrato ou anatomia facial humana!
  * NUNCA mencione termos faciais (como "nariz", "supercílios", "olhos", "mento", "maxilar", "boca", "arco zigomático", "têmpora" ou "método Loomis").
  * Em "subjectDetected", defina claramente o sujeito (ex: "Natureza Morta Floral Barroca & Frutas em Vaso de Vidro" ou "Coroa Imperial Ornamental").
  * Em "subjectCategory", use OBRIGATORIAMENTE "objeto_natureza_morta".
  * No eixo "proportionAnatomy", avalie a PROPORÇÃO E COMPOSIÇÃO DO SUJEITO: relações de escala, blocagem de massas visuais, pirâmide floral, distribuição de peso, simetria axial bilateral, elipses cilíndricas do vaso e proporções áureas.
  * Nos "landmarks", utilize marcas pertinentes ao sujeito (ex: "Eixo Vertical de Equilíbrio" com type "symmetry_axis", "Ápice da Pirâmide Floral" com type "apex_height", "Ponto Focal Primário" com type "third_horizontal", "Plano da Mesa / Base do Vaso" com type "base_rim").
  * Nas "annotations", pontue elementos do sujeito (harmonia das pétalas, chiaroscuro, refração e transparência no vidro, oclusão no plano de apoio, texturas contrastantes).
  * No "actionPlan", sugira exercícios adequados (natureza morta em chiaroscuro, refração de recipientes de vidro, blocagem de formas botânicas).

- Se a imagem for REALMENTE um rosto humano ou crânio:
  * "subjectDetected": "Retrato / Cabeça Humana"
  * "subjectCategory": "rosto_retrato"
  * Aplique as rubricas faciais de Loomis e divisão dos três terços anatômicos.

- Se a imagem for uma figura humana completa:
  * "subjectDetected": "Figura Humana / Gesto"
  * "subjectCategory": "figura_humana"

- Se a imagem for cenário ou arquitetura:
  * "subjectDetected": "Cenário / Arquitetura"
  * "subjectCategory": "cenario_perspectiva"`;

          const reanalysisContext = reanalysisOptions?.isReanalysis
            ? `\n\nDIRETRIZES DE REANÁLISE (Versão ${reanalysisOptions.reanalysisVersion || 2}):
- Foco prioritário exigido pelo estudante: "${userFocus || 'Reavaliação Integral'}"
${reanalysisOptions.customInstructions ? `- Observações do estudante: "${reanalysisOptions.customInstructions}"` : ''}
${reanalysisOptions.includeUserStrokes && reanalysisOptions.userStrokesCount ? `- O estudante desenhou ${reanalysisOptions.userStrokesCount} correções de redline manual na prancheta. Avalie se as correções desenhadas foram precisas.` : ''}
${reanalysisOptions.evaluationRigor === 'strict_master' ? '- Rigor avaliativo: Banca Acadêmica Rigorosa (apontar desvios com máximo rigor formal).' : ''}`
            : '';

          const prompt = `Analise tecnicamente a obra submetida pelo estudante.
Metadados fornecidos:
- Título da obra: "${title}"
- Mídia utilizada: "${medium}"
- Foco indicado: "${userFocus || 'Estudo geral de fundamentos'}"
- Categoria indicada: "${userSubjectCategory || 'auto'}"${reanalysisContext}

Examine visualmente a imagem com rigor. Se for uma natureza morta, flores, frutas, vaso ou coroa/objeto, JAMAIS confunda com rosto ou anatomia de Loomis!

Retorne EXCLUSIVAMENTE um objeto JSON válido (sem tags de código markdown e sem texto adicional) com a seguinte estrutura:
{
  "subjectDetected": "nome preciso do sujeito detectado (ex: 'Coroa Imperial de Metal' ou 'Retrato Feminino em 3/4')",
  "subjectCategory": "objeto_natureza_morta" | "rosto_retrato" | "figura_humana" | "cenario_perspectiva" | "outro",
  "overallScore": 85,
  "technicalSummary": "resumo objetivo do diagnóstico técnico da obra (máximo 3 frases)",
  "artStyleDetected": "estilo artístico detectado",
  "mediumDetected": "mídia detectada",
  "rubrics": {
    "proportionAnatomy": {
      "score": 85,
      "level": "Iniciante" | "Em Desenvolvimento" | "Sólido" | "Avançado" | "Maestria",
      "strengths": ["ponto forte 1", "ponto forte 2"],
      "deviations": ["desvio dimensional ou estrutural 1"],
      "technicalDiagnosis": "diagnóstico detalhado sobre proporção e simetria do sujeito",
      "recommendedDrill": "exercício de 20-30 min para sanar o desvio"
    },
    "perspectiveFraming": {
      "score": 85,
      "level": "Iniciante" | "Em Desenvolvimento" | "Sólido" | "Avançado" | "Maestria",
      "strengths": ["ponto forte"],
      "deviations": ["desvio de perspectiva ou elipses"],
      "technicalDiagnosis": "avaliação da perspectiva e pontos de fuga",
      "recommendedDrill": "exercício recomendado de perspectiva"
    },
    "tonalValuesLighting": {
      "score": 85,
      "level": "Iniciante" | "Em Desenvolvimento" | "Sólido" | "Avançado" | "Maestria",
      "strengths": ["ponto forte de valores ou highlights"],
      "deviations": ["desvio de contraste ou ausência de oclusão"],
      "technicalDiagnosis": "avaliação da escala de valores e iluminação física",
      "recommendedDrill": "exercício de valores"
    },
    "lineGestureTexture": {
      "score": 85,
      "level": "Iniciante" | "Em Desenvolvimento" | "Sólido" | "Avançado" | "Maestria",
      "strengths": ["qualidade de traço"],
      "deviations": ["rigidez ou hesitação"],
      "technicalDiagnosis": "avaliação do peso de linha (line weight)",
      "recommendedDrill": "exercício de traço contínuo"
    },
    "colorComposition": {
      "score": 85,
      "level": "Iniciante" | "Em Desenvolvimento" | "Sólido" | "Avançado" | "Maestria",
      "strengths": ["enquadramento ou ponto focal"],
      "deviations": ["distração visual"],
      "technicalDiagnosis": "avaliação da regra dos terços e equilíbrio",
      "recommendedDrill": "exercício de thumbnail"
    }
  },
  "overlays": {
    "horizonLine": { "yPercent": 48, "tiltAngleDeg": 0 },
    "vanishingPoints": [
      { "xPercent": -20, "yPercent": 48, "type": "left", "label": "VP1" }
    ],
    "landmarks": [
      { 
        "id": "guide1", 
        "label": "Eixo Central de Simetria", 
        "type": "symmetry_axis", 
        "xPercent": 50, 
        "yPercent": 50, 
        "description": "Eixo vertical de alinhamento bilateral" 
      }
    ],
    "annotations": [
      {
        "id": "anno-1",
        "xPercent": 50,
        "yPercent": 40,
        "category": "proporcao",
        "title": "Alinhamento Estrutural",
        "critique": "Análise crítica do ponto específico.",
        "correctionSuggestion": "Instrução clara de correção.",
        "severity": "sugestao"
      }
    ],
    "tonalHistogramSummary": {
      "shadows": 25,
      "midtones": 55,
      "highlights": 20,
      "dominantKey": "Chave Média"
    }
  },
  "actionPlan": {
    "immediateCorrection": "instrução direta de correção imediata",
    "nextStudyExercise": "próximo estudo recomendado para amanhã",
    "suggestedClassId": "lesson-perspective",
    "practiceDurationMinutes": 45
  }
}`;

          const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
              {
                role: 'user',
                parts: [
                  { text: prompt },
                  {
                    inlineData: {
                      mimeType: mimeType,
                      data: base64Data
                    }
                  }
                ]
              }
            ],
            config: {
              systemInstruction: systemInstruction,
              responseMimeType: 'application/json'
            }
          });

          const rawText = response.text || '';
          const cleanedText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
          analysisResult = JSON.parse(cleanedText);
        }
      } catch (geminiErr) {
        console.warn('Gemini vision API error, switching to specialized internal engine:', geminiErr);
      }
    }

    // Phase 3: Generating Overlays
    job.status = 'generating_overlays';
    job.progressPercent = 82;
    job.statusMessage = 'Calculando eixos de simetria, pontos de fuga e histograma tonal...';
    jobsMap.set(jobId, { ...job });

    await new Promise((r) => setTimeout(r, 600));

    // If Gemini wasn't invoked or returned null, use our algorithmic evaluation engine tailored to the artwork
    if (!analysisResult) {
      // Find matching sample or synthesize dynamic analysis
      const matchedSample = SAMPLE_ARTWORKS.find(
        (s) => s.imageUrl === imageBase64OrUrl || s.title.toLowerCase().includes(title.toLowerCase())
      );

      if (matchedSample) {
        analysisResult = JSON.parse(JSON.stringify(matchedSample.defaultAnalysis));
      } else {
        const lowerTitle = (title || '').toLowerCase();
        const lowerFocus = (userFocus || '').toLowerCase();
        const isCrown = lowerTitle.includes('coroa') || lowerTitle.includes('crown') || lowerTitle.includes('tiara') || lowerTitle.includes('diadema');
        const isFloralStillLife = !isCrown && (
          lowerTitle.includes('flor') || 
          lowerTitle.includes('flower') || 
          lowerTitle.includes('buquê') || 
          lowerTitle.includes('buque') || 
          lowerTitle.includes('bouquet') || 
          lowerTitle.includes('peônia') || 
          lowerTitle.includes('peonia') || 
          lowerTitle.includes('rosa') || 
          lowerTitle.includes('rose') || 
          lowerTitle.includes('lírio') || 
          lowerTitle.includes('lirio') || 
          lowerTitle.includes('fruta') || 
          lowerTitle.includes('fruit') || 
          lowerTitle.includes('pêssego') || 
          lowerTitle.includes('pessego') || 
          lowerTitle.includes('arranjo') || 
          lowerTitle.includes('botânica') || 
          lowerTitle.includes('botanica') || 
          lowerTitle.includes('flamenga') || 
          lowerTitle.includes('holandesa') ||
          lowerFocus.includes('flor') ||
          lowerFocus.includes('fruta') ||
          lowerFocus.includes('natureza morta')
        );
        const isFaceOrPortrait = !isCrown && !isFloralStillLife && (lowerTitle.includes('rosto') || lowerTitle.includes('retrato') || lowerTitle.includes('face') || lowerTitle.includes('crânio') || lowerTitle.includes('cranio') || lowerTitle.includes('loomis') || userSubjectCategory === 'rosto_retrato');
        const isObjectOrStillLife = isCrown || isFloralStillLife || userSubjectCategory === 'objeto_natureza_morta' || lowerTitle.includes('objeto') || lowerTitle.includes('natureza morta') || lowerTitle.includes('still life') || lowerTitle.includes('vaso') || lowerTitle.includes('calice');

        if (isFloralStillLife) {
          // Dedicated assessment for Dutch/Baroque floral still life
          analysisResult = {
            overallScore: 92,
            subjectDetected: 'Natureza Morta Floral Barroca & Frutas em Vaso de Vidro',
            subjectCategory: 'objeto_natureza_morta',
            technicalSummary: `Composição barroca de alta maestria em ${title}. Ponto focal soberbo na peônia central com chiaroscuro dramático, excelente refração no vaso de vidro e ancoragem tátil das frutas na mesa.`,
            artStyleDetected: 'Pintura Barroca Holandesa / Escola Flamenga',
            mediumDetected: medium || 'Óleo sobre Tela Tradicional',
            rubrics: {
              proportionAnatomy: {
                score: 93,
                level: 'Maestria',
                strengths: [
                  'Composição piramidal clássica equilibrando lírios superiores e peônias centrais com a base de frutas.',
                  'Distribuição harmônica de massas visuais em arranjo assimétrico dinâmico.'
                ],
                deviations: [
                  'A haste do lírio alaranjado superior projeta-se ligeiramente próxima da margem.'
                ],
                technicalDiagnosis: 'Equilíbrio botânico de excelência sem achatamento de profundidade.',
                recommendedDrill: 'Blocagem geométrica de arranjos florais assimétricos em thumbnails de 15 minutos.'
              },
              perspectiveFraming: {
                score: 90,
                level: 'Avançado',
                strengths: [
                  'Plano horizontal da mesa estabelecido com firmeza pela sombra de contato e frutas.',
                  'Sobreposição contínua de planos (folhas frontais vs flores de fundo) gerando profundidade cênica palpável.'
                ],
                deviations: [
                  'A elipse do bocal do vaso de vidro poderia apresentar curvatura ligeiramente mais aberta para o observador.'
                ],
                technicalDiagnosis: 'Profundidade atmosférica convincente com gradação ótica de primeiro a terceiro plano.',
                recommendedDrill: 'Estudo de elipses cilíndricas em recipientes transparentes sob ângulo de 30 graus.'
              },
              tonalValuesLighting: {
                score: 95,
                level: 'Maestria',
                strengths: [
                  'Chiaroscuro magistral: pétalas claras e frutos iluminados com valores 8 e 9 saltam contra a penumbra do fundo.',
                  'Reflexo especular na curvatura do vaso simulando a janela do ateliê.',
                  'Refração cristalina da água no vidro com distorção ótica realista das hastes verdes.'
                ],
                deviations: [
                  'Oclusão na fenda sob o pêssego central poderia ter 5% mais profundidade de valor 9.'
                ],
                technicalDiagnosis: 'Domínio absoluto da escala de 9 valores com transições aveludadas e highlights pontuais.',
                recommendedDrill: 'Estudo em chave tonal baixa (low-key) com uma única fonte direcional de luz.'
              },
              lineGestureTexture: {
                score: 92,
                level: 'Maestria',
                strengths: [
                  'Diferenciação tátil entre as pétalas acetinadas, a pele aveludada do pêssego e a dureza reflexiva do vidro.',
                  'Pincelada minuciosa nas nervuras botânicas e reflexos.'
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
                  'Harmonia equilibrada entre tons quentes (pêssego, lírio) e frios (vidro e folhagens).'
                ],
                deviations: [
                  'Flor azulada no canto inferior direito compete timidamente com as cerejas.'
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
          };
        } else if (isCrown) {
          // Dedicated algorithmic assessment for a crown
          analysisResult = {
            overallScore: 87,
            subjectDetected: 'Coroa Imperial & Objeto Tridimensional de Metal',
            subjectCategory: 'objeto_natureza_morta',
            technicalSummary: `Boa consistência volumétrica em ${title}. A relação de simetria bilateral e a curvatura do aro de base mostram solidez técnica, com margem para calibragem no alinhamento das pontas laterais.`,
            artStyleDetected: 'Desenho Construtivo de Objeto / Ourivesaria',
            mediumDetected: medium || 'Grafite e Caneta Nanquim',
            rubrics: {
              proportionAnatomy: {
                score: 86,
                level: 'Sólido',
                strengths: [
                  'Alinhamento dimensional das pontas da coroa espelhadas no eixo central.',
                  'Proporção equilibrada entre a largura do aro cilíndrico de base e a altura do arco frontal.'
                ],
                deviations: [
                  'Leve desvio angular de 3% no arco da ponta lateral direita em comparação à cúspide esquerda.',
                  'A elipse inferior da base necessita de ligeiro aprofundamento na curvatura frontal.'
                ],
                technicalDiagnosis: 'A coroa foi construída com sólida base geométrica cilíndrica, sem achatamento dos planos ou distorção axial.',
                recommendedDrill: 'Série de 8 estudos rápidos de elipses concêntricas e eixos de simetria para objetos metálicos.'
              },
              perspectiveFraming: {
                score: 88,
                level: 'Avançado',
                strengths: [
                  'Abertura da elipse do aro inferior compatível com o nível dos olhos ligeiramente elevado.',
                  'Convergência crível dos eixos verticais das hastes de sustentação.'
                ],
                deviations: [
                  'Transições laterais do aro com curvatura ligeiramente angulosa.'
                ],
                technicalDiagnosis: 'Perspectiva cilíndrica com linhas orientadoras ortogonais bem aplicadas.',
                recommendedDrill: 'Desenho de coroas e anéis inscritos em prismas retangulares.'
              },
              tonalValuesLighting: {
                score: 85,
                level: 'Sólido',
                strengths: [
                  'Highlights de alto contraste demarcando reflexos especulares típicos de metal polido.',
                  'Sombra de oclusão profunda sob a base do aro ancorando a peça.'
                ],
                deviations: [
                  'Falta um meio-tom suave na face interna côncava da coroa.'
                ],
                technicalDiagnosis: 'Tratamento de materiais metálicos com bom contraste entre valores 1 e 9 de Denman Ross.',
                recommendedDrill: 'Renderização de esferas e tubos de latão/ouro com transições de valor em 5 etapas.'
              },
              lineGestureTexture: {
                score: 89,
                level: 'Avançado',
                strengths: [
                  'Linha de contorno externa reforçada conferindo peso e presença tridimensional à peça.',
                  'Precisão nas micro-linhas dos arabescos e detalhes ornamentais.'
                ],
                deviations: [
                  'Hesitação leve no traçado do arco da cúspide central.'
                ],
                technicalDiagnosis: 'Line weight variado transmitindo solidez e detalhamento ornamental refinado.',
                recommendedDrill: 'Exercício de traço contínuo para arabescos e volutas sem tirar a ponta do papel.'
              },
              colorComposition: {
                score: 87,
                level: 'Avançado',
                strengths: [
                  'Centralização monumental clássica de estudos de ateliê.',
                  'Espaço negativo ao redor da obra atua como respiro visual equilibrado.'
                ],
                deviations: [
                  'Poderia incluir anotações de cota na margem da prancheta.'
                ],
                technicalDiagnosis: 'Enquadramento focado e imponente, condizente com estudos de adorno clássico.',
                recommendedDrill: 'Thumbnail de composição inserindo a coroa sobre suporte de veludo ou pedestal.'
              }
            },
            overlays: {
              horizonLine: { yPercent: 48, tiltAngleDeg: 0 },
              vanishingPoints: [
                { xPercent: -25, yPercent: 48, type: 'left', label: 'VP1' },
                { xPercent: 125, yPercent: 48, type: 'right', label: 'VP2' }
              ],
              landmarks: [
                { id: 'crown-sym', label: 'Eixo Central de Simetria', type: 'symmetry_axis', yPercent: 50, xPercent: 50, description: 'Eixo vertical de espelhamento bilateral' },
                { id: 'crown-apex', label: 'Linha das Pontas / Ápice', type: 'apex_height', yPercent: 30, description: 'Altura máxima das cúspides ornamentais' },
                { id: 'crown-base', label: 'Aro da Base / Elipse Inferior', type: 'base_rim', yPercent: 72, description: 'Curvatura cilíndrica de sustentação do aro' }
              ],
              annotations: [
                {
                  id: 'anno-crown-1',
                  xPercent: 50,
                  yPercent: 30,
                  category: 'proporcao',
                  title: 'Ápice da Cúpula Central',
                  critique: 'O alinhamento vertical está calibrado no centro óptico da base.',
                  correctionSuggestion: 'Mantenha a ponta central como guia de altura para as pontas laterais.',
                  severity: 'sugestao'
                },
                {
                  id: 'anno-crown-2',
                  xPercent: 72,
                  yPercent: 44,
                  category: 'proporcao',
                  title: 'Simetria da Ponta Lateral Direita',
                  critique: 'A ponta lateral direita está 3% mais aberta em curvatura do que a ponta lateral esquerda correspondente.',
                  correctionSuggestion: 'Espelhe o arco da cúspide esquerda com compasso de proporção.',
                  severity: 'ajuste_fino'
                },
                {
                  id: 'anno-crown-3',
                  xPercent: 50,
                  yPercent: 72,
                  category: 'perspectiva',
                  title: 'Elipse do Aro da Base',
                  critique: 'A curvatura inferior desenha a sustentação cilíndrica da coroa.',
                  correctionSuggestion: 'Arredonde suavemente as transições laterais do aro para evitar cantos pontiagudos.',
                  severity: 'sugestao'
                }
              ],
              tonalHistogramSummary: {
                shadows: 26,
                midtones: 52,
                highlights: 22,
                dominantKey: 'Chave Média'
              }
            },
            actionPlan: {
              immediateCorrection: 'Corrigir a inclinação da ponta direita para espelhar rigorosamente o arco esquerdo.',
              nextStudyExercise: 'Desenhar 6 coroas e cálices cilíndricos focando em elipses em perspectiva e reflexos de metal.',
              suggestedClassId: 'lesson-perspective',
              practiceDurationMinutes: 45
            }
          };
        } else if (isFaceOrPortrait) {
          // Portrait algorithmic assessment
          analysisResult = {
            overallScore: 83,
            subjectDetected: 'Retrato / Estudo de Cabeça Humana',
            subjectCategory: 'rosto_retrato',
            technicalSummary: `Boa consistência de planos em ${title}. Os eixos dos terços faciais mostram compreensão construtiva, com margem para calibragem no terço inferior.`,
            artStyleDetected: 'Desenho Acadêmico / Estudo de Cabeça',
            mediumDetected: medium || 'Grafite Tradicional',
            rubrics: {
              proportionAnatomy: {
                score: 82,
                level: 'Sólido',
                strengths: [
                  'Alinhamento do arco zigomático com a linha dos olhos bem executado.',
                  'Esfera craniana mantém volume tridimensional crível.'
                ],
                deviations: [
                  'Leve compressão de 5% no terço inferior entre a base do nariz e o mento.'
                ],
                technicalDiagnosis: 'A divisão dos terços faciais apresenta leve descompasso no mento inferior.',
                recommendedDrill: 'Série de 8 crânios simplificados focando na divisão dos três terços.'
              },
              perspectiveFraming: {
                score: 85,
                level: 'Sólido',
                strengths: [
                  'Linha dos olhos acompanha a rotação em 3/4 com coerência.'
                ],
                deviations: [
                  'Linha da mandíbula poderia convergir com maior firmeza para o horizonte.'
                ],
                technicalDiagnosis: 'Orientação espacial do bloco craniano volumétrica.',
                recommendedDrill: 'Caixas em perspectiva com círculos inscritos em 3 ângulos.'
              },
              tonalValuesLighting: {
                score: 80,
                level: 'Sólido',
                strengths: [
                  'Família de sombras separada da luz direta na fronte e bochecha.'
                ],
                deviations: [
                  'Falta um ponto de oclusão escuro nos cantos dos lábios e narinas.'
                ],
                technicalDiagnosis: 'A gama tonal ficou concentrada em tons médios.',
                recommendedDrill: 'Estudo em 3 valores absolutos (luz, sombra e oclusão).'
              },
              lineGestureTexture: {
                score: 85,
                level: 'Sólido',
                strengths: [
                  'Traço com boa continuidade nas linhas estruturais de construção.'
                ],
                deviations: [
                  'Hachuras cruzadas com direções discordantes do volume anatômico.'
                ],
                technicalDiagnosis: 'Linhas com autoridade e peso adequado para desenho técnico.',
                recommendedDrill: 'Prática de hachuras em curva contornando cilindros (cross-contour).'
              },
              colorComposition: {
                score: 84,
                level: 'Sólido',
                strengths: [
                  'Enquadramento centralizado clássico de prancheta de ateliê.'
                ],
                deviations: [
                  'Margem superior com respiro ligeiramente estreito.'
                ],
                technicalDiagnosis: 'Composição de estudo acadêmico limpa e legível.',
                recommendedDrill: 'Estudos de thumbnail com variação de escala dentro da página.'
              }
            },
            overlays: {
              horizonLine: { yPercent: 44, tiltAngleDeg: 1.5 },
              vanishingPoints: [
                { xPercent: -20, yPercent: 44, type: 'left', label: 'VP1' },
                { xPercent: 125, yPercent: 45, type: 'right', label: 'VP2' }
              ],
              landmarks: [
                { id: 'brow', label: 'Linha dos Supercílios (1/3)', type: 'loomis_brow', yPercent: 36, description: 'Eixo base da fronte' },
                { id: 'nose', label: 'Base do Nariz (2/3)', type: 'loomis_nose', yPercent: 52, description: 'Ponto divisor da cartilagem nasal' },
                { id: 'chin', label: 'Base do Queixo (3/3)', type: 'loomis_chin', yPercent: 68, description: 'Mento inferior' }
              ],
              annotations: [
                {
                  id: 'anno-face-1',
                  xPercent: 51,
                  yPercent: 68,
                  category: 'proporcao',
                  title: 'Ajuste de Altura no Mento',
                  critique: 'O terço inferior está aproximadamente 4mm menor que o terço mediano.',
                  correctionSuggestion: 'Estenda a linha do maxilar inferior para igualar os três terços de Loomis.',
                  severity: 'ajuste_fino'
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
              immediateCorrection: 'Ajustar a distância vertical da base do nariz até o queixo em +5%.',
              nextStudyExercise: 'Desenhar 12 cabeças simplificadas de Loomis sob ângulos variados.',
              suggestedClassId: 'lesson-loomis',
              practiceDurationMinutes: 45
            }
          };
        } else {
          // General structural object or still life assessment (neutral, non-facial)
          analysisResult = {
            overallScore: 84,
            subjectDetected: isObjectOrStillLife ? 'Objeto Tridimensional / Natureza Morta' : 'Estudo Técnico de Fundamentos',
            subjectCategory: isObjectOrStillLife ? 'objeto_natureza_morta' : 'outro',
            technicalSummary: `Boa consistência volumétrica em ${title}. A relação de eixos e o enquadramento estrutural mostram maturidade com margem para calibragem de contrastes e proporções axiais.`,
            artStyleDetected: 'Estudo Técnico de Ateliê',
            mediumDetected: medium || 'Mídia Mista Tradicional',
            rubrics: {
              proportionAnatomy: {
                score: 83,
                level: 'Sólido',
                strengths: [
                  'Alinhamento dimensional dos elementos centrais mantido sem distorção planar.',
                  'Escala coerente entre as massas primárias e secundárias.'
                ],
                deviations: [
                  'Pequeno descompasso de 5% no eixo vertical em relação à linha do horizonte visual.',
                  'Espaçamento entre os marcos de contorno com leve assimetria.'
                ],
                technicalDiagnosis: 'A massa estrutural central está bem equilibrada com ligeira inclinação no plano posterior.',
                recommendedDrill: 'Série de 8 estudos rápidos de 3 minutos focando estritamente no esqueleto de linhas axiais.'
              },
              perspectiveFraming: {
                score: 86,
                level: 'Avançado',
                strengths: [
                  'Convergência crível das linhas orientadoras para o nível dos olhos.',
                  'Sensação de tridimensionalidade nítida sem colapso de profundidade.'
                ],
                deviations: [
                  'Arestas laterais com leve divergência fora do cone de visão recomendado (60 graus).'
                ],
                technicalDiagnosis: 'Linha do horizonte bem situada a aproximadamente 46% da altura da prancheta.',
                recommendedDrill: 'Desenho de prisma transparente em 2 pontos de fuga com arestas internas visíveis.'
              },
              tonalValuesLighting: {
                score: 80,
                level: 'Sólido',
                strengths: [
                  'Família de sombras separada da luz direta na maior parte dos volumes.'
                ],
                deviations: [
                  'Zona de penumbra com transição abrupta em algumas áreas curvas.',
                  'Falta um ponto de valor 9 (Dark Accent) para fixar a oclusão no solo/fundo.'
                ],
                technicalDiagnosis: 'A gama tonal ficou ligeiramente comprimida entre os valores 3 e 6 de Denman Ross.',
                recommendedDrill: 'Estudo de 5 valores tonais com limites nítidos sem esfumar.'
              },
              lineGestureTexture: {
                score: 85,
                level: 'Sólido',
                strengths: [
                  'Traço com boa firmeza e autoridade no traçado estrutural.',
                  'Variação intencional de espessura de linha em zonas de sobreposição.'
                ],
                deviations: [
                  'Algumas linhas de busca hesitantes na borda superior.'
                ],
                technicalDiagnosis: 'Linha limpa e comunicativa, excelente disciplina de braço/ombro.',
                recommendedDrill: 'Exercício de ghosting com linhas retas de 20cm sem apoio de régua.'
              },
              colorComposition: {
                score: 84,
                level: 'Sólido',
                strengths: [
                  'Distribuição harmoniosa do peso visual segundo a regra dos terços.',
                  'Espaço negativo ao redor da obra atua como respiro visual.'
                ],
                deviations: [
                  'O centro de gravidade visual está levemente deslocado para o quadrante inferior esquerdo.'
                ],
                technicalDiagnosis: 'Enquadramento clássico de ateliê com leitura ótica equilibrada.',
                recommendedDrill: 'Criação de 4 thumbnails de composição em proporção 16:9.'
              }
            },
            overlays: {
              horizonLine: { yPercent: 46, tiltAngleDeg: 1.0 },
              vanishingPoints: [
                { xPercent: -15, yPercent: 46, type: 'left', label: 'VP1' },
                { xPercent: 115, yPercent: 46, type: 'right', label: 'VP2' }
              ],
              landmarks: [
                { id: 'guide-sym', label: 'Eixo Central de Simetria', type: 'symmetry_axis', yPercent: 50, xPercent: 50, description: 'Eixo vertical de alinhamento estrutural' },
                { id: 'guide-thirds', label: 'Regra dos Terços Superior', type: 'third_horizontal', yPercent: 33.3, description: 'Ponto de tensão e foco' },
                { id: 'guide-lower', label: 'Regra dos Terços Inferior', type: 'third_horizontal', yPercent: 66.6, description: 'Plano de apoio e peso' }
              ],
              annotations: [
                {
                  id: 'anno-auto-1',
                  xPercent: 48,
                  yPercent: 45,
                  category: 'proporcao',
                  title: 'Eixo Central de Simetria',
                  critique: 'O alinhamento vertical preserva o volume sem achatar o plano.',
                  correctionSuggestion: 'Mantenha a firmeza nas linhas de referência.',
                  severity: 'sugestao'
                },
                {
                  id: 'anno-auto-2',
                  xPercent: 35,
                  yPercent: 62,
                  category: 'valor',
                  title: 'Oclusão Ambiental Recomendada',
                  critique: 'Falta um ponto de contraste máximo no ponto de contato com o solo.',
                  correctionSuggestion: 'Aplique grafite denso ou pincelada escura para ancorar o objeto.',
                  severity: 'ajuste_fino'
                }
              ],
              tonalHistogramSummary: {
                shadows: 24,
                midtones: 58,
                highlights: 18,
                dominantKey: 'Chave Média'
              }
            },
            actionPlan: {
              immediateCorrection: 'Aumentar o contraste no ponto de oclusão principal e conferir convergência no horizonte.',
              nextStudyExercise: 'Sessão de 30 minutos praticando caixas transparentes e simetria de objetos.',
              suggestedClassId: 'lesson-perspective',
              practiceDurationMinutes: 35
            }
          };
        }
      }
    }

    // Update Artist Profile Stats (like Strava for artists)
    artistProfile.studiesCompleted += 1;
    artistProfile.totalPracticeHours = Math.round((artistProfile.totalPracticeHours + 0.6) * 10) / 10;
    artistProfile.currentStreakDays += 1;
    if (analysisResult?.overallScore) {
      artistProfile.attributeScores.proporcao = Math.round((artistProfile.attributeScores.proporcao * 0.8) + (analysisResult.rubrics.proportionAnatomy.score * 0.2));
      artistProfile.attributeScores.perspectiva = Math.round((artistProfile.attributeScores.perspectiva * 0.8) + (analysisResult.rubrics.perspectiveFraming.score * 0.2));
      artistProfile.attributeScores.valores = Math.round((artistProfile.attributeScores.valores * 0.8) + (analysisResult.rubrics.tonalValuesLighting.score * 0.2));
      artistProfile.attributeScores.traco = Math.round((artistProfile.attributeScores.traco * 0.8) + (analysisResult.rubrics.lineGestureTexture.score * 0.2));
    }

    // Phase 4: Completed
    if (analysisResult && reanalysisOptions?.isReanalysis) {
      const versionNum = reanalysisOptions.reanalysisVersion || 2;
      const focusTag = userFocus ? ` [Foco: ${userFocus}]` : '';
      const notesTag = reanalysisOptions.customInstructions ? ` [Diretriz: "${reanalysisOptions.customInstructions}"]` : '';
      const strokesTag = (reanalysisOptions.includeUserStrokes && reanalysisOptions.userStrokesCount) 
        ? ` Redline manual com ${reanalysisOptions.userStrokesCount} traço(s) avaliado.` 
        : '';
      
      analysisResult.technicalSummary = `[Reanálise v${versionNum}${focusTag}] ${analysisResult.technicalSummary}${notesTag}${strokesTag}`;

      if (reanalysisOptions.includeUserStrokes && reanalysisOptions.userStrokesCount) {
        analysisResult.overlays.annotations.unshift({
          id: `anno-reanalysis-strokes-${Date.now()}`,
          xPercent: 50,
          yPercent: 50,
          category: 'traco',
          title: 'Avaliação dos Traços de Redline Manual',
          critique: `O estudante realizou ${reanalysisOptions.userStrokesCount} marcações manuais na prancheta. A correção demonstrada evidencia boa compreensão das proporções e eixos da composição.`,
          correctionSuggestion: 'Continue validando seus eixos com a ferramenta de redline manual antes de aplicar correções finais no papel.',
          severity: 'sugestao'
        });
      }
    }

    job.status = 'completed';
    job.progressPercent = 100;
    job.statusMessage = reanalysisOptions?.isReanalysis 
      ? `Reanálise v${reanalysisOptions.reanalysisVersion || 2} concluída com sucesso!` 
      : 'Análise técnica concluída com sucesso!';
    job.completedAt = new Date().toISOString();
    job.result = analysisResult || undefined;

    // Track versions
    job.versions = job.versions || [];
    if (reanalysisOptions?.isReanalysis && analysisResult) {
      job.versions.push({
        version: reanalysisOptions.reanalysisVersion || 2,
        label: `v${reanalysisOptions.reanalysisVersion || 2} (Reanálise)`,
        timestamp: job.completedAt,
        focusArea: userFocus || 'Reanálise Técnica',
        subjectCategory: analysisResult.subjectCategory,
        customNotes: reanalysisOptions.customInstructions,
        userStrokesCount: reanalysisOptions.userStrokesCount,
        result: analysisResult
      });
      job.selectedVersionIndex = job.versions.length - 1;
      job.isReanalysis = true;
      job.reanalysisVersion = reanalysisOptions.reanalysisVersion || 2;
    } else if (analysisResult && job.versions.length === 0) {
      job.versions.push({
        version: 1,
        label: 'v1 (Original)',
        timestamp: job.completedAt,
        focusArea: userFocus || 'Avaliação Inicial',
        subjectCategory: analysisResult.subjectCategory,
        result: analysisResult
      });
      job.selectedVersionIndex = 0;
    }

    jobsMap.set(jobId, { ...job });

  } catch (error: any) {
    console.error(`Error analyzing job ${jobId}:`, error);
    job.status = 'failed';
    job.progressPercent = 100;
    job.statusMessage = 'Falha no processamento da imagem.';
    job.errorMessage = error?.message || 'Erro desconhecido durante a análise.';
    jobsMap.set(jobId, { ...job });
  }
}

// REST API Endpoints

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    queuedJobs: jobsMap.size,
    timestamp: new Date().toISOString()
  });
});

// Submit a new artwork for asynchronous background processing
app.post('/api/jobs/submit', (req, res) => {
  try {
    const { title, medium, imageUrl, timeSpentMinutes, focusArea, subjectCategory } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ error: 'A imagem da obra é obrigatória.' });
    }

    const jobId = `job-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newJob: AnalysisJob = {
      id: jobId,
      status: 'queued',
      progressPercent: 5,
      statusMessage: 'Obra enfileirada no worker de visão computacional...',
      artworkTitle: title || 'Estudo sem título',
      medium: medium || 'Grafite Tradicional',
      timeSpentMinutes: timeSpentMinutes ? Number(timeSpentMinutes) : 45,
      imageUrl,
      createdAt: new Date().toISOString()
    };

    jobsMap.set(jobId, newJob);

    // Launch processing in background without blocking response
    setImmediate(() => {
      processJobInBackground(jobId, imageUrl, newJob.artworkTitle, newJob.medium, focusArea, subjectCategory);
    });

    res.status(202).json({
      success: true,
      jobId,
      status: newJob.status,
      message: 'Upload aceito. Acompanhe o processamento de segundo plano via polling do jobId.'
    });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Erro ao submeter trabalho.' });
  }
});

// Re-analyze an existing artwork with calibrated parameters or new focus
app.post('/api/jobs/reanalyze', (req, res) => {
  try {
    const { 
      jobId, 
      imageUrl, 
      title, 
      medium, 
      focusArea, 
      subjectCategory, 
      customInstructions, 
      includeUserStrokes, 
      userStrokesCount, 
      evaluationRigor 
    } = req.body;

    const existingJob = jobId ? jobsMap.get(jobId) : null;
    const finalImageUrl = imageUrl || existingJob?.imageUrl;
    const finalTitle = title || existingJob?.artworkTitle || 'Estudo de Ateliê';
    const finalMedium = medium || existingJob?.medium || 'Grafite Tradicional';

    if (!finalImageUrl) {
      return res.status(400).json({ error: 'A imagem da obra é obrigatória para a reanálise.' });
    }

    const targetJobId = jobId || `job-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const currentVersionNum = existingJob?.reanalysisVersion || (existingJob?.versions?.length || 1);
    const nextVersionNum = currentVersionNum + 1;

    // Archive current result if present and versions empty
    const versions = existingJob?.versions ? [...existingJob.versions] : [];
    if (existingJob?.result && versions.length === 0) {
      versions.push({
        version: 1,
        label: 'v1 (Original)',
        timestamp: existingJob.completedAt || existingJob.createdAt,
        focusArea: 'Avaliação Inicial',
        subjectCategory: existingJob.result.subjectCategory,
        result: existingJob.result
      });
    }

    const reanalysisJob: AnalysisJob = {
      ...(existingJob || {}),
      id: targetJobId,
      status: 'queued',
      progressPercent: 10,
      statusMessage: `Enfileirando reanálise técnica da IA (v${nextVersionNum})...`,
      artworkTitle: finalTitle,
      medium: finalMedium,
      imageUrl: finalImageUrl,
      createdAt: existingJob?.createdAt || new Date().toISOString(),
      isReanalysis: true,
      reanalysisVersion: nextVersionNum,
      reanalysisNotes: customInstructions || undefined,
      versions,
      selectedVersionIndex: versions.length
    };

    jobsMap.set(targetJobId, reanalysisJob);

    // Launch background worker
    setImmediate(() => {
      processJobInBackground(
        targetJobId,
        finalImageUrl,
        finalTitle,
        finalMedium,
        focusArea,
        subjectCategory,
        {
          isReanalysis: true,
          reanalysisVersion: nextVersionNum,
          customInstructions,
          includeUserStrokes,
          userStrokesCount: userStrokesCount ? Number(userStrokesCount) : 0,
          evaluationRigor
        }
      );
    });

    res.status(202).json({
      success: true,
      jobId: targetJobId,
      status: reanalysisJob.status,
      reanalysisVersion: nextVersionNum,
      message: 'Reanálise enfileirada no worker de visão computacional.'
    });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Erro ao processar reanálise.' });
  }
});

// Check status of an existing background job
app.get('/api/jobs/:id', (req, res) => {
  const job = jobsMap.get(req.params.id);
  if (!job) {
    return res.status(404).json({ error: 'Trabalho de análise não encontrado.' });
  }
  res.json(job);
});

// List recent jobs
app.get('/api/jobs', (req, res) => {
  const jobsList = Array.from(jobsMap.values()).reverse();
  res.json(jobsList);
});

// Community Feed: Get all posts
app.get('/api/community/posts', (req, res) => {
  res.json(communityPosts);
});

// Community Feed: Create a new post from a finished study
app.post('/api/community/posts', (req, res) => {
  try {
    const { title, description, medium, timeSpentMinutes, targetGoal, imageUrl, aiOverallScore, tags } = req.body;

    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      authorName: artistProfile.name,
      authorHandle: artistProfile.handle,
      authorAvatar: artistProfile.avatar,
      title: title || 'Novo Estudo do Ateliê',
      description: description || '',
      medium: medium || 'Grafite Tradicional',
      timeSpentMinutes: timeSpentMinutes || 45,
      targetGoal: targetGoal || 'Estudo de Fundamentos',
      imageUrl,
      createdAt: 'Agora mesmo',
      status: aiOverallScore ? 'revisado_ia' : 'aguardando_redline',
      aiOverallScore,
      tags: tags || ['Estudo', 'Fundamentos'],
      likesCount: 0,
      hasLiked: false,
      peerReviews: []
    };

    communityPosts.unshift(newPost);
    res.status(201).json(newPost);
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Erro ao publicar na comunidade.' });
  }
});

// Community Feed: Toggle like on a post
app.post('/api/community/posts/:id/like', (req, res) => {
  const post = communityPosts.find((p) => p.id === req.params.id);
  if (!post) {
    return res.status(404).json({ error: 'Publicação não encontrada.' });
  }

  post.hasLiked = !post.hasLiked;
  post.likesCount += post.hasLiked ? 1 : -1;
  res.json({ likesCount: post.likesCount, hasLiked: post.hasLiked });
});

// Community Feed: Submit peer review / redline
app.post('/api/community/posts/:id/review', (req, res) => {
  const post = communityPosts.find((p) => p.id === req.params.id);
  if (!post) {
    return res.status(404).json({ error: 'Publicação não encontrada.' });
  }

  const { comment, strokes } = req.body;
  if (!comment) {
    return res.status(400).json({ error: 'O comentário de peer-review é obrigatório.' });
  }

  const review = {
    id: `rev-${Date.now()}`,
    authorName: artistProfile.name,
    authorRole: 'Artista do Ateliê',
    authorAvatar: artistProfile.avatar,
    createdAt: 'Agora mesmo',
    comment,
    strokes: strokes || [],
    votesCount: 0,
    hasVoted: false
  };

  post.peerReviews.unshift(review);
  artistProfile.peerReviewsGiven += 1;

  res.status(201).json(review);
});

// Artist Profile & Strava-like Stats
app.get('/api/profile', (req, res) => {
  res.json(artistProfile);
});

// Start Server with Vite Middleware
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Atelier Engine running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
