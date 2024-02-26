import "text-encoding";
import * as FileSystem from "expo-file-system";

import React, { useRef, useState, useEffect } from "react";
import { Audio } from "expo-av";
import * as fal from "@fal-ai/serverless-client";
import {
 
  SafeAreaView,
  Image,
  StyleSheet,
  View,
  Text,
} from "react-native";

import ConnectDotsWebView from "./ConnectDotsWebView";

//const APP_ID = "110602490-lcm-sd15-i2i";
const APP_ID = "110602490-lcm-sd15-i2i";
const DEFAULT_PROMPT = "sunny dog on the beach by the water very happy";

const App = () => {
  const webViewRef = useRef(null);
  const [receivedImage, setReceivedImage] = useState(null);
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const touchEndTimeout = useRef(null);
  const [currentPositionSec, setCurrentPositionSec] = useState(0); // New state for current playback position in seconds









  const promptsBySecond = {
    0: "A figure standing at the crossroads of various paths, each representing different tasks and challenges, contemplating which to take as they reflect on their own abilities and attitudes towards these challenges.",
    1: "A figure standing at the crossroads of various paths, each representing different tasks and challenges, contemplating which to take as they reflect on their own abilities and attitudes towards these challenges.",
    2: "A figure standing at the crossroads of various paths, each representing different tasks and challenges, contemplating which to take as they reflect on their own abilities and attitudes towards these challenges.",
    3: "A figure standing at the crossroads of various paths, each representing different tasks and challenges, contemplating which to take as they reflect on their own abilities and attitudes towards these challenges.",
    4: "A figure standing at the crossroads of various paths, each representing different tasks and challenges, contemplating which to take as they reflect on their own abilities and attitudes towards these challenges.",
    5: "A calendar with pages flipping from one month to another, symbolizing the variable duration of life's phases, from short to extended periods, highlighting the uncertainty and inevitable passage of time.",
    6: "A calendar with pages flipping from one month to another, symbolizing the variable duration of life's phases, from short to extended periods, highlighting the uncertainty and inevitable passage of time.",
    7: "A person standing unsteadily on a trampoline, symbolizing life's transitions, surrounded by a blurred backdrop representing the confusing and unstable nature of change.",
    8: "A person standing unsteadily on a trampoline, symbolizing life's transitions, surrounded by a blurred backdrop representing the confusing and unstable nature of change.",
    9: "A person standing unsteadily on a trampoline, symbolizing life's transitions, surrounded by a blurred backdrop representing the confusing and unstable nature of change.",
    10: "A person standing unsteadily on a trampoline, symbolizing life's transitions, surrounded by a blurred backdrop representing the confusing and unstable nature of change.",
    11: "A person standing unsteadily on a trampoline, symbolizing life's transitions, surrounded by a blurred backdrop representing the confusing and unstable nature of change.",
    12: "The same individual on the trampoline, now with other people bouncing around them, symbolizing external influences and disruptions, with no one laughing, adding a sense of seriousness to the challenges faced.",
    13: "The same individual on the trampoline, now with other people bouncing around them, symbolizing external influences and disruptions, with no one laughing, adding a sense of seriousness to the challenges faced.",
    14: "The same individual on the trampoline, now with other people bouncing around them, symbolizing external influences and disruptions, with no one laughing, adding a sense of seriousness to the challenges faced.",
    15: "The same individual on the trampoline, now with other people bouncing around them, symbolizing external influences and disruptions, with no one laughing, adding a sense of seriousness to the challenges faced.",
    16: "A visualization of a countdown, representing six months left on a college lease, with the background transitioning to an airport conveyor belt, symbolizing a journey towards an uncertain future.",
    17: "A visualization of a countdown, representing six months left on a college lease, with the background transitioning to an airport conveyor belt, symbolizing a journey towards an uncertain future.",
    18: "A visualization of a countdown, representing six months left on a college lease, with the background transitioning to an airport conveyor belt, symbolizing a journey towards an uncertain future.",
    19: "A visualization of a countdown, representing six months left on a college lease, with the background transitioning to an airport conveyor belt, symbolizing a journey towards an uncertain future.",
    20: "A visualization of a countdown, representing six months left on a college lease, with the background transitioning to an airport conveyor belt, symbolizing a journey towards an uncertain future.",
    21: "A shadowy, imposing tunnel represents the looming end of the lease and the inevitable approach towards a new, unknown phase of life, enhancing the feeling of moving towards an uncertain future.",
    22: "A shadowy, imposing tunnel represents the looming end of the lease and the inevitable approach towards a new, unknown phase of life, enhancing the feeling of moving towards an uncertain future.",
    23: "A shadowy, imposing tunnel represents the looming end of the lease and the inevitable approach towards a new, unknown phase of life, enhancing the feeling of moving towards an uncertain future.",
    24: "A shadowy, imposing tunnel represents the looming end of the lease and the inevitable approach towards a new, unknown phase of life, enhancing the feeling of moving towards an uncertain future.",
    25: "A shadowy, imposing tunnel represents the looming end of the lease and the inevitable approach towards a new, unknown phase of life, enhancing the feeling of moving towards an uncertain future.",
    26: "The figure begins to find balance on the trampoline, a smile forming as they start to embrace and enjoy the uncertainty and challenges, representing personal growth and acceptance.",
    27: "The figure begins to find balance on the trampoline, a smile forming as they start to embrace and enjoy the uncertainty and challenges, representing personal growth and acceptance.",
    28: "Scenes of the beach at sunset, a solitary bike resting against a backdrop of fading light, symbolizing the cherished, fleeting moments and the realization that these experiences are limited.",
    29: "Scenes of the beach at sunset, a solitary bike resting against a backdrop of fading light, symbolizing the cherished, fleeting moments and the realization that these experiences are limited.",
    30: "Scenes of the beach at sunset, a solitary bike resting against a backdrop of fading light, symbolizing the cherished, fleeting moments and the realization that these experiences are limited.",
    31: "Scenes of the beach at sunset, a solitary bike resting against a backdrop of fading light, symbolizing the cherished, fleeting moments and the realization that these experiences are limited.",
    32: "Scenes of the beach at sunset, a solitary bike resting against a backdrop of fading light, symbolizing the cherished, fleeting moments and the realization that these experiences are limited.",
    33: "Scenes of the beach at sunset, a solitary bike resting against a backdrop of fading light, symbolizing the cherished, fleeting moments and the realization that these experiences are limited.",
    34: "A quiet, dimly lit room viewed from outside, with laughter heard from within, symbolizing the warm, ephemeral moments of companionship that will not last forever.",
    35: "A quiet, dimly lit room viewed from outside, with laughter heard from within, symbolizing the warm, ephemeral moments of companionship that will not last forever.",
    36: "A quiet, dimly lit room viewed from outside, with laughter heard from within, symbolizing the warm, ephemeral moments of companionship that will not last forever.",
    37: "A quiet, dimly lit room viewed from outside, with laughter heard from within, symbolizing the warm, ephemeral moments of companionship that will not last forever.",
    38: "A solitary figure walking towards the ocean, reflecting on the diminishing frequency of such walks, yet filled with gratitude for the experiences and lessons learned.",
    39: "A solitary figure walking towards the ocean, reflecting on the diminishing frequency of such walks, yet filled with gratitude for the experiences and lessons learned.",
    40: "A solitary figure walking towards the ocean, reflecting on the diminishing frequency of such walks, yet filled with gratitude for the experiences and lessons learned.",
    41: "A solitary figure walking towards the ocean, reflecting on the diminishing frequency of such walks, yet filled with gratitude for the experiences and lessons learned.",
    42: "A large, empty jar next to the ocean at sunrise, symbolizing the six months ahead as a period to be filled with new encounters and opportunities.",
    43: "A large, empty jar next to the ocean at sunrise, symbolizing the six months ahead as a period to be filled with new encounters and opportunities.",
    44: "A large, empty jar next to the ocean at sunrise, symbolizing the six months ahead as a period to be filled with new encounters and opportunities.",
    45: "A large, empty jar next to the ocean at sunrise, symbolizing the six months ahead as a period to be filled with new encounters and opportunities.",
    46: "A nostalgic scene of a person pausing to watch a beautiful sunset before driving away, symbolizing reflection, appreciation, and the transient beauty of moments.",
    47: "A nostalgic scene of a person pausing to watch a beautiful sunset before driving away, symbolizing reflection, appreciation, and the transient beauty of moments.",
    48: "A nostalgic scene of a person pausing to watch a beautiful sunset before driving away, symbolizing reflection, appreciation, and the transient beauty of moments.",
    49: "A nostalgic scene of a person pausing to watch a beautiful sunset before driving away, symbolizing reflection, appreciation, and the transient beauty of moments.",
    50: "A nostalgic scene of a person pausing to watch a beautiful sunset before driving away, symbolizing reflection, appreciation, and the transient beauty of moments.",
    51: "A warm, inviting scene where friends gather in a cozy room, sharing music and moments, highlighting the importance of pausing to enjoy life and companionship.",
    52: "A warm, inviting scene where friends gather in a cozy room, sharing music and moments, highlighting the importance of pausing to enjoy life and companionship.",
    53: "A warm, inviting scene where friends gather in a cozy room, sharing music and moments, highlighting the importance of pausing to enjoy life and companionship.",
    54: "A warm, inviting scene where friends gather in a cozy room, sharing music and moments, highlighting the importance of pausing to enjoy life and companionship.",
    55: "A warm, inviting scene where friends gather in a cozy room, sharing music and moments, highlighting the importance of pausing to enjoy life and companionship.",
    56: "A group of friends under a starry sky, looking hopeful and inspired, symbolizing shared dreams and the collective journey of life, with an emphasis on unity and future aspirations.",
    57: "A group of friends under a starry sky, looking hopeful and inspired, symbolizing shared dreams and the collective journey of life, with an emphasis on unity and future aspirations.",
    58: "A group of friends under a starry sky, looking hopeful and inspired, symbolizing shared dreams and the collective journey of life, with an emphasis on unity and future aspirations."
  };
  





  useEffect(() => {
    const loadAudio = async () => {
      console.log("Loading Audio");
      const { sound: loadedSound } = await Audio.Sound.createAsync(
        require("./audio.mp3"), // Update the path to your audio file
      );
      setSound(loadedSound);
    };

    loadAudio();
  }, []);

  useEffect(() => {
    let interval;
  
    if (sound) {
      interval = setInterval(async () => {
        const status = await sound.getStatusAsync();
        if (status.isLoaded) {
          const positionSec = Math.floor(status.positionMillis / 1000);
          setCurrentPositionSec(positionSec); // Update currentPositionSec state
          console.log(`Current Position: ${positionSec} seconds`);
        }
      }, 1000); // Check every second
    }
  
    return () => {
      if (interval) {
        clearInterval(interval);
      }
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);
  
  // Use currentPositionSec to select the current prompt
  useEffect(() => {
    const currentPrompt = promptsBySecond[currentPositionSec] || DEFAULT_PROMPT;
    console.log(`Current Prompt: ${currentPrompt}`);
    // Now you can use currentPrompt for sending data or updating UI
    // For example, if sending data is dependent on some user action, make sure to use the updated currentPrompt
  }, [currentPositionSec]); // Re-run this effect whenever currentPositionSec changes

  const playAudio = async () => {
    if (!isPlaying) {
      console.log("Playing Audio");
      await sound.playAsync();
      setIsPlaying(true);
    }
  };

  const pauseAudio = async () => {
    if (isPlaying) {
      console.log("Pausing Audio");
      await sound.pauseAsync();
      setIsPlaying(false);
    }
  };

   

  fal.config({
    credentials: `5df34e63-e83c-4f2e-9dc5-f57f0c34dbb7:72e5b3680195b72c2d9c799b809f6fba`,
  });
  const { send: sendCurrentData } = fal.realtime.connect(APP_ID, {
    connectionKey: "drawing-lcm-rn",
    onResult: (result) => {
      if (result.images && result.images[0]) {
        setReceivedImage(result.images[0].url);
      }
    },
    onError: (error) => {
      // console.log("Error: " + error)
    },
  });

  return (
    <SafeAreaView style={styles.container}>
    <View style={styles.commonContainer}>
      {(currentPositionSec < 2 || currentPositionSec >= 20) ? ( // Show single image before 10s and after 20s
        <View style={styles.topHalf}>
          {receivedImage && (
            <Image
              source={{ uri: receivedImage }}
              style={styles.image}
              //onError={(e) => console.log('Image loading error:', e.nativeEvent.error)}
            />
          )}
        </View>
      ) : (
        <View style={styles.gridContainer}>
          {Array.from({ length: 4 }, (_, index) => (
            receivedImage && (
              <Image
                key={index}
                source={{ uri: receivedImage }}
                style={styles.gridImage}
              />
            )
          ))}
        </View>

        
      )}

<Text style={styles.gridText}>Your descriptive text here</Text>
    </View>
      <View
        style={styles.bottomHalf}
        onTouchStart={() => playAudio()} // Start playing audio when the user touches the screen
        onTouchEnd={() => {
          // Set a timeout to pause the audio, allowing for continuous play during quick touches
          touchEndTimeout.current = setTimeout(() => {
            pauseAudio();
          }, 100); // Adjust delay as needed
        }}
      >
        <ConnectDotsWebView
          style={styles.canvas}
          ref={webViewRef}
          onMessage={(event) => {
            const message = JSON.parse(event.nativeEvent.data);
            if (message.type === "touchStart") {
              clearTimeout(touchEndTimeout.current); // Cancel any pending pause
              playAudio();
            } else if (message.type === "touchEnd") {
              touchEndTimeout.current = setTimeout(() => {
                pauseAudio();
              }, 100); // Adjust delay as needed
            } else if (message.type === "canvasBase64") {
              var prevMessageData = "";
              const imageUrl = `${message.data}`;
              if (prevMessageData !== message.data) {
                prevMessageData = message.data; // Update the previous message data\
                console.log("NEW DATA!");
              } else {
                console.log("OLD DATA!");
              }

              console.log("we are 98 updating");
              const currentPrompt = promptsBySecond[currentPositionSec] || DEFAULT_PROMPT; // Select the prompt based on the current playback position
              console.log(currentPrompt)
              sendCurrentData({
                prompt:  currentPrompt,
                image_url: imageUrl,
                //seed: generateRandomNumber(),
                seed:9,
                sync_mode: true,
                strength: 0.99,
              });
            }
          }}
        />
      </View>
      {/* Removed the Text component that displayed the current playback position */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },

  commonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  
  image: {
    
    width: 300,
    height: 300,
    borderRadius: 20,
  },
  topHalf: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    justifyContent: "flex-end", // Aligns children
    padding: 0, // Add this line
    margin: 0, // Add this line
  },
  bottomHalf: {
    flex: 1,
    justifyContent: "flex-start",
  },

  gridContainer: {
    flexDirection: 'row', // Keep items in a row
    flexWrap: 'wrap', // Allow items to wrap to the next line
    justifyContent: 'center', // Center items horizontally
    alignItems: 'center', // Center items vertically
    padding: 20, // Add padding around the grid for better spacing
    marginTop: 75, // move lower or higher
  },
  gridImage: {
    width: '45%', // Adjust the width to fit 2 images per row with some space in between
    height: 140, // Adjust the height as per your requirement
    margin: 5, // Add some margin to create space between grid items
    borderRadius: 10, // Optional: if you want rounded corners
  },


  canvas: {
    position: 'absolute', // Position the canvas absolutely
    top: 0, // Distance from the top of the nearest positioned ancestor
    left: 0, // Distance from the left of the nearest positioned ancestor
    right: 0, // Distance from the right of the nearest positioned ancestor
    bottom: 0, // Distance from the bottom of the nearest positioned ancestor
    // You may need to adjust top, left, right, bottom values based on your layout needs
  },



  gridText: {
    textAlign: 'center', // Center the text
    marginTop: 30, // Add some space above the text
    fontSize: 26, // Set the font size
    color: 'black', // Set the text color
    fontFamily: 'Didot',
  },
});

export default App;