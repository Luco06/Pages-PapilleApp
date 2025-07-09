const baseTheme = {
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  fontSize: {
    small: 14,
    medium: 18,
    large: 24,
    title: 32,
  },
};

export const lightTheme = {
  ...baseTheme,
  mode: "light",
  colors: {
    background: "#F8F8F8",     // Couleur de fond
    primary: "#FE6B6B",        // Couleur principale
    text: "#1E272E",           // Couleur du texte
    cardBackground: "#FFFFFF", // Couleur des composants
    muted: "#d2dae2",          // Couleur atténuée
    white: "#FFFFFF",
    black: "#000000",
    // Couleurs pour le switch
    switchTrack: "#CCCCCC",        // Track inactif (gris moyen pour contraste)
    switchThumb: "#FFFFFF",        // Thumb (blanc)
    switchActiveTrack: "#4CAF50",  // Track actif (vert pour contraste avec le rouge)
    switchActiveThumb: "#FFFFFF",  // Thumb actif (blanc)
  },
};

export const darkTheme = {
  ...baseTheme,
  mode: "dark",
  colors: {
    background: "#1E1E1E",     // Couleur de fond
    primary: "#FF4D4D",        // Couleur principale
    text: "#FFFFFF",           // Couleur du texte
    cardBackground: "#2C2C2C", // Couleur des composants
    muted: "#485460",          // Couleur atténuée
    white: "#FFFFFF",
    black: "#000000",
    // Couleurs pour le switch
    switchTrack: "#666666",        // Track inactif (gris moyen foncé)
    switchThumb: "#FFFFFF",        // Thumb (blanc)
    switchActiveTrack: "#66BB6A",  // Track actif (vert clair pour contraste)
    switchActiveThumb: "#FFFFFF",  // Thumb actif (blanc)
  },
};

export type AppTheme = typeof lightTheme;