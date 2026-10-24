import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ActionButton } from "../components/ActionButton";
import { FormField } from "../components/FormField";
import { colors } from "../components/theme";
import type { RootStackParamList } from "../types/navigation";

type LoginScreenProps = NativeStackScreenProps<RootStackParamList, "Login">;

export function LoginScreen({ navigation }: LoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      style={styles.screen}
    >
      <View style={styles.intro}>
        <Text style={styles.eyebrow}>WELCOME BACK</Text>
        <Text style={styles.title}>Sign in</Text>
        <Text style={styles.description}>
          Continue your iExchange journey.
        </Text>
      </View>

      <View style={styles.form}>
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
          placeholder="Enter your password"
          secureTextEntry
          value={password}
        />
        <ActionButton
          disabled
          onPress={() => undefined}
          title="Sign-in coming soon"
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>New to iExchange?</Text>
        <Text
          accessibilityRole="link"
          onPress={() => navigation.navigate("Signup")}
          style={styles.link}
        >
          Create an account
        </Text>
      </View>
      <Text style={styles.note}>
        This form is a UI placeholder. Authentication will be added later.
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
    gap: 26,
    padding: 22,
    paddingTop: 34,
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
    fontSize: 30,
    fontWeight: "800",
  },
  description: {
    color: colors.muted,
    fontSize: 14,
  },
  form: {
    gap: 18,
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
