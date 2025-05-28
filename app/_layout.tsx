import { ApolloProvider } from "@apollo/client";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { SystemBars } from "react-native-edge-to-edge";
import { Provider as PaperProvider } from "react-native-paper";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { client } from "../apollo/client";
import { AuthProvider } from "../context/AuthContext";
import { ThemeProvider, useTheme } from "../theme/themeContext";
import { Providers } from "../utils/Provider";

function AppContent() {
  const theme = useTheme();

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{ flex: 1, backgroundColor: theme.colors.background }}
      >
      <SystemBars  style={theme.mode === "dark" ? "light" : "dark"} />
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
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    "P&Ppolice": require("../assets/fonts/Playfair-Italic-VariableFont_opsz,wdth,wght.ttf"),
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
