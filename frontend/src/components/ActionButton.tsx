import { Pressable, StyleSheet, Text } from "react-native";
import { colors } from "./theme";

type ActionButtonProps = {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary";
  disabled?: boolean;
};

export function ActionButton({
  title,
  onPress,
  variant = "primary",
  disabled = false,
}: ActionButtonProps) {
  const secondary = variant === "secondary";

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        secondary ? styles.secondaryButton : styles.primaryButton,
        disabled && styles.disabledButton,
        pressed && !disabled && styles.pressedButton,
      ]}
    >
      <Text
        style={[
          styles.label,
          secondary ? styles.secondaryLabel : styles.primaryLabel,
          disabled && styles.disabledLabel,
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    borderRadius: 14,
    justifyContent: "center",
    minHeight: 52,
    paddingHorizontal: 20,
  },
  primaryButton: {
    backgroundColor: colors.blue,
  },
  secondaryButton: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderWidth: 1,
  },
  disabledButton: {
    backgroundColor: colors.blueLight,
    borderColor: colors.blueLight,
  },
  pressedButton: {
    opacity: 0.82,
  },
  label: {
    fontSize: 15,
    fontWeight: "700",
  },
  primaryLabel: {
    color: colors.white,
  },
  secondaryLabel: {
    color: colors.navy,
  },
  disabledLabel: {
    color: colors.muted,
  },
});
