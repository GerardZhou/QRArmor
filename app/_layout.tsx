import { Slot } from "expo-router";
import { useCameraPermissions } from "expo-camera";
import { useEffect } from "react";

export default function RootLayout() {
  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    requestPermission();
  }, []);

  return <Slot />;
}
