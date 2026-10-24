import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
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

type MenuRowProps = {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  title: string;
  subtitle: string;
  endIcon: React.ComponentProps<typeof Ionicons>["name"];
  onPress: () => void;
};

function MenuRow({
  icon,
  title,
  subtitle,
  endIcon,
  onPress,
}: MenuRowProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.menuRow, pressed && styles.pressed]}
    >
      <Ionicons color={colors.blue} name={icon} size={21} />
      <View style={styles.menuCopy}>
        <Text style={styles.menuTitle}>{title}</Text>
        <Text style={styles.menuSubtitle}>{subtitle}</Text>
      </View>
      <Ionicons color={colors.muted} name={endIcon} size={19} />
    </Pressable>
  );
}

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
        { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 20 },
      ]}
      style={styles.screen}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        {!isAuthenticated ? (
          <Ionicons color={colors.muted} name="person-outline" size={19} />
        ) : null}
      </View>

      {isAuthenticated && user ? (
        <>
          <View style={styles.userSummary}>
            <View style={styles.avatar}>
              <Ionicons color={colors.blue} name="person-outline" size={28} />
            </View>
            <View style={styles.userCopy}>
              <Text style={styles.name}>{user.name}</Text>
              <Text style={styles.email}>{user.email}</Text>
              <View style={styles.status}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>Logged in</Text>
              </View>
            </View>
          </View>

          <View style={styles.divider} />
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            <InfoRow
              icon="person-outline"
              label="Full Name"
              value={user.name}
            />
            <InfoRow
              icon="mail-outline"
              label="Email Address"
              value={user.email}
            />
          </View>

          <View style={styles.divider} />
          <MenuRow
            endIcon="chevron-forward"
            icon="bookmark-outline"
            onPress={() =>
              navigation.navigate("Jobs", { openJobsTab: "saved" })
            }
            subtitle="View your bookmarked opportunities"
            title="Saved Jobs"
          />

          {logoutError ? (
            <Text accessibilityRole="alert" style={styles.error}>
              {logoutError}
            </Text>
          ) : null}
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ busy: isLoggingOut, disabled: isLoggingOut }}
            disabled={isLoggingOut}
            onPress={handleLogout}
            style={({ pressed }) => [
              styles.logoutButton,
              pressed && !isLoggingOut && styles.pressed,
            ]}
          >
            {isLoggingOut ? (
              <ActivityIndicator color="#C62828" size="small" />
            ) : (
              <Ionicons color="#C62828" name="log-out-outline" size={19} />
            )}
            <Text style={styles.logoutLabel}>
              {isLoggingOut ? "Logging out..." : "Logout"}
            </Text>
          </Pressable>
        </>
      ) : (
        <>
          <View style={styles.guestWelcome}>
            <View style={styles.guestAvatar}>
              <Ionicons color={colors.blue} name="person-outline" size={34} />
            </View>
            <Text style={styles.guestTitle}>Welcome, Guest!</Text>
            <Text style={styles.guestSubtitle}>
              Sign in to manage your profile and save jobs you&apos;re interested in.
            </Text>
            <View style={styles.primaryAction}>
              <ActionButton
                onPress={() => navigation.navigate("Login")}
                title="Login / Sign Up"
              />
            </View>
            {restoreError ? (
              <Text accessibilityRole="alert" style={styles.error}>
                Saved session could not be restored: {restoreError}
              </Text>
            ) : null}
          </View>

          <View style={styles.divider} />
          <MenuRow
            endIcon="chevron-forward"
            icon="briefcase-outline"
            onPress={() => navigation.navigate("Jobs", { openJobsTab: "all" })}
            subtitle="Browse available opportunities"
            title="Explore Jobs"
          />
          <View style={styles.rowDivider} />
          <MenuRow
            endIcon="lock-closed-outline"
            icon="bookmark-outline"
            onPress={() => navigation.navigate("Login")}
            subtitle="Login required to view saved jobs"
            title="Saved Jobs"
          />
        </>
      )}
    </ScrollView>
  );
}

type InfoRowProps = {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  label: string;
  value: string;
};

function InfoRow({ icon, label, value }: InfoRowProps) {
  return (
    <View style={styles.infoRow}>
      <Ionicons color={colors.muted} name={icon} size={19} />
      <View style={styles.infoCopy}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.background,
    flex: 1,
  },
  content: {
    gap: 14,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  headerTitle: {
    color: colors.navy,
    fontSize: 25,
    fontWeight: "600",
    letterSpacing: -0.5,
  },
  guestWelcome: {
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 5,
    paddingVertical: 12,
  },
  guestAvatar: {
    alignItems: "center",
    backgroundColor: colors.blueLight,
    borderRadius: 31,
    height: 62,
    justifyContent: "center",
    width: 62,
  },
  guestTitle: {
    color: colors.navy,
    fontSize: 19,
    fontWeight: "600",
    marginTop: 2,
  },
  guestSubtitle: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
  },
  primaryAction: {
    alignSelf: "stretch",
    marginTop: 2,
  },
  divider: {
    backgroundColor: colors.border,
    height: 1,
    marginVertical: 2,
  },
  rowDivider: {
    backgroundColor: colors.border,
    height: 1,
    marginLeft: 33,
  },
  menuRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 13,
    minHeight: 62,
    paddingVertical: 7,
  },
  menuCopy: {
    flex: 1,
    gap: 4,
  },
  menuTitle: {
    color: colors.navy,
    fontSize: 14,
    fontWeight: "600",
  },
  menuSubtitle: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 17,
  },
  userSummary: {
    alignItems: "center",
    flexDirection: "row",
    gap: 14,
    paddingVertical: 8,
  },
  avatar: {
    alignItems: "center",
    backgroundColor: colors.blueLight,
    borderRadius: 28,
    height: 56,
    justifyContent: "center",
    width: 56,
  },
  userCopy: {
    flex: 1,
    gap: 4,
  },
  name: {
    color: colors.navy,
    fontSize: 16,
    fontWeight: "600",
  },
  email: {
    color: colors.muted,
    fontSize: 13,
  },
  status: {
    alignItems: "center",
    flexDirection: "row",
    gap: 6,
    marginTop: 2,
  },
  statusDot: {
    backgroundColor: "#2E9B62",
    borderRadius: 4,
    height: 7,
    width: 7,
  },
  statusText: {
    color: "#2E9B62",
    fontSize: 12,
    fontWeight: "500",
  },
  section: {
    gap: 14,
    paddingVertical: 5,
  },
  sectionTitle: {
    color: colors.navy,
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 1,
  },
  infoRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 13,
    minHeight: 42,
  },
  infoCopy: {
    flex: 1,
    gap: 3,
  },
  infoLabel: {
    color: colors.muted,
    fontSize: 11,
  },
  infoValue: {
    color: colors.navy,
    fontSize: 13,
    fontWeight: "500",
  },
  logoutButton: {
    alignItems: "center",
    alignSelf: "stretch",
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    marginTop: 4,
    minHeight: 48,
  },
  logoutLabel: {
    color: "#C62828",
    fontSize: 14,
    fontWeight: "600",
  },
  pressed: {
    opacity: 0.78,
  },
  error: {
    color: "#B42318",
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
  },
});
