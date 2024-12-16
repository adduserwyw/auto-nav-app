declare module 'react-native-config' {
  export interface NativeConfig {
    SERVICE_UUID: string;
    CHARACTERISTIC_UUID: string;
    API: string;
  }

  export const Config: NativeConfig;
  export default Config;
}
