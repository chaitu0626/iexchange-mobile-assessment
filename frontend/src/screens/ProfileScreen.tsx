import { ScrollView, StyleSheet, Text, View } from "react-native";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { CompositeScreenProps } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ActionButton } from "../components/ActionButton";
import { colors } from "../components/theme";
import type { MainTabParamList, RootStackParamList } from "../types/navigation";

type ProfileScreenProps = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, "Profile">,
  NativeStackScreenProps<RootStackParamList>
>;

export function ProfileScreen({ navigation }: ProfileScreenProps) {
  const insets = useSafeAreaInsets();

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
          <Text style={styles.avatarText}>G</Text>
        </View>
        <View style={styles.profileCopy}>
          <Text style={styles.name}>Welcome to iExchange</Text>
          <Text style={styles.description}>
            Sign in or create an account to get started.
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        <ActionButton
          onPress={() => navigation.navigate("Login")}
          title="Sign in"
        />
        <ActionButton
          onPress={() => navigation.navigate("Signup")}
          title="Create an account"
          variant="secondary"
        />
      </View>

      <Text style={styles.note}>
        Account features are placeholders in this navigation step.
      </Text>
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
  note: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
    textAlign: "center",
  },
});
