// Script para limpar localStorage
if (typeof window !== 'undefined' && window.localStorage) {
    // Limpar dados antigos com prefixo aupm_
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
        if (key.startsWith('aupm_') || key.startsWith('apm_')) {
            localStorage.removeItem(key);
            console.log('Ì∑ëÔ∏è Removido:', key);
        }
    });
    console.log('‚úÖ LocalStorage limpo!');
}
