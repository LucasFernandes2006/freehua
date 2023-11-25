import React, {useState, useEffect, useReducer} from 'react';
import {useRoute} from '@react-navigation/native';
import {
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  View,
} from 'react-native';
import Pdf from 'react-native-pdf';
import {rememberChapter} from '../Scripts/Booker';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function Shower({navigation, route}) {
  const {file, files, order, master} = route.params;
  const loadedChapter = JSON.parse(file);
  const [pdfSource, setPdfSource] = useState(loadedChapter.chapter_content);
  const waitlist = JSON.parse(files);
  const [isHeaderVisible, setHeaderVisible] = useState(false);
  const [pagesAtMoment, setPagesAtMoment] = useState(0);
  const [isLastChapter, setIsLastChapter] = useState(false);
  const [isFirstChapter, setIsFirstChapter] = useState(false);

  const toggleHeaderVisibility = () => {
    setHeaderVisible(!isHeaderVisible);
    navigation.setOptions({headerShown: isHeaderVisible});
    navigation.setParams({tabBarOptions: {visible: isHeaderVisible}});
  };

  const tomes = JSON.parse(files);

  useEffect(() => {
    navigation.setOptions({
      headerRight: ({color, size}) => (
        <TouchableOpacity
          style={{paddingRight: 12}}
          onPress={() => navigation.navigate('Chat', {chapter: file})}>
          <Ionicons name="chatbox" color={'white'} size={40} />
        </TouchableOpacity>
      ),
      headerLeft: ({color, size}) => (
        <TouchableOpacity
          style={{paddingLeft: 12}}
          onPress={() => {
            navigation.navigate('Book', {source: master});
          }}>
          <Ionicons name="book" color={'white'} size={40} />
        </TouchableOpacity>
      ),
    });
  }, []);

  useEffect(() => {
    setPdfSource(loadedChapter.chapter_content);
    setIsLastChapter(order === waitlist.length ? true : false);
    setIsFirstChapter(order === 1 ? true : false);
    navigation.setOptions({
      title: `Capítulo ${order}`,
    });
      console.log(order);
  }, [file]);

    // TODO: TÁ UMA BOSTA PRECISA CONSERTAR FUNÇÃO DE IR E VOLTAR
  const goNext = async () => {
    navigation.navigate('Shower', {
      file: JSON.stringify(tomes[order]),
      files: files,
      order: order + 1,
      parent: master,
    });
  };

  const goBack = async () => {
    navigation.navigate('Shower', {
      file: JSON.stringify(tomes[order - 2]),
      files: files,
      order: order - 1,
      parent: master,
    });
  };

  return (
    <View style={{flex: 1}}>
      <Pdf
        source={{uri: pdfSource, cache: false}}
        trustAllCerts={false}
        onPageChanged={(page, numberOfPages) => {
          setPagesAtMoment(page);
          if (page === numberOfPages) {
            rememberChapter(file);
          }
        }}
        onError={error => {
          console.log(error);
        }}
        style={styles.pdf}
      />
      <TouchableOpacity
        style={styles.headerButton}
        onPress={toggleHeaderVisibility}
      />
      {isHeaderVisible || (
        <View style={styles.box_pages}>
          {!isFirstChapter && (
            <TouchableOpacity style={styles.next} onPress={() => goBack()}>
              <Ionicons name="arrow-back" color={'white'} size={40} />
            </TouchableOpacity>
          )}
          <Text style={styles.text_pages}>{pagesAtMoment}</Text>
          {!isLastChapter && (
            <TouchableOpacity style={styles.next} onPress={() => goNext()}>
              <Ionicons name="arrow-forward" color={'white'} size={40} />
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

const kindOfWidth = Math.round(Dimensions.get('window').width / 3);
const kindOfHeight = Math.round(Dimensions.get('window').height / 3);

const styles = StyleSheet.create({
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
  },
  headerButton: {
    position: 'absolute',
    top: kindOfHeight,
    left: kindOfWidth,
    width: kindOfWidth,
    height: kindOfHeight,
  },
  box_pages: {
    backgroundColor: 'black',
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  text_pages: {
    color: 'white',
    textAlign: 'center',
    fontSize: 32,
  },
});
