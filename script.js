// Variáveis Globais
let currentSlide = 0;
let track;
let slides;
let totalSlides;
let quizForm;
let quizResult; // Div onde o resultado será exibido
let selectedQuestions = []; // Armazena as questões sorteadas para o quiz atual
let prevButton; // Botão de navegação "Anterior"
let nextButton; // Botão de navegação "Próximo"

// ============================================================
// BANCO DE QUESTÕES: ANÁLISE DE SISTEMAS E PROJETO DE INTERAÇÃO
// ============================================================
const questionsPool = [
  {
    q: "Qual o principal objetivo da Análise de Sistemas?",
    options: ["Escrever código Java", "Testar o software final", "Entender e especificar requisitos do negócio", "Criar o design visual das telas"],
    answer: 2 // Resposta correta é o índice 2
  },
  {
    q: "Entrevistas e questionários são técnicas usadas principalmente em qual etapa?",
    options: ["Programação e Codificação", "Levantamento de Requisitos", "Testes de Usabilidade", "Implantação do Sistema"],
    answer: 1
  },
  {
    q: "Diagramas de Casos de Uso e Diagramas de Classes pertencem a qual abordagem/notação?",
    options: ["Projeto de Interação (IxD)", "Gerenciamento de Projeto Ágil", "Modelagem de Sistemas (UML)", "Teste de Caixa Preta"],
    answer: 2
  },
  {
    q: "O Projeto de Interação (IxD) foca primariamente em:",
    options: ["Desempenho do banco de dados", "Segurança da rede do servidor", "Como o usuário humano interage com o sistema", "Estratégias de marketing do produto"],
    answer: 2
  },
  {
    q: "Qual princípio de IxD se refere à facilidade com que um usuário pode usar e aprender a usar um sistema?",
    options: ["Acessibilidade (WCAG)", "Feedback Visual e Sonoro", "Consistência da Interface", "Usabilidade"],
    answer: 3
  },
  {
    q: "A técnica de criar representações fictícias, mas realistas, de usuários típicos do sistema é chamada de:",
    options: ["Wireframing Estrutural", "Criação de Personas", "Teste A/B de Cores", "Prototipagem de Papel"],
    answer: 1
  },
  {
    q: "Esboços de baixa fidelidade, focados principalmente na estrutura, layout e conteúdo das telas, são conhecidos como:",
    options: ["Protótipos de alta fidelidade", "Wireframes", "Mapas de Site Completos", "Guias de Estilo Visual"],
    answer: 1
  },
  {
    q: "Qual o propósito principal de se criar um Protótipo interativo durante o design?",
    options: ["Servir como documentação final do código", "Substituir a necessidade de testes", "Testar fluxos de navegação e interações antes de codificar", "Apresentar o design gráfico finalizado"],
    answer: 2
  },
  {
    q: "Como a Análise de Sistemas e o Projeto de Interação (IxD) geralmente se relacionam?",
    options: ["São exatamente a mesma disciplina", "São completamente independentes e não se influenciam", "A Análise define 'o quê' (requisitos) e o IxD define 'como' (interação)", "O IxD sempre deve ser concluído antes da Análise começar"],
    answer: 2
  },
   {
    q: "Qual das seguintes ferramentas é comumente utilizada para criar Wireframes e Protótipos interativos?",
    options: ["Microsoft Excel", "Adobe Photoshop", "Figma ou Adobe XD", "Visual Studio Code"],
    answer: 2 // Figma, Sketch, Adobe XD, Axure são comuns
  }
];

// ============================================================
// INICIALIZAÇÃO E EVENT LISTENERS
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  initializeElements();
  if (track && slides.length > 0) {
      updateCarousel(); // Garante o estado inicial correto
  } else {
      console.error("Falha ao inicializar elementos do carrossel.");
  }
});

window.addEventListener("resize", () => {
    // Apenas chama updateCarousel, que já pega a nova clientWidth
    if (track && slides.length > 0) {
        updateCarousel();
    }
});

// ============================================================
// FUNÇÕES PRINCIPAIS
// ============================================================

/**
 * Obtém referências para os elementos HTML essenciais.
 */
function initializeElements() {
  track = document.getElementById("track");
  slides = document.querySelectorAll(".slide");
  totalSlides = slides.length;
  quizForm = document.getElementById("quiz-form");
  quizResult = document.getElementById("quiz-result"); // Div de resultado

  // Obtém botões de navegação
  const navButtons = document.querySelectorAll('.nav-buttons button');
  if (navButtons.length === 2) {
    prevButton = navButtons[0];
    nextButton = navButtons[1];
  } else {
      console.error("Botões de navegação Anterior/Próximo não encontrados.");
  }

   // Verifica se todos os elementos essenciais foram encontrados
   if (!track || !slides || !quizForm || !quizResult) {
       console.error("Um ou mais elementos essenciais (track, slides, quizForm, quizResult) não foram encontrados no DOM.");
   }
}

/**
 * Prepara e navega para o slide do quiz.
 */
