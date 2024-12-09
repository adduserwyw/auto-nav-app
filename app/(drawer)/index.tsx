import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {ToastProvider} from "~/components/ui/toast";
import Index from '~/components/NavHome'
import {Bot, Navigation} from "lucide-react-native";
import {View,Text} from "react-native";


function LogoTitle() {
    return (
        <View className={styles.headerTitleContainer}>
            <Bot color="#8b5cf6" size={24} />
            <Text className={styles.headerTitle}>Auto-Nav Explorer</Text>
            <Navigation color="#8b5cf6" size={24} />
        </View>
    );
}
export default function Home() {
  const queryClient = new QueryClient();
  return (
    <>
        <Stack.Screen
            options={{
                headerTitle: (props) => <LogoTitle />,
                headerTransparent: true,
                headerTintColor: '#8b5cf6',
                headerStyle: {
                    backgroundColor: '#F9FAFB',
                },
            }}
        />
      {/*<Stack.Screen options={{ headerTitleStyle: {display: 'none'},headerTransparent: true }} />*/}
        <QueryClientProvider client={queryClient}>
            <ToastProvider>
                <Index/>
            </ToastProvider>
      </QueryClientProvider>
    </>
  );
}


const styles={
    headerTitleContainer: `flex-row items-center gap-2`,
    headerTitle: `text-xl font-bold text-[#8b5cf6]`,
}