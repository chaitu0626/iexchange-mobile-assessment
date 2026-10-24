import { ScrollView, StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ActionButton } from "../components/ActionButton";
import { colors } from "../components/theme";
import type { RootStackParamList } from "../types/navigation";

type JobDetailsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "JobDetails"
>;

export function JobDetailsScreen({ route }: JobDetailsScreenProps) {
  const { jobId, title } = route.params;

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      style={styles.screen}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.companyIcon}>
        <Text style={styles.companyInitial}>i</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.company}>iExchange partner company · Remote</Text>

      <View style={styles.tag}>
        <Text style={styles.tagText}>Full time</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About this opportunity</Text>
        <Text style={styles.body}>
          This is a placeholder job details screen. A full role description,
          requirements, and application flow can be added when job data is
          connected.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Job reference</Text>
        <Text style={styles.body}>{jobId}</Text>
      </View>

      <ActionButton
        disabled
        onPress={() => undefined}
        title="Applications coming soon"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.background,
    flex: 1,
  },
  content: {
    gap: 18,
    padding: 22,
  },
  companyIcon: {
    alignItems: "center",
    backgroundColor: colors.blueLight,
    borderRadius: 18,
    height: 62,
    justifyContent: "center",
    width: 62,
  },
  companyInitial: {
    color: colors.blue,
    fontSize: 26,
    fontWeight: "800",
  },
  title: {
    color: colors.navy,
    fontSize: 27,
    fontWeight: "800",
    lineHeight: 34,
  },
  company: {
    color: colors.muted,
    fontSize: 14,
  },
  tag: {
    alignSelf: "flex-start",
    backgroundColor: colors.blueLight,
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  tagText: {
    color: colors.blueDark,
    fontSize: 12,
    fontWeight: "700",
  },
  section: {
    borderTopColor: colors.border,
    borderTopWidth: 1,
    gap: 9,
    paddingTop: 18,
  },
  sectionTitle: {
    color: colors.navy,
    fontSize: 16,
    fontWeight: "700",
  },
  body: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 22,
  },
});
