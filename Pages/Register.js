import React, {useState} from 'react';
import styles from '../Styles/stylesLogin';
import {
  TouchableOpacity,
  StyleSheet,
  TextInput,
  View,
  Text,
  Alert,
  ActivityIndicator,
  ImageBackground,
} from 'react-native';
import {registerUser} from '../Scripts/Logger';

export default function Register({navigation}) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const register = async () => {
    if (email === '' || password === '' || username === '') {
      Alert.alert('Põe tudo, pô');
      return null;
    }

    setLoading(true);
    const userRegistered = await registerUser(email, password, username);
    if (userRegistered === true) {
      Alert.alert('Uhul, cadastro feito!');
      navigation.navigate('Login');
    }
    setLoading(false);
  };

  return (
    <ImageBackground
      style={styles.area}
      source={require('../Assets/landscape.jpg')}>
      <View style={{...styles.box, height: 500}}>
        <Text style={styles.title}>Registrar</Text>
        <View>
          <Text style={styles.subtitle}>Nome de usuário</Text>
          <TextInput
            style={styles.text}
            placeholder="Apelido"
            placeholderTextColor="gray"
            onChangeText={newUsername => setUsername(newUsername.toLowerCase())}
            value={username}
            inputMode="text"
          />
        </View>
        <View>
          <Text style={styles.subtitle}>Email</Text>
          <TextInput
            style={styles.text}
            placeholder="E-mail"
            placeholderTextColor="gray"
            onChangeText={newEmail => setEmail(newEmail.toLowerCase())}
            value={email}
            inputMode="email"
          />
        </View>
        <View>
          <Text style={styles.subtitle}>Senha</Text>
          <TextInput
            style={styles.text}
            placeholder="Senha"
            placeholderTextColor="gray"
            onChangeText={newPassword => setPassword(newPassword)}
            value={password}
            secureTextEntry={true}
          />
        </View>
        {loading ? (
          <ActivityIndicator size="large" />
        ) : (
          <View>
            <TouchableOpacity
              style={{...styles.button, width: '100%'}}
              onPress={register}>
              <Text style={styles.label}>Registrar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{...styles.button, width: '100%'}}
              onPress={() => navigation.navigate('Login')}>
              <Text style={styles.label}>Voltar</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ImageBackground>
  );
}
