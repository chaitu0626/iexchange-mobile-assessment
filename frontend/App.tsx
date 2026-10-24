import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "./src/context/AuthContext";
import { SavedJobsProvider } from "./src/context/SavedJobsContext";
import { RootNavigator } from "./src/navigation/RootNavigator";

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <AuthProvider>
        <SavedJobsProvider>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </SavedJobsProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
