export function createDarkMode() {
    let darkMode = $state(true);

    function toggleDarkMode() {
        darkMode = !darkMode;
    }

    return {
        get darkMode() {
            return darkMode;
        },
        toggleDarkMode
    }
}