import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";

import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const SignupScreen = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");

  const router = useRouter();
  const animationRef = useRef(null);

  useEffect(() => {
    if (animationRef.current) animationRef.current.play();
  }, []);

  const handleSignup = async () => {
    // Clear previous errors
    setEmailError("");

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    setIsLoading(true);
    const payload = {
      name: name,
      email: email,
      password: password,
      isEmailVerified: true
    };
    try {
      const response = await axios.post(
        "https://node-starter-temlate.onrender.com/api/v1/auth/register",
        payload
      );
      console.log("here is the response", response);
      if (response?.status === 201) {
        console.log("here is the response", response);
        Alert.alert("Success", "Account created successfully!", [
          { text: "OK", onPress: () => router.push("/auth/login") },
        ]);
      } else {
        console.log("here is the error", response);
        Alert.alert("Error", "Failed to create account");
      }
    } catch (error) {
      if (
        error.response?.status === 409 ||
        (error.response?.status === 400 &&
          error.response?.data?.message === "User already exists")
      ) {
        setEmailError("User already exists with this email address");
      } else {
        Alert.alert("Signup failed", "Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      <View style={styles.logoContainer}>
        <View style={styles.lottieContainer}>
          <LottieView
            ref={animationRef}
            source={require("../../assets/animations/login.json")}
            style={styles.lottieAnimation}
            autoPlay
            loop
          />
        </View>
      </View>

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={[styles.input, emailError ? styles.inputError : null]}
          placeholder="Email"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setEmailError("");
          }}
          keyboardType="email-address"
        />
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons
              name={showPassword ? "eye-off" : "eye"}
              size={24}
              color="#666"
            />
          </TouchableOpacity>
        </View>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Confirm Password"
            secureTextEntry={!showConfirmPassword}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            <Ionicons
              name={showConfirmPassword ? "eye-off" : "eye"}
              size={24}
              color="#666"
            />
          </TouchableOpacity>
        </View>
        {isLoading ? (
          <View style={styles.button}>
            <ActivityIndicator size="small" color="#ffffff" />
          </View>
        ) : (
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleSignup()}
          >
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.signupText}>
          Already have an account?{" "}
          <Text
            style={styles.signupTextLink}
            onPress={() => router.push("/auth/login")}
          >
            Login
          </Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    paddingTop: StatusBar.currentHeight || 0,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  lottieContainer: {
    width: 100,
    height: 100,
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  lottieAnimation: {
    width: 200,
    height: 200,
  },
  appName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2c3e50",
    marginTop: 10,
  },
  formContainer: {
    width: "100%",
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "600",
    color: "#34495e",
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    marginBottom: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: "#ffffff",
    fontSize: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#3498db",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  forgotPassword: {
    color: "#3498db",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    textAlign: "right",
    width: "100%",
  },
  signupText: {
    color: "#3498db",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    marginTop: 20,
  },
  signupTextLink: {
    color: "#3498db",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  passwordContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    backgroundColor: "#ffffff",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  passwordInput: {
    flex: 1,
    height: 50,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  inputError: {
    borderColor: "#e74c3c",
  },
  errorText: {
    color: "#e74c3c",
    fontSize: 14,
    marginTop: -10,
    marginBottom: 10,
    alignSelf: "flex-start",
  },
});

export default SignupScreen;
