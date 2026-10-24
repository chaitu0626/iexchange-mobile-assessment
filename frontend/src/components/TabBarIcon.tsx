import { StyleSheet, View } from "react-native";

type TabBarIconProps = {
  name: "briefcase" | "user";
  color: string;
  size: number;
};

export function TabBarIcon({ name, color, size }: TabBarIconProps) {
  if (name === "briefcase") {
    return (
      <View
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={[
          styles.briefcase,
          {
            borderColor: color,
            height: size * 0.62,
            width: size * 0.82,
          },
        ]}
      >
        <View
          style={[
            styles.handle,
            {
              borderColor: color,
              height: size * 0.22,
              width: size * 0.36,
            },
          ]}
        />
        <View style={[styles.briefcaseLine, { backgroundColor: color }]} />
      </View>
    );
  }

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={{ height: size, width: size }}
    >
      <View
        style={[
          styles.userHead,
          {
            backgroundColor: color,
            height: size * 0.34,
            left: size * 0.33,
            top: size * 0.08,
            width: size * 0.34,
          },
        ]}
      />
      <View
        style={[
          styles.userBody,
          {
            backgroundColor: color,
            bottom: size * 0.08,
            height: size * 0.39,
            left: size * 0.14,
            width: size * 0.72,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  briefcase: {
    alignItems: "center",
    borderRadius: 4,
    borderWidth: 2,
    justifyContent: "center",
    marginTop: 5,
  },
  handle: {
    borderBottomWidth: 0,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    borderWidth: 2,
    position: "absolute",
    top: -7,
  },
  briefcaseLine: {
    height: 2,
    position: "absolute",
    top: "42%",
    width: "100%",
  },
  userHead: {
    borderRadius: 99,
    position: "absolute",
  },
  userBody: {
    borderTopLeftRadius: 99,
    borderTopRightRadius: 99,
    position: "absolute",
  },
});
