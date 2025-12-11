/* ============================================
   IOT SIGNAL TRANSFORMATION VISUALIZATION
   Modern, Well-Structured JavaScript
   ============================================ */

/**
 * Application State Management
 */
const AppState = {
    currentMode: 'analog', // 'analog' or 'digital'
    animationFrameId: null,
    updateIntervals: {
        temperature: null,
        pir: null,
        animation: null
    },
    data: {
        temperature: 22.5,
        voltage: 2.45,
        adcValue: 3041,
        pirDetected: true,
        activeStage: 0
    }
};

/**
 * Configuration Constants
 */
const Config = {
    UPDATE_INTERVAL: 3000,      // Update data every 3 seconds
    ANIMATION_INTERVAL: 1500,   // Stage animation cycle
    ADC_BITS: 12,
    ADC_MAX: 4095,
    VOLTAGE_REF: 3.3,
    TEMP_MIN: 20,
    TEMP_MAX: 25,
    PIR_DETECTION_CHANCE: 0.6
};

/**
 * DOM Element References
 */
const Elements = {
    // Mode Selection
    analogBtn: null,
    digitalBtn: null,
    modeText: null,
    
    // Sensor Data
    sensorIconWrapper: null,
    sensorTitle: null,
    sensorDescription: null,
    sensorValue: null,
    sensorVoltage: null,
    sensorState: null,
    
    // Processing
    processingDescription: null,
    analogProcessing: null,
    digitalProcessing: null,
    adcValue: null,
    binaryValue: null,
    jsonPreview: null,
    gpioState: null,
    gpioVoltage: null,
    pirBinary: null,
    pirJsonPreview: null,
    pirPayloadBit: null,
    
    // Application
    appDisplay: null,
    appAction: null,
    
    // Stage Cards
    stageCards: []
};

/* ============================================
   INITIALIZATION
   ============================================ */

/**
 * Initialize the application when DOM is ready
 */
function init() {
    console.log('🚀 IoT Visualization System Initializing...');
    
    // Cache DOM elements
    cacheElements();
    
    // Set up event listeners
    setupEventListeners();
    
    // Start real-time updates
    startRealTimeUpdates();
    
    // Start stage animations
    startStageAnimations();
    
    // Initial render
    updateDisplay();
    
    console.log('✅ IoT Visualization System Ready');
}

/**
 * Cache all DOM element references for better performance
 */
function cacheElements() {
    // Mode buttons
    Elements.analogBtn = document.getElementById('analogBtn');
    Elements.digitalBtn = document.getElementById('digitalBtn');
    Elements.modeText = document.getElementById('modeText');
    
    // Sensor elements
    Elements.sensorIconWrapper = document.getElementById('sensorIconWrapper');
    Elements.sensorTitle = document.getElementById('sensorTitle');
    Elements.sensorDescription = document.getElementById('sensorDescription');
    Elements.sensorValue = document.getElementById('sensorValue');
    Elements.sensorVoltage = document.getElementById('sensorVoltage');
    Elements.sensorState = document.getElementById('sensorState');
    
    // Processing elements
    Elements.processingDescription = document.getElementById('processingDescription');
    Elements.analogProcessing = document.getElementById('analogProcessing');
    Elements.digitalProcessing = document.getElementById('digitalProcessing');
    Elements.adcValue = document.getElementById('adcValue');
    Elements.binaryValue = document.getElementById('binaryValue');
    Elements.jsonPreview = document.getElementById('jsonPreview');
    Elements.gpioState = document.getElementById('gpioState');
    Elements.gpioVoltage = document.getElementById('gpioVoltage');
    Elements.pirBinary = document.getElementById('pirBinary');
    Elements.pirJsonPreview = document.getElementById('pirJsonPreview');
    Elements.pirPayloadBit = document.getElementById('pirPayloadBit');
    
    // Application elements
    Elements.appDisplay = document.getElementById('appDisplay');
    Elements.appAction = document.getElementById('appAction');
    
    // Stage cards
    Elements.stageCards = Array.from(document.querySelectorAll('.stage-card'));
}

