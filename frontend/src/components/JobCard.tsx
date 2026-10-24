import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "./theme";

export type JobCardData = {
  id: string;
  title: string;
  company: string;
  location: string;
  initials: string;
  skills: string[];
};

type JobCardProps = {
  job: JobCardData;
  onPress: () => void;
  onSave: () => void;
};

export function JobCard({ job, onPress, onSave }: JobCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Pressable
          accessibilityRole="button"
          onPress={onPress}
          style={({ pressed }) => [styles.jobLink, pressed && styles.pressed]}
        >
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
        </Pressable>
        <Pressable
          accessibilityLabel="Save job"
          accessibilityRole="button"
          onPress={onSave}
          style={({ pressed }) => [styles.saveButton, pressed && styles.pressed]}
        >
          <Text style={styles.saveIcon}>♡</Text>
        </Pressable>
      </View>
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        style={({ pressed }) => [styles.bottomRow, pressed && styles.pressed]}
      >
        <Text style={styles.location}>{job.location}</Text>
      </Pressable>
      {job.skills.length > 0 && (
        <View style={styles.skillsRow}>
          {job.skills.slice(0, 3).map((skill) => (
            <View key={skill} style={styles.skillPill}>
              <Text numberOfLines={1} style={styles.skillText}>
                {skill}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
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
  jobLink: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    gap: 12,
  },
  saveButton: {
    alignItems: "center",
    borderRadius: 18,
    height: 36,
    justifyContent: "center",
    width: 36,
  },
  saveIcon: {
    color: colors.blue,
    fontSize: 26,
    lineHeight: 30,
  },
  pressed: {
    opacity: 0.82,
  },
  topRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 4,
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
  skillsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 7,
  },
  skillPill: {
    backgroundColor: colors.blueLight,
    borderRadius: 20,
    maxWidth: "48%",
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  skillText: {
    color: colors.blueDark,
    fontSize: 11,
    fontWeight: "700",
  },
});
