import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {ToastProvider} from "~/components/ui/toast";
import { Container } from '~/components/Container';
import Index from '~/components/NavHome'
import { ScreenContent } from '~/components/ScreenContent';

export default function Home() {
  const queryClient = new QueryClient();
  return (
    <>
      <Stack.Screen options={{ headerTitleStyle: {display: 'none'},headerTransparent: true }} />
        <QueryClientProvider client={queryClient}>
            <ToastProvider>
                <Index/>
            </ToastProvider>
      </QueryClientProvider>
    </>
  );
}
