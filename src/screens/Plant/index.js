import { api } from "../../lib/axios";
import { useRoute } from "@react-navigation/native";
import { AuthContext } from "../../context/auth";
import React, { useEffect, useContext, useState } from "react";
import Header from "../../components/Header";
import planta0 from "../../assets/images/planta/0.png";
import planta1 from "../../assets/images/planta/1.png";
import planta2 from "../../assets/images/planta/2.png";
import planta3 from "../../assets/images/planta/3.png";
import planta4 from "../../assets/images/planta/4.png";
import { styles } from "./style.js";
import GradientBackground from "../../components/Gradient/index.js";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

import {
  View,
  TextInput,
  Text,
  Alert,
  TouchableOpacity,
  Image,
  StatusBar,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";

const PlantaPage = ({ navigation }) => {
  const route = useRoute();
  const { user } = useContext(AuthContext);
  const [plantaData, setPlantaData] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [tempoRegaRestante, setTempoRegaRestante] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Is loading é ativo enquanto a planta ainda é carregada.

  const agendarNotificacao = async () => {
    // Configurar a notificação
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Lembrete",
        body: "É hora de regar a planta!",
        sound: "default", // Tocar o som padrão,
        vibrate: [0, 250, 250, 250],
        data: { extraData: "Alguma informação extra" },
      },
      trigger: {
        seconds: 5, // Tempo em segundos após o qual a notificação será disparada
      },
    });

    console.log("Notificação agendada com ID:", notificationId);
  };

  const carregarPlanta = async () => {
    console.log("Em carregar planta, user = ", user); //TESTES
    try {
      const response = await api.get(`/planta/${user.codCliente}`);
      //console.log("Resposta", response);
      console.log("Estagio:", response.data.result[0].estagio);
      setPlantaData(response.data.result[0]);
      console.log("Planta carregada :", response.data.result); // APAGAR DEPOIS
      console.log("Tempo carregado :", response.data.tempoRestante); // APAGAR DEPOIS
      setTempoRegaRestante(response.data.tempoRestante);
    } catch (error) {
      console.error("Erro ao carregar planta:", error.message); // Tratamento de erro
    } finally {
      setIsLoading(false);
    }
  };

  const regarPlanta = async () => {
    try {
      const response = await api.put(`/planta/rega/${user.codCliente}`);
      tempoRestante = response.data.tempo;

      if (response.status === 200) {
        alert(message);
        if (response.status === 200) {
          console.log("Regada");
          setRefresh(!refresh);
        }
      } else if (response.status === 201) {
        //Calcular o timestamp em tempo:
        const horas = Math.floor(tempoRestante / (1000 * 60 * 60));
        const minutos = Math.floor(
          (tempoRestante % (1000 * 60 * 60)) / (1000 * 60)
        );
        const segundos = Math.floor((tempoRestante % (1000 * 60)) / 1000);

        console.log("Não regada, em tempo de espera");
        agendarNotificacao();
        Alert.alert(
          "Aguarde",
          `Foi regada recentemente, volte em ${horas}:${minutos}:${segundos}`
        );
      } else {
        // Caso contrário, a mensagem de erro já foi retornada pelo servidor
        Alert.alert("Erro", "Erro ao regar a planta.");
      }
    } catch (error) {
      if (error.status === 300) {
        Alert.alert(
          "Pronta para colheita",
          "A planta já se encontra em estágio máximo e pronta para ser colhida!"
        );
      } else {
        Alert.alert("Error", "Erro ao regar a planta, pedimos desculpas");
      }
    }
  };

  const coletarPlanta = async () => {
    try {
      const response = await api.post(`/planta/coleta/${user.codCliente}`);

      if (response.status === 200) {
        const message = await response.data.message;
        alert(message);
        setRefresh(!refresh);
      } else {
        const errorMessage = await response.text();
        alert(errorMessage);
      }
    } catch (error) {
      console.error("Erro ao coletar planta:", error);
      Alert.alert("Error", "Erro ao colher a planta, pedimos desculpas");
    }
  };

  const pedirAjuda = async () => {
    Alert.alert(
      "Ajuda",
      "Regue a planta até ela atingir seu tamanho máximo, um botão de colher ficará disponível quando for o momento da colheita. Para verificar o tempo restante para regar novamente, basta clicar em regar."
    );
  };

  useEffect(() => {
    // Defina um canal de notificação para Android
    const criarCanal = async () => {
      if (Platform.OS === "android") {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== "granted") {
          alert("Permissão de notificação não concedida");
          return;
        }

        await Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.HIGH,
          sound: true,
          vibrate: true,
        });
      }
    };

    criarCanal();
  }, []);

  useEffect(() => {
    carregarPlanta();
  }, [refresh]);

  useEffect(() => {
    if (plantaData) {
      //console.log(plantaData.estagio); // APAGAR DEPOIS
    }
  }, [plantaData]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="400" color="green" />
        <Text>Carregando dados da planta...</Text>
      </View>
    );
  } else {
    return (
      <>
        <Header navigation={navigation} title="Planta" />
        <View style={styles.Area}>
          <TouchableOpacity style={styles.area_planta}>
            <Image
              source={
                plantaData.estagio === 4
                  ? planta4
                  : plantaData.estagio === 3
                  ? planta3
                  : plantaData.estagio === 2
                  ? planta2
                  : plantaData.estagio === 1
                  ? planta1
                  : planta0
              }
              style={styles.planta}
            />
          </TouchableOpacity>

          {/* Botões de regar e colher */}
          <View style={styles.botaoContainer}>
            {plantaData.estagio < 4 ? (
              <TouchableOpacity style={styles.botao} onPress={regarPlanta}>
                <Text style={styles.textoBotao}>Regar Planta</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.botao} onPress={coletarPlanta}>
                <Text style={styles.textoBotao}>Colher Planta</Text>
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity style={styles.botaoAjuda} onPress={pedirAjuda}>
            <Text style={styles.textoBotaoAjuda}>Ajuda ?</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  }
};

export default PlantaPage;
