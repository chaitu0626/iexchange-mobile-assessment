import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { CompositeScreenProps } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";
import { ActionButton } from "../components/ActionButton";
import { colors } from "../components/theme";
import type { MainTabParamList, RootStackParamList } from "../types/navigation";

type ProfileScreenProps = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, "Profile">,
  NativeStackScreenProps<RootStackParamList>
>;

export function ProfileScreen({ navigation }: ProfileScreenProps) {
  const insets = useSafeAreaInsets();
  const { user, isAuthenticated, restoreError, logout } = useAuth();
  const [logoutError, setLogoutError] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    setLogoutError(null);
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      setLogoutError(
        error instanceof Error ? error.message : "Could not sign out."
      );
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <ScrollView
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + 12 },
      ]}
      style={styles.screen}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Profile</Text>

      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {isAuthenticated ? user?.name.charAt(0).toUpperCase() : "G"}
          </Text>
        </View>
        <View style={styles.profileCopy}>
          {isAuthenticated && user ? (
            <>
              <Text style={styles.name}>{user.name}</Text>
              <Text style={styles.description}>{user.email}</Text>
            </>
          ) : (
            <>
              <Text style={styles.name}>Welcome to iExchange</Text>
              <Text style={styles.description}>
                Sign in or create an account to get started.
              </Text>
            </>
          )}
        </View>
      </View>

      {isAuthenticated ? (
        <View style={styles.actions}>
          {logoutError ? (
            <Text accessibilityRole="alert" style={styles.error}>
              {logoutError}
            </Text>
          ) : null}
          <ActionButton
            loading={isLoggingOut}
            onPress={handleLogout}
            title={isLoggingOut ? "Signing out..." : "Log out"}
            variant="secondary"
          />
        </View>
      ) : (
        <View style={styles.actions}>
          {restoreError ? (
            <Text accessibilityRole="alert" style={styles.error}>
              Saved session could not be restored: {restoreError}
            </Text>
          ) : null}
          <ActionButton
            onPress={() => navigation.navigate("Login")}
            title="Login"
          />
          <ActionButton
            onPress={() => navigation.navigate("Signup")}
            title="Sign Up"
            variant="secondary"
          />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.background,
    flex: 1,
  },
  content: {
    gap: 14,
    padding: 22,
  },
  title: {
    color: colors.navy,
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 8,
  },
  profileCard: {
    alignItems: "center",
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: "row",
    gap: 14,
    padding: 17,
  },
  avatar: {
    alignItems: "center",
    backgroundColor: colors.blueLight,
    borderRadius: 28,
    height: 56,
    justifyContent: "center",
    width: 56,
  },
  avatarText: {
    color: colors.blueDark,
    fontSize: 23,
    fontWeight: "800",
  },
  profileCopy: {
    flex: 1,
    gap: 5,
  },
  name: {
    color: colors.navy,
    fontSize: 15,
    fontWeight: "700",
  },
  description: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
  },
  actions: {
    gap: 11,
    marginTop: 8,
  },
  error: {
    color: "#B42318",
    fontSize: 12,
    lineHeight: 18,
  },
});
