import React, { useState } from "react";
import { View, TextInput, Button, Text } from "react-native";
import * as SecureStore from "expo-secure-store";

const LoginScreen = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    // Retrieve stored hashed password for username
    const storedPasswordHash = await SecureStore.getItemAsync(username);

    if (!storedPasswordHash) {
      setError("Invalid username");
      return;
    }

    // Compare hashed password with entered password
    const enteredPasswordHash = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      password
    );

    if (enteredPasswordHash !== storedPasswordHash) {
      setError("Invalid password");
      return;
    }

    // Create and store session token
    const sessionToken = uuidv4(); // Generate a UUID for the session token
    await SecureStore.setItemAsync("sessionToken", sessionToken);

    // Call onLogin with the session token
    onLogin(sessionToken);
  };

  return (
    <View>
      <Text>Username:</Text>
      <TextInput
        autoCapitalize="none"
        autoCompleteType="username"
        autoCorrect={false}
        onChangeText={setUsername}
        value={username}
      />
      <Text>Password:</Text>
      <TextInput
        secureTextEntry={!passwordVisible}
        autoCapitalize="none"
        autoCompleteType="password"
        autoCorrect={false}
        onChangeText={setPassword}
        value={password}
      />
      <Button
        title={passwordVisible ? "Hide" : "Show"}
        onPress={() => setPasswordVisible(!passwordVisible)}
      />
      {error && <Text>{error}</Text>}
      <Button title="Log In" onPress={handleLogin} />
    </View>
  );
};

export default LoginScreen;
