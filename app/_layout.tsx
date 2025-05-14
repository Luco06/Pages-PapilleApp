import { ApolloProvider } from "@apollo/client";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Provider as PaperProvider } from "react-native-paper";
import { client } from "../apollo/client";
import { AuthProvider } from "../context/AuthContext";
import { ThemeProvider, useTheme } from "../theme/themeContext";
import { Providers } from "../utils/Provider";

export default function RootLayout() {
  const theme = useTheme();
  return (
    <ThemeProvider>
      <Providers>
        <ApolloProvider client={client}>
          <AuthProvider>
            <PaperProvider>
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
            </PaperProvider>
          </AuthProvider>
        </ApolloProvider>
      </Providers>
    </ThemeProvider>
  );
}
