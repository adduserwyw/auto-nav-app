import {useCallback, useRef} from 'react';
import { Device } from 'react-native-ble-plx';
import { BASIC_COMMANDS, sendBluetoothCommand } from '../utils/bluetoothCommands';
import Toast from "react-native-toast-message";


export const useBluetoothControl = (device: Device | null) => {
    const commandIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const handleDirectionCommand = useCallback(
        async (command: keyof typeof BASIC_COMMANDS) => {
            if (!device) return;
            if (commandIntervalRef.current) {
                clearInterval(commandIntervalRef.current);
            }
            const sendCommand = async () => {
                try {
                    await sendBluetoothCommand(device, BASIC_COMMANDS[command],true);
                } catch (error) {
                    console.error(`Failed to send continuous ${command} command:`, error);
                    Toast.show({
                        type: 'error',
                        text1: `Failed to send ${command} command: ${error}`,
                        position: 'bottom'
                    });
                }
            };
            await sendCommand();
            commandIntervalRef.current = setInterval(sendCommand, 100);
        },
        [device]
    );

    const sendSingleCommand = useCallback(async (command: keyof typeof BASIC_COMMANDS) => {
        if (!device) return;
        try {
            sendBluetoothCommand(device, BASIC_COMMANDS[command],false);
        } catch (error) {
            console.error(`Failed to send continuous ${command} command:`, error);
            Toast.show({
                type: 'error',
                text1: `Failed to send ${command} command: ${error}`,
                position: 'bottom'
            });
        }
    }, [device]);


    const handleStopCommand = useCallback(async () => {
        if (!device) return;
        try {
            await sendBluetoothCommand(device, BASIC_COMMANDS.stop,true);
        } catch (error) {
            console.error(`Failed to send stop command:`, error);
            Toast.show({
                type: 'error',
                text1: `Failed to send stop command: ${error}`,
                position: 'bottom'
            });
        }
    }, [device]);

    const handleToggleRunning = useCallback(async (isRunning: boolean) => {
        if (!device) return;
        try {
            await sendBluetoothCommand(
                device,
                isRunning ? BASIC_COMMANDS.stop : BASIC_COMMANDS.up,true
            );
        } catch (error) {
            console.error(`Failed to send command:`, error);
            Toast.show({
                type: 'error',
                text1: `Failed to send command: ${error}`,
                position: 'bottom'
            });
        }
    }, [device]);


    return { handleDirectionCommand, sendSingleCommand,handleStopCommand,handleToggleRunning };
};