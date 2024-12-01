import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    ActivityIndicator,
    FlatList,
    StyleSheet,
} from 'react-native';
import { Device, BleManager } from 'react-native-ble-plx';
import { requestPermissions } from "~/hooks/useBLE";

interface ConnectionStatus {
    isConnected: boolean;
    deviceName: string | null;
    error: string | null;
}

interface BluetoothModalProps {
    isVisible: boolean;
    onClose: () => void;
    onDeviceConnect: (status: ConnectionStatus) => void;
}

export const ConnectionStatusComponent: React.FC<{ status: ConnectionStatus }> = ({ status }) => {
    return (
        <View style={styles.statusContainer}>
            <Text style={[
                styles.statusText,
                status.isConnected ? styles.connectedText : styles.disconnectedText
            ]}>
                {status.isConnected ? '● Connected' : '○ Disconnected'}
            </Text>
            {status.deviceName && (
                <Text style={styles.deviceNameText}>
                    Device: {status.deviceName}
                </Text>
            )}
            {status.error && (
                <Text style={styles.errorText}>
                    {status.error}
                </Text>
            )}
        </View>
    );
};

export const BluetoothModal: React.FC<BluetoothModalProps> = ({
                                                                  isVisible,
                                                                  onClose,
                                                                  onDeviceConnect,
                                                              }) => {
    const [isScanning, setIsScanning] = useState(false);
    const [devices, setDevices] = useState<Set<Device>>(new Set());
    const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
    const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
        isConnected: false,
        deviceName: null,
        error: null,
    });
    const [isConnecting, setIsConnecting] = useState(false);
    const bleManager = new BleManager();

    const startScanning = async () => {
        try {
            const permission = await requestPermissions();
            if (!permission) {
                setConnectionStatus({
                    isConnected: false,
                    deviceName: null,
                    error: 'Bluetooth permission denied',
                });
                return;
            }

            setIsScanning(true);
            setDevices(new Set());
            setConnectionStatus({
                isConnected: false,
                deviceName: null,
                error: null,
            });

            bleManager.startDeviceScan(null, null, (error, device) => {
                if (error) {
                    console.log('Scan error:', error);
                    setIsScanning(false);
                    setConnectionStatus({
                        isConnected: false,
                        deviceName: null,
                        error: `Scan error: ${error.message}`,
                    });
                    return;
                }

                if (device) {
                    setDevices(prev => new Set([...prev, device]));
                }
            });

            setTimeout(() => {
                bleManager.stopDeviceScan();
                setIsScanning(false);
            }, 10000);
        } catch (error) {
            console.log('Error starting scan:', error);
            setIsScanning(false);
            setConnectionStatus({
                isConnected: false,
                deviceName: null,
                error: `Scan error: ${error}`,
            });
        }
    };

    const handleDeviceConnect = async (device: Device) => {
        try {
            setIsConnecting(true);
            setIsScanning(false);
            bleManager.stopDeviceScan();

            await device.connect();
            const newStatus = {
                isConnected: true,
                deviceName: device.name || 'Unknown Device',
                error: null,
            };
            setConnectionStatus(newStatus);
            onDeviceConnect(newStatus);

            // Keep modal open for 2 seconds to show success message
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (error) {
            const errorStatus = {
                isConnected: false,
                deviceName: device.name || 'Unknown Device',
                error: `Connection failed: ${error}`,
            };
            setConnectionStatus(errorStatus);
            onDeviceConnect(errorStatus);
        } finally {
            setIsConnecting(false);
        }
    };

    useEffect(() => {
        if (isVisible) {
            startScanning();
        }

        return () => {
            bleManager.stopDeviceScan();
            setIsScanning(false);
        };
    }, [isVisible]);

    const renderDevice = ({ item: device }: { item: Device }) => (
        <TouchableOpacity
            style={[
                styles.deviceItem,
                selectedDevice?.id === device.id && styles.selectedDevice
            ]}
            onPress={() => setSelectedDevice(device)}
        >
            <View style={styles.deviceInfo}>
                <Text style={styles.deviceName}>
                    {device.name || 'Unknown Device'}
                </Text>
                <Text style={styles.deviceId}>
                    {device.id}
                </Text>
            </View>
            <TouchableOpacity
                style={[
                    styles.connectButton,
                    isConnecting && styles.connectingButton
                ]}
                onPress={() => handleDeviceConnect(device)}
                disabled={isConnecting}
            >
                <Text style={styles.connectButtonText}>
                    {isConnecting ? 'Connecting...' : 'Connect'}
                </Text>
            </TouchableOpacity>
        </TouchableOpacity>
    );

    return (
        <Modal
            visible={isVisible}
            animationType="slide"
            transparent
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Bluetooth Devices</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Text style={styles.closeButtonText}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    <ConnectionStatusComponent status={connectionStatus} />

                    {isScanning && (
                        <View style={styles.scanningContainer}>
                            <ActivityIndicator color="#8b5cf6" />
                            <Text style={styles.scanningText}>Scanning for devices...</Text>
                        </View>
                    )}

                    <FlatList
                        data={Array.from(devices)}
                        renderItem={renderDevice}
                        keyExtractor={device => device.id}
                        style={styles.deviceList}
                        ListEmptyComponent={
                            !isScanning ? (
                                <Text style={styles.emptyText}>No devices found</Text>
                            ) : null
                        }
                    />

                    <TouchableOpacity
                        style={styles.scanButton}
                        onPress={startScanning}
                        disabled={isScanning || isConnecting}
                    >
                        <Text style={styles.scanButtonText}>
                            {isScanning ? 'Scanning...' : 'Scan Again'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    statusContainer: {
        padding: 12,
        marginBottom: 12,
        borderRadius: 8,
        backgroundColor: '#f3f4f6',
    },
    statusText: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    connectedText: {
        color: '#10b981',
    },
    disconnectedText: {
        color: '#6b7280',
    },
    deviceNameText: {
        fontSize: 14,
        color: '#4b5563',
    },
    errorText: {
        fontSize: 14,
        color: '#ef4444',
        marginTop: 4,
    },
    connectingButton: {
        backgroundColor: '#9ca3af',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '90%',
        maxHeight: '80%',
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1f2937',
    },
    closeButton: {
        padding: 8,
    },
    closeButtonText: {
        fontSize: 18,
        color: '#6b7280',
    },
    scanningContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        gap: 8,
    },
    scanningText: {
        color: '#8b5cf6',
        fontSize: 14,
    },
    deviceList: {
        maxHeight: '60%',
    },
    deviceItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 8,
        marginBottom: 8,
    },
    selectedDevice: {
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.05)',
    },
    deviceInfo: {
        flex: 1,
    },
    deviceName: {
        fontSize: 16,
        fontWeight: '500',
        color: '#1f2937',
    },
    deviceId: {
        fontSize: 12,
        color: '#6b7280',
    },
    connectButton: {
        backgroundColor: '#8b5cf6',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
    },
    connectButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '500',
    },
    scanButton: {
        backgroundColor: '#8b5cf6',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 16,
    },
    scanButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
    },
    emptyText: {
        textAlign: 'center',
        color: '#6b7280',
        padding: 16,
    },
});