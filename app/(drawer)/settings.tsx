import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Users, Heart, MessageSquareQuote } from 'lucide-react-native';

const SettingsPage = () => {

    const teamMembers = [
        {
            name: 'Amina Znine',
            quote: '"Still loading… my life"',
        },
        {
            name: 'Lychee Lu (Lu Jie)',
            quote: '"coding is fun … until it’s not"',
        },
        {
            name: 'WYW@adduserwyw',
            quote: '"I wanna retire😭"',
        },
    ];

    const TeamMember = ({ member }) => (
        <View className="flex-row justify-between">
            <TouchableOpacity style={styles.socialLink}>
            <Text style={styles.memberName}>{member.name}</Text>
            </TouchableOpacity>
            <View style={styles.socialLinks}>
                <View clasName="flex-column">
                    <MessageSquareQuote size={16} color="#4A5568" />
                    <Text style={styles.socialText}  ellipsizeMode="tail">{member.quote}</Text>
                </View>
            </View>
        </View>

    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>About</Text>
                    <View style={styles.subtitleContainer}>
                        <Users size={20} color="#4A5568" />
                        <Text style={styles.subtitle}>About Our Team</Text>
                    </View>
                </View>

                {/* About Section */}
                <View style={styles.aboutCard}>
                    <View style={styles.aboutHeader}>
                        <Text style={styles.sectionTitle}>About Us</Text>
                        <View style={styles.aboutTextContainer}>
                            <Text style={styles.aboutText}>
                                We're IIT students from LAB .
                            </Text>
                            <Text style={styles.aboutText}>
                                Our app is crafted with
                            </Text>
                            <Heart size={16} color="#E53E3E" style={styles.heartIcon} />
                        </View>
                    </View>
                    <View style={styles.teamSection}>
                        <View style={styles.memberContainer}>
                            <Text style={styles.memberTitle}>
                                Our Team Members
                            </Text>
                            {teamMembers.map((member, index) => (
                                <TeamMember key={index} member={member} />
                            ))}
                            <Text style={styles.socialLink}>(In alphabetical order)</Text>
                        </View>
                    </View>
                    {/* Version Info */}
                    <Text style={styles.version}>Version 0.0.0</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7FAFC',
    },
    scrollContent: {
        padding: 24,
    },
    header: {
        marginBottom: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1A202C',
        marginBottom: 8,
    },
    subtitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#4A5568',
        marginLeft: 8,
    },
    aboutCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginBottom: 24,
    },
    aboutHeader: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#1A202C',
        marginBottom: 8,
    },
    aboutTextContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
    },
    aboutText: {
        fontSize: 14,
        color: '#4A5568',
        lineHeight: 20,
    },
    heartIcon: {
        marginHorizontal: 4,
    },
    teamSection: {
        borderTopWidth: 1,
        borderTopColor: '#E2E8F0',
        paddingTop: 24,
    },
    memberContainer: {
        marginBottom: 24,
        paddingBottom: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
    },
    // memberContainer: {
    //     paddingVertical: 16,
    //     borderBottomWidth: 1,
    //     borderBottomColor: '#E2E8F0',
    // },
    memberTitle: {
        fontSize: 18,
        fontWeight: '500',
        color: '#1A202C',
        marginBottom: 4,
    },
    memberName: {
        fontSize: 14,
        color: '#4A5568',
        marginBottom: 8,
    },
    socialLinks: {
        marginTop:16,
        flexDirection: 'row',
        gap: 16,
    },
    socialLink: {
        marginTop:16,
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16,
    },
    socialText: {
        fontSize: 14,
        color: '#4A5568',
        marginLeft: 4,
    },
    version: {
        textAlign: 'center',
        fontSize: 12,
        color: '#718096',
    },
});

export default SettingsPage;