function startQuiz() {
  selectedQuestions = getRandomQuestions(5); // Pega 5 questões aleatórias
  if (selectedQuestions.length === 0) {
      console.error("Nenhuma questão selecionada para o quiz.");
      // Poderia exibir uma mensagem para o usuário aqui
      return;
  }
  const quizSlideIndex = Array.from(slides).findIndex(slide => slide.id === 'quiz-slide');
  if (quizSlideIndex !== -1) {
      goToSlide(quizSlideIndex); // Navega para o slide do quiz
       // buildQuiz() será chamado dentro do goToSlide se o índice for o do quiz
  } else {
      console.error("Slide do quiz (#quiz-slide) não encontrado!");
  }
}

/**
 * Seleciona um número específico de questões aleatórias do pool.
 * @param {number} numQuestions - Quantidade de questões a selecionar.
 * @returns {Array} Array com as questões selecionadas.
 */
function getRandomQuestions(numQuestions) {
  if (!questionsPool || questionsPool.length === 0) {
      console.error("Banco de questões está vazio ou inválido.");
      return [];
  }
  const shuffled = [...questionsPool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(numQuestions, questionsPool.length)); // Garante não pegar mais que o disponível
}

/**
 * Constrói dinamicamente o formulário do quiz no HTML.
 */
function buildQuiz() {
  if (!quizForm) {
      console.error("Elemento do formulário do quiz (#quiz-form) não encontrado.");
      return;
  }
  quizForm.innerHTML = ""; // Limpa o formulário anterior

  selectedQuestions.forEach((q, idx) => {
    const questionEl = document.createElement("div");
    questionEl.className = "question"; // Classe para estilização

    // Título da Questão
    const title = document.createElement("p");
    // title.className = "quiz-question-text"; // Classe opcional
    title.innerHTML = `<strong>${idx + 1}. ${q.q}</strong>`; // Usa innerHTML para negrito
    questionEl.appendChild(title);

    // Container para as Opções
    const optionsDiv = document.createElement('div');
    optionsDiv.className = 'quiz-options'; // Classe para estilização

    // Cria os Radio Buttons para cada opção
    q.options.forEach((opt, i) => {
      const label = document.createElement("label");
      const radio = document.createElement("input");
      radio.type = "radio";
      radio.name = `q${idx}`; // Nome único para o grupo de radios da questão
      radio.value = i;       // Valor é o índice da opção
      radio.required = true; // Torna a resposta obrigatória

      label.appendChild(radio);
      label.appendChild(document.createTextNode(` ${opt}`)); // Adiciona o texto da opção
      optionsDiv.appendChild(label); // Adiciona a label ao container de opções
    });

    questionEl.appendChild(optionsDiv); // Adiciona opções à div da questão
    quizForm.appendChild(questionEl);   // Adiciona a questão ao formulário
  });

  // Adiciona o botão de finalizar DENTRO do formulário
  const submitBtn = document.createElement("button");
  submitBtn.type = "submit"; // IMPORTANTE: para acionar o onsubmit do form
  submitBtn.className = "btn"; // Classe genérica de botão (pode adicionar mais)
  submitBtn.innerHTML = '<i class="fas fa-check-circle"></i> Finalizar Quiz';
  quizForm.appendChild(submitBtn);

  // Adiciona o listener para o SUBMIT do formulário
  quizForm.onsubmit = function(event) {
      event.preventDefault(); // Previne o recarregamento padrão da página
      submitQuiz();         // Chama a função que processa as respostas
  };
}

/**
 * Processa as respostas do quiz, calcula e exibe os resultados.
 */
function submitQuiz() {
  const results = calculateResults();
  displayResults(results);
  const resultSlideIndex = Array.from(slides).findIndex(slide => slide.id === 'result-slide');
   if (resultSlideIndex !== -1) {
      goToSlide(resultSlideIndex); // Navega para o slide de resultado
   } else {
       console.error("Slide de resultado (#result-slide) não encontrado!");
   }
}

/**
 * Calcula a pontuação e detalha as respostas do usuário.
 * @returns {object} Objeto com pontuação, total e detalhes de cada questão.
 */
function calculateResults() {
  let score = 0;
  const resultsDetails = []; // Array para guardar detalhes de cada resposta

  selectedQuestions.forEach((q, i) => {
    const selectedInput = quizForm.querySelector(`input[name="q${i}"]:checked`);
    const userAnswerIndex = selectedInput ? parseInt(selectedInput.value) : null; // Índice da resposta do usuário
    const isCorrect = userAnswerIndex === q.answer; // Compara com a resposta correta

    if (isCorrect) {
        score++; // Incrementa a pontuação
    }

    resultsDetails.push({
      question: q.q,
      userAnswer: userAnswerIndex !== null ? q.options[userAnswerIndex] : 'Não respondida',
      correctAnswer: q.options[q.answer],
      isCorrect: isCorrect
    });
  });

  return {
    score: score,
    total: selectedQuestions.length,
    details: resultsDetails
  };
}

/**
 * Gera e insere o HTML dos resultados no slide correspondente.
 * @param {object} results - O objeto retornado por calculateResults.
 */
