import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";

import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const LoginScreen = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [credentialsError, setCredentialsError] = useState("");

  const router = useRouter();
  const animationRef = useRef(null);

  useEffect(() => {
    if (animationRef.current) animationRef.current.play();
  }, []);

  const handleLogin = async () => {
    // Clear previous errors
    setCredentialsError("");
    
    setIsLoading(true);
    const payload = {
      email: email,
      password: password,
    };
    try {
        const response = await axios.post("https://node-starter-temlate.onrender.com/api/v1/auth/login", payload);
        if(response?.status === 200) {
            const token = response.data.token;
            await AsyncStorage.setItem("userToken", token);
            router.push("/dashboard/todo");
        } else {
            setCredentialsError("Invalid credentials");
        }
      } catch (error) {
        console.log("API Error:", error.message);
        setCredentialsError("Invalid credentials");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
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
          placeholder="Email"
          placeholderTextColor="#7f8c8d"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setCredentialsError("");
          }}
        />
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            placeholderTextColor="#7f8c8d"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setCredentialsError("");
            }}
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
        {credentialsError ? <Text style={styles.errorText}>{credentialsError}</Text> : null}
        <Text style={styles.forgotPassword} onPress={() => router.push("/auth/forgot-password")}>Forgot Password?</Text>
        {isLoading ? (
          <View style={styles.button}>
            <ActivityIndicator size="small" color="#ffffff" />
          </View>
        ) : (
          <TouchableOpacity style={styles.button} onPress={() => handleLogin()}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.signupText}>
          Don't have an account?{" "}
          <Text style={styles.signupTextLink} onPress={() => router.push("/auth/signup")}>
            Sign up
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
  errorText: {
    color: "#e74c3c",
    fontSize: 14,
    marginTop: -10,
    marginBottom: 10,
    alignSelf: "flex-start",
  },
});

export default LoginScreen;
