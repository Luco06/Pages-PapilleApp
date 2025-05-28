import { ApolloProvider } from "@apollo/client";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Provider as PaperProvider } from "react-native-paper";
import { client } from "../apollo/client";
import { AuthProvider } from "../context/AuthContext";
import { ThemeProvider, useTheme } from "../theme/themeContext";
import { Providers } from "../utils/Provider";

function AppContent() {
  const theme = useTheme();

  return (
    <>
      <StatusBar
        style={theme.mode === "dark" ? "light" : "dark"}
        backgroundColor={theme.colors.background}
        translucent
      />
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Login"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    "P&Ppolice": require('../assets/fonts/Playfair-Italic-VariableFont_opsz,wdth,wght.ttf')
  });

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider>
      <Providers>
        <ApolloProvider client={client}>
          <AuthProvider>
            <PaperProvider>
              <AppContent />
            </PaperProvider>
          </AuthProvider>
        </ApolloProvider>
      </Providers>
    </ThemeProvider>
  );
}