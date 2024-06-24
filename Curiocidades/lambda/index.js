const Alexa = require('ask-sdk-core');

// i18n dependencies. i18n is the main module, sprintf allows us to include variables with '%s'.
const i18n = require('i18next');
const sprintf = require('i18next-sprintf-postprocessor');

const dataEN = [
    'Cristiano Ronaldo was born on February 5, 1985, in Madeira, Portugal.',
    'He began his professional career with Sporting CP.',
    'Ronaldo joined Manchester United in 2003 at the age of 18.',
    'He won his first Ballon d\'Or in 2008.',
    'Ronaldo is the all-time top scorer in the UEFA Champions League.',
    'He has won five UEFA Champions League titles.',
    'Ronaldo holds the record for most goals scored in a single UEFA Champions League season.',
    'He has played for teams like Real Madrid, Juventus, and Manchester United.'
];

const dataES = [
    'Cristiano Ronaldo nació el 5 de febrero de 1985 en Madeira, Portugal.',
    'Comenzó su carrera profesional con el Sporting de Lisboa.',
    'Ronaldo se unió al Manchester United en 2003 a la edad de 18 años.',
    'Ganó su primer Balón de Oro en 2008.',
    'Ronaldo es el máximo goleador histórico de la UEFA Champions League.',
    'Ha ganado cinco títulos de la UEFA Champions League.',
    'Ronaldo tiene el récord de más goles anotados en una sola temporada de la UEFA Champions League.',
    'Ha jugado para equipos como el Real Madrid, Juventus y Manchester United.'
];

const LocalizationInterceptor = {
    process(handlerInput) {
        const localizationClient = i18n.use(sprintf).init({
            lng: handlerInput.requestEnvelope.request.locale,
            fallbackLng: 'en',
            resources: {
                en: {
                    translation: {
                        WELCOME_MESSAGE: 'Hello! Welcome to Cristiano Ronaldo Facts. You can ask for a fact by saying "give me a fun fact about Cristiano Ronaldo".',
                        HELP_MESSAGE: 'You can ask me for a fact by saying "give me a Cristiano Ronaldo fact".',
                        FACT_PREFIX: 'Here\'s a fact about Cristiano Ronaldo: ',
                        REPROMPT: 'Would you like to hear another fact about Cristiano Ronaldo?',
                        GOODBYE: 'Goodbye!',
                        FALLBACK: 'Sorry, I don\'t know about that. Please try again.',
                        ERROR: 'Sorry, I had trouble doing what you asked. Please try again.'
                    }
                },
                es: {
                    translation: {
                        WELCOME_MESSAGE: '¡Hola! Bienvenido a Curiosidades de Cristiano Ronaldo. Puedes pedir un dato curioso diciendo "dame un dato curioso sobre Cristiano Ronaldo".',
                        HELP_MESSAGE: 'Puedes pedirme un dato curioso diciendo "dame un dato curioso sobre Cristiano Ronaldo".',
                        FACT_PREFIX: 'Aquí tienes un dato curioso sobre Cristiano Ronaldo: ',
                        REPROMPT: '¿Te gustaría escuchar otro dato curioso sobre Cristiano Ronaldo?',
                        GOODBYE: '¡Adiós!',
                        FALLBACK: 'Lo siento, no sé sobre eso. Por favor intenta de nuevo.',
                        ERROR: 'Lo siento, tuve problemas para hacer lo que pediste. Por favor, inténtalo de nuevo.'
                    }
                }
            },
            returnObjects: true
        });

        const attributes = handlerInput.attributesManager.getRequestAttributes();
        attributes.t = function (...args) {
            return localizationClient.t(...args);
        };
    }
};

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('WELCOME_MESSAGE');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const FrasesIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'FrasesIntent';
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const locale = handlerInput.requestEnvelope.request.locale;
        const data = locale.startsWith('es') ? dataES : dataEN;
        const randomFact = data[Math.floor(Math.random() * data.length)];
        const speakOutput = requestAttributes.t('FACT_PREFIX') + randomFact;
        const repromptOutput = requestAttributes.t('REPROMPT');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(repromptOutput)
            .getResponse();
    }
};

const HelloWorldIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'HelloWorldIntent';
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('WELCOME_MESSAGE');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('HELP_MESSAGE');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('GOODBYE');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

const ExitIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ExitIntent';
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('GOODBYE');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('FALLBACK');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};

const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('ERROR');
        
        console.log(`Error handled: ${error.message}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        FrasesIntentHandler,
        HelloWorldIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        ExitIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(ErrorHandler)
    .addRequestInterceptors(LocalizationInterceptor)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();