/**
 * Set up all event listeners
 */
function setupEventListeners() {
    if (Elements.analogBtn) {
        Elements.analogBtn.addEventListener('click', () => switchMode('analog'));
    }
    
    if (Elements.digitalBtn) {
        Elements.digitalBtn.addEventListener('click', () => switchMode('digital'));
    }
    
    // Add smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', handleSmoothScroll);
    });
}

/* ============================================
   MODE SWITCHING
   ============================================ */

/**
 * Switch between analog and digital modes
 * @param {string} mode - 'analog' or 'digital'
 */
function switchMode(mode) {
    if (AppState.currentMode === mode) return;
    
    console.log(`🔄 Switching mode to: ${mode}`);
    AppState.currentMode = mode;
    
    // Update UI
    updateModeButtons(mode);
    updateModeText(mode);
    updateSensorDisplay(mode);
    updateProcessingDisplay(mode);
    updateApplicationDisplay(mode);
    
    // Animate transition
    animateModeTransition();
}

/**
 * Update mode button states
 */
function updateModeButtons(mode) {
    const buttons = [Elements.analogBtn, Elements.digitalBtn];
    buttons.forEach(btn => btn && btn.classList.remove('active'));
    
    const activeBtn = mode === 'analog' ? Elements.analogBtn : Elements.digitalBtn;
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
}

/**
 * Update mode text display
 */
function updateModeText(mode) {
    if (Elements.modeText) {
        Elements.modeText.textContent = mode === 'analog' 
            ? 'Capteur Analogique' 
            : 'Capteur Numérique';
    }
}

/**
 * Update sensor display based on mode
 */
function updateSensorDisplay(mode) {
    if (mode === 'analog') {
        setElementText(Elements.sensorTitle, 'Capteur Analogique');
        setElementText(Elements.sensorDescription, 'Signal Analogique');
        setSensorIcon(getAnalogSensorIcon());
    } else {
        setElementText(Elements.sensorTitle, 'Capteur PIR');
        setElementText(Elements.sensorDescription, 'Signal Numérique');
        setSensorIcon(getDigitalSensorIcon());
    }
}

function setSensorIcon(svg) {
    if (Elements.sensorIconWrapper) {
        Elements.sensorIconWrapper.innerHTML = svg;
    }
}

function getAnalogSensorIcon() {
    return '<svg class="stage-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12c2-4 4-4 6 0s4 4 6 0 4-4 6 0"></path></svg>';
}

function getDigitalSensorIcon() {
    return '<svg class="stage-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12.55a11 11 0 0 1 14.08 0"></path><path d="M1.42 9a16 16 0 0 1 21.16 0"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12.01" y2="20"></line></svg>';
}

/**
 * Update processing display based on mode
 */
function updateProcessingDisplay(mode) {
    if (mode === 'analog') {
        setElementText(Elements.processingDescription, 'ADC + Codage');
        showElement(Elements.analogProcessing);
        hideElement(Elements.digitalProcessing);
    } else {
        setElementText(Elements.processingDescription, 'Codage Direct');
        hideElement(Elements.analogProcessing);
        showElement(Elements.digitalProcessing);
    }
}

/**
 * Update application display based on mode
 */
function updateApplicationDisplay(mode) {
    if (mode === 'analog') {
        setElementText(Elements.appAction, 'Chauffage');
    } else {
        setElementText(Elements.appAction, 'Éclairage');
    }
}

/**
 * Animate mode transition
 */
function animateModeTransition() {
    Elements.stageCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
        }, index * 100);
    });
}

/* ============================================
   REAL-TIME DATA UPDATES
   ============================================ */

/**
 * Start all real-time update intervals
 */
