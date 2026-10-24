import { useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useAuth } from "../context/AuthContext";
import { ActionButton } from "../components/ActionButton";
import { FormField } from "../components/FormField";
import { colors } from "../components/theme";
import type { RootStackParamList } from "../types/navigation";

type LoginScreenProps = NativeStackScreenProps<RootStackParamList, "Login">;
type LoginErrors = Partial<Record<"email" | "password", string>>;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginScreen({ navigation }: LoginScreenProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<LoginErrors>({});
  const [requestError, setRequestError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogin() {
    Keyboard.dismiss();
    const nextErrors: LoginErrors = {};
    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      nextErrors.email = "Email is required.";
    } else if (!EMAIL_PATTERN.test(normalizedEmail)) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (!password) {
      nextErrors.password = "Password is required.";
    }

    setErrors(nextErrors);
    setRequestError(null);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      await login({ email: normalizedEmail, password });
      navigation.popTo("MainTabs", { screen: "Profile" });
    } catch (error) {
      setRequestError(
        error instanceof Error ? error.message : "Could not sign in. Try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.screen}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.intro}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.description}>
            Sign in to continue to your iExchange account.
          </Text>
        </View>

        <View style={styles.form}>
          <FormField
            autoCapitalize="none"
            error={errors.email}
            keyboardType="email-address"
            label="Email"
            onChangeText={(value) => {
              setEmail(value);
              setErrors((current) => ({ ...current, email: undefined }));
              setRequestError(null);
            }}
            placeholder="you@example.com"
            value={email}
          />
          <FormField
            autoCapitalize="none"
            error={errors.password}
            label="Password"
            onChangeText={(value) => {
              setPassword(value);
              setErrors((current) => ({ ...current, password: undefined }));
              setRequestError(null);
            }}
            placeholder="Enter your password"
            secureTextEntry
            showPasswordToggle
            value={password}
          />
          {requestError ? (
            <Text accessibilityRole="alert" style={styles.requestError}>
              {requestError}
            </Text>
          ) : null}
          <ActionButton
            loading={isSubmitting}
            onPress={handleLogin}
            title={isSubmitting ? "Signing in..." : "Login"}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don&apos;t have an account?</Text>
          <Pressable
            accessibilityRole="link"
            onPress={() => navigation.navigate("Signup")}
          >
            <Text style={styles.link}>Sign Up</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.background,
    flex: 1,
  },
  content: {
    flexGrow: 1,
    gap: 30,
    justifyContent: "center",
    padding: 22,
    paddingBottom: 36,
  },
  intro: {
    gap: 9,
  },
  title: {
    color: colors.navy,
    fontSize: 30,
    fontWeight: "800",
  },
  description: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
  },
  form: {
    gap: 18,
  },
  requestError: {
    color: "#B42318",
    fontSize: 13,
    lineHeight: 19,
  },
  footer: {
    alignItems: "center",
    flexDirection: "row",
    gap: 5,
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
});
