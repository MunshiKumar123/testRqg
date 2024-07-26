
import React, { useEffect, useState, useRef } from 'react';
import RecordRTC from "recordrtc";
import { saveAs } from "file-saver";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';



function Test() {
    // useEffect(() => {
    //   // Check if browser supports workers
    //   if (typeof (Worker) !== "undefined") {
    //     // Create a new web worker
    //     const worker = new Worker(new URL('./worker.js', import.meta.url));

    //     // Start the worker
    //     worker.postMessage('start');

    //     // Cleanup the worker on component unmount
    //     return () => {
    //       worker.terminate();
    //     };
    //   } else {
    //     console.error("Web Workers are not supported in your browser.");
    //   }
    // }, []);
    useEffect(() => {
        const sumNumber = (arr) => {
            let sum;
            for (let i = 0; i < arr.length; i++) {
                for (let j = 1; j < arr.length; j++) {
                    if (arr[i] === 0) {
                        sum = arr[i]
                    }
                }
            }
            return sum;
        }
        console.log(sumNumber([2, 8, 7, 10, 49, 0, 20, 35, 5, 5]));
    }, [])
    const [token, setToken] = useState()
    const userLogin = async () => {
        const data = {
            user: "manish",
            password: "test",
            campaign_id: "campaign",
            phonelogin: "8001",
            phonepass: "test"
        };
        const url = `https://192.168.1.188/agent_panal/api/login`;
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': "application/json",
                },
                body: JSON.stringify(data)
            })
            const result = await response.json();
            console.log('@@@@@@@@@', result);
        } catch (error) {
            console.log(error);
        }
    };
    const [recording, setRecording] = useState(false);
    const [videoURL, setVideoURL] = useState("");
    const recorderRef = useRef(null);
    const videoRef = useRef(null);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({
                video: true
            });

            recorderRef.current = new RecordRTC(stream, {
                type: "video",
                mimeType: "video/webm; codecs=vp8",
                videoBitsPerSecond: 128000,
            });

            recorderRef.current.startRecording();
            setRecording(true);
        } catch (err) {
            console.error("Error: " + err);
        }
    };

    const stopRecording = async () => {
        recorderRef.current.stopRecording(async () => {
            const blob = recorderRef.current.getBlob();
            const videoURL = window.URL.createObjectURL(blob);
            setVideoURL(videoURL);
            saveAs(blob, "screen-recording.webm");
        });
        setRecording(false);
    };

    // speach
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition,
    } = useSpeechRecognition();

    useEffect(() => {
        if (!browserSupportsSpeechRecognition) {
            console.log('Browser does not support speech recognition.');
        }
    }, [browserSupportsSpeechRecognition]);

    const startListening = () => SpeechRecognition.startListening({ continuous: true, language: 'en-US' });
    const stopListening = () => SpeechRecognition.stopListening();

    useEffect(() => {
        const data = [
            { category: 'Fruit', name: 'Apple' },
            { category: 'Fruit', name: 'Banana' },
            { category: 'Vegetable', name: 'Carrot' },
            { category: 'Fruit', name: 'Orange' },
            { category: 'Vegetable', name: 'Lettuce' }
        ];
        // Group objects by category
        const grouped = data.reduce((accumulator, currentValue) => {
            const key = currentValue.category;
            (accumulator[key] = accumulator[key] || []).push(currentValue);
            return accumulator;
        }, {});
    }, [])

    useEffect(() => {
        const results = (str) => {
            let charCounts = {};

            for (let i = 0; i < str.length; i++) {
                let char = str[i];
                if (charCounts[char]) {
                    charCounts[char] += 1;
                } else {
                    charCounts[char] = 1;
                }
            }
            return charCounts;
        }

        const output = results("manhish");
        console.log('Character counts:', output);
    }, []);
    return (
        <div className="App">
            <div>
                <button onClick={recording ? stopRecording : startRecording}>
                    {recording ? "Stop Recording" : "Start Recording"}
                </button>
                {videoURL && (
                    <div>
                        <h3>Recorded Video:</h3>
                        <video ref={videoRef} src={videoURL} controls />
                    </div>
                )}
            </div>

            <div>
                <h1>Speech Recognition in React</h1>
                <p>Microphone: {listening ? 'on' : 'off'}</p>
                <button onClick={startListening}>Start</button>
                <button onClick={stopListening}>Stop</button>
                <button onClick={resetTranscript}>Reset</button>
                <p>{transcript}</p>
            </div>

            {/* <h1>API Hit Every Second</h1> */}

            <button onClick={userLogin}>Login</button>
            {/* <button onClick={userCamp}>campaing Get</button> */}
        </div>
    );
}

export default Test;