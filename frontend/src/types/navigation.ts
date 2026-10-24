import type { NavigatorScreenParams } from "@react-navigation/native";

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList> | undefined;
  JobDetails: {
    jobId: string;
  };
  Login: undefined;
  Signup: undefined;
};

export type MainTabParamList = {
  Jobs: undefined;
  Profile: undefined;
};
