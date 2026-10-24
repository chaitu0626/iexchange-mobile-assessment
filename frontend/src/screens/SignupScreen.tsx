import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ActionButton } from "../components/ActionButton";
import { FormField } from "../components/FormField";
import { colors } from "../components/theme";
import type { RootStackParamList } from "../types/navigation";

type SignupScreenProps = NativeStackScreenProps<RootStackParamList, "Signup">;

export function SignupScreen({ navigation }: SignupScreenProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      style={styles.screen}
    >
      <View style={styles.intro}>
        <Text style={styles.eyebrow}>JOIN IEXCHANGE</Text>
        <Text style={styles.title}>Create account</Text>
        <Text style={styles.description}>
          Set up your profile to get started.
        </Text>
      </View>

      <View style={styles.form}>
        <FormField
          label="Full name"
          onChangeText={setName}
          placeholder="Your name"
          value={name}
        />
        <FormField
          autoCapitalize="none"
          keyboardType="email-address"
          label="Email"
          onChangeText={setEmail}
          placeholder="you@example.com"
          value={email}
        />
        <FormField
          label="Password"
          onChangeText={setPassword}
          placeholder="Create a password"
          secureTextEntry
          value={password}
        />
        <ActionButton
          disabled
          onPress={() => undefined}
          title="Sign-up coming soon"
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account?</Text>
        <Text
          accessibilityRole="link"
          onPress={() => navigation.navigate("Login")}
          style={styles.link}
        >
          Sign in
        </Text>
      </View>
      <Text style={styles.note}>
        This form is a UI placeholder. Account creation will be added later.
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
    flexGrow: 1,
    gap: 24,
    padding: 22,
    paddingTop: 30,
  },
  intro: {
    gap: 8,
  },
  eyebrow: {
    color: colors.blue,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.5,
  },
  title: {
    color: colors.navy,
    fontSize: 28,
    fontWeight: "800",
  },
  description: {
    color: colors.muted,
    fontSize: 14,
  },
  form: {
    gap: 16,
  },
  footer: {
    alignItems: "center",
    flexDirection: "row",
    gap: 6,
    justifyContent: "center",
  },
  footerText: {
    color: colors.muted,
    fontSize: 13,
  },
  link: {
    color: colors.blue,
    fontSize: 13,
    fontWeight: "700",
  },
  note: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
  },
});
