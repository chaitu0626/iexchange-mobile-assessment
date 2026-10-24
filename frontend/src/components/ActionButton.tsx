import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "./theme";

type ActionButtonProps = {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary";
  disabled?: boolean;
  loading?: boolean;
};

export function ActionButton({
  title,
  onPress,
  variant = "primary",
  disabled = false,
  loading = false,
}: ActionButtonProps) {
  const secondary = variant === "secondary";
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ busy: loading, disabled: isDisabled }}
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        secondary ? styles.secondaryButton : styles.primaryButton,
        isDisabled && styles.disabledButton,
        pressed && !isDisabled && styles.pressedButton,
      ]}
    >
      <View style={styles.content}>
        {loading && (
          <ActivityIndicator
            color={secondary ? colors.blue : colors.white}
            size="small"
          />
        )}
        <Text
          style={[
            styles.label,
            secondary ? styles.secondaryLabel : styles.primaryLabel,
            isDisabled && !loading && styles.disabledLabel,
          ]}
        >
          {title}
        </Text>
      </View>
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
  content: {
    alignItems: "center",
    flexDirection: "row",
    gap: 9,
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
