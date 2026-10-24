import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ActionButton } from "../components/ActionButton";
import { colors } from "../components/theme";
import { ApiError } from "../services/api";
import { getJobById } from "../services/jobsService";
import type { Job } from "../types/job";
import type { RootStackParamList } from "../types/navigation";

type JobDetailsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "JobDetails"
>;

export function JobDetailsScreen({ route }: JobDetailsScreenProps) {
  const { jobId } = route.params;
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isNotFound, setIsNotFound] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let isCurrent = true;

    getJobById(jobId)
      .then((result) => {
        if (isCurrent) {
          setJob(result);
        }
      })
      .catch((requestError: unknown) => {
        if (!isCurrent) {
          return;
        }

        if (requestError instanceof ApiError && requestError.status === 404) {
          setIsNotFound(true);
        } else {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Could not load this job."
          );
        }
      })
      .finally(() => {
        if (isCurrent) {
          setIsLoading(false);
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [jobId, retryCount]);

  if (isLoading) {
    return (
      <View style={styles.centeredState}>
        <ActivityIndicator color={colors.blue} size="large" />
        <Text style={styles.stateMessage}>Loading job details...</Text>
      </View>
    );
  }

  if (isNotFound) {
    return (
      <View style={styles.centeredState}>
        <Text style={styles.stateTitle}>Job not found</Text>
        <Text style={styles.stateMessage}>
          This opportunity may no longer be available.
        </Text>
      </View>
    );
  }

  if (error || !job) {
    return (
      <View style={styles.centeredState}>
        <Text style={styles.stateTitle}>Unable to load job details</Text>
        <Text style={styles.stateMessage}>
          {error ?? "The server returned no job details."}
        </Text>
        <ActionButton
          onPress={() => {
            setIsLoading(true);
            setError(null);
            setIsNotFound(false);
            setRetryCount((count) => count + 1);
          }}
          title="Retry"
          variant="secondary"
        />
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      style={styles.screen}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.companyIcon}>
        <Text style={styles.companyInitial}>
          {job.company.trim().charAt(0).toUpperCase() || "?"}
        </Text>
      </View>
      <Text style={styles.title}>{job.title}</Text>
      <Text style={styles.company}>{job.company}</Text>
      <Text style={styles.location}>{job.location}</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About this opportunity</Text>
        <Text style={styles.body}>{job.description}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Requirements</Text>
        <Text style={styles.body}>{job.requirements}</Text>
      </View>

      {job.skills.length > 0 ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Required skills</Text>
          <View style={styles.skills}>
            {job.skills.map((skill) => (
              <View key={skill} style={styles.skillPill}>
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            ))}
          </View>
        </View>
      ) : null}
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
    paddingBottom: 32,
  },
  centeredState: {
    alignItems: "center",
    backgroundColor: colors.background,
    flex: 1,
    gap: 14,
    justifyContent: "center",
    padding: 28,
  },
  stateTitle: {
    color: colors.navy,
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
  stateMessage: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
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
    fontSize: 15,
    fontWeight: "600",
  },
  location: {
    color: colors.muted,
    fontSize: 14,
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
  skills: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  skillPill: {
    backgroundColor: colors.blueLight,
    borderRadius: 18,
    paddingHorizontal: 11,
    paddingVertical: 7,
  },
  skillText: {
    color: colors.blueDark,
    fontSize: 12,
    fontWeight: "600",
  },
});
