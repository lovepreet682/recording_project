import React, { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const Homepage = () => {
    // Change the variable name from transcript to voiceTranscript
    const [querySearch, setQuerySearch] = useState('');
    const { transcript, listening, resetTranscript } = useSpeechRecognition();

    const handleSpeechRecognition = () => {
        if (!listening) {
            resetTranscript();
            SpeechRecognition.startListening();
        } else {
            SpeechRecognition.stopListening();
            // Update to use voiceTranscript
            setQuerySearch(transcript);
        }
    };

    useEffect(() => {
        // Update to use voiceTranscript
        setQuerySearch(transcript);
    }, [transcript]);

    const handleSubmit = () => {
        alert('Value Submitting: ' + querySearch);
    };

    return (
        <div>
            <h4 className='text-center pt-4'>Welcome to Recording Project</h4>
        </div>
    );
};

export default Homepage;
