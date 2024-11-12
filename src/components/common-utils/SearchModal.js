// SearchModal.js
import React, {useState, useEffect} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Modal,
  StyleSheet,
  Animated,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import {CustomThemeColors} from '../CustomThemeColors';
import {FlatList} from 'react-native-gesture-handler';
import * as Keychain from 'react-native-keychain';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {API_URL} from '../ApiUrl';
import {useNavigation, useRoute} from '@react-navigation/native';

const SearchModal = ({visible, onClose, onSearch, isLoading, setIsLoading}) => {
  const [searchables, setSearchables] = useState([]);

  const route = useRoute();
  const data = route.params?.data;

  useEffect(() => {
    const loadPrivileges = async () => {
      try {
        const credentials = await Keychain.getGenericPassword({
          service: 'privileges',
        });
        if (credentials) {
          const savedAssetListRecentSearches =
            await Keychain.getGenericPassword({
              service: 'assetListRecentSearches',
            });

          if (
            savedAssetListRecentSearches &&
            savedAssetListRecentSearches.password
          ) {
            setSearchables(JSON.parse(savedAssetListRecentSearches.password));
            console.log('Loaded Privileges', savedAssetListRecentSearches);
          } else {
            console.log('No recent searches stored.');
          }
        } else {
          console.log('No stored credentials found.');
        }
      } catch (error) {
        console.log('Could not load privileges:', error);
      }
    };

    loadPrivileges();
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const slideAnim = useState(new Animated.Value(0))[0];
  const [highlightSelection, setHighlightSelection] = useState(null);
  const [isMatchId, setIsMatchId] = useState([]);
  useEffect(() => {
    if (data) {
      fetchSearchList();
    }
  }, [isMatchId]);

  useEffect(() => {
    if (data) {
      console.log('Data received:', data);
      setSearchQuery(data);
    }
  }, [data]);

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim]);

  const batches = [];
  const [suggestions, setSuggestions] = useState(['No suggestions']);
  const [searchResults, setSearchResults] = useState(0);
  const [matchedItems, setMatchedItems] = useState([]);
  const [ItemUniqueKey, setItemUniqueKey] = useState('assetId');
  const [dataResult, setDataResult] = useState([]);

  const fetchSuggestions = async () => {
    try {
      const credentials = await Keychain.getGenericPassword({service: 'jwt'});
      const token = credentials.password;
      console.log('Token with bearer:', `${token}`);
      console.log('searchQuery data:' + searchQuery);

      const response = await fetch(
        `${API_URL}/api/assetList/suggestions?query=${searchQuery}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Response:', data);
      setSearchResults(data.searchResults); // total count of matched items
      setSuggestions(data.suggestions);
      setMatchedItems(data.matchedItems);
      const ids = data.matchedItems.map(item => item[ItemUniqueKey]);
      setIsMatchId(ids);
      console.log('ID assets:', ids);
    } catch (error) {
      console.error(
        'Error fetching suggestions in assetlist search modal:',
        error,
      );
    }
  };

  const fetchSearchList = async () => {
    try {
      const credentials = await Keychain.getGenericPassword({service: 'jwt'});

      if (!credentials) {
        throw new Error('No credentials found');
      }

      const token = credentials.password;
      if (!token) {
        throw new Error('Token is empty');
      }

      // console.log('Token for search list:', token);
      // console.log('Token for search list:', isMatchId);
      const batchSize = 100; // Define your preferred batch size

      for (let i = 0; i < isMatchId.length; i += batchSize) {
        const batchIds = isMatchId.slice(i, i + batchSize);
        console.log('search list batchIds:', batchIds);

        const response = await fetch(`${API_URL}/api/assetList/searchResult`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${token}`,
          },
          body: JSON.stringify({
            ids: batchIds,
          }),
        });

        if (!response.ok) {
          console.error('HTTP error', response.status, response.statusText);
          if (response.status === 401) {
            console.error('Unauthorized: Check your token and permissions');
          } else if (response.status === 403) {
            console.error(
              'Forbidden: You do not have permission to access this resource',
            );
          }
          return;
        }
        const data = await response.json();
        // console.log('Response Data:', data);
        batches.push(data);
      }
      // console.log('DataResult :', batches);
      const dataaa = batches
        .flat()
        .filter(item => item && Object.keys(item).length > 0);
      onSearch(dataaa);
    } catch (error) {
      console.error('Error fetching search list:', error);
    }
  };

  // useEffect(() => {
  //   if (isMatchId.length > 0) {
  //     fetchSearchList();
  //   }
  // }, [isMatchId]);

  useEffect(() => {
    if (searchQuery.length > 0) {
      fetchSuggestions();
      console.log('qr searchquery update useEffect' + searchQuery);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  const handleSearchComplete = async () => {
    setIsLoading(true); // Show loading indicator
    await fetchSearchList(); // Wait for search list fetch
    setIsLoading(false); // Hide loading indicator
    onClose();
  };

  const doHighlightSearchQuerySubstring = (text, highlight) => {
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return (
      <Text>
        {parts.map((part, index) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <Text key={index} style={styles.highlightSearchQuerySubstring}>
              {part}
            </Text>
          ) : (
            part
          ),
        )}
      </Text>
    );
  };

  const slideUpStyle = {
    transform: [
      {
        translateY: slideAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [500, 0],
        }),
      },
    ],
  };

  // const debounceTimeout = useRef(null);
  // const [inputValue, setInputValue] = useState('');
  // const handleInputChange = query => {
  //   setInputValue(query);
  //   if (debounceTimeout.current) {
  //     clearTimeout(debounceTimeout.current);
  //   }
  //   debounceTimeout.current = setTimeout(() => {
  //     setSearchQuery(query);
  //   }, 1000); // Adjust the delay as needed
  // };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <Animated.View style={[styles.modalContainer, slideUpStyle]}>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={query => {
                setSearchQuery(query);
              }}
              placeholder="Ex: Computer"
            />
            <TouchableOpacity
              style={styles.searchButton}
              onPress={handleSearchComplete}
              disabled={isLoading} // Disable the button when loading
            >
              <MaterialIcons
                name="search"
                size={23}
                color="#000"
                style={{opacity: isLoading ? 0.2 : 0.5}} // Adjust opacity based on loading state
              />
            </TouchableOpacity>
          </View>

          {/* Conditionally render loading indicator */}
          {isLoading && (
            <View style={styles.loadingIndicatorContainer}>
              <ActivityIndicator size="large" color="#000" />
              <Text>Loading...</Text>
            </View>
          )}

          {!isLoading && (
            <>
              <View style={{marginTop: 5, width: '100%'}}>
                <Text style={styles.suggestionsText}>
                  {searchQuery
                    ? suggestions.length > 0
                      ? 'Suggested'
                      : 'No Suggestions'
                    : 'Recent Searches'}
                </Text>
              </View>
              <View style={styles.searchableContainer}>
                <FlatList
                  data={searchQuery ? suggestions : searchables}
                  keyExtractor={(item, index) => `${index}-${item}`}
                  renderItem={({item, index}) => (
                    <TouchableOpacity
                      onPress={() => {
                        setHighlightSelection(index);
                        setSearchQuery(item);
                      }}>
                      <View style={styles.searchableSubContainer}>
                        <View style={{marginHorizontal: 10}}>
                          <MaterialIcons
                            name={
                              searchQuery ? 'search' : 'youtube-searched-for'
                            }
                            size={20}
                            style={{color: 'lightgrey'}}
                          />
                        </View>
                        <View>
                          <Text
                            style={
                              highlightSelection === index
                                ? styles.optionHighlighter
                                : styles.searchableText
                            }>
                            {doHighlightSearchQuerySubstring(item, searchQuery)}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </>
          )}

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <MaterialIcons
              name="close"
              size={23}
              color="#000"
              style={{opacity: 0.5}}
            />
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 0.5,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
    // justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 10,
    width: '100%',
    height: 40,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: CustomThemeColors.fadedPrimary,
    borderRadius: 50,
    paddingHorizontal: 20,
    marginRight: 10,
  },
  highlightSearchQuerySubstring: {
    color: CustomThemeColors.primary,
    fontWeight: 'bold',
  },
  searchButton: {
    width: 40, // Adjust width and height as needed
    height: 40,
    backgroundColor: CustomThemeColors.fadedPrimary,
    padding: 10,
    borderRadius: 25,
    justifyContent: 'center',
  },
  searchButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 15,
  },

  searchableContainer: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 5,
  },
  searchableSubContainer: {
    marginTop: 0,
    flexDirection: 'row',
    marginLeft: 5,
    // backgroundColor: 'red',
  },
  searchableText: {
    padding: 5,
    paddingHorizontal: 0,
    // borderWidth: 1,
    borderColor: CustomThemeColors.primary,
    borderRadius: 20,
    marginBottom: 5,
  },
  optionHighlighter: {
    padding: 5,
    paddingHorizontal: 10,
    // borderWidth: 1,
    borderColor: CustomThemeColors.primary,
    borderRadius: 20,
    marginBottom: 10,
    backgroundColor: CustomThemeColors.fadedPrimary,
    color: 'grey',
  },
});

export default SearchModal;
