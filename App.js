import React, { useState } from "react";
import { View, Button } from "react-native";
import * as SecureStore from "expo-secure-store";
import AccountCreationModal from "./components/AccountCreationModal";
import LoginScreen from "./components/LoginScreen";

const App = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [sessionToken, setSessionToken] = useState(null);

  const handleCreateAccount = () => {
    setModalVisible(true);
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  const handleCreateAccountSubmit = async (username, password) => {
    // Check if username already exists
    const storedUsername = await SecureStore.getItemAsync(username);
    if (storedUsername) {
      alert("Username already exists");
      return;
    }

    // Store username and hashed password in SecureStorage
    const passwordHash = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      password
    );
    await SecureStore.setItemAsync(username, passwordHash);

    // Log in user
    handleLogin(username, password);
  };

  const handleLogin = async (username, password) => {
    // Retrieve stored hashed password for username
    const storedPasswordHash = await SecureStore.getItemAsync(username);

    if (!storedPasswordHash) {
      alert("Invalid username");
      return;
    }

    // Compare hashed password with entered password
    const enteredPasswordHash = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      password
    );

    if (enteredPasswordHash !== storedPasswordHash) {
      alert("Invalid password");
      return;
    }

    // Create and store session token
    const sessionToken = uuidv4(); // Generate a UUID for the session token
    await SecureStore.setItemAsync("sessionToken", sessionToken);
    setSessionToken(sessionToken);

    // Close account creation modal
    setModalVisible(false);
  };

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync("sessionToken");
    setSessionToken(null);
  };

  return (
    <View>
      {sessionToken ? (
        <View>
          <Button title="Log Out" onPress={handleLogout} />
          {/* Render content for logged-in users */}
        </View>
      ) : (
        <View>
          <Button title="Create Account" onPress={handleCreateAccount} />
          <LoginScreen onLogin={handleLogin} />
        </View>
      )}
      <AccountCreationModal
        visible={modalVisible}
        onCancel={handleCancel}
        onSubmit={handleCreateAccountSubmit}
      />
    </View>
  );
};

export default App;