function startRealTimeUpdates() {
    // Initial updates
    updateTemperatureData();
    updatePIRData();
    
    // Set up intervals
    AppState.updateIntervals.temperature = setInterval(() => {
        if (AppState.currentMode === 'analog') {
            updateTemperatureData();
            updateDisplay();
        }
    }, Config.UPDATE_INTERVAL);
    
    AppState.updateIntervals.pir = setInterval(() => {
        if (AppState.currentMode === 'digital') {
            updatePIRData();
            updateDisplay();
        }
    }, Config.UPDATE_INTERVAL);
}

/**
 * Update temperature sensor data
 */
function updateTemperatureData() {
    // Generate random temperature
    AppState.data.temperature = Config.TEMP_MIN + Math.random() * (Config.TEMP_MAX - Config.TEMP_MIN);
    
    // Calculate voltage (linear mapping)
    AppState.data.voltage = 2.0 + (AppState.data.temperature - Config.TEMP_MIN) * 0.1;
    
    // Calculate ADC value
    AppState.data.adcValue = Math.floor((AppState.data.voltage / Config.VOLTAGE_REF) * Config.ADC_MAX);
}

/**
 * Update PIR sensor data
 */
function updatePIRData() {
    // Random detection based on probability
    AppState.data.pirDetected = Math.random() < Config.PIR_DETECTION_CHANCE;
}

/**
 * Update all display elements with current data
 */
function updateDisplay() {
    if (AppState.currentMode === 'analog') {
        updateAnalogDisplay();
    } else {
        updateDigitalDisplay();
    }
}

/**
 * Update analog mode display
 */
function updateAnalogDisplay() {
    const temp = AppState.data.temperature.toFixed(1);
    const voltage = AppState.data.voltage.toFixed(2);
    const adc = AppState.data.adcValue;
    const binary = adc.toString(2).padStart(Config.ADC_BITS, '0');
    
    // Sensor values
    setElementText(Elements.sensorValue, `${temp}°C`);
    setElementText(Elements.sensorVoltage, `${voltage}V`);
    setElementText(Elements.sensorState, 'Actif');
    
    // Processing values
    setElementText(Elements.adcValue, adc);
    setElementText(Elements.binaryValue, binary);
    setElementText(Elements.jsonPreview, `{"temp": ${temp}, "ts": ${Math.floor(Date.now() / 1000)}}`);
    
    // Application values
    setElementText(Elements.appDisplay, `${temp}°C`);
    
    // Add value update animation
    animateValueUpdate(Elements.sensorValue);
}

/**
 * Update digital mode display
 */
function updateDigitalDisplay() {
    const detected = AppState.data.pirDetected;
    const state = detected ? 'HIGH' : 'LOW';
    const voltage = detected ? '3.3V' : '0V';
    const binary = detected ? '1' : '0';
    const status = detected ? 'Mouvement' : 'Aucun';
    
    // Sensor values
    setElementText(Elements.sensorValue, status);
    setElementText(Elements.sensorVoltage, voltage);
    setElementText(Elements.sensorState, state);
    
    // Processing values
    setElementText(Elements.gpioState, state);
    setElementText(Elements.gpioVoltage, voltage);
    setElementText(Elements.pirBinary, binary);
    setElementText(Elements.pirPayloadBit, binary);
    
    // Application values
    setElementText(Elements.appDisplay, status);
    
    // Update colors
    if (Elements.sensorValue) {
        Elements.sensorValue.style.color = detected ? '#10b981' : '#94a3b8';
    }
    
    // Add value update animation
    animateValueUpdate(Elements.sensorValue);
}

/* ============================================
   STAGE ANIMATIONS
   ============================================ */

/**
 * Start stage animation cycle
 */
function startStageAnimations() {
    AppState.data.activeStage = 0;
    
    AppState.updateIntervals.animation = setInterval(() => {
        cycleActiveStage();
    }, Config.ANIMATION_INTERVAL);
}

/**
 * Cycle through active stage indicators
 */
