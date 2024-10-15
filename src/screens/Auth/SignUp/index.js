import React, { useState } from 'react';
import { View, StyleSheet, Alert, Button, Text } from 'react-native';
import { api } from '../../../lib/axios';
import QRCodeStep from '../../../components/signup/qrcode-step';
import RegisterStep from '../../../components/signup/register-step';
import LottieView from 'lottie-react-native';

export default function SignUp({ navigation }) {
    const [qrCodeData, setQrCodeData] = useState('');
    const [step, setStep] = useState('scan'); // Controla a etapa atual
    const [cameraVisible, setCameraVisible] = useState(false);
    const [capturedPhoto, setCapturedPhoto] = useState(null);

    const handleRegisterSuccess = () => {
        navigation.navigate('Login');
    };

    const handleOpenCamera = () => {
        setCameraVisible(true);
    };

    const handleCloseCamera = () => {
        setCameraVisible(false);
    };

    const handlePhotoTaken = (photoUri) => {
        setCapturedPhoto(photoUri);
        Alert.alert('Foto capturada!', `Foto salva em: ${photoUri}`);
    };

    const handleQRCodeScanned = async (data) => {
        try {
            console.log('QRCode escaneado:', data); // Adicione este log para verificar o QRCode escaneado
            const response = await api.post('/clientes/qrcode', {
                codCliente: data
            });

            console.log('Resposta da API:', response.data); // Adicione este log para verificar a resposta

            if (response.status === 200) {
                Alert.alert('QR Code validado com sucesso!', `${data}`);
                setQrCodeData(data);
                setStep('register');
            } else {
                const result = await response.json();
                Alert.alert('Erro', result.error || 'QRCode não validado.');
            }
        } catch (error) {
            console.error('Erro ao validar QR Code:', error); // Adicione este log para capturar o erro
            Alert.alert('Erro', 'Não foi possível validar o QR Code.');
        }
    };

    return (
        <View style={styles.container}>
            {step === 'scan' ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <View style={styles.qrcodeContainer}>
                        <Text style={styles.title}>
                            Escaneie o QR Code para validar seu cadastro.
                        </Text>
                        <Text style={styles.subtitle}>
                            Após escanear, você será redirecionado para a tela de registro.
                        </Text>
                        <LottieView
                            autoPlay
                            style={{
                                width: 200,
                                height: 200,
                            }}
                            source={require('../../../assets/qrcode-animation.json')}
                        />
                        <Button title="Autorizar câmera" onPress={handleOpenCamera} />
                    </View>
                    {capturedPhoto && <Text>Foto Capturada: {capturedPhoto}</Text>}
                    <QRCodeStep
                        visible={cameraVisible}
                        onClose={handleCloseCamera}
                        onPhotoTaken={handlePhotoTaken}
                        onQRCodeScanned={handleQRCodeScanned} // Passando a função de escanear QRCode
                    />
                </View>
            ) : (
                <RegisterStep qrCodeData={qrCodeData} onRegisterSuccess={handleRegisterSuccess} />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 40,
    },
    qrcodeContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        gap: 15,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 20,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        color: '#666',
    }
});