document.addEventListener('DOMContentLoaded', function () {
  // Utility functions for show/hide using the .hidden class
  function showElement(el) {
    if (el) el.classList.remove('hidden');
  }
  function hideElement(el) {
    if (el) el.classList.add('hidden');
  }

  // DOM elements
  const startBtn = document.getElementById('start-simulation');
  const simSelection = document.getElementById('simulation-selection');
  const simTypeSelection = document.getElementById('simulation-type-selection');
  const topicSelect = document.getElementById('topic');
  const difficultySelect = document.getElementById('difficulty');
  const simArea = document.getElementById('simulation-area');
  const themeToggle = document.getElementById('theme-toggle');
  const footerYear = document.getElementById('year');

  // Concepts data will be loaded from JSON
  let conceptsData = {};

  // Fetch concepts.json
  fetch('concepts.json')
    .then(response => response.json())
    .then(data => {
      conceptsData = data;
      // Populate topic dropdown if needed
      if (topicSelect) {
        topicSelect.innerHTML = '<option value="">-- Select a Topic --</option>';
        Object.keys(conceptsData).forEach(topic => {
          const option = document.createElement('option');
          option.value = topic;
          option.textContent = topic;
          topicSelect.appendChild(option);
        });
      }
    })
    .catch(err => {
      alert('Failed to load concept notes. Please refresh or contact support.');
      console.error('Failed to load concepts.json:', err);
    });

  footerYear.textContent = new Date().getFullYear();

  // Show simulation selection when Start Simulation is clicked
  if (startBtn && simSelection) {
    startBtn.addEventListener('click', () => {
      hideElement(document.getElementById('home'));
      showElement(simSelection);
    });
  }

  // Show simulation type selection when topic and difficulty are chosen
  if (topicSelect && difficultySelect && simTypeSelection) {
    topicSelect.addEventListener('change', () => {
      if (topicSelect.value && difficultySelect.value) {
        showElement(simTypeSelection);
      } else {
        hideElement(simTypeSelection);
        if (simArea) simArea.innerHTML = '';
      }
    });
    difficultySelect.addEventListener('change', () => {
      if (topicSelect.value && difficultySelect.value) {
        showElement(simTypeSelection);
      } else {
        hideElement(simTypeSelection);
        if (simArea) simArea.innerHTML = '';
      }
    });
  }

  // Simulation type button handler
  if (simTypeSelection && simArea) {
    simTypeSelection.addEventListener('click', (e) => {
      if (e.target.tagName === 'BUTTON') {
        const simulationType = e.target.getAttribute('data-type');
        const topic = topicSelect.value;
        const difficulty = difficultySelect.value;
        simArea.innerHTML = ''; // Clear previous content

        if (simulationType === 'concept') {
          loadConceptExplanation(topic, difficulty);
        } else if (simulationType === 'problem') {
          generateProblem(topic, difficulty);
        } else if (simulationType === 'application') {
          launchGraphSimulation();
        } else {
          simArea.innerHTML = '<p>Simulation for this selection is coming soon!</p>';
        }
        showElement(simArea);
      }
    });
  }

  function loadConceptExplanation(topic, difficulty) {
    // Map dropdown values to conceptsData keys
    const topicMap = {
      "calculus-derivatives": "Calculus - Derivatives",
      "linear-algebra": "Linear Algebra",
      "differential-equations": "Differential Equations",
      "probability-basics": "Probability"
    };
    const difficultyMap = {
      "foundations": "foundation",
      "core-concepts": "core concept",
      "applied": "applied",
      "advanced": "advanced",
      "pre-university": "pre-university",
      "engineering": "engineering"
    };

    const topicKey = topicMap[topic] || topic;
    const difficultyKey = difficultyMap[difficulty] || difficulty;

    const notes =
      conceptsData[topicKey] && conceptsData[topicKey][difficultyKey]
        ? conceptsData[topicKey][difficultyKey]
        : null;

    if (!notes) {
      simArea.innerHTML += `<p>No concept notes found for this topic and level.</p>`;
      return;
    }

    // Theorems (support array of objects or strings)
    let theoremsHTML = "";
    if (notes.theorems) {
      theoremsHTML = `<h4>Theorems</h4><ul>`;
      notes.theorems.forEach(t => {
        if (typeof t === "string") {
          theoremsHTML += `<li>${t}</li>`;
        } else {
          theoremsHTML += `<li>
            <strong>${t.name}:</strong> ${t.statement}
            ${t.example ? `<br><em>Example:</em> ${t.example}` : ""}
          </li>`;
        }
      });
      theoremsHTML += `</ul>`;
    }

    // Applications (support array of objects or strings)
    let applicationsHTML = "";
    if (notes.applications) {
      applicationsHTML = `<h4>Applications</h4><ul>`;
      if (Array.isArray(notes.applications)) {
        notes.applications.forEach(a => {
          if (typeof a === "string") {
            applicationsHTML += `<li>${a}</li>`;
          } else {
            applicationsHTML += `<li>
              <strong>${a.name}:</strong> ${a.explanation}
            </li>`;
          }
        });
      } else {
        applicationsHTML += `<li>${notes.applications}</li>`;
      }
      applicationsHTML += `</ul>`;
    }

    // Postulates, Types, Formulas
    const postulatesHTML = notes.postulates
      ? `<h4>Postulates</h4><ul>${notes.postulates.map(p => `<li>${p}</li>`).join('')}</ul>`
      : '';
    const typesHTML = notes.types
      ? `<h4>Types</h4><ul>${notes.types.map(t => `<li>${t}</li>`).join('')}</ul>`
      : '';
    const formulasHTML = notes.formulas
      ? `<h4>Key Formulas</h4><ul>${notes.formulas.map(f => `<li>${f}</li>`).join('')}</ul>`
      : '';

    // Example
    const exampleHTML = notes.example
      ? `<h4>Example</h4><p>${notes.example}</p>`
      : '';

    simArea.innerHTML += `
      <div id="concept-module">
        <h4>Definition</h4>
        <p>${notes.definition || ''}</p>
        ${theoremsHTML}
        ${postulatesHTML}
        ${typesHTML}
        ${formulasHTML}
        ${exampleHTML}
        ${applicationsHTML}
      </div>
    `;
  }

  function randomPolynomial(degree = 2) {
    // Generates a random polynomial string, e.g., "3*x^2 + 2*x + 1"
    let terms = [];
    for (let i = degree; i >= 1; i--) {
      const coeff = Math.floor(Math.random() * 5) + 1;
      terms.push(`${coeff}*x^${i}`);
    }
    const constant = Math.floor(Math.random() * 10);
    terms.push(constant.toString());
    return terms.join(' + ');
  }

  function randomMatrix(size = 2) {
    let matrix = [];
    for (let i = 0; i < size; i++) {
      let row = [];
      for (let j = 0; j < size; j++) {
        row.push(Math.floor(Math.random() * 9) + 1);
      }
      matrix.push(`[${row.join(',')}]`);
    }
    return `[${matrix.join(',')}]`;
  }

  function randomDifferentialEquation(level = 1) {
    // More complex ODEs for higher levels
    if (level > 3) {
      // e.g., dy/dx = 2*x^2 + 3*x + 1
      return `dy/dx=${randomPolynomial(Math.min(level, 3))}`;
    }
    const coeff = Math.floor(Math.random() * 5) + 1;
    const power = Math.floor(Math.random() * 2) + 1;
    return `dy/dx=${coeff}*x^${power}`;
  }

  function randomProbabilityExpr(level = 1) {
    const denoms = [2, 4, 6, 8, 10, 12, 20];
    const d1 = denoms[Math.floor(Math.random() * denoms.length)];
    const d2 = denoms[Math.floor(Math.random() * denoms.length)];
    if (level > 2) {
      // More complex: (1/6)+(1/4)*(1/2)
      return `(1/${d1})+((1/${d2})*1/${denoms[Math.floor(Math.random() * denoms.length)]})`;
    }
    const ops = ['+', '*'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    return `(1/${d1})${op}(1/${d2})`;
  }

  function generateProblem(topic, difficulty) {
    let problemText = '';
    let equation = '';
    let api = '';

    // Map difficulty to degree/complexity
    const diffMap = {
      "foundations": 1,
      "core-concepts": 2,
      "applied": 3,
      "advanced": 4,
      "pre-university": 5,
      "engineering": 6
    };
    const level = diffMap[difficulty] || 2;

    // Problem types by level
    let problemTypes = [];
    if (level === 1) {
      problemTypes = ['direct', 'concept'];
    } else if (level === 2) {
      problemTypes = ['direct', 'concept', 'theorem'];
    } else if (level === 3) {
      problemTypes = ['direct', 'statement', 'theorem', 'concept'];
    } else if (level >= 4) {
      problemTypes = ['direct', 'statement', 'theorem', 'concept'];
    }

    // Pick a problem type randomly
    const chosenType = problemTypes[Math.floor(Math.random() * problemTypes.length)];

    // Helper for theorem/concept questions
    function getRandomTheorem(topicKey, diffKey) {
      const notes = conceptsData[topicKey] && conceptsData[topicKey][diffKey];
      if (notes && notes.theorems && notes.theorems.length > 0) {
        return notes.theorems[Math.floor(Math.random() * notes.theorems.length)];
      }
      return null;
    }

    function getRandomConcept(topicKey, diffKey) {
      const notes = conceptsData[topicKey] && conceptsData[topicKey][diffKey];
      if (notes && notes.definition) {
        return notes.definition;
      }
      return null;
    }

    // Map dropdown values to conceptsData keys
    const topicMap = {
      "calculus-derivatives": "Calculus - Derivatives",
      "linear-algebra": "Linear Algebra",
      "differential-equations": "Differential Equations",
      "probability-basics": "Probability"
    };
    const difficultyMap = {
      "foundations": "foundation",
      "core-concepts": "core concept",
      "applied": "applied",
      "advanced": "advanced",
      "pre-university": "pre-university",
      "engineering": "engineering"
    };
    const topicKey = topicMap[topic] || topic;
    const diffKey = difficultyMap[difficulty] || difficulty;

    // Problem generation by topic
    if (topicKey === "Calculus - Derivatives") {
      if (chosenType === 'direct') {
        equation = randomPolynomial(level);
        problemText = `Find the derivative of f(x) = ${equation}`;
        api = 'derive';
      } else if (chosenType === 'statement') {
        if (level >= 3) {
          problemText = "A ball is thrown upwards and its height at time t is given by h(t) = 20t - 5t^2. What is the velocity at t = 2 seconds?";
          equation = "20 - 10*2";
          api = '';
        }
      } else if (chosenType === 'theorem') {
        const th = getRandomTheorem(topicKey, diffKey);
        if (th) {
          problemText = `State and explain the following theorem: <strong>${th.name}</strong>.<br>Give an example.`;
          equation = th.statement;
          api = '';
        }
      } else if (chosenType === 'concept') {
        const def = getRandomConcept(topicKey, diffKey);
        problemText = `Explain in your own words: What does the derivative of a function represent?`;
        equation = def;
        api = '';
      }
    } else if (topicKey === "Linear Algebra") {
      if (chosenType === 'direct') {
        const size = Math.min(2 + Math.floor(level / 2), 4);
        const m1 = randomMatrix(size);
        const m2 = randomMatrix(size);
        const op = level > 2 ? '*' : '+';
        equation = `${m1}${op}${m2}`;
        problemText = `Calculate: ${m1} ${op} ${m2}`;
        api = 'simplify';
      } else if (chosenType === 'statement') {
        if (level >= 3) {
          problemText = "A company produces two products using two resources. Write a system of equations to model the allocation if product A uses 2 units of resource 1 and 1 of resource 2, product B uses 1 of each, and total resources are 100 and 80.";
          equation = '';
          api = '';
        }
      } else if (chosenType === 'theorem') {
        const th = getRandomTheorem(topicKey, diffKey);
        if (th) {
          problemText = `State and explain the following theorem: <strong>${th.name}</strong>.<br>Give an example.`;
          equation = th.statement;
          api = '';
        }
      } else if (chosenType === 'concept') {
        const def = getRandomConcept(topicKey, diffKey);
        problemText = `What is a matrix? Give a real-world example.`;
        equation = def;
        api = '';
      }
    } else if (topicKey === "Differential Equations") {
      if (chosenType === 'direct') {
        equation = randomDifferentialEquation(level);
        problemText = `Solve the differential equation: ${equation}`;
        api = 'solve';
      } else if (chosenType === 'statement') {
        if (level >= 3) {
          problemText = "A tank contains 100 liters of saltwater with 10 kg of salt. Pure water flows in at 5 L/min and the mixture flows out at the same rate. Write and solve the differential equation for the amount of salt.";
          equation = '';
          api = '';
        }
      } else if (chosenType === 'theorem') {
        const th = getRandomTheorem(topicKey, diffKey);
        if (th) {
          problemText = `State and explain the following theorem: <strong>${th.name}</strong>.<br>Give an example.`;
          equation = th.statement;
          api = '';
        }
      } else if (chosenType === 'concept') {
        const def = getRandomConcept(topicKey, diffKey);
        problemText = `What is a differential equation? Give an example from real life.`;
        equation = def;
        api = '';
      }
    } else if (topicKey === "Probability") {
      if (chosenType === 'direct') {
        equation = randomProbabilityExpr(level);
        problemText = `Simplify the probability expression: ${equation}`;
        api = 'simplify';
      } else if (chosenType === 'statement') {
        if (level >= 3) {
          problemText = "A box contains 5 red and 7 blue balls. Two balls are drawn at random without replacement. What is the probability both are red?";
          equation = '';
          api = '';
        }
      } else if (chosenType === 'theorem') {
        const th = getRandomTheorem(topicKey, diffKey);
        if (th) {
          problemText = `State and explain the following theorem: <strong>${th.name}</strong>.<br>Give an example.`;
          equation = th.statement;
          api = '';
        }
      } else if (chosenType === 'concept') {
        const def = getRandomConcept(topicKey, diffKey);
        problemText = `What is probability? Give a real-world example.`;
        equation = def;
        api = '';
      }
    } else {
      problemText = 'No auto-generated problems for this topic.';
      equation = '';
      api = '';
    }

    // Render the problem and answer area
    simArea.innerHTML = `
      <div id="problem-section"><p>${problemText}</p></div>
      <input type="text" id="user-answer" placeholder="Type your answer">
      <button id="submit-answer">Submit Answer</button>
      <div id="answer-feedback"></div>
      <p><strong>Or solve your own equation:</strong></p>
      <input type="text" id="custom-problem" placeholder="Enter function or expression">
      <button id="solve-custom">Solve It</button>
      <div id="custom-answer" style="margin-top:10px; color:#0078d7; font-weight:bold;"></div>
    `;

    // Only auto-check direct/API problems
    document.getElementById('submit-answer').addEventListener('click', async function () {
      const userAnswer = document.getElementById('user-answer').value.trim();
      if (!equation || !api) {
        document.getElementById('answer-feedback').textContent = "This is a conceptual or statement problem. Please check your answer with the explanation or example in the concept notes.";
        return;
      }
      try {
        const res = await fetch(`https://newton.vercel.app/api/v2/${api}/${encodeURIComponent(equation)}`);
        const data = await res.json();
        const correctAnswer = data.result.replace(/\s/g, '');
        if (userAnswer.replace(/\s/g, '') === correctAnswer) {
          document.getElementById('answer-feedback').textContent = '✅ Correct! Generating new problem...';
          setTimeout(() => generateProblem(topic, difficulty), 1200);
        } else {
          document.getElementById('answer-feedback').textContent = `❌ Try again. Correct answer: ${data.result}`;
        }
      } catch (err) {
        document.getElementById('answer-feedback').textContent = 'API error. Try again.';
      }
    });

    document.getElementById('solve-custom').addEventListener('click', async function () {
      const customEq = document.getElementById('custom-problem').value.trim();
      const customAnswerDiv = document.getElementById('custom-answer');
      customAnswerDiv.textContent = '';
      if (!customEq) {
        alert('Please enter a problem.');
        return;
      }
      // Basic check: if it's not a direct math expression, show a message
      if (!/[\d\+\-\*\/\^=x]/i.test(customEq)) {
        customAnswerDiv.textContent = 'Step-by-step solutions for statement problems will be available soon. For now, please refer to the concept notes and examples.';
        return;
      }
      // Otherwise, use Newton API for direct expressions
      try {
        const res = await fetch(`https://newton.vercel.app/api/v2/simplify/${encodeURIComponent(customEq)}`);
        const data = await res.json();
        customAnswerDiv.textContent = `Result: ${data.result}`;
      } catch (error) {
        customAnswerDiv.textContent = 'API error. Try again.';
      }
    });
  }
  function launchGraphSimulation() {
    simArea.innerHTML += `
      <div id="graph-section">
        <p><strong>Graph any function of x (e.g., x^2, x^3, sin(x), etc.):</strong></p>
        <input type="text" id="graphEquation" placeholder="Enter function (e.g., x^2)">
        <button id="generateGraph">Plot Graph</button>
        <div id="graph-info"></div>
        <canvas id="graphCanvas" width="500" height="400" style="border:1px solid #ccc;"></canvas>
      </div>
    `;
    document.getElementById('generateGraph').addEventListener('click', function () {
      const equation = document.getElementById('graphEquation').value.trim();
      plotGraph(equation);
    });
  }

  function plotGraph(equation) {
    const canvas = document.getElementById('graphCanvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw axes
    const width = canvas.width;
    const height = canvas.height;
    const originX = width / 2;
    const originY = height / 2;
    const scale = 40; // pixels per unit

    // Get theme colors from CSS variables
    const styles = getComputedStyle(document.body);
    const axisColor = styles.getPropertyValue('--accent').trim() || "#7ecfff";
    const labelColor = styles.getPropertyValue('--text').trim() || "#f2f2f2";
    const gridColor = styles.getPropertyValue('--border').trim() || "#444";

    // Draw grid (if you have it)
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    for (let x = 0; x <= width; x += scale) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y <= height; y += scale) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw axes
    ctx.strokeStyle = axisColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, originY);
    ctx.lineTo(width, originY);
    ctx.stroke();
    ctx.beginPath();
    ctx.font = "12px Arial";
    for (let i = -Math.floor(originX / scale); i <= Math.floor(originX / scale); i++) {
      if (i === 0) continue;
      ctx.fillText(i, originX + i * scale - 5, originY + 15);
      ctx.beginPath();
      ctx.moveTo(originX + i * scale, originY - 5);
      ctx.lineTo(originX + i * scale, originY + 5);
      ctx.stroke();
    }
    for (let i = -Math.floor(originY / scale); i <= Math.floor(originY / scale); i++) {
      if (i === 0) continue;
      ctx.fillText(-i, originX + 5, originY + i * scale + 5);
      ctx.beginPath();
      ctx.moveTo(originX - 5, originY + i * scale);
      ctx.lineTo(originX + 5, originY + i * scale);
      ctx.stroke();
    }

    // Plot the function
    if (!equation) {
      document.getElementById('graph-info').textContent = "Please enter a function to plot.";
      return;
    }
    document.getElementById('graph-info').textContent = `Plotting: y = ${equation}`;

    try {
      const expr = math.compile(equation);
      ctx.strokeStyle = "#0078d7";
      ctx.lineWidth = 2;
      ctx.beginPath();
      let first = true;
      for (let px = 0; px <= width; px++) {
        const x = (px - originX) / scale;
        let y;
        try {
          y = expr.evaluate({ x });
        } catch {
          y = NaN;
        }
        if (typeof y !== "number" || isNaN(y) || !isFinite(y)) {
          first = true;
          continue;
        }
        const py = originY - y * scale;
        if (first) {
          ctx.moveTo(px, py);
          first = false;
        } else {
          ctx.lineTo(px, py);
        }
      }
      ctx.stroke();
    } catch (error) {
      document.getElementById('graph-info').textContent = "Invalid equation format. Try again.";
    }
  }

  // Theme toggle safety
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('light-theme');
      themeToggle.textContent =
        document.body.classList.contains('light-theme') ? '🌙 Theme' : '☀️ Theme';
    });
  }

  // Utility to format a matrix as an HTML table
  function renderMatrix(matrix) {
    let html = '<table class="matrix">';
    for (const row of matrix) {
      html += '<tr>';
      for (const cell of row) {
        html += `<td>${cell}</td>`;
      }
      html += '</tr>';
    }
    html += '</table>';
    return html;
  }

  // Utility to display math expressions in a <pre> block
  function renderMathExpression(expr) {
    return `<pre class="math-expression">${expr}</pre>`;
  }

  // Utility to show a styled error message
  function showError(message, container) {
    if (container) {
      container.innerHTML = `<div class="error-message">${message}</div>`;
    }
  }

  // Example: Linear Algebra - Problem Solving Simulation
  function linearAlgebraProblem(simArea) {
    // Generate a random 2x2 matrix
    const matrix = [
      [Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)],
      [Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)]
    ];
    simArea.innerHTML = `
      <h4>Solve for the determinant of the following matrix:</h4>
      ${renderMatrix(matrix)}
      <button id="solve-matrix">Show Solution</button>
      <div id="matrix-solution"></div>
    `;
    document.getElementById('solve-matrix').onclick = () => {
      const det = matrix[0][0]*matrix[1][1] - matrix[0][1]*matrix[1][0];
      document.getElementById('matrix-solution').innerHTML =
        renderMathExpression(`Determinant = (${matrix[0][0]}×${matrix[1][1]}) - (${matrix[0][1]}×${matrix[1][0]}) = ${det}`);
    };
  }

  // Example: Calculus - Derivatives - Concept Exploration
  function calculusConcept(simArea) {
    const expr = "x^2 + 3*x + 2";
    simArea.innerHTML = `
      <h4>Differentiate the following expression with respect to x:</h4>
      ${renderMathExpression(expr)}
      <button id="show-derivative">Show Derivative</button>
      <div id="derivative-solution"></div>
    `;
    document.getElementById('show-derivative').onclick = () => {
      try {
        const derivative = math.derivative(expr, 'x').toString();
        document.getElementById('derivative-solution').innerHTML =
          renderMathExpression(`d/dx (${expr}) = ${derivative}`);
      } catch (err) {
        showError('Error computing derivative. Please check the expression.', document.getElementById('derivative-solution'));
      }
    };
  }

  // Example: Probability - Basics - Application (Graph Simulation)
  function probabilityGraph(simArea) {
    simArea.innerHTML = `
      <h4>Visualize a simple probability distribution:</h4>
      <canvas id="prob-graph" width="300" height="200"></canvas>
      <div id="graph-info"></div>
    `;
    try {
      const ctx = document.getElementById('prob-graph').getContext('2d');
      // Simple bar chart for demonstration
      const probs = [0.1, 0.3, 0.4, 0.2];
      ctx.fillStyle = '#3498db';
      probs.forEach((p, i) => {
        ctx.fillRect(50 + i*50, 200 - p*180, 30, p*180);
        ctx.fillStyle = '#2c3e50';
        ctx.fillText(`P${i+1}`, 55 + i*50, 195);
        ctx.fillStyle = '#3498db';
      });
      document.getElementById('graph-info').innerHTML =
        renderMathExpression(`Probabilities: [${probs.join(', ')}]`);
    } catch (err) {
      showError('Error rendering probability graph.', document.getElementById('graph-info'));
    }
  }
});
