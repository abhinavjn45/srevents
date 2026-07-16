

// SECURITY FIX: Enhanced browser fingerprinting with multiple entropy sources
export const generateBrowserFingerprint = (): string => {
    try {
        // Collect multiple entropy sources
        const fingerprint: any = {
            // Canvas fingerprint
            canvas: generateCanvasFingerprint(),
            
            // WebGL fingerprint
            webgl: generateWebGLFingerprint(),
            
            // User agent
            userAgent: navigator.userAgent,
            
            // Language and locale
            language: navigator.language,
            languages: navigator.languages?.join(','),
            
            // Platform
            platform: navigator.platform,
            
            // Screen resolution
            screen: {
                width: window.screen.width,
                height: window.screen.height,
                availWidth: window.screen.availWidth,
                availHeight: window.screen.availHeight,
                colorDepth: window.screen.colorDepth,
                pixelDepth: window.screen.pixelDepth
            },
            
            // Timezone
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            
            // Hardware concurrency
            hardwareConcurrency: (navigator as any).hardwareConcurrency || 'unknown',
            
            // Device memory (if available)
            deviceMemory: (navigator as any).deviceMemory || 'unknown',
            
            // Fonts (sample common fonts)
            fonts: getInstalledFonts(),
            
            // Plugins
            plugins: getPlugins(),
            
            // Local storage support
            localStorage: typeof localStorage !== 'undefined' && localStorage !== null,
            
            // Session storage support
            sessionStorage: typeof sessionStorage !== 'undefined' && sessionStorage !== null,
            
            // IndexedDB support
            indexedDB: typeof indexedDB !== 'undefined' && indexedDB !== null,
            
            // DoNotTrack
            doNotTrack: navigator.doNotTrack || (navigator as any).msDoNotTrack || 'unknown'
        };
        
        // Hash all collected data
        const hash = hashObject(fingerprint);
        return hash;
    } catch (error) {
        console.error('Error generating fingerprint:', error);
        return 'fp-' + Date.now() + '-' + Math.random().toString(36).substring(7);
    }
};

// Generate canvas fingerprint
const generateCanvasFingerprint = (): string => {
    try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) return 'canvas-unavailable';
        
        canvas.width = 280;
        canvas.height = 60;
        
        ctx.textBaseline = 'top';
        ctx.font = '14px Arial';
        ctx.textBaseline = 'alphabetic';
        ctx.fillStyle = '#f60';
        ctx.fillRect(125, 1, 62, 20);
        ctx.fillStyle = '#069';
        ctx.fillText('Browser Fingerprint', 2, 15);
        ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
        ctx.fillText('Browser Fingerprint', 4, 17);
        
        // Add some random data to make it harder to spoof
        ctx.fillStyle = `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.5)`;
        ctx.fillRect(50, 30, 50, 20);
        
        return canvas.toDataURL().substring(0, 100);
    } catch (error) {
        return 'canvas-error';
    }
};

// Generate WebGL fingerprint
const generateWebGLFingerprint = (): string => {
    try {
        const canvas = document.createElement('canvas');
        const gl = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as WebGLRenderingContext;
        
        if (!gl) return 'webgl-unavailable';
        
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
            const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
            const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
            return `${vendor}-${renderer}`.substring(0, 100);
        }
        
        return 'webgl-no-debug';
    } catch (error) {
        return 'webgl-error';
    }
};

// Get installed fonts
const getInstalledFonts = (): string[] => {
    const baseFonts = ['monospace', 'sans-serif', 'serif'];
    const testFonts = [
        'Arial', 'Verdana', 'Helvetica', 'Times New Roman', 'Courier New',
        'Georgia', 'Palatino', 'Garamond', 'Bookman', 'Comic Sans MS',
        'Trebuchet MS', 'Impact', 'Lucida Sans', 'Tahoma', 'Lucida Console'
    ];
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return [];
    
    const textSize = '72px monospace';
    const testString = 'mmmmmmmmmmlli';
    
    const getWidth = (font: string) => {
        ctx.font = `${textSize}, ${font}`;
        return ctx.measureText(testString).width;
    };
    
    const baseWidths: { [key: string]: number } = {};
    baseFonts.forEach(font => {
        baseWidths[font] = getWidth(font);
    });
    
    const detectedFonts: string[] = [];
    testFonts.forEach(font => {
        baseFonts.forEach(baseFont => {
            const width = getWidth(`'${font}', ${baseFont}`);
            if (width !== baseWidths[baseFont]) {
                detectedFonts.push(font);
            }
        });
    });
    
    return detectedFonts;
};

// Get plugins
const getPlugins = (): string[] => {
    const plugins: string[] = [];
    
    if (navigator.plugins && navigator.plugins.length > 0) {
        for (let i = 0; i < navigator.plugins.length; i++) {
            const plugin = navigator.plugins[i];
            plugins.push(plugin.name);
        }
    }
    
    return plugins;
};

// Hash object to fingerprint
const hashObject = (obj: any): string => {
    try {
        const str = JSON.stringify(obj);
        // Use simple hash function since crypto might not be available in browser
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        
        // Return just the deterministic hash (no timestamp)
        return 'fp-' + Math.abs(hash).toString(16);
    } catch (error) {
        return 'fp-' + Math.random().toString(36).substring(2);
    }
};

// Generate UUID for cookie token
export const generateUUID = (): string => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

// Get or create cookie token
export const getCookieToken = (): string => {
    let token = localStorage.getItem('cookieToken');
    
    if (!token) {
        token = generateUUID();
        localStorage.setItem('cookieToken', token);
    }
    
    return token;
};

// Get or create local storage token
export const getLocalStorageToken = (): string => {
    let token = localStorage.getItem('localStorageToken');
    
    if (!token) {
        token = generateUUID();
        localStorage.setItem('localStorageToken', token);
    }
    
    return token;
};
