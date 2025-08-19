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

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");

  const router = useRouter();
  const animationRef = useRef(null);

  useEffect(() => {
    if (animationRef.current) animationRef.current.play();
  }, []);

  const handleResetPassword = async () => {
    // Clear previous errors
    setEmailError("");
    
    if (!email.trim()) {
      setEmailError("Please enter your email address");
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // For now, just show success message
      // In real implementation, you would make API call here
    }, 2000);
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
        <Text style={styles.title}>Forgot Password?</Text>
        <Text style={styles.subtitle}>
          Enter your email address and we'll send you a link to reset your password.
        </Text>
        
        <TextInput
          style={[styles.input, emailError ? styles.inputError : null]}
          placeholder="Email"
          placeholderTextColor="#7f8c8d"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setEmailError(""); 
          }}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
        
        {isLoading ? (
          <View style={styles.button}>
            <ActivityIndicator size="small" color="#ffffff" />
          </View>
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
            <Text style={styles.buttonText}>Reset Password</Text>
          </TouchableOpacity>
        )}
        
        <Text style={styles.backToLogin}>
          Remember your password?{" "}
          <Text style={styles.backToLoginLink} onPress={() => router.back()}>
            Back to Login
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
  },
  lottieContainer: {
    width: 200,
    height: 200,
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  lottieAnimation: {
    width: 200,
    height: 200,
  },
  formContainer: {
    width: "100%",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#7f8c8d",
    marginBottom: 30,
    textAlign: "center",
    lineHeight: 22,
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
  backToLogin: {
    color: "#7f8c8d",
    fontSize: 16,
    marginTop: 30,
    textAlign: "center",
  },
  backToLoginLink: {
    color: "#3498db",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ForgotPasswordScreen;
