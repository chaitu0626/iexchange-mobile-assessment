import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { colors } from "./theme";

type FormFieldProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  secureTextEntry?: boolean;
  showPasswordToggle?: boolean;
  error?: string;
  keyboardType?: "default" | "email-address";
  autoCapitalize?: "none" | "sentences" | "words";
};

export function FormField({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  showPasswordToggle = false,
  error,
  keyboardType = "default",
  autoCapitalize = "sentences",
}: FormFieldProps) {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputContainer, error && styles.inputError]}>
        <TextInput
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
          keyboardType={keyboardType}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.muted}
          secureTextEntry={secureTextEntry && !passwordVisible}
          style={styles.input}
          value={value}
        />
        {secureTextEntry && showPasswordToggle && (
          <Pressable
            accessibilityLabel={passwordVisible ? "Hide password" : "Show password"}
            accessibilityRole="button"
            onPress={() => setPasswordVisible((visible) => !visible)}
            style={styles.toggle}
          >
            <Text style={styles.toggleLabel}>
              {passwordVisible ? "Hide" : "Show"}
            </Text>
          </Pressable>
        )}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: 8,
  },
  label: {
    color: colors.navy,
    fontSize: 14,
    fontWeight: "600",
  },
  inputContainer: {
    alignItems: "center",
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 13,
    borderWidth: 1,
    flexDirection: "row",
    minHeight: 52,
  },
  inputError: {
    borderColor: "#D14343",
  },
  input: {
    flex: 1,
    color: colors.navy,
    fontSize: 16,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  toggle: {
    minHeight: 48,
    justifyContent: "center",
    paddingHorizontal: 14,
  },
  toggleLabel: {
    color: colors.blue,
    fontSize: 13,
    fontWeight: "700",
  },
  error: {
    color: "#B42318",
    fontSize: 12,
  },
});
