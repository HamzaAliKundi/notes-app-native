import { Stack } from "expo-router";

const DashboardLayout = () => {
    return (
        <Stack>
            <Stack.Screen name="todo" options={{ headerShown: false }} />
        </Stack>
    );
};

export default DashboardLayout;