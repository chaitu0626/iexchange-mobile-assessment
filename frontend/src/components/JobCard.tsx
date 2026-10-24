import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "./theme";

export type JobCardData = {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  initials: string;
};

type JobCardProps = {
  job: JobCardData;
  onPress: () => void;
};

export function JobCard({ job, onPress }: JobCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.topRow}>
        <View style={styles.companyIcon}>
          <Text style={styles.companyInitials}>{job.initials}</Text>
        </View>
        <View style={styles.titleBlock}>
          <Text numberOfLines={1} style={styles.title}>
            {job.title}
          </Text>
          <Text style={styles.company}>{job.company}</Text>
        </View>
        <Text accessibilityLabel="View job details" style={styles.chevron}>
          ›
        </Text>
      </View>
      <View style={styles.bottomRow}>
        <Text style={styles.location}>{job.location}</Text>
        <View style={styles.typePill}>
          <Text style={styles.typeText}>{job.type}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    gap: 18,
    padding: 17,
  },
  pressed: {
    opacity: 0.82,
  },
  topRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
  },
  companyIcon: {
    alignItems: "center",
    backgroundColor: colors.blueLight,
    borderRadius: 13,
    height: 46,
    justifyContent: "center",
    width: 46,
  },
  companyInitials: {
    color: colors.blueDark,
    fontSize: 14,
    fontWeight: "800",
  },
  titleBlock: {
    flex: 1,
    gap: 5,
  },
  title: {
    color: colors.navy,
    fontSize: 15,
    fontWeight: "700",
  },
  company: {
    color: colors.muted,
    fontSize: 13,
  },
  chevron: {
    color: colors.muted,
    fontSize: 28,
    lineHeight: 30,
  },
  bottomRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  location: {
    color: colors.muted,
    fontSize: 13,
  },
  typePill: {
    backgroundColor: colors.blueLight,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  typeText: {
    color: colors.blueDark,
    fontSize: 11,
    fontWeight: "700",
  },
});
