import React, { useState } from "react";
import { View, TextInput, Button, Modal, Text } from "react-native";
import * as SecureStore from "expo-secure-store";

const AccountCreationModal = ({ visible, onCancel, onSubmit }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordVerification, setPasswordVerification] = useState("");

  const handleSubmit = async () => {
    // Check if passwords match
    if (password !== passwordVerification) {
      alert("Passwords do not match");
      return;
    }

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
    onSubmit();
  };

  return (
    <Modal visible={visible} onRequestClose={onCancel}>
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
        <Text>Verify Password:</Text>
        <TextInput
          secureTextEntry={!passwordVisible}
          autoCapitalize="none"
          autoCompleteType="password"
          autoCorrect={false}
          onChangeText={setPasswordVerification}
          value={passwordVerification}
        />
        <Button title="Cancel" onPress={onCancel} />
        <Button title="Submit" onPress={handleSubmit} />
      </View>
    </Modal>
  );
};

export default AccountCreationModal;