function cycleActiveStage() {
    const totalStages = Elements.stageCards.length;
    AppState.data.activeStage = (AppState.data.activeStage + 1) % totalStages;
    
    // Update stage card highlights
    Elements.stageCards.forEach((card, index) => {
        const isActive = index === AppState.data.activeStage;
        updateStageCardState(card, isActive);
    });
}

/**
 * Update stage card visual state
 */
function updateStageCardState(card, isActive) {
    if (isActive) {
        card.style.borderColor = '#06b6d4';
        card.style.boxShadow = '0 0 40px rgba(6, 182, 212, 0.4)';
        card.style.transform = 'scale(1.02)';
    } else {
        card.style.borderColor = 'rgba(148, 163, 184, 0.2)';
        card.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.3)';
        card.style.transform = 'scale(1)';
    }
}

/* ============================================
   UTILITY FUNCTIONS
   ============================================ */

/**
 * Safely set element text content
 */
function setElementText(element, text) {
    if (element && element.textContent !== text) {
        element.textContent = text;
    }
}

/**
 * Show element
 */
function showElement(element) {
    if (element) {
        element.style.display = 'grid';
    }
}

/**
 * Hide element
 */
function hideElement(element) {
    if (element) {
        element.style.display = 'none';
    }
}

/**
 * Animate value update
 */
function animateValueUpdate(element) {
    if (!element) return;
    
    element.style.animation = 'none';
    
    // Force reflow
    void element.offsetWidth;
    
    element.style.animation = 'valueFlash 0.5s ease';
}

/**
 * Handle smooth scroll for anchor links
 */
function handleSmoothScroll(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
        target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

/* ============================================
   CLEANUP
   ============================================ */

/**
 * Clean up intervals and listeners
 */
function cleanup() {
    console.log('🧹 Cleaning up...');
    
    // Clear intervals
    Object.values(AppState.updateIntervals).forEach(interval => {
        if (interval) clearInterval(interval);
    });
    
    // Cancel animation frames
    if (AppState.animationFrameId) {
        cancelAnimationFrame(AppState.animationFrameId);
    }
}

/* ============================================
   CSS ANIMATIONS (Injected)
   ============================================ */

/**
 * Add dynamic CSS animations
 */
function injectAnimations() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes valueFlash {
            0% {
                background-color: rgba(6, 182, 212, 0.3);
                transform: scale(1);
            }
            50% {
                background-color: rgba(6, 182, 212, 0.5);
                transform: scale(1.05);
            }
            100% {
                background-color: transparent;
                transform: scale(1);
            }
        }
    `;
    document.head.appendChild(style);
}

/* ============================================
   EVENT LISTENERS
   ============================================ */

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        injectAnimations();
        init();
    });
} else {
    injectAnimations();
    init();
}

// Cleanup on page unload
window.addEventListener('beforeunload', cleanup);

// Handle visibility change (pause updates when tab is hidden)
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('⏸️ Page hidden - pausing updates');
        cleanup();
    } else {
        console.log('▶️ Page visible - resuming updates');
        startRealTimeUpdates();
        startStageAnimations();
    }
});

/* ============================================
   DEVELOPER CONSOLE
   ============================================ */

console.log('%c🚀 IoT Signal Transformation Visualization', 'font-size: 20px; font-weight: bold; color: #06b6d4;');
console.log('%c📊 Transformations: Échantillonnage → Quantification → Codage', 'font-size: 14px; color: #94a3b8;');
console.log('%c✨ Modern Architecture with Clean Code Structure', 'font-size: 14px; color: #10b981;');
console.log('%c💡 Switch modes to see Analog (Temperature) vs Digital (PIR) sensors', 'font-size: 12px; color: #f59e0b;');

// Export for debugging (if needed)
if (typeof window !== 'undefined') {
    window.IoTApp = {
        state: AppState,
        config: Config,
        switchMode,
        updateDisplay,
        cleanup
    };
}
