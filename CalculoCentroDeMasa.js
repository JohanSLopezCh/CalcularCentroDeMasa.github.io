document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const numParticlesInput = document.getElementById('num-particles');
    const generateBtn = document.getElementById('generate-inputs');
    const calculateBtn = document.getElementById('calculate');
    const particlesInputs = document.getElementById('particles-inputs');
    const resultsBody = document.getElementById('results-body');
    const resultsFooter = document.getElementById('results-footer');
    
    // Elementos para mostrar resultados
    const massTotal = document.getElementById('mass-total');
    const xCm = document.getElementById('x-cm');
    const yCm = document.getElementById('y-cm');
    const zCm = document.getElementById('z-cm');
    const xVec = document.getElementById('x-vec');
    const yVec = document.getElementById('y-vec');
    const zVec = document.getElementById('z-vec');
    
    // Generar inputs iniciales
    generateParticleInputs();
    
    // Event listeners
    generateBtn.addEventListener('click', generateParticleInputs);
    calculateBtn.addEventListener('click', calculateCenterOfMass);
    
    // Función para generar inputs de partículas
    function generateParticleInputs() {
        const numParticles = parseInt(numParticlesInput.value) || 3;
        
        // Limitar número de partículas entre 1 y 10
        if (numParticles < 1) {
            numParticlesInput.value = 1;
            return;
        } else if (numParticles > 10) {
            numParticlesInput.value = 10;
            return;
        }
        
        // Limpiar inputs existentes
        particlesInputs.innerHTML = '';
        
        // Generar nuevos inputs
        for (let i = 0; i < numParticles; i++) {
            const particleRow = document.createElement('div');
            particleRow.className = 'particle-row';
            
            particleRow.innerHTML = `
                <div class="particle-label">Partícula ${i + 1}</div>
                <div>
                    <input type="number" step="0.01" placeholder="Masa" 
                           class="particle-mass" required value="${getRandomMass()}">
                </div>
                <div>
                    <input type="number" step="0.01" placeholder="Pos X" 
                           class="particle-x" required value="${getRandomPosition()}">
                </div>
                <div>
                    <input type="number" step="0.01" placeholder="Pos Y" 
                           class="particle-y" required value="${getRandomPosition()}">
                </div>
                <div>
                    <input type="number" step="0.01" placeholder="Pos Z" 
                           class="particle-z" required value="${getRandomPosition()}">
                </div>
            `;
            
            particlesInputs.appendChild(particleRow);
        }
    }
    
    // Función para calcular el centro de masa
    function calculateCenterOfMass() {
        // Recopilar datos de las partículas
        const massInputs = document.querySelectorAll('.particle-mass');
        const xInputs = document.querySelectorAll('.particle-x');
        const yInputs = document.querySelectorAll('.particle-y');
        const zInputs = document.querySelectorAll('.particle-z');
        
        // Arrays para almacenar datos y resultados
        const particles = [];
        let totalMass = 0;
        let sumMiXi = 0;
        let sumMiYi = 0;
        let sumMiZi = 0;
        
        // Procesar cada partícula
        for (let i = 0; i < massInputs.length; i++) {
            const mass = parseFloat(massInputs[i].value) || 0;
            const x = parseFloat(xInputs[i].value) || 0;
            const y = parseFloat(yInputs[i].value) || 0;
            const z = parseFloat(zInputs[i].value) || 0;
            
            // Calcular productos
            const miXi = mass * x;
            const miYi = mass * y;
            const miZi = mass * z;
            
            // Actualizar sumas
            totalMass += mass;
            sumMiXi += miXi;
            sumMiYi += miYi;
            sumMiZi += miZi;
            
            // Guardar datos de la partícula
            particles.push({
                index: i + 1,
                mass: mass,
                x: x,
                y: y,
                z: z,
                miXi: miXi,
                miYi: miYi,
                miZi: miZi
            });
        }
        
        // Calcular coordenadas del centro de masa
        const xCmValue = totalMass !== 0 ? sumMiXi / totalMass : 0;
        const yCmValue = totalMass !== 0 ? sumMiYi / totalMass : 0;
        const zCmValue = totalMass !== 0 ? sumMiZi / totalMass : 0;
        
        // Actualizar tabla de resultados
        updateResultsTable(particles, totalMass, sumMiXi, sumMiYi, sumMiZi);
        
        // Actualizar resultados mostrados
        updateResultsDisplay(totalMass, xCmValue, yCmValue, zCmValue);
        
        // Efecto de animación en los resultados
        animateResults();
    }
    
    // Función para actualizar la tabla de resultados
    function updateResultsTable(particles, totalMass, sumMiXi, sumMiYi, sumMiZi) {
        // Limpiar tabla
        resultsBody.innerHTML = '';
        
        // Agregar filas de partículas
        particles.forEach(p => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${p.index}</td>
                <td>${p.mass.toFixed(2)}</td>
                <td>${p.x.toFixed(2)}</td>
                <td>${p.miXi.toFixed(2)}</td>
                <td>${p.y.toFixed(2)}</td>
                <td>${p.miYi.toFixed(2)}</td>
                <td>${p.z.toFixed(2)}</td>
                <td>${p.miZi.toFixed(2)}</td>
            `;
            resultsBody.appendChild(row);
        });
        
        // Actualizar fila de totales
        resultsFooter.innerHTML = `
            <tr>
                <td>Sumas</td>
                <td>${totalMass.toFixed(2)}</td>
                <td></td>
                <td>${sumMiXi.toFixed(2)}</td>
                <td></td>
                <td>${sumMiYi.toFixed(2)}</td>
                <td></td>
                <td>${sumMiZi.toFixed(2)}</td>
            </tr>
        `;
    }
    
    // Función para actualizar la visualización de resultados
    function updateResultsDisplay(totalMass, xCmValue, yCmValue, zCmValue) {
        massTotal.textContent = totalMass.toFixed(2);
        xCm.textContent = xCmValue.toFixed(2);
        yCm.textContent = yCmValue.toFixed(2);
        zCm.textContent = zCmValue.toFixed(2);
        xVec.textContent = xCmValue.toFixed(2);
        yVec.textContent = yCmValue.toFixed(2);
        zVec.textContent = zCmValue.toFixed(2);
    }
    
    // Función para animar los resultados
    function animateResults() {
        const elements = document.querySelectorAll('.formula, .vector-formula');
        elements.forEach(el => {
            el.classList.remove('highlight');
            void el.offsetWidth; // Trigger reflow
            el.classList.add('highlight');
        });
    }
    
    // Funciones de utilidad para generar valores aleatorios
    function getRandomMass() {
        return (Math.random() * 9 + 1).toFixed(2); // Entre 1 y 10
    }
    
    function getRandomPosition() {
        return (Math.random() * 4 - 2).toFixed(2); // Entre -2 y 2
    }
});