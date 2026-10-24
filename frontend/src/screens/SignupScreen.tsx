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

type SignupScreenProps = NativeStackScreenProps<RootStackParamList, "Signup">;
type SignupErrors = Partial<
  Record<"name" | "email" | "password" | "confirmPassword", string>
>;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

export function SignupScreen({ navigation }: SignupScreenProps) {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<SignupErrors>({});
  const [requestError, setRequestError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSignup() {
    Keyboard.dismiss();
    const nextErrors: SignupErrors = {};
    const normalizedName = name.trim();
    const normalizedEmail = email.trim();

    if (!normalizedName) {
      nextErrors.name = "Full name is required.";
    }
    if (!normalizedEmail) {
      nextErrors.email = "Email is required.";
    } else if (!EMAIL_PATTERN.test(normalizedEmail)) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (!password) {
      nextErrors.password = "Password is required.";
    } else if (password.length < MIN_PASSWORD_LENGTH) {
      nextErrors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
    }
    if (!confirmPassword) {
      nextErrors.confirmPassword = "Please confirm your password.";
    } else if (password !== confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(nextErrors);
    setRequestError(null);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      await register({
        name: normalizedName,
        email: normalizedEmail,
        password,
      });
      navigation.popTo("MainTabs", { screen: "Profile" });
    } catch (error) {
      setRequestError(
        error instanceof Error
          ? error.message
          : "Could not create your account. Try again."
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
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.description}>
            Create an account to get started with iExchange.
          </Text>
        </View>

        <View style={styles.form}>
          <FormField
            autoCapitalize="words"
            error={errors.name}
            label="Full Name"
            onChangeText={(value) => {
              setName(value);
              setErrors((current) => ({ ...current, name: undefined }));
              setRequestError(null);
            }}
            placeholder="Your full name"
            value={name}
          />
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
              setErrors((current) => ({
                ...current,
                password: undefined,
                confirmPassword: undefined,
              }));
              setRequestError(null);
            }}
            placeholder="Create a password"
            secureTextEntry
            showPasswordToggle
            value={password}
          />
          <FormField
            autoCapitalize="none"
            error={errors.confirmPassword}
            label="Confirm Password"
            onChangeText={(value) => {
              setConfirmPassword(value);
              setErrors((current) => ({
                ...current,
                confirmPassword: undefined,
              }));
              setRequestError(null);
            }}
            placeholder="Re-enter your password"
            secureTextEntry
            showPasswordToggle
            value={confirmPassword}
          />
          {requestError ? (
            <Text accessibilityRole="alert" style={styles.requestError}>
              {requestError}
            </Text>
          ) : null}
          <ActionButton
            loading={isSubmitting}
            onPress={handleSignup}
            title={isSubmitting ? "Creating account..." : "Create Account"}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <Pressable
            accessibilityRole="link"
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.link}>Login</Text>
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
    gap: 24,
    padding: 22,
    paddingBottom: 36,
    paddingTop: 24,
  },
  intro: {
    gap: 8,
  },
  title: {
    color: colors.navy,
    fontSize: 28,
    fontWeight: "800",
  },
  description: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
  },
  form: {
    gap: 16,
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
