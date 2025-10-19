import { CameraView } from "expo-camera";
import { Stack } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  AppState,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Overlay } from "./Overlay";
import { scanUrl } from "../../utils/api";

export default function Home() {
  const qrLock = useRef(false);
  const appState = useRef(AppState.currentState);
  const [loading, setLoading] = useState(false);

  // Reset the QR lock when app returns to foreground
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        qrLock.current = false;
      }
      appState.current = nextAppState;
    });

    return () => subscription.remove();
  }, []);

  const handleScannedUrl = async (url: string) => {
    try {
      setLoading(true);
      const result = await scanUrl(url);
      setLoading(false);

      Alert.alert(
      "Scan Result",
      result.status === "malicious"
        ? "⚠️ This URL is malicious!\n\nBlocked access for your safety."
        : `✅ This URL is safe!\n\nSummary:\n${result.summary || "No summary available."}`,
      [
        {
          text: "OK",
          onPress: () => {
            qrLock.current = false; // allow scanning again
          },
        },
      ]
    );

    } catch (error) {
      setLoading(false);
      Alert.alert("Error", "Failed to scan URL for safety", [
        {
          text: "OK",
          onPress: () => {
            qrLock.current = false; // reset after error
          },
        },
      ]);
    }
  };

  return (
    <SafeAreaView style={StyleSheet.absoluteFillObject}>
      <Stack.Screen
        options={{
          title: "QRArmor",
          headerShown: false,
        }}
      />

      {Platform.OS === "android" ? <StatusBar hidden /> : null}

      {/* QR Camera */}
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        onBarcodeScanned={({ data }) => {
          if (data && !qrLock.current) {
            qrLock.current = true;
            setTimeout(() => {
              handleScannedUrl(data);
            }, 500);
          }
        }}
      />

      {/* Custom Overlay Frame */}
      <Overlay />

      {/* Loading Overlay */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Scanning...</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "white",
    fontSize: 18,
    marginTop: 10,
    fontWeight: "500",
  },
});
