import { StyleSheet, Text, View } from "react-native";
import { ActionButton } from "../components/ActionButton";
import { colors } from "../components/theme";

type SavedJobsScreenProps = {
  onBrowseJobs: () => void;
};

export function SavedJobsScreen({ onBrowseJobs }: SavedJobsScreenProps) {
  return (
    <View style={styles.container}>
      <View style={styles.bookmarkCircle}>
        <Text style={styles.bookmark}>♡</Text>
      </View>
      <Text style={styles.title}>No saved jobs yet</Text>
      <Text style={styles.description}>
        Jobs you save will be collected here so you can find them easily.
      </Text>
      <ActionButton onPress={onBrowseJobs} title="Browse all jobs" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: 14,
    paddingHorizontal: 22,
    paddingTop: 54,
  },
  bookmarkCircle: {
    alignItems: "center",
    backgroundColor: colors.blueLight,
    borderRadius: 34,
    height: 68,
    justifyContent: "center",
    width: 68,
  },
  bookmark: {
    color: colors.blue,
    fontSize: 38,
    lineHeight: 44,
  },
  title: {
    color: colors.navy,
    fontSize: 19,
    fontWeight: "700",
    marginTop: 6,
  },
  description: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
  },
});
