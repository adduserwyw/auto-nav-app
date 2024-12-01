import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { Drawer } from 'expo-router/drawer';

import { HeaderButton } from '../../components/HeaderButton';

const DrawerLayout = () => (
  <Drawer>
    <Drawer.Screen
      name="index"
      options={{
        drawerLabel: 'Home',
          drawerLabelStyle: {
            color: "#8b5cf6",
            fontWeight: "bold",
            },
          drawerActiveBackgroundColor: "#f3e8ff",
        drawerIcon: ({ size, color }) => <Ionicons name="home-outline" size={size} color={"#8b5cf6"} />,
      }}
    />
  </Drawer>
);

export default DrawerLayout;