function displayResults(results) {
    if (!quizResult) {
        console.error("Elemento para exibir resultados (#quiz-result) não encontrado.");
        return;
    }

    let html = `<div class="results-container">`; // Inicia container dos resultados

    // Itera sobre cada questão respondida
    results.details.forEach((res, i) => {
        html += `
      <div class="question-result ${res.isCorrect ? 'correct' : 'incorrect'}">
        <p><strong>${i + 1}. ${res.question}</strong></p>
        <p class="user-answer">Sua resposta: ${res.userAnswer}</p>
        ${!res.isCorrect ? `<p class="correct-answer">Resposta correta: ${res.correctAnswer}</p>` : ''}
        <p class="result-status">
          ${res.isCorrect
            ? '<i class="fas fa-check"></i> Acertou!'
            : '<i class="fas fa-times"></i> Errou!'}
        </p>
      </div>
    `;
    });

    html += `</div>`; // Fecha o results-container

    // Calcula a porcentagem e define a mensagem final
    const percentage = results.total > 0 ? (results.score / results.total) * 100 : 0;
    let message = "";

    if (percentage === 100) {
        message = `🎉 Excelente! Você acertou todas as ${results.total} questões!`;
    } else if (percentage >= 70) {
        message = `👍 Muito bem! Você acertou ${results.score} de ${results.total} (${percentage.toFixed(0)}%)!`;
    } else if (percentage >= 50) {
        message = `🙂 Bom esforço! Você acertou ${results.score} de ${results.total} (${percentage.toFixed(0)}%). Continue revisando!`;
    } else {
        message = `🤔 Você acertou ${results.score} de ${results.total} (${percentage.toFixed(0)}%). Que tal revisar o conteúdo e tentar de novo?`;
    }

    // Adiciona o placar final e o botão de voltar/refazer
    html += `
    <div class="final-score">
      <h3>${message}</h3>
      <button onclick="goToSlide(0)" class="return-btn btn">
          <i class="fas fa-redo"></i> Voltar ao Início / Refazer
      </button>
    </div>
  `;

    quizResult.innerHTML = html; // Insere o HTML gerado na div de resultado
}


/**
 * Navega para o slide anterior ou próximo usando os botões fixos.
 * @param {number} direction - (-1) para anterior, (1) para próximo.
 */
function navigate(direction) {
  // Verifica se o botão correspondente está desabilitado
  const targetButton = direction === 1 ? nextButton : prevButton;
  if (targetButton && targetButton.disabled) {
      // console.log("Navegação ignorada: botão desabilitado.");
      return; // Sai da função se o botão estiver desabilitado
  }

  if (totalSlides > 0) {
      currentSlide = (currentSlide + direction + totalSlides) % totalSlides;
      updateCarousel();
  }
}

/**
 * Navega diretamente para um slide específico pelo índice.
 * @param {number} index - O índice do slide de destino.
 */
function goToSlide(index) {
  if (index >= 0 && index < totalSlides) {
    currentSlide = index;
    updateCarousel(); // Atualiza a exibição do slide e o estado dos botões

    // Se o slide de destino for o quiz, constrói o formulário
    if (slides[currentSlide].id === 'quiz-slide') {
      buildQuiz();
    }
  } else {
      console.warn(`Tentativa de ir para slide inválido: ${index}`);
  }
}

/**
 * Atualiza a posição visual do carrossel (translateX).
 */
function updateCarousel() {
   if (!track) return; // Sai se o track não foi encontrado

  const slideWidth = track.clientWidth; // Largura do container visível
   if (slideWidth > 0) {
        // Move o track horizontalmente para mostrar o slide atual
        track.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
    } else {
        // Se a largura for 0 (pode acontecer durante carregamento/oculto), adia ou loga
        console.warn("Largura do track é 0. Transform não aplicado.");
        // requestAnimationFrame(updateCarousel); // Poderia tentar de novo no próximo frame
    }


  // Atualiza a classe 'active' nos slides (opcional, mas útil para estilização/depuração)
  slides.forEach((slide, index) => {
    slide.classList.toggle('active', index === currentSlide);
  });

  // ATUALIZA O ESTADO DOS BOTÕES DE NAVEGAÇÃO (HABILITA/DESABILITA)
  updateNavigationButtons();
}

/**
 * Habilita ou desabilita os botões de navegação "Anterior" e "Próximo"
 * com base no slide atual.
 */
function updateNavigationButtons() {
    if (!prevButton || !nextButton) return; // Sai se os botões não existem

    // Índices dos slides especiais
    const conclusionSlideIndex = totalSlides - 3; // Assumindo Conclusão, Quiz, Resultado no final
    const firstSlideIndex = 0;
    const lastInteractiveSlideIndex = conclusionSlideIndex -1; // O último slide antes da conclusão

    // Desabilita "Anterior" no primeiro slide
    prevButton.disabled = (currentSlide === firstSlideIndex);

    // Desabilita "Próximo" no slide de Conclusão, Quiz e Resultado
    nextButton.disabled = (currentSlide >= conclusionSlideIndex);

    // Aplicar estilos visuais para desabilitado (já feito no CSS com :disabled)
}
