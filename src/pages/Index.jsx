import React, { useState } from "react";
import { Box, Button, Flex, Heading, Select, Slider, SliderTrack, SliderFilledTrack, SliderThumb } from "@chakra-ui/react";
import { FaPlay, FaPause, FaRandom } from "react-icons/fa";

const ALGORITHMS = {
  bubble: bubbleSort,
  selection: selectionSort,
  insertion: insertionSort,
};

function bubbleSort(arr) {
  const animations = [];
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      animations.push([j, j + 1, null]);
      if (arr[j] > arr[j + 1]) {
        animations.push([j, j + 1, "swap"]);
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return animations;
}

function selectionSort(arr) {
  const animations = [];
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      animations.push([i, j, null]);
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }
    animations.push([i, minIdx, "swap"]);
    [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
  }
  return animations;
}

function insertionSort(arr) {
  const animations = [];
  const n = arr.length;
  for (let i = 1; i < n; i++) {
    let key = arr[i];
    let j = i - 1;
    animations.push([i, null, "key"]);
    while (j >= 0 && arr[j] > key) {
      animations.push([j, j + 1, "overwrite"]);
      arr[j + 1] = arr[j];
      j--;
    }
    animations.push([j + 1, null, "insert"]);
    arr[j + 1] = key;
  }
  return animations;
}

const SortingVisualizer = () => {
  const [array, setArray] = useState([]);
  const [arraySize, setArraySize] = useState(50);
  const [algorithm, setAlgorithm] = useState("bubble");
  const [isRunning, setIsRunning] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(50);

  const randomizeArray = () => {
    const newArray = [];
    for (let i = 0; i < arraySize; i++) {
      newArray.push(Math.floor(Math.random() * 500) + 10);
    }
    setArray(newArray);
  };

  const handleSort = () => {
    setIsRunning(true);
    const animations = ALGORITHMS[algorithm]([...array]);
    animate(animations);
  };

  const animate = (animations) => {
    animations.forEach(([i, j, type], idx) => {
      setTimeout(() => {
        const bars = document.getElementsByClassName("array-bar");
        if (type === "swap") {
          [bars[i].style.height, bars[j].style.height] = [bars[j].style.height, bars[i].style.height];
          bars[i].style.backgroundColor = "green";
          bars[j].style.backgroundColor = "green";
        } else if (type === "key") {
          bars[i].style.backgroundColor = "blue";
        } else if (type === "overwrite" || type === "insert") {
          bars[j].style.height = bars[i].style.height;
          bars[i].style.backgroundColor = "red";
          bars[j].style.backgroundColor = "red";
        } else {
          bars[i].style.backgroundColor = "red";
          if (j !== null) bars[j].style.backgroundColor = "red";
        }
      }, idx * animationSpeed);
    });
    setTimeout(() => {
      setIsRunning(false);
    }, animations.length * animationSpeed);
  };

  return (
    <Flex direction="column" align="center" width="100%">
      <Heading my={8}>Sorting Visualizer</Heading>
      <Flex width="80%" justify="space-between" wrap="wrap">
        {array.map((val, idx) => (
          <Box key={idx} className="array-bar" height={`${val}px`} width={`${60 / arraySize}%`} bg="teal.300" mx={1} />
        ))}
      </Flex>
      <Flex mt={8} width="80%" justify="space-between" align="center">
        <Flex align="center">
          <Button onClick={randomizeArray} disabled={isRunning} colorScheme="teal" mr={4}>
            <FaRandom />
          </Button>
          <Select value={algorithm} onChange={(e) => setAlgorithm(e.target.value)} disabled={isRunning} width={40}>
            <option value="bubble">Bubble Sort</option>
            <option value="selection">Selection Sort</option>
            <option value="insertion">Insertion Sort</option>
          </Select>
        </Flex>
        <Flex align="center">
          <Button onClick={handleSort} disabled={isRunning || array.length === 0} colorScheme="teal" mr={4}>
            {isRunning ? <FaPause /> : <FaPlay />}
          </Button>
          <Slider value={animationSpeed} onChange={(val) => setAnimationSpeed(val)} min={10} max={500} width={40}>
            <SliderTrack>
              <SliderFilledTrack bg="teal.300" />
            </SliderTrack>
            <SliderThumb />
          </Slider>
        </Flex>
        <Slider value={arraySize} onChange={(val) => setArraySize(val)} min={10} max={100} width={40} disabled={isRunning}>
          <SliderTrack>
            <SliderFilledTrack bg="teal.300" />
          </SliderTrack>
          <SliderThumb />
        </Slider>
      </Flex>
    </Flex>
  );
};

export default SortingVisualizer;
