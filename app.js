import { createApp } from 'vue';

const app = createApp({
    data() {
        return {
            gameState: 'loading',
            loadingProgress: 0,
            loadingMessage: 'Loading game assets...',
            characters: [],
            locations: [],
            currentCharacter: null,
            currentLocation: null,
            currentDialogue: '',
            currentChoices: [],
            showChoices: false,
            dialogueQueue: [],
            hasSavedGame: false,
            settingsOpen: false,
            settings: {
                ttsEnabled: false,
                speechRate: 1,
                textSpeed: 5,
                currentGameState: null
            },
            gameData: {
                characterMemories: {},
                relationshipStatus: {}
            }
        };
    },
    mounted() {
        this.loadGame();
    },
    methods: {
        async loadGame() {
            // Simulate loading assets
            await this.simulateLoading();
            
            // Initialize characters
            await this.initializeCharacters();
            
            // Initialize locations
            await this.initializeLocations();
            
            // Load saved game data if exists
            this.loadSavedGameData();
            
            // Check if there's a saved game
            this.hasSavedGame = this.checkForSavedGame();
            
            // Load settings
            this.loadSettings();
            
            // Set game state to main menu
            this.gameState = 'mainMenu';
        },
        
        async simulateLoading() {
            // Simulates loading process for assets
            for (let i = 0; i <= 100; i += 5) {
                this.loadingProgress = i;
                if (i === 25) this.loadingMessage = 'Generating characters...';
                if (i === 50) this.loadingMessage = 'Creating locations...';
                if (i === 75) this.loadingMessage = 'Finalizing...';
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        },
        
        async initializeCharacters() {
            const characterData = [
                {
                    id: 'alex',
                    name: 'Alex',
                    gender: 'male',
                    shortBio: 'An ambitious photographer who loves adventure and the outdoors.',
                    fullBio: 'Alex has traveled to over 30 countries capturing stunning landscapes and wildlife. When not behind the camera, you can find them hiking mountain trails or planning their next expedition.',
                    interests: ['photography', 'hiking', 'travel', 'nature'],
                    portraitPrompt: 'Portrait of Alex, an attractive male photographer in his late 20s with tousled brown hair and a confident smile, holding a professional camera, outdoor adventure setting with natural lighting',
                    seed: 42
                },
                {
                    id: 'jamie',
                    name: 'Jamie',
                    gender: 'non-binary',
                    shortBio: 'A tech entrepreneur with a love for sci-fi and board games.',
                    fullBio: 'Jamie founded their first startup at 19 and hasn\'t slowed down since. Despite their busy schedule, they always make time for weekly board game nights and binge-watching sci-fi series.',
                    interests: ['technology', 'board games', 'sci-fi', 'entrepreneurship'],
                    portraitPrompt: 'Portrait of Jamie, an attractive non-binary tech entrepreneur in their mid-20s with stylish glasses and short hair with colorful highlights, smart casual outfit, startup office setting with tech gadgets',
                    seed: 43
                },
                {
                    id: 'morgan',
                    name: 'Morgan',
                    gender: 'female',
                    shortBio: 'A passionate chef who dreams of opening their own restaurant.',
                    fullBio: 'Morgan trained in Paris under renowned chefs before returning home to experiment with fusion cuisines. They spend weekends at farmers markets searching for unique ingredients and hosting dinner parties for friends.',
                    interests: ['cooking', 'food', 'wine tasting', 'farmers markets'],
                    portraitPrompt: 'Portrait of Morgan, an attractive female chef in her early 30s with warm eyes and curly hair partially covered by a chef\'s bandana, wearing chef whites with a colorful neckerchief, modern kitchen setting',
                    seed: 44
                },
                {
                    id: 'taylor',
                    name: 'Taylor',
                    gender: 'male',
                    shortBio: 'A marine biologist with contagious enthusiasm for ocean life.',
                    fullBio: 'Taylor splits their time between research vessels and coastal conservation projects. Their passion for protecting marine ecosystems is matched only by their ability to tell fascinating stories about their underwater discoveries.',
                    interests: ['marine biology', 'scuba diving', 'conservation', 'swimming'],
                    portraitPrompt: 'Portrait of Taylor, an attractive male marine biologist in his mid-30s with sun-kissed skin and bright eyes, casual clothing with a waterproof watch, oceanside research facility background',
                    seed: 45
                },
                {
                    id: 'kai',
                    name: 'Kai',
                    gender: 'non-binary',
                    shortBio: 'A laid-back musician who plays in local venues on weekends.',
                    fullBio: 'By day, Kai works as a sound engineer, but their true passion emerges on stage where they perform a mix of original songs and creative covers. They have a knack for finding beauty in everyday moments and turning them into lyrics.',
                    interests: ['music', 'songwriting', 'concerts', 'vintage record collecting'],
                    portraitPrompt: 'Portrait of Kai, an attractive non-binary musician in their late 20s with an artistic style, playing an acoustic guitar, relaxed pose, music venue with ambient stage lighting',
                    seed: 46
                }
            ];
            
            this.characters = characterData;
            
            // Generate character portraits
            for (const character of this.characters) {
                await this.generateCharacterPortrait(character);
            }
        },
        
        async generateCharacterPortrait(character) {
            try {
                const result = await websim.imageGen({
                    prompt: character.portraitPrompt,
                    aspect_ratio: "3:4",
                    seed: character.seed
                });
                
                character.portraitUrl = result.url;
            } catch (error) {
                console.error(`Failed to generate portrait for ${character.name}:`, error);
                // Fallback attempt with simpler prompt
                try {
                    const result = await websim.imageGen({
                        prompt: `Portrait photo of ${character.name}, ${character.gender} character for dating app`,
                        aspect_ratio: "3:4",
                        seed: character.seed + 100 // Different seed for fallback
                    });
                    character.portraitUrl = result.url;
                } catch (fallbackError) {
                    console.error(`Fallback portrait generation failed for ${character.name}:`, fallbackError);
                    character.portraitUrl = 'placeholder.svg';
                }
            }
        },
        
        async initializeLocations() {
            const locationData = [
                {
                    id: 'cafe',
                    name: 'Cozy Café',
                    shortDescription: 'A charming café with a warm atmosphere.',
                    fullDescription: 'Nestled on a quiet street corner, this café offers artisanal coffee and freshly baked pastries. The rustic decor, soft jazz music, and comfortable seating make it perfect for intimate conversations.',
                    imagePrompt: 'A cozy cafe interior with warm lighting, wooden tables, bookshelves, plants, and a few customers enjoying coffee, perfect for a romantic date',
                    seed: 101
                },
                {
                    id: 'beach',
                    name: 'Sunset Beach',
                    shortDescription: 'A beautiful beach with golden sands and stunning views.',
                    fullDescription: 'As the day transitions to evening, this beach becomes magical with its golden sands glowing under the setting sun. The gentle sound of waves creates a serene backdrop for a romantic stroll along the shoreline.',
                    imagePrompt: 'A romantic beach at sunset with golden sand, gentle waves, and a colorful sky, two beach chairs in the distance, perfect for a date',
                    seed: 102
                },
                {
                    id: 'park',
                    name: 'Central Park',
                    shortDescription: 'A vibrant park with lush greenery and a small lake.',
                    fullDescription: 'This urban oasis features winding paths, flowering gardens, and a picturesque lake where paddle boats drift lazily. Street musicians often provide ambient melodies, adding to the park\'s enchanting atmosphere.',
                    imagePrompt: 'A beautiful city park with lush green trees, flowering plants, a small lake with paddle boats, walking paths, and benches, perfect for a romantic date',
                    seed: 103
                },
                {
                    id: 'restaurant',
                    name: 'Moonlight Restaurant',
                    shortDescription: 'An elegant restaurant with sophisticated ambiance.',
                    fullDescription: 'With its dim lighting, fine cuisine, and attentive service, this restaurant creates the perfect setting for a special evening. The outdoor terrace offers city views that become even more spectacular after dark.',
                    imagePrompt: 'An elegant restaurant interior with soft lighting, beautifully set tables with candles, fine dining atmosphere, subtle romantic ambiance',
                    seed: 104
                },
                {
                    id: 'arcade',
                    name: 'Retro Arcade',
                    shortDescription: 'A fun-filled arcade with classic games and neon lights.',
                    fullDescription: 'Step back in time with vintage arcade games, pinball machines, and a jukebox playing hits from decades past. The neon lights and playful atmosphere make this a perfect spot for showing off your competitive side.',
                    imagePrompt: 'A retro gaming arcade with colorful neon lights, classic arcade machines, pinball tables, and a fun nostalgic atmosphere, perfect for a casual date',
                    seed: 105
                },
                {
                    id: 'museum',
                    name: 'Art Museum',
                    shortDescription: 'A modern museum with diverse art collections.',
                    fullDescription: 'This contemporary space houses everything from Renaissance masterpieces to avant-garde installations. The thoughtfully curated exhibits provide plenty of inspiration for meaningful conversations about art and creativity.',
                    imagePrompt: 'A modern art museum interior with white walls, minimalist design, diverse artworks displayed, spacious galleries with a few visitors admiring the exhibits',
                    seed: 106
                }
            ];
            
            this.locations = locationData;
            
            // Generate location images
            for (const location of this.locations) {
                await this.generateLocationImage(location);
            }
        },
        
        async generateLocationImage(location) {
            try {
                const result = await websim.imageGen({
                    prompt: location.imagePrompt,
                    aspect_ratio: "16:9",
                    seed: location.seed
                });
                
                location.imageUrl = result.url;
            } catch (error) {
                console.error(`Failed to generate image for ${location.name}:`, error);
                // Fallback attempt with simpler prompt
                try {
                    const result = await websim.imageGen({
                        prompt: `${location.name} location for a date, romantic setting`,
                        aspect_ratio: "16:9",
                        seed: location.seed + 100 // Different seed for fallback
                    });
                    location.imageUrl = result.url;
                } catch (fallbackError) {
                    console.error(`Fallback image generation failed for ${location.name}:`, fallbackError);
                    location.imageUrl = 'placeholder.svg';
                }
            }
        },
        
        loadSavedGameData() {
            const savedData = localStorage.getItem('heartsJourneyData');
            if (savedData) {
                try {
                    this.gameData = JSON.parse(savedData);
                } catch (error) {
                    console.error('Failed to parse saved game data:', error);
                    this.gameData = {
                        characterMemories: {},
                        relationshipStatus: {}
                    };
                }
            }
        },
        
        checkForSavedGame() {
            return Object.keys(this.gameData.relationshipStatus).length > 0;
        },
        
        loadSettings() {
            const savedSettings = localStorage.getItem('heartsJourneySettings');
            if (savedSettings) {
                try {
                    this.settings = {...this.settings, ...JSON.parse(savedSettings)};
                } catch (error) {
                    console.error('Failed to parse saved settings:', error);
                }
            }
        },
        
        startNewGame() {
            this.gameState = 'characterSelection';
        },
        
        continueGame() {
            if (!this.hasSavedGame) return;
            
            // Restore previous game state
            if (this.settings.currentGameState) {
                // Restore character, location and game state from where player left off
                const characterId = this.settings.currentGameState.characterId;
                const locationId = this.settings.currentGameState.locationId;
                
                this.currentCharacter = this.characters.find(c => c.id === characterId) || null;
                this.currentLocation = this.locations.find(l => l.id === locationId) || null;
                
                if (this.currentCharacter && this.currentLocation) {
                    this.gameState = 'dating';
                    this.startDateScene();
                } else {
                    // Fallback to character selection if we can't restore the exact state
                    this.gameState = 'characterSelection';
                }
            } else {
                this.gameState = 'characterSelection';
            }
        },
        
        selectCharacter(character) {
            this.currentCharacter = character;
            this.gameState = 'locationSelection';
        },
        
        selectLocation(location) {
            this.currentLocation = location;
            this.gameState = 'dating';
            this.startDateScene();
        },
        
        async startDateScene() {
            // Initialize or retrieve character memory
            if (!this.gameData.characterMemories[this.currentCharacter.id]) {
                this.gameData.characterMemories[this.currentCharacter.id] = [];
            }
            
            const memories = this.gameData.characterMemories[this.currentCharacter.id];
            const isFirstMeeting = memories.length === 0;
            
            // Generate dialogue based on context
            await this.generateDialogue(isFirstMeeting);
            
            // Save current game state
            this.saveGameState();
        },
        
        async generateDialogue(isFirstMeeting) {
            const character = this.currentCharacter;
            const location = this.currentLocation;
            const memories = this.gameData.characterMemories[character.id] || [];
            
            let dialogueContext = `Character: ${character.name}
Gender: ${character.gender}
Bio: ${character.fullBio}
Interests: ${character.interests.join(', ')}
Location: ${location.name}
Location Description: ${location.fullDescription}
Is First Meeting: ${isFirstMeeting ? 'Yes' : 'No'}
Recent Memories: ${memories.slice(-5).join(' ')}`;

            try {
                const completion = await websim.chat.completions.create({
                    messages: [
                        {
                            role: "system",
                            content: `You are an AI generating dialogue for a dating simulator game called Heart's Journey. 
                            Create realistic, engaging dialogue for the character speaking to the player.
                            The dialogue should reflect the character's personality, interests, and the current location.
                            If this is a first meeting, the character should introduce themselves naturally.
                            If this is not a first meeting, reference past interactions from memories if available.
                            The dialogue should feel natural and conversational, with some flirty undertones.
                            After the character's dialogue, provide 3 response options for the player.
                            Format the response as a JSON object with the following structure:
                            {
                                "dialogue": "Character's dialogue text here",
                                "choices": [
                                    {"text": "First response option", "tone": "friendly/flirty/serious/etc"},
                                    {"text": "Second response option", "tone": "friendly/flirty/serious/etc"},
                                    {"text": "Third response option", "tone": "friendly/flirty/serious/etc"}
                                ]
                            }`
                        },
                        {
                            role: "user",
                            content: dialogueContext
                        }
                    ],
                    json: true,
                });
                
                const dialogueData = JSON.parse(completion.content);
                
                // Set current dialogue and choices
                this.dialogueQueue = [];
                this.currentDialogue = '';
                this.showChoices = false;
                
                // Type out the dialogue with animation
                this.dialogueQueue = dialogueData.dialogue.split('');
                this.typeDialogue();
                
                // Set choices after dialogue finishes
                this.currentChoices = dialogueData.choices;
                
                // Speak dialogue if TTS is enabled
                if (this.settings.ttsEnabled) {
                    this.speakText(dialogueData.dialogue);
                }
                
            } catch (error) {
                console.error('Failed to generate dialogue:', error);
                
                // Fallback dialogue
                this.currentDialogue = `Hi there! It's nice to meet you. I'm ${character.name}. Shall we enjoy our time at ${location.name}?`;
                this.currentChoices = [
                    {text: "I'd love to get to know you better.", tone: "friendly"},
                    {text: "This place is really nice, don't you think?", tone: "casual"},
                    {text: "You look amazing today.", tone: "flirty"}
                ];
                this.showChoices = true;
            }
        },
        
        typeDialogue() {
            if (this.dialogueQueue.length > 0) {
                const typingSpeed = 11 - this.settings.textSpeed; // Invert so higher = faster
                this.currentDialogue += this.dialogueQueue.shift();
                setTimeout(() => this.typeDialogue(), typingSpeed * 10);
            } else {
                // Show choices when dialogue is complete
                setTimeout(() => {
                    this.showChoices = true;
                }, 500);
            }
        },
        
        async makeChoice(choiceIndex) {
            const choice = this.currentChoices[choiceIndex];
            
            // Add choice to character memory
            const memoryEntry = `Player chose: "${choice.text}" (${choice.tone})`;
            this.gameData.characterMemories[this.currentCharacter.id].push(memoryEntry);
            
            // Limit memory to last 20 interactions
            if (this.gameData.characterMemories[this.currentCharacter.id].length > 20) {
                this.gameData.characterMemories[this.currentCharacter.id].shift();
            }
            
            // Generate character response to the choice
            this.showChoices = false;
            await this.generateResponseToChoice(choice);
            
            // Save game data
            this.saveGameData();
        },
        
        async generateResponseToChoice(choice) {
            const character = this.currentCharacter;
            const location = this.currentLocation;
            
            let responseContext = `Character: ${character.name}
Gender: ${character.gender}
Bio: ${character.fullBio}
Interests: ${character.interests.join(', ')}
Location: ${location.name}
Player's choice: "${choice.text}" (${choice.tone})`;

            try {
                const completion = await websim.chat.completions.create({
                    messages: [
                        {
                            role: "system",
                            content: `You are an AI generating character responses for a dating simulator.
                            Create the character's response to the player's choice.
                            The response should reflect the character's personality and react appropriately to the tone of the player's choice.
                            Make the response feel natural and conversational.
                            Format the response as a JSON object with the following structure:
                            {
                                "response": "Character's response text here",
                                "nextChoices": [
                                    {"text": "First response option", "tone": "friendly/flirty/serious/etc"},
                                    {"text": "Second response option", "tone": "friendly/flirty/serious/etc"},
                                    {"text": "Third response option", "tone": "friendly/flirty/serious/etc"}
                                ]
                            }`
                        },
                        {
                            role: "user",
                            content: responseContext
                        }
                    ],
                    json: true,
                });
                
                const responseData = JSON.parse(completion.content);
                
                // Set current dialogue and choices
                this.dialogueQueue = [];
                this.currentDialogue = '';
                this.showChoices = false;
                
                // Type out the dialogue with animation
                this.dialogueQueue = responseData.response.split('');
                this.typeDialogue();
                
                // Set choices after dialogue finishes
                this.currentChoices = responseData.nextChoices;
                
                // Speak dialogue if TTS is enabled
                if (this.settings.ttsEnabled) {
                    this.speakText(responseData.response);
                }
                
            } catch (error) {
                console.error('Failed to generate response:', error);
                
                // Fallback response
                this.currentDialogue = `I really enjoyed hearing that from you. What else would you like to talk about?`;
                this.currentChoices = [
                    {text: "Tell me more about yourself.", tone: "curious"},
                    {text: "What do you think about this place?", tone: "casual"},
                    {text: "I'm having a great time with you.", tone: "flirty"}
                ];
                this.showChoices = true;
            }
        },
        
        continueDialogue() {
            // User clicked continue when no choices available
            // Generate new dialogue continuation based on previous context
            this.generateNextDialogueSegment();
        },
        
        async generateNextDialogueSegment() {
            const character = this.currentCharacter;
            const location = this.currentLocation;
            const memories = this.gameData.characterMemories[character.id].slice(-3);
            
            let dialogueContext = `Character: ${character.name}
Gender: ${character.gender}
Location: ${location.name}
Continue the conversation naturally.
Recent interactions: ${memories.join(' ')}`;

            try {
                const completion = await websim.chat.completions.create({
                    messages: [
                        {
                            role: "system",
                            content: `You are an AI generating the next segment of a conversation for a dating simulator.
                            Continue the conversation between the character and player in a natural way.
                            The dialogue should progress the date forward slightly.
                            Format the response as a JSON object with the following structure:
                            {
                                "dialogue": "Character's next dialogue text here",
                                "choices": [
                                    {"text": "First response option", "tone": "friendly/flirty/serious/etc"},
                                    {"text": "Second response option", "tone": "friendly/flirty/serious/etc"},
                                    {"text": "Third response option", "tone": "friendly/flirty/serious/etc"}
                                ]
                            }`
                        },
                        {
                            role: "user",
                            content: dialogueContext
                        }
                    ],
                    json: true,
                });
                
                const dialogueData = JSON.parse(completion.content);
                
                // Set current dialogue and choices
                this.dialogueQueue = [];
                this.currentDialogue = '';
                this.showChoices = false;
                
                // Type out the dialogue with animation
                this.dialogueQueue = dialogueData.dialogue.split('');
                this.typeDialogue();
                
                // Set choices after dialogue finishes
                this.currentChoices = dialogueData.choices;
                
                // Speak dialogue if TTS is enabled
                if (this.settings.ttsEnabled) {
                    this.speakText(dialogueData.dialogue);
                }
                
            } catch (error) {
                console.error('Failed to generate dialogue continuation:', error);
                
                // Fallback dialogue
                this.currentDialogue = `So, what else would you like to talk about?`;
                this.currentChoices = [
                    {text: "Tell me about your hobbies.", tone: "curious"},
                    {text: "How's your day been so far?", tone: "friendly"},
                    {text: "I'm really enjoying our time together.", tone: "flirty"}
                ];
                this.showChoices = true;
            }
        },
        
        speakText(text) {
            // Stop any current speech
            window.speechSynthesis.cancel();
            
            // Create a new speech utterance
            const utterance = new SpeechSynthesisUtterance(text);
            
            // Get available voices
            const voices = window.speechSynthesis.getVoices();
            
            // If voices array is empty, wait for voices to load
            if (voices.length === 0) {
                window.speechSynthesis.onvoiceschanged = () => this.assignVoice(utterance);
            } else {
                this.assignVoice(utterance);
            }
            
            // Set speech rate
            utterance.rate = this.settings.speechRate;
            
            // Speak the text
            window.speechSynthesis.speak(utterance);
        },
        
        assignVoice(utterance) {
            const voices = window.speechSynthesis.getVoices();
            
            // Group voices by perceived gender
            const femaleVoices = voices.filter(voice => 
                voice.name.toLowerCase().includes('female') || 
                voice.name.toLowerCase().includes('woman') ||
                voice.name.includes('Samantha') ||
                voice.name.includes('Victoria') ||
                voice.name.includes('Karen'));
                
            const maleVoices = voices.filter(voice => 
                voice.name.toLowerCase().includes('male') || 
                voice.name.toLowerCase().includes('man') ||
                voice.name.includes('Daniel') ||
                voice.name.includes('David') ||
                voice.name.includes('Alex'));
                
            // Remaining voices considered neutral
            const neutralVoices = voices.filter(voice => 
                !femaleVoices.includes(voice) && 
                !maleVoices.includes(voice));
            
            // Assign voice based on character gender
            let selectedVoice;
            
            switch(this.currentCharacter.gender) {
                case 'female':
                    selectedVoice = femaleVoices.length > 0 ? 
                        femaleVoices[Math.floor(Math.random() * femaleVoices.length)] : 
                        voices[0];
                    break;
                case 'male':
                    selectedVoice = maleVoices.length > 0 ? 
                        maleVoices[Math.floor(Math.random() * maleVoices.length)] : 
                        voices[0];
                    break;
                case 'non-binary':
                    selectedVoice = neutralVoices.length > 0 ? 
                        neutralVoices[Math.floor(Math.random() * neutralVoices.length)] : 
                        voices[0];
                    break;
                default:
                    selectedVoice = voices[0];
            }
            
            utterance.voice = selectedVoice;
        },
        
        saveGameData() {
            // Save relationship data and memories
            localStorage.setItem('heartsJourneyData', JSON.stringify(this.gameData));
            
            // Update saved game flag
            this.hasSavedGame = true;
        },
        
        saveGameState() {
            // Save current character and location
            this.settings.currentGameState = {
                characterId: this.currentCharacter?.id,
                locationId: this.currentLocation?.id
            };
            
            // Save settings
            this.saveSettings();
            
            // Save game data
            this.saveGameData();
        },
        
        openSettings() {
            this.settingsOpen = true;
        },
        
        closeSettings() {
            this.settingsOpen = false;
        },
        
        saveSettings() {
            localStorage.setItem('heartsJourneySettings', JSON.stringify(this.settings));
            this.closeSettings();
        },
        
        returnToMainMenu() {
            // Save current game state before returning to menu
            this.saveGameState();
            
            // Return to main menu
            this.gameState = 'mainMenu';
            this.closeSettings();
        },
        
        backToMainMenu() {
            this.gameState = 'mainMenu';
        },
        
        backToCharacterSelection() {
            this.gameState = 'characterSelection';
        }
    }
});

app.mount('#app');

