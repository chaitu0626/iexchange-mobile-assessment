import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "./AuthContext";
import {
  getSavedJobs as getSavedJobsRequest,
  saveJob as saveJobRequest,
  unsaveJob as unsaveJobRequest,
} from "../services/jobsService";
import type { Job } from "../types/job";

type SavedJobsContextValue = {
  savedJobs: Job[];
  savedJobIds: ReadonlySet<string>;
  pendingJobIds: ReadonlySet<string>;
  isLoading: boolean;
  error: string | null;
  refreshSavedJobs: () => Promise<void>;
  toggleSavedJob: (jobId: string) => Promise<void>;
};

type SavedJobsState = {
  ownerId: string;
  jobs: Job[];
  error: string | null;
};

const SavedJobsContext = createContext<SavedJobsContextValue | undefined>(
  undefined
);

type SavedJobsProviderProps = {
  children: ReactNode;
};

export function SavedJobsProvider({ children }: SavedJobsProviderProps) {
  const { user } = useAuth();

  return (
    <SavedJobsSession key={user?.id ?? "guest"}>
      {children}
    </SavedJobsSession>
  );
}

function SavedJobsSession({ children }: SavedJobsProviderProps) {
  const { user, token } = useAuth();
  const ownerId = user?.id ?? null;
  const [state, setState] = useState<SavedJobsState | null>(null);
  const [pendingJobIds, setPendingJobIds] = useState<ReadonlySet<string>>(
    () => new Set()
  );
  const requestSequence = useRef(0);
  const inFlightLoad = useRef<{
    ownerId: string;
    promise: Promise<void>;
  } | null>(null);
  const inFlightMutations = useRef(new Set<string>());

  const refreshSavedJobs = useCallback(async () => {
    if (!ownerId || !token) {
      return;
    }

    const inFlight = inFlightLoad.current;
    if (inFlight?.ownerId === ownerId) {
      return inFlight.promise;
    }

    const requestId = ++requestSequence.current;
    const request = getSavedJobsRequest(token)
      .then((jobs) => {
        if (requestId === requestSequence.current) {
          setState({ ownerId, jobs, error: null });
        }
      })
      .catch((requestError: unknown) => {
        if (requestId === requestSequence.current) {
          setState((current) => ({
            ownerId,
            jobs: current?.ownerId === ownerId ? current.jobs : [],
            error:
              requestError instanceof Error
                ? requestError.message
                : "Could not load saved jobs.",
          }));
        }
      })
      .finally(() => {
        if (inFlightLoad.current?.promise === request) {
          inFlightLoad.current = null;
        }
      });

    inFlightLoad.current = { ownerId, promise: request };
    return request;
  }, [ownerId, token]);

  useEffect(() => {
    requestSequence.current += 1;
    inFlightLoad.current = null;

    if (ownerId && token) {
      void refreshSavedJobs();
    }
  }, [ownerId, refreshSavedJobs, token]);

  const toggleSavedJob = useCallback(
    async (jobId: string) => {
      if (!ownerId || !token) {
        throw new Error("Log in to save jobs.");
      }
      const mutationKey = `${ownerId}:${jobId}`;
      if (inFlightMutations.current.has(mutationKey)) {
        return;
      }

      inFlightMutations.current.add(mutationKey);
      setPendingJobIds((current) => new Set(current).add(mutationKey));

      try {
        const currentlySaved =
          state?.ownerId === ownerId &&
          state.jobs.some((job) => job.id === jobId);

        if (currentlySaved) {
          await unsaveJobRequest(jobId, token);
          requestSequence.current += 1;
          inFlightLoad.current = null;
          setState((current) =>
            current?.ownerId === ownerId
              ? {
                  ...current,
                  jobs: current.jobs.filter((job) => job.id !== jobId),
                  error: null,
                }
              : current
          );
        } else {
          const savedJob = await saveJobRequest(jobId, token);
          requestSequence.current += 1;
          inFlightLoad.current = null;
          setState((current) => {
            const currentJobs =
              current?.ownerId === ownerId ? current.jobs : [];
            return {
              ownerId,
              jobs: currentJobs.some((job) => job.id === savedJob.id)
                ? currentJobs
                : [savedJob, ...currentJobs],
              error: null,
            };
          });
        }
        void refreshSavedJobs();
      } finally {
        inFlightMutations.current.delete(mutationKey);
        setPendingJobIds((current) => {
          const next = new Set(current);
          next.delete(mutationKey);
          return next;
        });
      }
    },
    [ownerId, refreshSavedJobs, state, token]
  );

  const currentState = state?.ownerId === ownerId ? state : null;
  const currentPendingJobIds = useMemo(
    () =>
      new Set(
        [...pendingJobIds]
          .filter((key) => ownerId !== null && key.startsWith(`${ownerId}:`))
          .map((key) => (ownerId ? key.slice(ownerId.length + 1) : key))
      ),
    [ownerId, pendingJobIds]
  );
  const value = useMemo<SavedJobsContextValue>(
    () => ({
      savedJobs: currentState?.jobs ?? [],
      savedJobIds: new Set(currentState?.jobs.map((job) => job.id) ?? []),
      pendingJobIds: currentPendingJobIds,
      isLoading: Boolean(ownerId && token && !currentState),
      error: currentState?.error ?? null,
      refreshSavedJobs,
      toggleSavedJob,
    }),
    [
      currentState,
      ownerId,
      currentPendingJobIds,
      refreshSavedJobs,
      token,
      toggleSavedJob,
    ]
  );

  return (
    <SavedJobsContext.Provider value={value}>
      {children}
    </SavedJobsContext.Provider>
  );
}

export function useSavedJobs(): SavedJobsContextValue {
  const context = useContext(SavedJobsContext);
  if (!context) {
    throw new Error("useSavedJobs must be used inside SavedJobsProvider");
  }
  return context;
}
